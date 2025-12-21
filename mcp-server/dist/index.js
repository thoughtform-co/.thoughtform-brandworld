#!/usr/bin/env node
/**
 * Thoughtform Unified MCP Server v3.0
 *
 * One MCP to rule them all:
 * - Design tokens, philosophy, platform specs, reference components
 * - Semantic search/validation powered by Voyage AI
 * - Captain's Log voice-driven thought capture
 * - Cross-repo file access for all Thoughtform projects
 *
 * Resources:
 * - thoughtform://tokens/{type}
 * - thoughtform://philosophy
 * - thoughtform://particles
 * - thoughtform://skill
 * - thoughtform://components/{platform}/{component}
 * - thoughtform://semantic/anchors
 * - thoughtform://semantic/translations
 * - thoughtform://semantic/antipatterns
 * - thoughtform://registry/assets
 * - thoughtform://registry/validation
 * - thoughtform://references/list
 * - thoughtform://references/{id}
 *
 * Tools (Design):
 * - get_design_tokens
 * - get_color_css
 * - get_platform_components
 * - search_references
 * - suggest_translation
 * - get_translation_chain
 *
 * Tools (Semantic):
 * - search_philosophy
 * - check_platform_alignment
 * - activate_anchors
 * - detect_platform
 * - validate_design
 * - get_fingerprint
 *
 * Tools (Captain's Log):
 * - captains_log - Record voice entries with platform routing
 * - search_captains_log - Semantic search through thought history
 * - get_log_timeline - Get recent entries by platform
 *
 * Tools (Filesystem):
 * - read_repo_file - Read file from any Thoughtform repo
 * - write_repo_file - Write file to any Thoughtform repo
 * - list_repo_dir - List directory contents
 * - search_repo_files - Search for files by glob pattern
 * - get_repo_tree - Get directory tree structure
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
// Import local embeddings module (Voyage AI + JSON storage)
import { initializeEmbeddings, isConfigured as isEmbeddingsConfigured, searchEmbeddings, calculateDrift, activateAnchors as activateAnchorsEmbedding, detectPlatform as detectPlatformEmbedding, getStats as getEmbeddingStats, 
// Captain's Log embedding functions
storeCaptainsLogEntry, searchCaptainsLog, getRecentCaptainsLogs, getCaptainsLogStats, } from "./embeddings-local.js";
// Import Captain's Log module
import { CaptainsLog, createLogEntry, formatStardate, isValidPlatform, isValidContextType, isValidSource, getAllPlatforms, } from "./captains-log.js";
// Import Design Navigator module
import { initializeNavigator, matchReference, projectReference, interpolateDesigns, exploreSpace, getComponentById, getAllComponents, getDesignSpace, getComponentGraph, getStats as getNavigatorStats, } from "./design-navigator.js";
// Check for Voyage configuration
let embeddingsConfigured = false;
const VOYAGE_KEY = process.env.VOYAGE_API_KEY;
// ─── Thoughtform Repos Configuration ────────────────────────────────────────
// Configure via THOUGHTFORM_REPOS env var (comma-separated paths or repo names)
// Default repos are relative to the Dropbox Thoughtform folder
const DROPBOX_BASE = process.platform === "win32"
    ? "C:\\Users\\buyss\\Dropbox\\03_Thoughtform"
    : "/Users/voidwalker/Library/CloudStorage/Dropbox/03_Thoughtform";
const DEFAULT_REPOS = {
    "brandworld": path.join(DROPBOX_BASE, "01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld"),
    "atlas": path.join(DROPBOX_BASE, "08_Artifacts/atlas"),
    "ledger": path.join(DROPBOX_BASE, "08_Artifacts/ledger-web"),
    "astrolabe": path.join(DROPBOX_BASE, "08_Artifacts/09_Astrolabe"),
    "thoughtform-co": path.join(DROPBOX_BASE, "08_Artifacts/12_Thoughtform.co"),
    "groundtruth": path.join(DROPBOX_BASE, "02_Groundtruth"),
};
// Parse THOUGHTFORM_REPOS env var or use defaults
function getConfiguredRepos() {
    const envRepos = process.env.THOUGHTFORM_REPOS;
    if (!envRepos)
        return DEFAULT_REPOS;
    const repos = {};
    for (const entry of envRepos.split(",")) {
        const trimmed = entry.trim();
        if (trimmed.includes("=")) {
            // Format: name=/path/to/repo
            const [name, repoPath] = trimmed.split("=");
            repos[name.trim()] = repoPath.trim();
        }
        else if (DEFAULT_REPOS[trimmed]) {
            // Just a repo name, use default path
            repos[trimmed] = DEFAULT_REPOS[trimmed];
        }
        else if (fs.existsSync(trimmed)) {
            // Full path provided
            const name = path.basename(trimmed);
            repos[name] = trimmed;
        }
    }
    return Object.keys(repos).length > 0 ? repos : DEFAULT_REPOS;
}
const THOUGHTFORM_REPOS = getConfiguredRepos();
// Validate path is within allowed repos
function isPathAllowed(targetPath) {
    const normalizedTarget = path.resolve(targetPath);
    for (const [repoName, repoPath] of Object.entries(THOUGHTFORM_REPOS)) {
        const normalizedRepo = path.resolve(repoPath);
        if (normalizedTarget.startsWith(normalizedRepo)) {
            return { allowed: true, repo: repoName };
        }
    }
    return { allowed: false };
}
// Resolve a repo-relative path to absolute
function resolveRepoPath(repoOrPath, relativePath) {
    // If it's a known repo name
    if (THOUGHTFORM_REPOS[repoOrPath] && relativePath) {
        return path.join(THOUGHTFORM_REPOS[repoOrPath], relativePath);
    }
    // If it's already an absolute path
    if (path.isAbsolute(repoOrPath)) {
        const check = isPathAllowed(repoOrPath);
        return check.allowed ? repoOrPath : null;
    }
    // Try to parse as repo:path format
    if (repoOrPath.includes(":")) {
        const [repo, ...rest] = repoOrPath.split(":");
        const relPath = rest.join(":");
        if (THOUGHTFORM_REPOS[repo]) {
            return path.join(THOUGHTFORM_REPOS[repo], relPath);
        }
    }
    // Try each repo to find the file
    for (const repoPath of Object.values(THOUGHTFORM_REPOS)) {
        const fullPath = path.join(repoPath, repoOrPath);
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }
    return null;
}
console.error(`✓ Configured repos: ${Object.keys(THOUGHTFORM_REPOS).join(", ")}`);
if (VOYAGE_KEY) {
    try {
        initializeEmbeddings({ voyageKey: VOYAGE_KEY });
        embeddingsConfigured = isEmbeddingsConfigured();
        const stats = getEmbeddingStats();
        if (stats.count > 0) {
            console.error(`✓ Semantic search enabled (Voyage AI, ${stats.count} embeddings)`);
        }
        else {
            console.error("⚠ Voyage configured but no embeddings found. Run: npx tsx scripts/embed-corpus-local.ts");
        }
        // Initialize Design Navigator
        initializeNavigator({ voyageKey: VOYAGE_KEY });
        const navStats = getNavigatorStats();
        if (navStats.componentCount > 0) {
            console.error(`✓ Design Navigator enabled (${navStats.componentCount} components, ${navStats.platforms.length} platforms)`);
        }
        else {
            console.error("⚠ Design Navigator: No components found. Run: npx tsx scripts/embed-components.ts");
        }
    }
    catch (error) {
        console.error("⚠ Semantic search disabled:", error);
    }
}
else {
    console.error("⚠ Semantic search disabled (no VOYAGE_API_KEY). Local keyword fallback active.");
    // Still initialize navigator for non-embedding features
    initializeNavigator({});
}
// Helper: Get validation status from drift score
function getValidationStatusLocal(driftScore) {
    if (driftScore < 0.2)
        return "approved";
    if (driftScore < 0.4)
        return "expansion";
    if (driftScore < 0.6)
        return "edge_case";
    return "violation";
}
// Helper: Get drift interpretation
function getDriftInterpretation(driftScore) {
    if (driftScore < 0.2)
        return "Strong alignment with platform identity. Proceed with confidence.";
    if (driftScore < 0.4)
        return "Valid expansion of the design system. Document if new pattern.";
    if (driftScore < 0.6)
        return "Edge case - may be valid but review recommended.";
    return "Potential violation - significant drift from platform character.";
}
// Helper: Local content search (fallback when Supabase not configured)
function searchLocalContent(query, category, limit = 5) {
    const results = [];
    const queryLower = query.toLowerCase();
    // Search fingerprints
    if (!category || category === "platform_identity") {
        const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];
        for (const platform of platforms) {
            const fp = readJsonFile(`semantic/fingerprints/${platform}.json`);
            if (!fp)
                continue;
            const text = JSON.stringify(fp).toLowerCase();
            if (text.includes(queryLower)) {
                results.push({
                    category: "platform_identity",
                    source_id: platform,
                    title: `${platform} fingerprint`,
                    content: fp.identity?.extended || "",
                    similarity: 0.8, // Placeholder
                });
            }
        }
    }
    // Search anchors
    if (!category || category === "anchor") {
        const anchors = readJsonFile("tokens/anchors/definitions.json");
        if (anchors?.anchors) {
            for (const [name, anchor] of Object.entries(anchors.anchors)) {
                const text = JSON.stringify(anchor).toLowerCase();
                if (text.includes(queryLower)) {
                    results.push({
                        category: "anchor",
                        source_id: name,
                        title: `${name} anchor`,
                        content: anchor.meaning || "",
                        similarity: 0.7,
                    });
                }
            }
        }
    }
    return results.slice(0, limit);
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
// Helper to read JSON files
function readJsonFile(relativePath) {
    try {
        const fullPath = path.join(ROOT_DIR, relativePath);
        const content = fs.readFileSync(fullPath, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
// Helper to read text files
function readTextFile(relativePath) {
    try {
        const fullPath = path.join(ROOT_DIR, relativePath);
        return fs.readFileSync(fullPath, "utf-8");
    }
    catch {
        return null;
    }
}
// Create server
const server = new Server({
    name: "thoughtform-design",
    version: "1.0.0",
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "thoughtform://tokens/colors",
                name: "Color Tokens",
                description: "Canonical color definitions for all Thoughtform platforms",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/typography",
                name: "Typography Tokens",
                description: "Font stacks, scale, and tracking values",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/spacing",
                name: "Spacing Tokens",
                description: "4px grid system and semantic spacing",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/motion",
                name: "Motion Tokens",
                description: "Timing curves, durations, easing, and glitch intensity scale",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/astrolabe",
                name: "Astrolabe Platform Tokens",
                description: "Gold accent, dark mode - knowledge navigation",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/atlas",
                name: "Atlas Platform Tokens",
                description: "Dawn/Gold accent, dark mode - specimen archive",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/ledger-dark",
                name: "Ledger Dark Platform Tokens",
                description: "Verde accent, dark mode - Blade Runner terminal",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://tokens/ledger-light",
                name: "Ledger Light Platform Tokens",
                description: "Teal accent, light mode - NASA blueprint",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://philosophy",
                name: "Design Principles",
                description: "Core design tenets and non-negotiables",
                mimeType: "text/markdown",
            },
            {
                uri: "thoughtform://particles",
                name: "Particle System",
                description: "Shared GRID=3 particle renderer code",
                mimeType: "application/javascript",
            },
            {
                uri: "thoughtform://skill",
                name: "Design Skill",
                description: "Concise Claude/Cursor skill for Thoughtform design",
                mimeType: "text/markdown",
            },
            // ─── Reference Components ─────────────────────────────────────
            {
                uri: "thoughtform://components/atlas/EntityCard",
                name: "Atlas EntityCard Component",
                description: "Reference implementation for Atlas entity cards (3:4 aspect, threat indicators)",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/atlas/ThreatBadge",
                name: "Atlas ThreatBadge Component",
                description: "Threat level indicator badge component",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/ledger/WireframeBox",
                name: "Ledger WireframeBox Component",
                description: "Blueprint-style container with corner brackets",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/ledger/StatCard",
                name: "Ledger StatCard Component",
                description: "Financial metric display card with trend indicators",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/ledger/DataTable",
                name: "Ledger DataTable Component",
                description: "Minimal table with diamond markers and hover states",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/astrolabe/InstrumentPanel",
                name: "Astrolabe InstrumentPanel Component",
                description: "Navigation instrument panel with status indicators",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/shared/ParticleCanvas",
                name: "Shared ParticleCanvas Component",
                description: "GRID=3 particle system with platform-specific behaviors",
                mimeType: "text/typescript",
            },
            {
                uri: "thoughtform://components/shared/GlitchEffects",
                name: "Shared GlitchEffects Component",
                description: "CSS and React glitch effects (scanlines, aberration, noise, loading)",
                mimeType: "text/typescript",
            },
            // ─── Semantic Layer ──────────────────────────────────────────────
            {
                uri: "thoughtform://semantic/anchors",
                name: "Semantic Anchors",
                description: "The six semantic anchors (NAVIGATION, THRESHOLD, INSTRUMENT, LIVING_GEOMETRY, GRADIENT, SIGNAL)",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://semantic/translations",
                name: "Translation Table",
                description: "Anchor → Translation → Physical Pattern mappings (THE workflow)",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://semantic/antipatterns",
                name: "Anti-Patterns",
                description: "Never/always design rules",
                mimeType: "text/markdown",
            },
            // ─── Registry ────────────────────────────────────────────────────
            {
                uri: "thoughtform://registry/assets",
                name: "Asset Registry",
                description: "All registered design assets with semantic metadata",
                mimeType: "application/json",
            },
            {
                uri: "thoughtform://registry/validation",
                name: "Validation Rules",
                description: "Quality tests and anti-pattern rules",
                mimeType: "application/json",
            },
            // ─── References ──────────────────────────────────────────────────
            {
                uri: "thoughtform://references/list",
                name: "Reference Library",
                description: "List of all reference entries with summaries",
                mimeType: "application/json",
            },
        ],
    };
});
// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const resourceMap = {
        // Tokens
        "thoughtform://tokens/colors": { path: "tokens/colors.json", type: "json" },
        "thoughtform://tokens/typography": { path: "tokens/typography.json", type: "json" },
        "thoughtform://tokens/spacing": { path: "tokens/spacing.json", type: "json" },
        "thoughtform://tokens/motion": { path: "tokens/motion.json", type: "json" },
        "thoughtform://tokens/astrolabe": { path: "tokens/platforms/astrolabe.json", type: "json" },
        "thoughtform://tokens/atlas": { path: "tokens/platforms/atlas.json", type: "json" },
        "thoughtform://tokens/ledger-dark": { path: "tokens/platforms/ledger-dark.json", type: "json" },
        "thoughtform://tokens/ledger-light": { path: "tokens/platforms/ledger-light.json", type: "json" },
        // Documentation
        "thoughtform://philosophy": { path: "philosophy/PRINCIPLES.md", type: "text" },
        "thoughtform://particles": { path: "particles/core.js", type: "text" },
        "thoughtform://skill": { path: "skills/SKILL.md", type: "text" },
        // Atlas Components
        "thoughtform://components/atlas/EntityCard": { path: "components/atlas/EntityCard.tsx", type: "text" },
        "thoughtform://components/atlas/ThreatBadge": { path: "components/atlas/ThreatBadge.tsx", type: "text" },
        // Ledger Components
        "thoughtform://components/ledger/WireframeBox": { path: "components/ledger/WireframeBox.tsx", type: "text" },
        "thoughtform://components/ledger/StatCard": { path: "components/ledger/StatCard.tsx", type: "text" },
        "thoughtform://components/ledger/DataTable": { path: "components/ledger/DataTable.tsx", type: "text" },
        // Astrolabe Components
        "thoughtform://components/astrolabe/InstrumentPanel": { path: "components/astrolabe/InstrumentPanel.tsx", type: "text" },
        // Shared Components
        "thoughtform://components/shared/ParticleCanvas": { path: "components/shared/ParticleCanvas.tsx", type: "text" },
        "thoughtform://components/shared/GlitchEffects": { path: "components/shared/GlitchEffects.tsx", type: "text" },
        // Semantic Layer
        "thoughtform://semantic/anchors": { path: "tokens/anchors/definitions.json", type: "json" },
        "thoughtform://semantic/translations": { path: "semantic/translations/translation-table.json", type: "json" },
        "thoughtform://semantic/antipatterns": { path: "semantic/antipatterns.md", type: "text" },
        // Registry
        "thoughtform://registry/assets": { path: "registry/assets.json", type: "json" },
        "thoughtform://registry/validation": { path: "registry/validation.json", type: "json" },
        // References
        "thoughtform://references/list": { path: "references/index/keywords.json", type: "json" },
    };
    const resource = resourceMap[uri];
    if (!resource) {
        throw new Error(`Unknown resource: ${uri}`);
    }
    const content = resource.type === "json"
        ? readJsonFile(resource.path)
        : readTextFile(resource.path);
    if (content === null) {
        throw new Error(`Failed to read resource: ${uri}`);
    }
    return {
        contents: [
            {
                uri,
                mimeType: resource.type === "json" ? "application/json" : "text/markdown",
                text: resource.type === "json" ? JSON.stringify(content, null, 2) : content,
            },
        ],
    };
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_design_tokens",
                description: "Get complete design tokens for a specific platform",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Platform name: astrolabe, atlas, ledger-dark, or ledger-light",
                            enum: ["astrolabe", "atlas", "ledger-dark", "ledger-light"],
                        },
                    },
                    required: ["platform"],
                },
            },
            {
                name: "get_color_css",
                description: "Generate CSS custom properties for a platform's colors",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Platform name: astrolabe, atlas, ledger-dark, or ledger-light",
                            enum: ["astrolabe", "atlas", "ledger-dark", "ledger-light"],
                        },
                    },
                    required: ["platform"],
                },
            },
            {
                name: "get_platform_components",
                description: "Get all reference component code for a platform",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Platform name: atlas, ledger, or astrolabe",
                            enum: ["atlas", "ledger", "astrolabe"],
                        },
                        includeShared: {
                            type: "boolean",
                            description: "Include shared components (ParticleCanvas)",
                            default: true,
                        },
                    },
                    required: ["platform"],
                },
            },
            {
                name: "search_references",
                description: "Search the reference library by anchor, dialect, tag, or mode",
                inputSchema: {
                    type: "object",
                    properties: {
                        anchors: {
                            type: "array",
                            items: { type: "string" },
                            description: "Filter by anchor activation (NAVIGATION, THRESHOLD, INSTRUMENT, LIVING_GEOMETRY, GRADIENT, SIGNAL)",
                        },
                        dialect: {
                            type: "string",
                            description: "Filter by dialect affinity (astrolabe, atlas, ledger-dark, ledger-light, marketing)",
                            enum: ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"],
                        },
                        mode: {
                            type: "string",
                            description: "Filter by reference mode (direct, philosophical, hybrid)",
                            enum: ["direct", "philosophical", "hybrid"],
                        },
                        tags: {
                            type: "array",
                            items: { type: "string" },
                            description: "Filter by tags (retrofuturism, CRT, terminal, etc.)",
                        },
                    },
                },
            },
            {
                name: "suggest_translation",
                description: "Given a reference ID, suggest Thoughtform assets and translation patterns",
                inputSchema: {
                    type: "object",
                    properties: {
                        referenceId: {
                            type: "string",
                            description: "Reference ID from the library",
                        },
                    },
                    required: ["referenceId"],
                },
            },
            {
                name: "get_translation_chain",
                description: "Get the full Anchor → Translations → Physical Patterns chain for an anchor",
                inputSchema: {
                    type: "object",
                    properties: {
                        anchor: {
                            type: "string",
                            description: "Anchor name (NAVIGATION, THRESHOLD, INSTRUMENT, LIVING_GEOMETRY, GRADIENT, SIGNAL)",
                            enum: ["NAVIGATION", "THRESHOLD", "INSTRUMENT", "LIVING_GEOMETRY", "GRADIENT", "SIGNAL"],
                        },
                    },
                    required: ["anchor"],
                },
            },
            // ─── Semantic Search Tools (require Supabase) ──────────────────────
            {
                name: "search_philosophy",
                description: "Semantic search through Thoughtform philosophy corpus. Returns relevant philosophy, platform identities, and anchors based on meaning similarity.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Natural language query about design philosophy, approach, or meaning",
                        },
                        category: {
                            type: "string",
                            description: "Filter by category",
                            enum: ["philosophy", "platform_identity", "anchor", "pattern", "reference", "component"],
                        },
                        limit: {
                            type: "number",
                            description: "Maximum results (default 5)",
                            default: 5,
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "check_platform_alignment",
                description: "Check how well a design description aligns with a platform's identity. Returns drift score (0=perfect match, 1=complete mismatch) and validation status.",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Platform to check against",
                            enum: ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"],
                        },
                        description: {
                            type: "string",
                            description: "Description of the design or component to validate",
                        },
                    },
                    required: ["platform", "description"],
                },
            },
            {
                name: "activate_anchors",
                description: "Given a design request, determine which semantic anchors should be activated and with what weights.",
                inputSchema: {
                    type: "object",
                    properties: {
                        request: {
                            type: "string",
                            description: "Design request or component description",
                        },
                    },
                    required: ["request"],
                },
            },
            {
                name: "detect_platform",
                description: "Automatically detect which platform a design request is best suited for based on semantic similarity.",
                inputSchema: {
                    type: "object",
                    properties: {
                        request: {
                            type: "string",
                            description: "Design request or description",
                        },
                    },
                    required: ["request"],
                },
            },
            {
                name: "validate_design",
                description: "Full design validation: detect platform, activate anchors, check drift, suggest patterns. Returns complete decision record.",
                inputSchema: {
                    type: "object",
                    properties: {
                        request: {
                            type: "string",
                            description: "Design request or component description",
                        },
                        platform: {
                            type: "string",
                            description: "Optional: specify platform instead of auto-detecting",
                            enum: ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"],
                        },
                    },
                    required: ["request"],
                },
            },
            {
                name: "get_fingerprint",
                description: "Get the full semantic fingerprint for a platform including identity, anchor weights, and aesthetic characteristics.",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Platform name",
                            enum: ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"],
                        },
                    },
                    required: ["platform"],
                },
            },
            // ─── Captain's Log Tools ────────────────────────────────────────────────
            {
                name: "captains_log",
                description: "Record a Captain's Log entry. Parses voice commands like 'Captain's Log:', 'Atlas entry:', 'Ledger note:' to route to the correct platform. Returns the stored entry with stardate.",
                inputSchema: {
                    type: "object",
                    properties: {
                        transcription: {
                            type: "string",
                            description: "Voice transcription or text entry. Trigger phrases like 'Captain's Log:', 'Atlas entry:', etc. auto-route to platforms.",
                        },
                        platform: {
                            type: "string",
                            description: "Optional: override auto-detected platform",
                            enum: ["thoughtform", "atlas", "ledger", "astrolabe", "starhaven", "journal"],
                        },
                        context: {
                            type: "string",
                            description: "Optional: type of entry",
                            enum: ["insight", "idea", "frustration", "breakthrough", "question", "reflection"],
                        },
                        source: {
                            type: "string",
                            description: "How the entry was captured",
                            enum: ["voice", "mcp", "manual"],
                        },
                    },
                    required: ["transcription"],
                },
            },
            {
                name: "search_captains_log",
                description: "Semantic search through your Captain's Log thought history. Find entries by meaning, not just keywords.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Natural language query to search for",
                        },
                        platform: {
                            type: "string",
                            description: "Optional: filter to specific platform",
                            enum: ["thoughtform", "atlas", "ledger", "astrolabe", "starhaven", "journal"],
                        },
                        context: {
                            type: "string",
                            description: "Optional: filter by context type",
                            enum: ["insight", "idea", "frustration", "breakthrough", "question", "reflection"],
                        },
                        limit: {
                            type: "number",
                            description: "Maximum results to return (default 10)",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_log_timeline",
                description: "Get recent Captain's Log entries, optionally filtered by platform. View your thought evolution over time.",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Optional: filter to specific platform",
                            enum: ["thoughtform", "atlas", "ledger", "astrolabe", "starhaven", "journal"],
                        },
                        limit: {
                            type: "number",
                            description: "Number of entries to return (default 20)",
                        },
                    },
                },
            },
            {
                name: "get_log_platforms",
                description: "Get list of all Captain's Log platforms with descriptions.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            // ─── Filesystem Tools ───────────────────────────────────────────────────
            {
                name: "read_repo_file",
                description: "Read a file from any Thoughtform repo (atlas, ledger, astrolabe, thoughtform-co, brandworld, groundtruth). Use repo:path format or just the path.",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "File path. Can be: 'atlas:src/App.tsx', 'ledger:package.json', or full path within allowed repos",
                        },
                        encoding: {
                            type: "string",
                            description: "File encoding (default: utf-8)",
                            default: "utf-8",
                        },
                    },
                    required: ["path"],
                },
            },
            {
                name: "write_repo_file",
                description: "Write content to a file in any Thoughtform repo. Creates directories if needed.",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "File path using repo:path format or full path",
                        },
                        content: {
                            type: "string",
                            description: "Content to write to the file",
                        },
                    },
                    required: ["path", "content"],
                },
            },
            {
                name: "list_repo_dir",
                description: "List contents of a directory in any Thoughtform repo.",
                inputSchema: {
                    type: "object",
                    properties: {
                        path: {
                            type: "string",
                            description: "Directory path using repo:path format or full path",
                        },
                    },
                    required: ["path"],
                },
            },
            {
                name: "search_repo_files",
                description: "Search for files matching a glob pattern across Thoughtform repos.",
                inputSchema: {
                    type: "object",
                    properties: {
                        pattern: {
                            type: "string",
                            description: "Glob pattern to match (e.g., '**/*.tsx', 'src/**/*.ts')",
                        },
                        repo: {
                            type: "string",
                            description: "Optional: limit search to specific repo",
                            enum: ["atlas", "ledger", "astrolabe", "thoughtform-co", "brandworld", "groundtruth"],
                        },
                    },
                    required: ["pattern"],
                },
            },
            {
                name: "get_repo_tree",
                description: "Get directory tree structure for a Thoughtform repo.",
                inputSchema: {
                    type: "object",
                    properties: {
                        repo: {
                            type: "string",
                            description: "Repo name",
                            enum: ["atlas", "ledger", "astrolabe", "thoughtform-co", "brandworld", "groundtruth"],
                        },
                        maxDepth: {
                            type: "number",
                            description: "Maximum depth to traverse (default: 3)",
                            default: 3,
                        },
                    },
                    required: ["repo"],
                },
            },
            {
                name: "list_repos",
                description: "List all configured Thoughtform repos and their paths.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            // ─── Design Navigation Tools ──────────────────────────────────────────────
            {
                name: "match_reference",
                description: "MODE 1: MATCH - Find existing components similar to a reference/description. Returns similar components, suggested tokens, patterns, and implementation path. Use when you have a reference and want to implement it.",
                inputSchema: {
                    type: "object",
                    properties: {
                        description: {
                            type: "string",
                            description: "Description of the reference, design element, or visual pattern you want to match",
                        },
                        platform: {
                            type: "string",
                            description: "Optional: filter to a specific platform",
                            enum: ["atlas", "ledger", "astrolabe", "marketing", "shared"],
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of matches to return (default: 5)",
                            default: 5,
                        },
                    },
                    required: ["description"],
                },
            },
            {
                name: "project_reference",
                description: "MODE 2: NAVIGATE - Project a reference into platform-specific expressions. Shows how the same concept would express in Atlas, Ledger, Astrolabe, etc. Use when you want to see possibilities, not just find what exists.",
                inputSchema: {
                    type: "object",
                    properties: {
                        description: {
                            type: "string",
                            description: "Description of the reference or design concept to project",
                        },
                        platforms: {
                            type: "array",
                            items: { type: "string" },
                            description: "Optional: specific platforms to project into (default: all)",
                        },
                    },
                    required: ["description"],
                },
            },
            {
                name: "interpolate_designs",
                description: "MODE 2: NAVIGATE - Blend between two components/design points. Shows what exists at different ratios between A and B. Use for exploring the space between two known designs.",
                inputSchema: {
                    type: "object",
                    properties: {
                        componentA: {
                            type: "string",
                            description: "First component name or ID (e.g., 'EntityCard', 'atlas:EntityCard')",
                        },
                        componentB: {
                            type: "string",
                            description: "Second component name or ID",
                        },
                        steps: {
                            type: "number",
                            description: "Number of interpolation points (default: 5)",
                            default: 5,
                        },
                    },
                    required: ["componentA", "componentB"],
                },
            },
            {
                name: "explore_space",
                description: "MODE 2: NAVIGATE - Explore design space using semantic parameters (sliders). Adjust terminal↔organic, cool↔warm, etc. to find components and tokens at that position.",
                inputSchema: {
                    type: "object",
                    properties: {
                        terminal_organic: {
                            type: "number",
                            description: "Terminal (-1) to Organic (+1) axis. Terminal=scanlines, monospace. Organic=breathing, soft.",
                            minimum: -1,
                            maximum: 1,
                        },
                        minimal_dense: {
                            type: "number",
                            description: "Minimal (-1) to Dense (+1) axis. Minimal=clean, sparse. Dense=rich, detailed.",
                            minimum: -1,
                            maximum: 1,
                        },
                        cool_warm: {
                            type: "number",
                            description: "Cool (-1) to Warm (+1) axis. Cool=verde, teal. Warm=gold, dawn.",
                            minimum: -1,
                            maximum: 1,
                        },
                        static_animated: {
                            type: "number",
                            description: "Static (-1) to Animated (+1) axis. Static=no motion. Animated=particles, breathing.",
                            minimum: -1,
                            maximum: 1,
                        },
                        limit: {
                            type: "number",
                            description: "Number of nearby components to return (default: 5)",
                            default: 5,
                        },
                    },
                },
            },
            {
                name: "get_component",
                description: "Get details for a specific component by name or ID.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Component name or ID (e.g., 'EntityCard', 'atlas:EntityCard')",
                        },
                    },
                    required: ["id"],
                },
            },
            {
                name: "list_components",
                description: "List all embedded components, optionally filtered by platform.",
                inputSchema: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            description: "Optional: filter by platform",
                            enum: ["atlas", "ledger", "astrolabe", "marketing", "shared"],
                        },
                    },
                },
            },
            {
                name: "get_design_space_info",
                description: "Get information about the design space axes and platform positions.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "get_design_tokens") {
        const platform = args.platform;
        const colors = readJsonFile("tokens/colors.json");
        const typography = readJsonFile("tokens/typography.json");
        const spacing = readJsonFile("tokens/spacing.json");
        const motion = readJsonFile("tokens/motion.json");
        const platformTokens = readJsonFile(`tokens/platforms/${platform}.json`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        platform,
                        colors,
                        typography,
                        spacing,
                        motion,
                        platformSpecific: platformTokens,
                    }, null, 2),
                },
            ],
        };
    }
    if (name === "get_color_css") {
        const platform = args.platform;
        const colors = readJsonFile("tokens/colors.json");
        const platformTokens = readJsonFile(`tokens/platforms/${platform}.json`);
        const isLight = platformTokens?.mode === "light";
        const bgKey = isLight ? "paper" : "void";
        const textKey = isLight ? "ink" : "dawn";
        const css = `:root {
  /* Background */
  --void: ${colors.void.base};
  --surface-0: ${colors.void["surface-0"]};
  --surface-1: ${colors.void["surface-1"]};
  --paper: ${colors.paper.base};
  --paper-light: ${colors.paper.light};
  
  /* Text */
  --dawn: ${colors.dawn.base};
  --dawn-50: ${colors.dawn["50"]};
  --dawn-30: ${colors.dawn["30"]};
  --dawn-08: ${colors.dawn["08"]};
  --ink: ${colors.ink.base};
  --ink-50: ${colors.ink["50"]};
  --ink-12: ${colors.ink["12"]};
  
  /* Accent */
  --gold: ${colors.gold.base};
  --gold-40: ${colors.gold["40"]};
  --teal: ${colors.teal.base};
  --verde: ${colors.verde.base};
  --signal: ${colors.signal.base};
  
  /* Platform aliases */
  --background: var(--${bgKey});
  --text: var(--${textKey});
  --accent: var(--${platformTokens?.accent || "gold"});
}`;
        return {
            content: [{ type: "text", text: css }],
        };
    }
    if (name === "get_platform_components") {
        const { platform, includeShared = true } = args;
        const componentFiles = {
            atlas: [
                "components/atlas/EntityCard.tsx",
                "components/atlas/ThreatBadge.tsx",
            ],
            ledger: [
                "components/ledger/WireframeBox.tsx",
                "components/ledger/StatCard.tsx",
                "components/ledger/DataTable.tsx",
            ],
            astrolabe: [
                "components/astrolabe/InstrumentPanel.tsx",
            ],
        };
        const files = componentFiles[platform] || [];
        if (includeShared) {
            files.push("components/shared/ParticleCanvas.tsx");
            files.push("components/shared/GlitchEffects.tsx");
        }
        const components = {};
        for (const file of files) {
            const content = readTextFile(file);
            if (content) {
                const componentName = path.basename(file, ".tsx");
                components[componentName] = content;
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        platform,
                        components,
                        summary: `${Object.keys(components).length} components loaded for ${platform}`,
                    }, null, 2),
                },
            ],
        };
    }
    if (name === "search_references") {
        const { anchors, dialect, mode, tags } = args;
        const keywordIndex = readJsonFile("references/index/keywords.json");
        if (!keywordIndex) {
            return { content: [{ type: "text", text: "Reference index not found" }] };
        }
        let results = Object.entries(keywordIndex.entries || {});
        // Filter by anchors
        if (anchors && anchors.length > 0) {
            results = results.filter(([_, entry]) => {
                const entryAnchors = entry.anchors?.highest || [];
                return anchors.some((a) => entryAnchors.includes(a));
            });
        }
        // Filter by dialect
        if (dialect) {
            results = results.filter(([_, entry]) => {
                const entryDialects = entry.dialects?.highest || [];
                return entryDialects.includes(dialect);
            });
        }
        // Filter by mode
        if (mode) {
            results = results.filter(([_, entry]) => entry.referenceMode === mode);
        }
        // Filter by tags
        if (tags && tags.length > 0) {
            results = results.filter(([_, entry]) => {
                const entryTags = entry.tags || [];
                return tags.some((t) => entryTags.includes(t));
            });
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        count: results.length,
                        results: results.map(([id, entry]) => ({
                            id,
                            title: entry.title,
                            mode: entry.referenceMode,
                            distance: entry.translationDistance,
                            anchors: entry.anchors?.highest,
                            dialects: entry.dialects?.highest,
                            translations: entry.translations,
                            tags: entry.tags,
                        })),
                    }, null, 2),
                },
            ],
        };
    }
    if (name === "suggest_translation") {
        const { referenceId } = args;
        const keywordIndex = readJsonFile("references/index/keywords.json");
        const translationTable = readJsonFile("semantic/translations/translation-table.json");
        const assetsRegistry = readJsonFile("registry/assets.json");
        if (!keywordIndex || !translationTable || !assetsRegistry) {
            return { content: [{ type: "text", text: "Required files not found" }] };
        }
        const reference = keywordIndex.entries?.[referenceId];
        if (!reference) {
            return { content: [{ type: "text", text: `Reference not found: ${referenceId}` }] };
        }
        // Get translations from reference
        const suggestedTranslations = reference.translations || [];
        // Get anchor-based translations
        const highAnchors = reference.anchors?.highest || [];
        const anchorTranslations = {};
        for (const anchor of highAnchors) {
            const anchorData = translationTable.anchors?.[anchor];
            if (anchorData) {
                anchorTranslations[anchor] = anchorData.translations || [];
            }
        }
        // Find matching assets
        const matchingAssets = (assetsRegistry.assets || []).filter((asset) => {
            const assetTranslations = asset.translations || [];
            return suggestedTranslations.some((t) => assetTranslations.includes(t));
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        reference: {
                            id: referenceId,
                            title: reference.title,
                            mode: reference.referenceMode,
                            distance: reference.translationDistance,
                        },
                        suggestedTranslations,
                        anchorTranslations,
                        matchingAssets: matchingAssets.map((a) => ({
                            id: a.id,
                            name: a.name,
                            type: a.type,
                            translations: a.translations,
                            dialects: a.dialects,
                            path: a.paths?.implementation,
                        })),
                    }, null, 2),
                },
            ],
        };
    }
    if (name === "get_translation_chain") {
        const { anchor } = args;
        const translationTable = readJsonFile("semantic/translations/translation-table.json");
        const anchorsData = readJsonFile("tokens/anchors/definitions.json");
        if (!translationTable || !anchorsData) {
            return { content: [{ type: "text", text: "Required files not found" }] };
        }
        const anchorDef = anchorsData.anchors?.[anchor];
        const anchorTrans = translationTable.anchors?.[anchor];
        if (!anchorDef || !anchorTrans) {
            return { content: [{ type: "text", text: `Anchor not found: ${anchor}` }] };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        anchor: {
                            name: anchor,
                            meaning: anchorDef.meaning,
                            tensions: anchorDef.tensions,
                            colorAffinity: anchorDef.colorAffinity,
                        },
                        translations: anchorTrans.translations,
                        physicalPatterns: anchorTrans.physicalPatterns,
                    }, null, 2),
                },
            ],
        };
    }
    // ─── Semantic Search Tools ──────────────────────────────────────────────
    if (name === "search_philosophy") {
        const { query, category, limit = 5 } = args;
        // Check if embeddings are configured
        if (!embeddingsConfigured) {
            // Fallback to local search through fingerprints and anchors
            const results = searchLocalContent(query, category, limit);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            mode: "local",
                            note: "Supabase not configured. Using local keyword search.",
                            results,
                        }, null, 2),
                    }],
            };
        }
        try {
            const results = await searchEmbeddings(query, { category, limit });
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ mode: "semantic", results }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: String(error) }, null, 2),
                    }],
            };
        }
    }
    if (name === "check_platform_alignment") {
        const { platform, description } = args;
        if (!embeddingsConfigured) {
            // Fallback to fingerprint keyword matching
            const fingerprint = readJsonFile(`semantic/fingerprints/${platform}.json`);
            if (!fingerprint) {
                return { content: [{ type: "text", text: `Fingerprint not found for: ${platform}` }] };
            }
            const keywords = fingerprint.keywords || [];
            const descLower = description.toLowerCase();
            const matchedKeywords = keywords.filter((k) => descLower.includes(k.toLowerCase()));
            const score = matchedKeywords.length / Math.max(keywords.length, 1);
            const driftScore = 1 - score;
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            mode: "local",
                            note: "Supabase not configured. Using keyword matching.",
                            platform,
                            drift_score: Math.round(driftScore * 1000) / 1000,
                            alignment_score: Math.round(score * 1000) / 1000,
                            validation_status: getValidationStatusLocal(driftScore),
                            matched_keywords: matchedKeywords,
                        }, null, 2),
                    }],
            };
        }
        try {
            const driftScore = await calculateDrift(description, platform);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            mode: "semantic",
                            platform,
                            drift_score: driftScore,
                            alignment_score: 1 - driftScore,
                            validation_status: getValidationStatusLocal(driftScore),
                            interpretation: getDriftInterpretation(driftScore),
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }, null, 2) }],
            };
        }
    }
    if (name === "activate_anchors") {
        const { request } = args;
        if (!embeddingsConfigured) {
            // Fallback to keyword matching against anchor definitions
            const anchorsData = readJsonFile("tokens/anchors/definitions.json");
            if (!anchorsData?.anchors) {
                return { content: [{ type: "text", text: "Anchor definitions not found" }] };
            }
            const requestLower = request.toLowerCase();
            const activations = {};
            for (const [anchorName, anchor] of Object.entries(anchorsData.anchors)) {
                const anchorObj = anchor;
                const keywords = [
                    ...(anchorObj.resonatesWith || []),
                    ...(anchorObj.expressions || []),
                ];
                let matches = 0;
                for (const kw of keywords) {
                    if (requestLower.includes(kw.toLowerCase())) {
                        matches++;
                    }
                }
                activations[anchorName] = Math.min(matches / 3, 1); // Normalize
            }
            // Sort by activation strength
            const sorted = Object.entries(activations)
                .sort(([, a], [, b]) => b - a)
                .reduce((obj, [k, v]) => ({ ...obj, [k]: Math.round(v * 1000) / 1000 }), {});
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            mode: "local",
                            note: "Supabase not configured. Using keyword matching.",
                            request,
                            activations: sorted,
                        }, null, 2),
                    }],
            };
        }
        try {
            const activations = await activateAnchorsEmbedding(request);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ mode: "semantic", request, activations }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }, null, 2) }],
            };
        }
    }
    if (name === "detect_platform") {
        const { request } = args;
        if (!embeddingsConfigured) {
            // Fallback: check against all fingerprints
            const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];
            const scores = [];
            const requestLower = request.toLowerCase();
            for (const platform of platforms) {
                const fingerprint = readJsonFile(`semantic/fingerprints/${platform}.json`);
                if (!fingerprint)
                    continue;
                const keywords = fingerprint.keywords || [];
                const matchedKeywords = keywords.filter((k) => requestLower.includes(k.toLowerCase()));
                scores.push({
                    platform,
                    score: matchedKeywords.length / Math.max(keywords.length, 1),
                });
            }
            scores.sort((a, b) => b.score - a.score);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            mode: "local",
                            note: "Supabase not configured. Using keyword matching.",
                            detected_platform: scores[0]?.platform || "unknown",
                            confidence: scores[0]?.score || 0,
                            all_scores: scores,
                        }, null, 2),
                    }],
            };
        }
        try {
            const result = await detectPlatformEmbedding(request);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ mode: "semantic", ...result }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: String(error) }, null, 2) }],
            };
        }
    }
    if (name === "validate_design") {
        const { request, platform: specifiedPlatform } = args;
        // Get or detect platform
        let platform = specifiedPlatform;
        let platformConfidence = 1;
        if (!platform) {
            if (embeddingsConfigured) {
                const detection = await detectPlatformEmbedding(request);
                platform = detection.platform;
                platformConfidence = detection.score;
            }
            else {
                // Local detection
                const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];
                let bestPlatform = "astrolabe";
                let bestScore = 0;
                const requestLower = request.toLowerCase();
                for (const p of platforms) {
                    const fingerprint = readJsonFile(`semantic/fingerprints/${p}.json`);
                    if (!fingerprint)
                        continue;
                    const keywords = fingerprint.keywords || [];
                    const matched = keywords.filter((k) => requestLower.includes(k.toLowerCase()));
                    const score = matched.length / Math.max(keywords.length, 1);
                    if (score > bestScore) {
                        bestScore = score;
                        bestPlatform = p;
                    }
                }
                platform = bestPlatform;
                platformConfidence = bestScore;
            }
        }
        // Get anchor activations
        let anchors = {};
        if (embeddingsConfigured) {
            anchors = await activateAnchorsEmbedding(request);
        }
        else {
            const anchorsData = readJsonFile("tokens/anchors/definitions.json");
            const requestLower = request.toLowerCase();
            for (const [anchorName, anchor] of Object.entries(anchorsData?.anchors || {})) {
                const anchorObj = anchor;
                const keywords = [...(anchorObj.resonatesWith || []), ...(anchorObj.expressions || [])];
                let matches = 0;
                for (const kw of keywords) {
                    if (requestLower.includes(kw.toLowerCase()))
                        matches++;
                }
                anchors[anchorName] = Math.min(matches / 3, 1);
            }
        }
        // Get drift score
        let driftScore = 0.5;
        if (embeddingsConfigured) {
            driftScore = await calculateDrift(request, platform);
        }
        else {
            const fingerprint = readJsonFile(`semantic/fingerprints/${platform}.json`);
            if (fingerprint) {
                const keywords = fingerprint.keywords || [];
                const requestLower = request.toLowerCase();
                const matched = keywords.filter((k) => requestLower.includes(k.toLowerCase()));
                driftScore = 1 - (matched.length / Math.max(keywords.length, 1));
            }
        }
        // Get suggested patterns based on activated anchors
        const translationTable = readJsonFile("semantic/translations/translation-table.json");
        const suggestedPatterns = [];
        const suggestedComponents = [];
        const topAnchors = Object.entries(anchors)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([name]) => name);
        for (const anchor of topAnchors) {
            const anchorTrans = translationTable?.anchors?.[anchor];
            if (anchorTrans?.translations) {
                suggestedPatterns.push(...anchorTrans.translations.slice(0, 2));
            }
            if (anchorTrans?.physicalPatterns) {
                for (const [, pattern] of Object.entries(anchorTrans.physicalPatterns).slice(0, 2)) {
                    const p = pattern;
                    if (p.component)
                        suggestedComponents.push(p.component);
                }
            }
        }
        // Check antipatterns
        const antipatterns = readTextFile("semantic/antipatterns.md") || "";
        const violatedAntipatterns = [];
        const requestLower = request.toLowerCase();
        if (requestLower.includes("border-radius") && !requestLower.includes("border-radius: 0") && !requestLower.includes("border-radius:0")) {
            violatedAntipatterns.push("no-border-radius");
        }
        if (requestLower.includes("purple gradient") || requestLower.includes("purple-gradient")) {
            violatedAntipatterns.push("no-purple-gradients");
        }
        if (requestLower.includes("inter") || requestLower.includes("arial") || requestLower.includes("helvetica")) {
            violatedAntipatterns.push("no-system-fonts");
        }
        const validationStatus = getValidationStatusLocal(driftScore);
        // Get tokens for the platform
        const platformTokens = readJsonFile(`tokens/platforms/${platform}.json`);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        mode: embeddingsConfigured ? "semantic" : "local",
                        request,
                        detected_platform: platform,
                        platform_confidence: Math.round(platformConfidence * 1000) / 1000,
                        drift_score: Math.round(driftScore * 1000) / 1000,
                        validation_status: validationStatus,
                        interpretation: getDriftInterpretation(driftScore),
                        activated_anchors: Object.fromEntries(Object.entries(anchors)
                            .sort(([, a], [, b]) => b - a)
                            .map(([k, v]) => [k, Math.round(v * 1000) / 1000])),
                        suggested_patterns: [...new Set(suggestedPatterns)],
                        suggested_components: [...new Set(suggestedComponents)],
                        violated_antipatterns: violatedAntipatterns,
                        platform_tokens: {
                            mode: platformTokens?.mode,
                            accent: platformTokens?.colors?.accent,
                            background: platformTokens?.colors?.background,
                            text: platformTokens?.colors?.text,
                        },
                    }, null, 2),
                }],
        };
    }
    if (name === "get_fingerprint") {
        const { platform } = args;
        const fingerprint = readJsonFile(`semantic/fingerprints/${platform}.json`);
        if (!fingerprint) {
            return { content: [{ type: "text", text: `Fingerprint not found for: ${platform}` }] };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(fingerprint, null, 2),
                }],
        };
    }
    // ─── Captain's Log Tool Handlers ──────────────────────────────────────────
    if (name === "captains_log") {
        const { transcription, platform: platformOverride, context, source } = args;
        // Validate inputs
        if (!transcription || transcription.trim().length === 0) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: "Transcription is required and cannot be empty" }, null, 2),
                    }],
            };
        }
        // Create the log entry
        const entry = createLogEntry(transcription, {
            platform: platformOverride && isValidPlatform(platformOverride) ? platformOverride : undefined,
            contextType: context && isValidContextType(context) ? context : undefined,
            source: source && isValidSource(source) ? source : 'mcp',
        });
        // Generate unique ID for the entry
        const entryId = `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        // Store in local JSON file
        const logsPath = path.join(ROOT_DIR, "captains-log-entries.json");
        let existingLogs = [];
        try {
            const existingContent = fs.readFileSync(logsPath, "utf-8");
            existingLogs = JSON.parse(existingContent);
        }
        catch {
            // File doesn't exist yet, start fresh
        }
        existingLogs.push(entry);
        fs.writeFileSync(logsPath, JSON.stringify(existingLogs, null, 2));
        // If embeddings are configured, also store with embedding for semantic search
        let embeddingStatus = "not_configured";
        if (embeddingsConfigured) {
            try {
                await storeCaptainsLogEntry({
                    id: entryId,
                    platform: entry.platform,
                    content: entry.cleanedContent,
                    context_type: entry.contextType ?? undefined,
                    stardate: entry.stardate,
                    tags: entry.tags,
                });
                embeddingStatus = "stored";
            }
            catch (error) {
                embeddingStatus = `error: ${String(error)}`;
            }
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        status: "recorded",
                        stardate: formatStardate(entry.stardate),
                        entry: {
                            id: entryId,
                            platform: entry.platform,
                            content: entry.cleanedContent,
                            context: entry.contextType,
                            tags: entry.tags,
                            trigger: entry.triggerPhrase,
                        },
                        embedding_status: embeddingStatus,
                        message: `Captain's Log entry recorded for ${entry.platform}`,
                    }, null, 2),
                }],
        };
    }
    if (name === "search_captains_log") {
        const { query, platform, context, limit = 10 } = args;
        // If embeddings are configured, use semantic search
        if (embeddingsConfigured) {
            try {
                const results = await searchCaptainsLog(query, {
                    platform: platform && isValidPlatform(platform) ? platform : undefined,
                    context: context && isValidContextType(context) ? context : undefined,
                    limit,
                });
                const stats = getCaptainsLogStats();
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                mode: "semantic",
                                note: "Using Voyage AI semantic search",
                                query,
                                total_entries: stats.count,
                                results: results.map(r => ({
                                    id: r.id,
                                    platform: r.platform,
                                    content: r.content,
                                    context: r.context_type,
                                    stardate: r.stardate,
                                    tags: r.tags,
                                    similarity: Math.round(r.similarity * 1000) / 1000,
                                    anchors: r.anchor_activations,
                                })),
                            }, null, 2),
                        }],
                };
            }
            catch (error) {
                console.error("Semantic search error, falling back to keyword:", error);
                // Fall through to keyword search
            }
        }
        // Fallback: Read existing logs and do keyword search
        const logsPath = path.join(ROOT_DIR, "captains-log-entries.json");
        let logs = [];
        try {
            const content = fs.readFileSync(logsPath, "utf-8");
            logs = JSON.parse(content);
        }
        catch {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            mode: "local",
                            note: "No Captain's Log entries found yet",
                            results: [],
                        }, null, 2),
                    }],
            };
        }
        // Filter by platform and context if provided
        let filtered = logs;
        if (platform && isValidPlatform(platform)) {
            filtered = filtered.filter(e => e.platform === platform);
        }
        if (context && isValidContextType(context)) {
            filtered = filtered.filter(e => e.contextType === context);
        }
        // Simple keyword search
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/);
        const scored = filtered.map(entry => {
            const content = entry.cleanedContent.toLowerCase();
            const matchCount = queryWords.filter(word => content.includes(word)).length;
            const score = matchCount / queryWords.length;
            return { entry, score };
        });
        // Sort by score and take top results
        const results = scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => ({
            platform: s.entry.platform,
            content: s.entry.cleanedContent,
            context: s.entry.contextType,
            stardate: s.entry.stardate,
            tags: s.entry.tags,
            relevance: Math.round(s.score * 100) / 100,
        }));
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        mode: "local",
                        note: "Using keyword search. Set VOYAGE_API_KEY for semantic search.",
                        query,
                        total_entries: logs.length,
                        filtered_count: filtered.length,
                        results,
                    }, null, 2),
                }],
        };
    }
    if (name === "get_log_timeline") {
        const { platform, limit = 20 } = args;
        // Try to get from embeddings index first (has anchor data)
        if (embeddingsConfigured) {
            try {
                const recentLogs = getRecentCaptainsLogs({
                    platform: platform && isValidPlatform(platform) ? platform : undefined,
                    limit,
                });
                if (recentLogs.length > 0) {
                    const stats = getCaptainsLogStats();
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    mode: "semantic",
                                    total_entries: stats.count,
                                    showing: recentLogs.length,
                                    platform_filter: platform || "all",
                                    entries: recentLogs.map(e => ({
                                        id: e.id,
                                        stardate: formatStardate(e.stardate),
                                        platform: e.platform,
                                        content: e.content,
                                        context: e.context_type,
                                        tags: e.tags,
                                        anchors: e.anchor_activations,
                                    })),
                                }, null, 2),
                            }],
                    };
                }
            }
            catch (error) {
                console.error("Error reading embeddings, falling back:", error);
            }
        }
        // Fallback: Read from JSON file
        const logsPath = path.join(ROOT_DIR, "captains-log-entries.json");
        let logs = [];
        try {
            const content = fs.readFileSync(logsPath, "utf-8");
            logs = JSON.parse(content);
        }
        catch {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            note: "No Captain's Log entries found yet",
                            entries: [],
                        }, null, 2),
                    }],
            };
        }
        // Filter by platform if provided
        let filtered = logs;
        if (platform && isValidPlatform(platform)) {
            filtered = filtered.filter(e => e.platform === platform);
        }
        // Sort by stardate (most recent first) and take limit
        const entries = filtered
            .sort((a, b) => b.stardate.localeCompare(a.stardate))
            .slice(0, limit)
            .map(e => ({
            stardate: formatStardate(e.stardate),
            platform: e.platform,
            content: e.cleanedContent,
            context: e.contextType,
            tags: e.tags,
        }));
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        mode: "local",
                        total_entries: logs.length,
                        showing: entries.length,
                        platform_filter: platform || "all",
                        entries,
                    }, null, 2),
                }],
        };
    }
    if (name === "get_log_platforms") {
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        platforms: getAllPlatforms(),
                        triggers: CaptainsLog.TRIGGER_PATTERNS,
                        context_types: Object.keys(CaptainsLog.CONTEXT_PATTERNS),
                    }, null, 2),
                }],
        };
    }
    // ─── Filesystem Tool Handlers ──────────────────────────────────────────────
    if (name === "read_repo_file") {
        const { path: filePath, encoding = "utf-8" } = args;
        const resolvedPath = resolveRepoPath(filePath);
        if (!resolvedPath) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: "Path not found or not allowed",
                            path: filePath,
                            allowed_repos: Object.keys(THOUGHTFORM_REPOS),
                        }, null, 2),
                    }],
            };
        }
        try {
            const content = fs.readFileSync(resolvedPath, encoding);
            const stats = fs.statSync(resolvedPath);
            const check = isPathAllowed(resolvedPath);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            path: resolvedPath,
                            repo: check.repo,
                            size: stats.size,
                            modified: stats.mtime.toISOString(),
                            content,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to read file: ${String(error)}`,
                            path: resolvedPath,
                        }, null, 2),
                    }],
            };
        }
    }
    if (name === "write_repo_file") {
        const { path: filePath, content } = args;
        const resolvedPath = resolveRepoPath(filePath);
        if (!resolvedPath) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: "Path not allowed",
                            path: filePath,
                            allowed_repos: Object.keys(THOUGHTFORM_REPOS),
                        }, null, 2),
                    }],
            };
        }
        try {
            // Create directory if needed
            const dir = path.dirname(resolvedPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(resolvedPath, content, "utf-8");
            const stats = fs.statSync(resolvedPath);
            const check = isPathAllowed(resolvedPath);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            status: "written",
                            path: resolvedPath,
                            repo: check.repo,
                            size: stats.size,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to write file: ${String(error)}`,
                            path: resolvedPath,
                        }, null, 2),
                    }],
            };
        }
    }
    if (name === "list_repo_dir") {
        const { path: dirPath } = args;
        const resolvedPath = resolveRepoPath(dirPath);
        if (!resolvedPath) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: "Path not found or not allowed",
                            path: dirPath,
                            allowed_repos: Object.keys(THOUGHTFORM_REPOS),
                        }, null, 2),
                    }],
            };
        }
        try {
            const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
            const check = isPathAllowed(resolvedPath);
            const items = entries.map(entry => ({
                name: entry.name,
                type: entry.isDirectory() ? "directory" : "file",
                path: path.join(resolvedPath, entry.name),
            }));
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            path: resolvedPath,
                            repo: check.repo,
                            count: items.length,
                            entries: items,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Failed to list directory: ${String(error)}`,
                            path: resolvedPath,
                        }, null, 2),
                    }],
            };
        }
    }
    if (name === "search_repo_files") {
        const { pattern, repo } = args;
        const searchRepos = repo ? { [repo]: THOUGHTFORM_REPOS[repo] } : THOUGHTFORM_REPOS;
        const results = [];
        // Simple glob matching (basic implementation)
        function matchGlob(filePath, globPattern) {
            const regexPattern = globPattern
                .replace(/\*\*/g, "<<<GLOBSTAR>>>")
                .replace(/\*/g, "[^/]*")
                .replace(/<<<GLOBSTAR>>>/g, ".*")
                .replace(/\./g, "\\.")
                .replace(/\?/g, ".");
            return new RegExp(`^${regexPattern}$`).test(filePath);
        }
        function searchDir(dir, repoName, repoBase) {
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    const relativePath = path.relative(repoBase, fullPath).replace(/\\/g, "/");
                    // Skip node_modules, .git, etc.
                    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") {
                        continue;
                    }
                    if (entry.isDirectory()) {
                        searchDir(fullPath, repoName, repoBase);
                    }
                    else if (matchGlob(relativePath, pattern) || matchGlob(entry.name, pattern)) {
                        results.push({
                            repo: repoName,
                            path: fullPath,
                            relativePath,
                        });
                    }
                }
            }
            catch {
                // Skip directories we can't read
            }
        }
        for (const [repoName, repoPath] of Object.entries(searchRepos)) {
            if (fs.existsSync(repoPath)) {
                searchDir(repoPath, repoName, repoPath);
            }
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        pattern,
                        repo_filter: repo || "all",
                        count: results.length,
                        files: results.slice(0, 100), // Limit results
                    }, null, 2),
                }],
        };
    }
    if (name === "get_repo_tree") {
        const { repo, maxDepth = 3 } = args;
        const repoPath = THOUGHTFORM_REPOS[repo];
        if (!repoPath || !fs.existsSync(repoPath)) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Repo not found: ${repo}`,
                            allowed_repos: Object.keys(THOUGHTFORM_REPOS),
                        }, null, 2),
                    }],
            };
        }
        function buildTree(dir, depth) {
            if (depth > maxDepth)
                return [];
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                return entries
                    .filter(e => !["node_modules", ".git", "dist", ".next", "__pycache__"].includes(e.name))
                    .map(entry => {
                    const node = {
                        name: entry.name,
                        type: entry.isDirectory() ? "directory" : "file",
                    };
                    if (entry.isDirectory()) {
                        node.children = buildTree(path.join(dir, entry.name), depth + 1);
                    }
                    return node;
                })
                    .sort((a, b) => {
                    // Directories first
                    if (a.type !== b.type)
                        return a.type === "directory" ? -1 : 1;
                    return a.name.localeCompare(b.name);
                });
            }
            catch {
                return [];
            }
        }
        const tree = buildTree(repoPath, 0);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        repo,
                        path: repoPath,
                        maxDepth,
                        tree,
                    }, null, 2),
                }],
        };
    }
    if (name === "list_repos") {
        const repos = Object.entries(THOUGHTFORM_REPOS).map(([name, repoPath]) => ({
            name,
            path: repoPath,
            exists: fs.existsSync(repoPath),
        }));
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        count: repos.length,
                        repos,
                    }, null, 2),
                }],
        };
    }
    // ─── Design Navigation Tool Handlers ────────────────────────────────────────
    if (name === "match_reference") {
        const { description, platform, limit = 5 } = args;
        if (!embeddingsConfigured) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: "Voyage API key not configured",
                            note: "Set VOYAGE_API_KEY to enable semantic matching",
                        }, null, 2),
                    }],
            };
        }
        try {
            const result = await matchReference(description, { platform, limit });
            return {
                content: [{
                        type: "text",
                        text: `Tool: match_reference, Result: ${JSON.stringify({
                            mode: "match",
                            query: description,
                            matchCount: result.matches.length,
                            matches: result.matches.map(m => ({
                                component: m.component.name,
                                repo: m.component.repo,
                                platform: m.component.platform,
                                similarity: Math.round(m.similarity * 1000) / 1000,
                                patterns: m.sharedPatterns,
                                tokens: m.sharedTokens.slice(0, 5),
                            })),
                            suggestedTokens: result.suggestedTokens,
                            suggestedPatterns: result.suggestedPatterns,
                            implementationPath: result.implementationPath,
                        }, null, 2)}`,
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: String(error) }, null, 2),
                    }],
            };
        }
    }
    if (name === "project_reference") {
        const { description, platforms } = args;
        if (!embeddingsConfigured) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: "Voyage API key not configured",
                            note: "Set VOYAGE_API_KEY to enable projection",
                        }, null, 2),
                    }],
            };
        }
        try {
            const projections = await projectReference(description, platforms);
            return {
                content: [{
                        type: "text",
                        text: `Tool: project_reference, Result: ${JSON.stringify({
                            mode: "navigate/project",
                            query: description,
                            projections: projections.map(p => ({
                                platform: p.platform,
                                description: p.description,
                                suggestedTokens: p.suggestedTokens,
                                suggestedPatterns: p.suggestedPatterns,
                                similarComponents: p.similarComponents,
                            })),
                        }, null, 2)}`,
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: String(error) }, null, 2),
                    }],
            };
        }
    }
    if (name === "interpolate_designs") {
        const { componentA, componentB, steps = 5 } = args;
        try {
            const points = interpolateDesigns(componentA, componentB, steps);
            return {
                content: [{
                        type: "text",
                        text: `Tool: interpolate_designs, Result: ${JSON.stringify({
                            mode: "navigate/interpolate",
                            from: componentA,
                            to: componentB,
                            steps: points.length,
                            interpolation: points.map(p => ({
                                ratio: p.ratio,
                                description: p.description,
                                suggestedTokens: p.suggestedTokens,
                                suggestedPatterns: p.suggestedPatterns,
                            })),
                        }, null, 2)}`,
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: String(error) }, null, 2),
                    }],
            };
        }
    }
    if (name === "explore_space") {
        const { terminal_organic, minimal_dense, cool_warm, static_animated, limit = 5 } = args;
        try {
            const result = exploreSpace({
                terminal_organic: terminal_organic ?? 0,
                minimal_dense: minimal_dense ?? 0,
                cool_warm: cool_warm ?? 0,
                static_animated: static_animated ?? 0,
            }, { limit });
            return {
                content: [{
                        type: "text",
                        text: `Tool: explore_space, Result: ${JSON.stringify({
                            mode: "navigate/explore",
                            position: result.position,
                            nearestPlatform: result.nearestPlatform,
                            platformDistance: Math.round(result.platformDistance * 1000) / 1000,
                            suggestedTokens: result.suggestedTokens,
                            suggestedPatterns: result.suggestedPatterns,
                            nearbyComponents: result.nearbyComponents.map(c => ({
                                component: c.component.name,
                                repo: c.component.repo,
                                platform: c.component.platform,
                                similarity: Math.round(c.similarity * 1000) / 1000,
                            })),
                        }, null, 2)}`,
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: String(error) }, null, 2),
                    }],
            };
        }
    }
    if (name === "get_component") {
        const { id } = args;
        const component = getComponentById(id);
        if (!component) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: `Component not found: ${id}`,
                            hint: "Use list_components to see available components",
                        }, null, 2),
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: `Tool: get_component, Result: ${JSON.stringify({
                        id: component.id,
                        name: component.name,
                        repo: component.repo,
                        platform: component.platform,
                        embeddingText: component.embeddingText,
                        usesTokens: component.usesTokens,
                        usesPatterns: component.usesPatterns,
                        relatedComponents: component.relatedComponents.slice(0, 10),
                        semanticPosition: component.semanticPosition,
                    }, null, 2)}`,
                }],
        };
    }
    if (name === "list_components") {
        const { platform } = args;
        let components = getAllComponents();
        if (platform) {
            components = components.filter(c => c.platform === platform);
        }
        return {
            content: [{
                    type: "text",
                    text: `Tool: list_components, Result: ${JSON.stringify({
                        count: components.length,
                        platform_filter: platform || "all",
                        components: components.map(c => ({
                            id: c.id,
                            name: c.name,
                            repo: c.repo,
                            platform: c.platform,
                            patterns: c.usesPatterns,
                        })),
                    }, null, 2)}`,
                }],
        };
    }
    if (name === "get_design_space_info") {
        const space = getDesignSpace();
        const graph = getComponentGraph();
        const stats = getNavigatorStats();
        return {
            content: [{
                    type: "text",
                    text: `Tool: get_design_space_info, Result: ${JSON.stringify({
                        componentCount: stats.componentCount,
                        platforms: stats.platforms,
                        axes: space?.axes.map(a => ({
                            id: a.id,
                            name: a.name,
                            negative: a.negative.label,
                            positive: a.positive.label,
                            negativeTokens: a.negative.tokens,
                            positiveTokens: a.positive.tokens,
                        })),
                        platformPositions: space?.platforms,
                        graphStats: {
                            nodes: graph?.nodes.length || 0,
                            edges: graph?.edges.length || 0,
                        },
                    }, null, 2)}`,
                }],
        };
    }
    throw new Error(`Unknown tool: ${name}`);
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Thoughtform Design MCP Server running on stdio");
}
main().catch(console.error);

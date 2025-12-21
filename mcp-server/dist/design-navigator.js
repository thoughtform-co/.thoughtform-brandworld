/**
 * Thoughtform Design Navigator
 *
 * Implements two complementary modes for the semantic design system:
 *
 * MODE 1: MATCH (Grounded Search)
 * - Find similar existing components
 * - Get implementation guidance
 * - Practical, actionable, grounded in codebase
 *
 * MODE 2: NAVIGATE (Generative Exploration)
 * - Project references into platform-specific expressions
 * - Interpolate between design points
 * - Explore design space with semantic parameters
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");
// ═══════════════════════════════════════════════════════════════════════════
// DATA LOADING
// ═══════════════════════════════════════════════════════════════════════════
let embeddings = [];
let designSpace = null;
let componentGraph = null;
let voyageApiKey = null;
export function initializeNavigator(config) {
    voyageApiKey = config.voyageKey || null;
    loadData();
}
function loadData() {
    // Load component embeddings
    const embeddingsPath = path.join(ROOT_DIR, "semantic/components/embeddings.json");
    if (fs.existsSync(embeddingsPath)) {
        const data = JSON.parse(fs.readFileSync(embeddingsPath, "utf-8"));
        embeddings = data.embeddings || [];
        console.error(`✓ Loaded ${embeddings.length} component embeddings`);
    }
    else {
        console.error("⚠ No component embeddings found. Run embed-components.ts first.");
    }
    // Load design space
    const spacePath = path.join(ROOT_DIR, "semantic/design-space.json");
    if (fs.existsSync(spacePath)) {
        designSpace = JSON.parse(fs.readFileSync(spacePath, "utf-8"));
        console.error(`✓ Loaded design space with ${designSpace?.axes.length || 0} axes`);
    }
    // Load component graph
    const graphPath = path.join(ROOT_DIR, "semantic/component-graph.json");
    if (fs.existsSync(graphPath)) {
        componentGraph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
        console.error(`✓ Loaded component graph with ${componentGraph?.nodes.length || 0} nodes`);
    }
}
// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
function positionDistance(a, b) {
    return Math.sqrt(Math.pow(a.terminal_organic - b.terminal_organic, 2) +
        Math.pow(a.minimal_dense - b.minimal_dense, 2) +
        Math.pow(a.cool_warm - b.cool_warm, 2) +
        Math.pow(a.static_animated - b.static_animated, 2));
}
function interpolatePosition(a, b, ratio) {
    return {
        terminal_organic: a.terminal_organic + (b.terminal_organic - a.terminal_organic) * ratio,
        minimal_dense: a.minimal_dense + (b.minimal_dense - a.minimal_dense) * ratio,
        cool_warm: a.cool_warm + (b.cool_warm - a.cool_warm) * ratio,
        static_animated: a.static_animated + (b.static_animated - a.static_animated) * ratio,
    };
}
async function generateQueryEmbedding(text) {
    if (!voyageApiKey) {
        throw new Error("Voyage API key not configured");
    }
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${voyageApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "voyage-3-lite",
            input: text,
            input_type: "query",
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Voyage embedding error: ${error}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
}
// ═══════════════════════════════════════════════════════════════════════════
// MODE 1: MATCH (Grounded Search)
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Find components similar to the given description/reference
 */
export async function matchReference(description, options = {}) {
    const limit = options.limit || 5;
    const threshold = options.threshold || 0.3;
    // Generate embedding for the query
    const queryEmbedding = await generateQueryEmbedding(description);
    // Find similar components
    let candidates = embeddings;
    if (options.platform) {
        candidates = candidates.filter(c => c.platform === options.platform || c.platform === "shared");
    }
    const matches = candidates
        .map(comp => {
        const similarity = cosineSimilarity(queryEmbedding, comp.embedding);
        return {
            component: comp,
            similarity,
            sharedPatterns: comp.usesPatterns,
            sharedTokens: comp.usesTokens,
        };
    })
        .filter(m => m.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    // Aggregate suggested tokens and patterns from top matches
    const tokenCounts = {};
    const patternCounts = {};
    for (const match of matches) {
        for (const token of match.component.usesTokens) {
            tokenCounts[token] = (tokenCounts[token] || 0) + match.similarity;
        }
        for (const pattern of match.component.usesPatterns) {
            patternCounts[pattern] = (patternCounts[pattern] || 0) + match.similarity;
        }
    }
    const suggestedTokens = Object.entries(tokenCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([token]) => token);
    const suggestedPatterns = Object.entries(patternCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([pattern]) => pattern);
    // Generate implementation path
    const implementationPath = [];
    if (matches.length > 0) {
        const topMatch = matches[0];
        implementationPath.push(`Start from ${topMatch.component.name} (${topMatch.component.repo})`);
        if (suggestedTokens.length > 0) {
            implementationPath.push(`Use tokens: ${suggestedTokens.slice(0, 4).join(", ")}`);
        }
        if (suggestedPatterns.length > 0) {
            implementationPath.push(`Apply patterns: ${suggestedPatterns.join(", ")}`);
        }
        if (topMatch.component.relatedComponents.length > 0) {
            implementationPath.push(`Related components: ${topMatch.component.relatedComponents.slice(0, 3).join(", ")}`);
        }
    }
    return {
        matches,
        suggestedTokens,
        suggestedPatterns,
        implementationPath,
    };
}
/**
 * Search components by semantic position in design space
 */
export function searchByPosition(position, options = {}) {
    const limit = options.limit || 5;
    // Create full position with defaults at 0
    const targetPosition = {
        terminal_organic: position.terminal_organic ?? 0,
        minimal_dense: position.minimal_dense ?? 0,
        cool_warm: position.cool_warm ?? 0,
        static_animated: position.static_animated ?? 0,
    };
    return embeddings
        .map(comp => ({
        component: comp,
        similarity: 1 - positionDistance(targetPosition, comp.semanticPosition) / 4, // Normalize
        sharedPatterns: comp.usesPatterns,
        sharedTokens: comp.usesTokens,
    }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
}
// ═══════════════════════════════════════════════════════════════════════════
// MODE 2: NAVIGATE - Projection
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Project a reference into platform-specific expressions
 */
export async function projectReference(description, targetPlatforms) {
    if (!designSpace) {
        throw new Error("Design space not loaded");
    }
    // Get base match first
    const baseMatch = await matchReference(description, { limit: 3 });
    const platforms = targetPlatforms || designSpace.platforms.map(p => p.id);
    const results = [];
    for (const platformId of platforms) {
        const platform = designSpace.platforms.find(p => p.id === platformId);
        if (!platform)
            continue;
        // Find components from this platform
        const platformComponents = embeddings.filter(c => c.platform === platformId);
        // Find most similar platform components
        const similarPlatformComps = baseMatch.matches.length > 0
            ? platformComponents
                .map(comp => ({
                component: comp,
                similarity: cosineSimilarity(baseMatch.matches[0].component.embedding, comp.embedding),
            }))
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 3)
            : [];
        // Determine tokens and patterns for this platform
        const platformTokens = new Set(platform.primaryTokens);
        const platformPatterns = new Set();
        for (const sc of similarPlatformComps) {
            for (const t of sc.component.usesTokens)
                platformTokens.add(t);
            for (const p of sc.component.usesPatterns)
                platformPatterns.add(p);
        }
        // Generate description based on platform characteristics
        let platformDescription = "";
        switch (platformId) {
            case "atlas":
                platformDescription = `As Atlas: Organic, specimen-like treatment. ${baseMatch.suggestedPatterns.includes("cornerBrackets") ? "Corner brackets framing the element. " : ""}Dawn glow accents on void background. Breathing animation if interactive.`;
                break;
            case "ledger":
                platformDescription = `As Ledger: Terminal aesthetic with scanline overlay. Verde accent on key data points. Monospace typography, horizontal flow.${baseMatch.suggestedPatterns.includes("particleSystem") ? " Horizontal particle drift in background." : ""}`;
                break;
            case "astrolabe":
                platformDescription = `As Astrolabe: Navigation instrument aesthetic. Gold traces on void, brass-tinted overlays. Integrated into cockpit/HUD context. Axis-flow particles if animated.`;
                break;
            case "marketing":
                platformDescription = `As Marketing: Hero-scale treatment with particle gateway. Gold and dawn accents, dramatic void background. Portal frame aesthetic for key elements.`;
                break;
            default:
                platformDescription = `As ${platformId}: Adapted to platform conventions.`;
        }
        results.push({
            platform: platformId,
            description: platformDescription,
            suggestedTokens: Array.from(platformTokens).slice(0, 8),
            suggestedPatterns: Array.from(platformPatterns).slice(0, 5),
            similarComponents: similarPlatformComps.map(sc => sc.component.name),
            positionAdjustments: platform.position,
        });
    }
    return results;
}
// ═══════════════════════════════════════════════════════════════════════════
// MODE 2: NAVIGATE - Interpolation
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Interpolate between two components or design points
 */
export function interpolateDesigns(componentA, componentB, steps = 5) {
    const compA = embeddings.find(c => c.id === componentA || c.name === componentA);
    const compB = embeddings.find(c => c.id === componentB || c.name === componentB);
    if (!compA || !compB) {
        throw new Error(`Components not found: ${!compA ? componentA : ""} ${!compB ? componentB : ""}`);
    }
    const results = [];
    for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const position = interpolatePosition(compA.semanticPosition, compB.semanticPosition, ratio);
        // Find tokens and patterns by blending
        const tokensA = new Set(compA.usesTokens);
        const tokensB = new Set(compB.usesTokens);
        const sharedTokens = [...tokensA].filter(t => tokensB.has(t));
        const uniqueA = [...tokensA].filter(t => !tokensB.has(t));
        const uniqueB = [...tokensB].filter(t => !tokensA.has(t));
        const suggestedTokens = [
            ...sharedTokens,
            ...(ratio < 0.5 ? uniqueA.slice(0, Math.ceil((1 - ratio) * uniqueA.length)) : []),
            ...(ratio > 0.5 ? uniqueB.slice(0, Math.ceil(ratio * uniqueB.length)) : []),
        ];
        const patternsA = new Set(compA.usesPatterns);
        const patternsB = new Set(compB.usesPatterns);
        const sharedPatterns = [...patternsA].filter(p => patternsB.has(p));
        const suggestedPatterns = [
            ...sharedPatterns,
            ...(ratio < 0.5 ? [...patternsA].filter(p => !patternsB.has(p)) : []),
            ...(ratio >= 0.5 ? [...patternsB].filter(p => !patternsA.has(p)) : []),
        ];
        // Generate description
        let description = "";
        if (ratio === 0) {
            description = `Pure ${compA.name}`;
        }
        else if (ratio === 1) {
            description = `Pure ${compB.name}`;
        }
        else if (ratio < 0.3) {
            description = `Mostly ${compA.name} with hints of ${compB.name}`;
        }
        else if (ratio > 0.7) {
            description = `Mostly ${compB.name} with hints of ${compA.name}`;
        }
        else {
            description = `Balanced blend of ${compA.name} and ${compB.name}`;
        }
        // Add position context
        if (position.terminal_organic < -0.3)
            description += ". Terminal aesthetic.";
        else if (position.terminal_organic > 0.3)
            description += ". Organic aesthetic.";
        if (position.cool_warm < -0.3)
            description += " Cool tones.";
        else if (position.cool_warm > 0.3)
            description += " Warm tones.";
        results.push({
            ratio,
            description,
            suggestedTokens: [...new Set(suggestedTokens)],
            suggestedPatterns: [...new Set(suggestedPatterns)],
        });
    }
    return results;
}
// ═══════════════════════════════════════════════════════════════════════════
// MODE 2: NAVIGATE - Exploration
// ═══════════════════════════════════════════════════════════════════════════
/**
 * Explore design space by adjusting semantic parameters
 */
export function exploreSpace(parameters, options = {}) {
    if (!designSpace) {
        throw new Error("Design space not loaded");
    }
    const limit = options.limit || 5;
    const position = {
        terminal_organic: parameters.terminal_organic ?? 0,
        minimal_dense: parameters.minimal_dense ?? 0,
        cool_warm: parameters.cool_warm ?? 0,
        static_animated: parameters.static_animated ?? 0,
    };
    // Find nearest platform
    let nearestPlatform = designSpace.platforms[0];
    let nearestDistance = Infinity;
    for (const platform of designSpace.platforms) {
        const dist = positionDistance(position, platform.position);
        if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestPlatform = platform;
        }
    }
    // Find nearby components
    const nearbyComponents = searchByPosition(position, { limit });
    // Determine suggested tokens based on position
    const suggestedTokens = [...nearestPlatform.primaryTokens];
    for (const axis of designSpace.axes) {
        const axisValue = position[axis.id];
        if (axisValue < -0.3) {
            suggestedTokens.push(...axis.negative.tokens);
        }
        else if (axisValue > 0.3) {
            suggestedTokens.push(...axis.positive.tokens);
        }
    }
    // Determine suggested patterns
    const suggestedPatterns = [];
    for (const axis of designSpace.axes) {
        const axisValue = position[axis.id];
        if (axisValue < -0.3) {
            suggestedPatterns.push(...axis.negative.patterns);
        }
        else if (axisValue > 0.3) {
            suggestedPatterns.push(...axis.positive.patterns);
        }
    }
    return {
        position,
        nearestPlatform: nearestPlatform.id,
        platformDistance: nearestDistance,
        suggestedTokens: [...new Set(suggestedTokens)],
        suggestedPatterns: [...new Set(suggestedPatterns)],
        nearbyComponents,
    };
}
// ═══════════════════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════
export function getComponentById(id) {
    return embeddings.find(c => c.id === id || c.name === id);
}
export function getAllComponents() {
    return embeddings;
}
export function getDesignSpace() {
    return designSpace;
}
export function getComponentGraph() {
    return componentGraph;
}
export function getStats() {
    return {
        componentCount: embeddings.length,
        platforms: [...new Set(embeddings.map(c => c.platform))],
        axisCount: designSpace?.axes.length || 0,
    };
}

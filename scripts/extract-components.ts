#!/usr/bin/env npx tsx
/**
 * Thoughtform Semantic Design Navigation - Component Extraction Script
 * 
 * Extracts semantic information from components across all Thoughtform repos.
 * This forms the foundation for both Match mode (search) and Navigate mode (exploration).
 * 
 * Usage:
 *   npx tsx scripts/extract-components.ts
 * 
 * Output:
 *   - semantic/components/index.json - All extracted component metadata
 *   - semantic/component-graph.json - Relationship graph
 *   - semantic/design-space.json - Axis definitions
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

// Repo paths - matches the MCP server configuration
const DROPBOX_BASE = process.platform === "win32"
  ? "C:\\Users\\buyss\\Dropbox\\03_Thoughtform"
  : "/Users/voidwalker/Library/CloudStorage/Dropbox/03_Thoughtform";

const REPOS: Record<string, string> = {
  brandworld: path.join(DROPBOX_BASE, "01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld"),
  atlas: path.join(DROPBOX_BASE, "08_Artifacts/atlas"),
  ledger: path.join(DROPBOX_BASE, "08_Artifacts/ledger-web"),
  astrolabe: path.join(DROPBOX_BASE, "08_Artifacts/09_Astrolabe"),
};

// Component directories to scan per repo
const COMPONENT_PATHS: Record<string, string[]> = {
  brandworld: [
    "components/atlas",
    "components/ledger",
    "components/astrolabe",
    "components/shared",
    "components/thoughtform-co",
    "components/mockups",
  ],
  atlas: [
    "src/components/constellation",
    "src/components/admin",
    "src/components/forge",
    "src/components/shared",
    "src/components/ui",
    "design/mockups",
  ],
  ledger: [
    "src/components",
    "design",
  ],
  astrolabe: [
    "src/components",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ComponentMetadata {
  id: string;
  name: string;
  path: string;
  repo: string;
  platform: string;
  
  // Extracted content for embedding
  description: string;
  visualCharacteristics: string;
  implementation: string;
  
  // Relationships
  imports: string[];
  usesTokens: string[];
  usesPatterns: string[];
  relatedComponents: string[];
  
  // Semantic position in design space (-1 to 1)
  semanticPosition: {
    terminal_organic: number;
    minimal_dense: number;
    cool_warm: number;
    static_animated: number;
  };
  
  // Raw content for full embedding
  embeddingText: string;
  
  // Metadata
  fileType: "tsx" | "html" | "md" | "css";
  lineCount: number;
  lastModified: string;
}

export interface ComponentGraph {
  nodes: { id: string; platform: string; type: string }[];
  edges: { source: string; target: string; relationship: string }[];
}

export interface DesignSpace {
  axes: {
    id: string;
    name: string;
    negative: { label: string; tokens: string[]; patterns: string[] };
    positive: { label: string; tokens: string[]; patterns: string[] };
  }[];
  platforms: {
    id: string;
    position: Record<string, number>;
    primaryTokens: string[];
  }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// TOKEN & PATTERN DETECTION
// ═══════════════════════════════════════════════════════════════════════════

const TOKEN_PATTERNS = {
  colors: [
    /--void/g, /--dawn/g, /--gold/g, /--verde/g, /--signal/g,
    /--paper/g, /--ink/g, /--teal/g,
    /var\(--[\w-]+\)/g,
  ],
  typography: [
    /font-mono/g, /PT Mono/g, /IBM Plex/g, /Mondwest/g, /NeueBit/g,
    /font-sans/g, /font-serif/g,
  ],
  spacing: [
    /GRID\s*=\s*3/g, /gap-\d/g, /space-\d/g, /p-\d/g, /m-\d/g,
  ],
};

const VISUAL_PATTERNS = {
  cornerBrackets: /corner.*bracket|bracket.*corner|-top-px.*-left-px|-bottom-px.*-right-px/gi,
  glassmorphism: /backdrop-filter|blur\(|glass|frosted/gi,
  scanlines: /scanline|repeating-linear-gradient.*0deg/gi,
  particleSystem: /particle|canvas|animate|requestAnimationFrame/gi,
  threatGradient: /threat.*level|threat.*color|benign|cautious|volatile|existential/gi,
  breathing: /breathing|pulse|animate.*pulse|scale\[1\.\d/gi,
  gridSnapping: /GRID\s*=\s*3|Math\.floor.*\/\s*3|pixel.*snap/gi,
};

const PLATFORM_INDICATORS = {
  atlas: /entity|denizen|specimen|bestiary|threat|creature|cosmic|alien/gi,
  ledger: /terminal|invoice|stat|metric|epoch|financial|dashboard/gi,
  astrolabe: /navigation|cockpit|instrument|canon|article|compass/gi,
  marketing: /hero|feature|cta|landing|thoughtform\.co/gi,
};

// ═══════════════════════════════════════════════════════════════════════════
// EXTRACTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function extractTokensFromContent(content: string): string[] {
  const tokens = new Set<string>();
  
  // Extract CSS custom properties
  const cssVars = content.match(/var\(--[\w-]+\)/g) || [];
  cssVars.forEach(v => tokens.add(v.replace(/var\(|\)/g, "")));
  
  // Extract direct token references
  const directTokens = content.match(/--[\w-]+/g) || [];
  directTokens.forEach(t => tokens.add(t));
  
  // Extract color token names
  ["void", "dawn", "gold", "verde", "signal", "paper", "ink", "teal"].forEach(color => {
    if (content.toLowerCase().includes(color)) {
      tokens.add(`--${color}`);
    }
  });
  
  return Array.from(tokens).filter(t => t.startsWith("--"));
}

function extractPatternsFromContent(content: string): string[] {
  const patterns: string[] = [];
  
  for (const [patternName, regex] of Object.entries(VISUAL_PATTERNS)) {
    if (regex.test(content)) {
      patterns.push(patternName);
    }
    // Reset regex lastIndex
    regex.lastIndex = 0;
  }
  
  return patterns;
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // Match import statements
  const importMatches = content.match(/import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"][^'"]+['"]/g) || [];
  
  for (const imp of importMatches) {
    // Extract the path
    const pathMatch = imp.match(/from\s+['"]([^'"]+)['"]/);
    if (pathMatch) {
      imports.push(pathMatch[1]);
    }
  }
  
  return imports;
}

function detectPlatform(content: string, filePath: string): string {
  // Check file path first
  if (filePath.includes("/atlas/") || filePath.includes("\\atlas\\")) return "atlas";
  if (filePath.includes("/ledger/") || filePath.includes("\\ledger\\")) return "ledger";
  if (filePath.includes("/astrolabe/") || filePath.includes("\\astrolabe\\")) return "astrolabe";
  if (filePath.includes("thoughtform-co") || filePath.includes("marketing")) return "marketing";
  
  // Check content for platform indicators
  let scores: Record<string, number> = { atlas: 0, ledger: 0, astrolabe: 0, marketing: 0 };
  
  for (const [platform, regex] of Object.entries(PLATFORM_INDICATORS)) {
    const matches = content.match(regex) || [];
    scores[platform] = matches.length;
    regex.lastIndex = 0;
  }
  
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    return Object.entries(scores).find(([, v]) => v === maxScore)?.[0] || "shared";
  }
  
  return "shared";
}

function extractHeaderComment(content: string): { description: string; anchors: string[]; rules: string[] } {
  const result = { description: "", anchors: [] as string[], rules: [] as string[] };
  
  // Look for JSDoc-style or block comment at the start
  const headerMatch = content.match(/^\/\*\*[\s\S]*?\*\/|^\/\*[\s\S]*?\*\//);
  if (!headerMatch) return result;
  
  const header = headerMatch[0];
  
  // Extract description (first paragraph)
  const descMatch = header.match(/\*\s*([A-Z][\w\s-]+(?:\.|$))/);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }
  
  // Extract semantic anchors
  const anchorMatch = header.match(/SEMANTIC ANCHORS?:\s*([^\n*]+)/i);
  if (anchorMatch) {
    result.anchors = anchorMatch[1].split(/,\s*/).map(a => a.trim());
  }
  
  // Extract design rules
  const rulesMatch = header.match(/DESIGN RULES?:([\s\S]*?)(?:\*\/|\n\s*\*\s*[A-Z])/i);
  if (rulesMatch) {
    const rulesText = rulesMatch[1];
    const ruleLines = rulesText.match(/\*\s*-\s*[^\n]+/g) || [];
    result.rules = ruleLines.map(r => r.replace(/\*\s*-\s*/, "").trim());
  }
  
  return result;
}

function calculateSemanticPosition(
  content: string,
  tokens: string[],
  patterns: string[],
  platform: string
): ComponentMetadata["semanticPosition"] {
  // Initialize at neutral
  const position = {
    terminal_organic: 0,
    minimal_dense: 0,
    cool_warm: 0,
    static_animated: 0,
  };
  
  // Terminal vs Organic axis
  if (patterns.includes("scanlines") || /monospace|PT Mono|terminal/i.test(content)) {
    position.terminal_organic -= 0.4;
  }
  if (patterns.includes("breathing") || /organic|radial|creature|entity/i.test(content)) {
    position.terminal_organic += 0.4;
  }
  if (tokens.some(t => t.includes("verde"))) position.terminal_organic -= 0.2;
  if (tokens.some(t => t.includes("dawn"))) position.terminal_organic += 0.2;
  
  // Minimal vs Dense axis
  const lineCount = content.split("\n").length;
  if (lineCount < 100) position.minimal_dense -= 0.3;
  if (lineCount > 300) position.minimal_dense += 0.3;
  if (/simple|minimal|clean/i.test(content)) position.minimal_dense -= 0.2;
  if (/complex|rich|detailed|parameter/i.test(content)) position.minimal_dense += 0.2;
  
  // Cool vs Warm axis
  if (tokens.some(t => t.includes("verde") || t.includes("teal"))) position.cool_warm -= 0.4;
  if (tokens.some(t => t.includes("gold") || t.includes("dawn") || t.includes("signal"))) position.cool_warm += 0.4;
  
  // Static vs Animated axis
  if (patterns.includes("particleSystem") || patterns.includes("breathing")) {
    position.static_animated += 0.5;
  }
  if (/animation|transition|animate|requestAnimationFrame/i.test(content)) {
    position.static_animated += 0.3;
  }
  if (/static|no-animation|immediate/i.test(content)) {
    position.static_animated -= 0.3;
  }
  
  // Platform adjustments
  if (platform === "ledger") {
    position.terminal_organic -= 0.2;
    position.cool_warm -= 0.1;
  }
  if (platform === "atlas") {
    position.terminal_organic += 0.2;
    position.cool_warm += 0.1;
  }
  
  // Clamp to [-1, 1]
  for (const key of Object.keys(position) as (keyof typeof position)[]) {
    position[key] = Math.max(-1, Math.min(1, position[key]));
  }
  
  return position;
}

function generateEmbeddingText(metadata: Omit<ComponentMetadata, "embeddingText">): string {
  const parts: string[] = [];
  
  parts.push(`Component: ${metadata.name}`);
  parts.push(`Platform: ${metadata.platform}`);
  
  if (metadata.description) {
    parts.push(`Description: ${metadata.description}`);
  }
  
  if (metadata.visualCharacteristics) {
    parts.push(`Visual characteristics: ${metadata.visualCharacteristics}`);
  }
  
  if (metadata.usesTokens.length > 0) {
    parts.push(`Uses tokens: ${metadata.usesTokens.join(", ")}`);
  }
  
  if (metadata.usesPatterns.length > 0) {
    parts.push(`Implements patterns: ${metadata.usesPatterns.join(", ")}`);
  }
  
  if (metadata.implementation) {
    parts.push(`Implementation notes: ${metadata.implementation}`);
  }
  
  const pos = metadata.semanticPosition;
  const posDesc: string[] = [];
  if (pos.terminal_organic < -0.3) posDesc.push("terminal aesthetic");
  if (pos.terminal_organic > 0.3) posDesc.push("organic aesthetic");
  if (pos.cool_warm < -0.3) posDesc.push("cool colors");
  if (pos.cool_warm > 0.3) posDesc.push("warm colors");
  if (pos.static_animated > 0.3) posDesc.push("animated");
  if (posDesc.length > 0) {
    parts.push(`Style: ${posDesc.join(", ")}`);
  }
  
  return parts.join(". ");
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE PROCESSING
// ═══════════════════════════════════════════════════════════════════════════

function processComponentFile(filePath: string, repo: string): ComponentMetadata | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).slice(1) as ComponentMetadata["fileType"];
    
    // Skip non-component files
    if (!["tsx", "html", "md", "css"].includes(ext)) return null;
    if (fileName.startsWith(".") || fileName.includes(".test.") || fileName.includes(".spec.")) return null;
    if (fileName === "index.ts" || fileName === "index.tsx") return null;
    
    // Extract semantic information
    const tokens = extractTokensFromContent(content);
    const patterns = extractPatternsFromContent(content);
    const imports = extractImports(content);
    const platform = detectPlatform(content, filePath);
    const header = extractHeaderComment(content);
    
    // Build visual characteristics from patterns
    const visualChars: string[] = [];
    if (patterns.includes("cornerBrackets")) visualChars.push("corner bracket accents");
    if (patterns.includes("glassmorphism")) visualChars.push("glassmorphism overlay");
    if (patterns.includes("scanlines")) visualChars.push("scanline effects");
    if (patterns.includes("particleSystem")) visualChars.push("particle animation");
    if (patterns.includes("threatGradient")) visualChars.push("threat level gradient");
    if (patterns.includes("breathing")) visualChars.push("breathing/pulsing animation");
    if (patterns.includes("gridSnapping")) visualChars.push("GRID=3 pixel snapping");
    
    // Calculate semantic position
    const semanticPosition = calculateSemanticPosition(content, tokens, patterns, platform);
    
    // Build component name
    const componentName = fileName.replace(/\.(tsx|html|md|css)$/, "");
    const componentId = `${repo}:${componentName}`;
    
    const metadata: Omit<ComponentMetadata, "embeddingText"> = {
      id: componentId,
      name: componentName,
      path: filePath,
      repo,
      platform,
      description: header.description || `${componentName} component for ${platform}`,
      visualCharacteristics: visualChars.join(", ") || "standard component styling",
      implementation: header.rules.join("; ") || "",
      imports,
      usesTokens: tokens,
      usesPatterns: patterns,
      relatedComponents: [], // Will be filled in graph building
      semanticPosition,
      fileType: ext,
      lineCount: content.split("\n").length,
      lastModified: stats.mtime.toISOString(),
    };
    
    return {
      ...metadata,
      embeddingText: generateEmbeddingText(metadata),
    };
  } catch (error) {
    console.error(`  ⚠ Error processing ${filePath}:`, error);
    return null;
  }
}

function scanDirectory(dirPath: string, repo: string): ComponentMetadata[] {
  const components: ComponentMetadata[] = [];
  
  if (!fs.existsSync(dirPath)) {
    return components;
  }
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (["node_modules", ".next", "dist", ".git", "__pycache__"].includes(entry.name)) {
        continue;
      }
      components.push(...scanDirectory(fullPath, repo));
    } else if (entry.isFile()) {
      const component = processComponentFile(fullPath, repo);
      if (component) {
        components.push(component);
      }
    }
  }
  
  return components;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH BUILDING
// ═══════════════════════════════════════════════════════════════════════════

function buildComponentGraph(components: ComponentMetadata[]): ComponentGraph {
  const graph: ComponentGraph = { nodes: [], edges: [] };
  
  // Add all components as nodes
  for (const comp of components) {
    graph.nodes.push({
      id: comp.id,
      platform: comp.platform,
      type: comp.fileType,
    });
  }
  
  // Build edges from imports and shared patterns
  for (const comp of components) {
    // Find components that share imports
    for (const imp of comp.imports) {
      // Check if any component matches this import
      for (const other of components) {
        if (other.id === comp.id) continue;
        
        // Check if import references this component
        if (imp.includes(other.name) || other.path.includes(imp)) {
          graph.edges.push({
            source: comp.id,
            target: other.id,
            relationship: "imports",
          });
        }
      }
    }
    
    // Find components that share patterns
    for (const pattern of comp.usesPatterns) {
      for (const other of components) {
        if (other.id === comp.id) continue;
        
        if (other.usesPatterns.includes(pattern)) {
          // Avoid duplicates
          const existingEdge = graph.edges.find(
            e => (e.source === comp.id && e.target === other.id) ||
                 (e.source === other.id && e.target === comp.id)
          );
          
          if (!existingEdge) {
            graph.edges.push({
              source: comp.id,
              target: other.id,
              relationship: `shares-${pattern}`,
            });
          }
        }
      }
    }
    
    // Find sibling components (same platform, same directory)
    const compDir = path.dirname(comp.path);
    for (const other of components) {
      if (other.id === comp.id) continue;
      
      if (path.dirname(other.path) === compDir && other.platform === comp.platform) {
        const existingEdge = graph.edges.find(
          e => (e.source === comp.id && e.target === other.id && e.relationship === "sibling") ||
               (e.source === other.id && e.target === comp.id && e.relationship === "sibling")
        );
        
        if (!existingEdge) {
          graph.edges.push({
            source: comp.id,
            target: other.id,
            relationship: "sibling",
          });
        }
      }
    }
  }
  
  // Update related components in metadata
  for (const comp of components) {
    const related = graph.edges
      .filter(e => e.source === comp.id || e.target === comp.id)
      .map(e => e.source === comp.id ? e.target : e.source);
    comp.relatedComponents = [...new Set(related)];
  }
  
  return graph;
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SPACE DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

function createDesignSpace(): DesignSpace {
  return {
    axes: [
      {
        id: "terminal_organic",
        name: "Terminal ↔ Organic",
        negative: {
          label: "Terminal",
          tokens: ["--verde", "--ink", "monospace"],
          patterns: ["scanlines", "gridSnapping"],
        },
        positive: {
          label: "Organic",
          tokens: ["--dawn", "--gold", "serif-accent"],
          patterns: ["breathing", "particleSystem"],
        },
      },
      {
        id: "minimal_dense",
        name: "Minimal ↔ Dense",
        negative: {
          label: "Minimal",
          tokens: ["--void", "space-large"],
          patterns: [],
        },
        positive: {
          label: "Dense",
          tokens: ["--surface-1", "space-tight"],
          patterns: ["glassmorphism", "cornerBrackets"],
        },
      },
      {
        id: "cool_warm",
        name: "Cool ↔ Warm",
        negative: {
          label: "Cool",
          tokens: ["--verde", "--teal", "--ink"],
          patterns: [],
        },
        positive: {
          label: "Warm",
          tokens: ["--gold", "--dawn", "--signal"],
          patterns: [],
        },
      },
      {
        id: "static_animated",
        name: "Static ↔ Animated",
        negative: {
          label: "Static",
          tokens: [],
          patterns: [],
        },
        positive: {
          label: "Animated",
          tokens: [],
          patterns: ["particleSystem", "breathing", "scanlines"],
        },
      },
    ],
    platforms: [
      {
        id: "atlas",
        position: {
          terminal_organic: 0.6,
          minimal_dense: 0.3,
          cool_warm: 0.5,
          static_animated: 0.4,
        },
        primaryTokens: ["--dawn", "--void", "--gold"],
      },
      {
        id: "ledger",
        position: {
          terminal_organic: -0.6,
          minimal_dense: 0.4,
          cool_warm: -0.4,
          static_animated: 0.2,
        },
        primaryTokens: ["--verde", "--void", "--ink"],
      },
      {
        id: "astrolabe",
        position: {
          terminal_organic: 0.2,
          minimal_dense: 0.2,
          cool_warm: 0.6,
          static_animated: 0.5,
        },
        primaryTokens: ["--gold", "--void", "--dawn"],
      },
      {
        id: "marketing",
        position: {
          terminal_organic: 0.3,
          minimal_dense: -0.2,
          cool_warm: 0.4,
          static_animated: 0.6,
        },
        primaryTokens: ["--gold", "--void", "--dawn"],
      },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Thoughtform Semantic Design Navigation                      ║");
  console.log("║  Component Extraction Script                                 ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  
  const allComponents: ComponentMetadata[] = [];
  
  // Scan each repo
  for (const [repoName, repoPath] of Object.entries(REPOS)) {
    console.log(`\n📂 Scanning ${repoName}...`);
    
    if (!fs.existsSync(repoPath)) {
      console.log(`  ⚠ Repo not found at ${repoPath}`);
      continue;
    }
    
    const componentPaths = COMPONENT_PATHS[repoName] || [];
    let repoComponentCount = 0;
    
    for (const compPath of componentPaths) {
      const fullPath = path.join(repoPath, compPath);
      const components = scanDirectory(fullPath, repoName);
      allComponents.push(...components);
      repoComponentCount += components.length;
      
      if (components.length > 0) {
        console.log(`  ✓ ${compPath}: ${components.length} components`);
      }
    }
    
    console.log(`  → Total: ${repoComponentCount} components from ${repoName}`);
  }
  
  console.log(`\n📊 Building component graph...`);
  const graph = buildComponentGraph(allComponents);
  console.log(`  ✓ ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
  
  console.log(`\n📐 Creating design space definition...`);
  const designSpace = createDesignSpace();
  console.log(`  ✓ ${designSpace.axes.length} axes, ${designSpace.platforms.length} platforms`);
  
  // Save outputs
  console.log(`\n💾 Saving outputs...`);
  
  const outputDir = path.join(ROOT_DIR, "semantic/components");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save component index
  const componentIndex = {
    version: "2.0.0",
    extracted_at: new Date().toISOString(),
    count: allComponents.length,
    components: allComponents,
  };
  fs.writeFileSync(
    path.join(outputDir, "index.json"),
    JSON.stringify(componentIndex, null, 2)
  );
  console.log(`  ✓ semantic/components/index.json (${allComponents.length} components)`);
  
  // Save graph
  fs.writeFileSync(
    path.join(ROOT_DIR, "semantic/component-graph.json"),
    JSON.stringify(graph, null, 2)
  );
  console.log(`  ✓ semantic/component-graph.json`);
  
  // Save design space
  fs.writeFileSync(
    path.join(ROOT_DIR, "semantic/design-space.json"),
    JSON.stringify(designSpace, null, 2)
  );
  console.log(`  ✓ semantic/design-space.json`);
  
  // Summary by platform
  console.log(`\n══════════════════════════════════════════════════════════════`);
  console.log(`✅ Extraction complete!`);
  console.log(`\n   Components by platform:`);
  const byPlatform: Record<string, number> = {};
  for (const comp of allComponents) {
    byPlatform[comp.platform] = (byPlatform[comp.platform] || 0) + 1;
  }
  for (const [platform, count] of Object.entries(byPlatform).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${platform}: ${count}`);
  }
  
  console.log(`\n   Components by repo:`);
  const byRepo: Record<string, number> = {};
  for (const comp of allComponents) {
    byRepo[comp.repo] = (byRepo[comp.repo] || 0) + 1;
  }
  for (const [repo, count] of Object.entries(byRepo).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${repo}: ${count}`);
  }
  
  console.log(`\n   Most common patterns:`);
  const patternCounts: Record<string, number> = {};
  for (const comp of allComponents) {
    for (const pattern of comp.usesPatterns) {
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    }
  }
  for (const [pattern, count] of Object.entries(patternCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    console.log(`     ${pattern}: ${count}`);
  }
  
  console.log(`\n══════════════════════════════════════════════════════════════`);
}

main().catch(console.error);


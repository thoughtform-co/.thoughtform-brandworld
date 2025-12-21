#!/usr/bin/env npx tsx
/**
 * Thoughtform Semantic Design System - Corpus Embedding Script
 * 
 * This script reads all design system content and creates embeddings:
 * - Philosophy documents
 * - Platform identity descriptions
 * - Anchor definitions
 * - Translation patterns
 * - Reference entries
 * - Platform fingerprints
 * 
 * Usage:
 *   npx tsx scripts/embed-corpus.ts
 * 
 * Environment variables required:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Validate environment
if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error("Missing required environment variables:");
  if (!SUPABASE_URL) console.error("  - SUPABASE_URL");
  if (!SUPABASE_KEY) console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  if (!OPENAI_KEY) console.error("  - OPENAI_API_KEY");
  console.error("\nCreate a .env.local file with these values.");
  process.exit(1);
}

// Import embeddings module dynamically after env validation
const { initializeEmbeddings, storeEmbedding, storeFingerprint } = await import("../mcp-server/src/embeddings.js");

// Initialize
initializeEmbeddings({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
  openaiKey: OPENAI_KEY,
});

// Helper functions
function readJsonFile(relativePath: string): unknown | null {
  try {
    const fullPath = path.join(ROOT_DIR, relativePath);
    const content = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Could not read ${relativePath}:`, error);
    return null;
  }
}

function readTextFile(relativePath: string): string | null {
  try {
    const fullPath = path.join(ROOT_DIR, relativePath);
    return fs.readFileSync(fullPath, "utf-8");
  } catch (error) {
    console.warn(`Could not read ${relativePath}:`, error);
    return null;
  }
}

// Embedding functions
async function embedPhilosophy(): Promise<number> {
  console.log("\n📚 Embedding philosophy documents...");
  let count = 0;

  // Core philosophy - PRINCIPLES.md
  const principles = readTextFile("philosophy/PRINCIPLES.md");
  if (principles) {
    await storeEmbedding({
      category: "philosophy",
      source_id: "philosophy-principles",
      source_path: "philosophy/PRINCIPLES.md",
      title: "Design Principles",
      content: principles,
      platforms: ["shared"],
      metadata: { type: "core" },
    });
    count++;
    console.log("  ✓ Design Principles");
  }

  // Navigation leitmotif (core semantic)
  const navigationLeitmotif = `
    AI sees meaning and language as a geometry that you must navigate through. 
    When you prompt, you don't open a register or access a database—you're navigating 
    multi-dimensional space with topology, clustering, and vectors. Navigation is what 
    users must learn to do with AI. Navigation is what Thoughtform teaches. Navigation 
    is the literal operation happening inside the models. The brand leitmotif and the 
    underlying technology are the same thing.
  `;
  await storeEmbedding({
    category: "philosophy",
    source_id: "philosophy-navigation-core",
    source_path: null,
    title: "Navigation Leitmotif",
    content: navigationLeitmotif,
    platforms: ["shared"],
    metadata: { type: "semantic-core", priority: "highest" },
  });
  count++;
  console.log("  ✓ Navigation Leitmotif (semantic core)");

  // Generative patterns
  const generative = readTextFile("philosophy/GENERATIVE-PATTERNS.md");
  if (generative) {
    await storeEmbedding({
      category: "philosophy",
      source_id: "philosophy-generative",
      source_path: "philosophy/GENERATIVE-PATTERNS.md",
      title: "Generative Patterns",
      content: generative,
      platforms: ["shared"],
      metadata: { type: "pattern-philosophy" },
    });
    count++;
    console.log("  ✓ Generative Patterns");
  }

  return count;
}

async function embedPlatformIdentities(): Promise<number> {
  console.log("\n🎨 Embedding platform identities...");
  let count = 0;

  const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];

  for (const platform of platforms) {
    const data = readJsonFile(`tokens/platforms/${platform}.json`) as Record<string, unknown> | null;
    if (!data) continue;

    const character = data.character as { short?: string; extended?: string } | undefined;
    if (!character) continue;

    const content = `
      ${data.name}: ${data.description}
      
      Character: ${character.short}
      
      ${character.extended}
      
      ${(data as { resonatesWith?: { strong?: string[] } }).resonatesWith?.strong?.join(", ") || ""}
    `;

    await storeEmbedding({
      category: "platform_identity",
      source_id: `platform-${platform}`,
      source_path: `tokens/platforms/${platform}.json`,
      title: `${data.name} Platform Identity`,
      content: content.trim(),
      platforms: [platform],
      metadata: {
        mode: (data as { mode?: string }).mode,
        accent: (data.colors as { accent?: string })?.accent,
      },
    });
    count++;
    console.log(`  ✓ ${data.name}`);
  }

  return count;
}

async function embedAnchors(): Promise<number> {
  console.log("\n⚓ Embedding semantic anchors...");
  let count = 0;

  const anchorsData = readJsonFile("tokens/anchors/definitions.json") as { anchors?: Record<string, unknown> } | null;
  if (!anchorsData?.anchors) {
    console.warn("  ⚠ No anchor definitions found");
    return 0;
  }

  for (const [anchorName, anchor] of Object.entries(anchorsData.anchors)) {
    const anchorObj = anchor as {
      meaning?: string;
      resonatesWith?: string[];
      expressions?: string[];
      note?: string;
    };

    const content = `
      ${anchorName}: ${anchorObj.meaning}
      
      Resonates with: ${anchorObj.resonatesWith?.join(", ") || ""}
      
      Expressions: ${anchorObj.expressions?.join(", ") || ""}
      
      ${anchorObj.note || ""}
    `;

    await storeEmbedding({
      category: "anchor",
      source_id: anchorName,
      source_path: "tokens/anchors/definitions.json",
      title: `${anchorName} Anchor`,
      content: content.trim(),
      platforms: ["shared"],
      metadata: {
        colorAffinity: (anchor as { colorAffinity?: string }).colorAffinity,
        tensions: (anchor as { tensions?: unknown }).tensions,
      },
    });
    count++;
    console.log(`  ✓ ${anchorName}`);
  }

  return count;
}

async function embedPatterns(): Promise<number> {
  console.log("\n🔧 Embedding translation patterns...");
  let count = 0;

  const translationTable = readJsonFile("semantic/translations/translation-table.json") as {
    anchors?: Record<string, { translations?: string[]; physicalPatterns?: Record<string, unknown> }>;
  } | null;

  if (!translationTable?.anchors) {
    console.warn("  ⚠ No translation table found");
    return 0;
  }

  for (const [anchorName, anchorData] of Object.entries(translationTable.anchors)) {
    const patterns = anchorData.physicalPatterns || {};

    for (const [patternName, pattern] of Object.entries(patterns)) {
      const patternObj = pattern as {
        component?: string;
        elements?: string[];
        signalQuotient?: number[];
        dialects?: string[];
      };

      const content = `
        ${patternName} (${anchorName} anchor)
        
        Component: ${patternObj.component || "N/A"}
        Elements: ${patternObj.elements?.join(", ") || "N/A"}
        Signal Quotient: ${patternObj.signalQuotient?.join("-") || "N/A"}
        Dialects: ${patternObj.dialects?.join(", ") || "shared"}
      `;

      await storeEmbedding({
        category: "pattern",
        source_id: `pattern-${anchorName.toLowerCase()}-${patternName.toLowerCase().replace(/\s+/g, "-")}`,
        source_path: "semantic/translations/translation-table.json",
        title: `${patternName} Pattern`,
        content: content.trim(),
        platforms: patternObj.dialects || ["shared"],
        metadata: {
          anchor: anchorName,
          component: patternObj.component,
          signalQuotient: patternObj.signalQuotient,
        },
      });
      count++;
    }
    console.log(`  ✓ ${anchorName} patterns (${Object.keys(patterns).length})`);
  }

  return count;
}

async function embedReferences(): Promise<number> {
  console.log("\n🖼️ Embedding reference entries...");
  let count = 0;

  const referencesDir = path.join(ROOT_DIR, "references/entries");
  
  if (!fs.existsSync(referencesDir)) {
    console.warn("  ⚠ No references directory found");
    return 0;
  }

  const files = fs.readdirSync(referencesDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(referencesDir, file), "utf-8");
    const sourceId = `reference-${file.replace(".md", "")}`;
    const title = file.replace(".md", "").replace(/-/g, " ");

    await storeEmbedding({
      category: "reference",
      source_id: sourceId,
      source_path: `references/entries/${file}`,
      title: title,
      content: content,
      platforms: ["shared"], // Could parse from frontmatter
      metadata: {
        filename: file,
      },
    });
    count++;
    console.log(`  ✓ ${title}`);
  }

  return count;
}

async function embedFingerprints(): Promise<number> {
  console.log("\n🔒 Embedding platform fingerprints...");
  let count = 0;

  const fingerprintsDir = path.join(ROOT_DIR, "semantic/fingerprints");
  
  if (!fs.existsSync(fingerprintsDir)) {
    console.warn("  ⚠ No fingerprints directory found");
    return 0;
  }

  const files = fs.readdirSync(fingerprintsDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(fingerprintsDir, file), "utf-8")
    ) as {
      platform: string;
      version?: string;
      identity: { short: string; extended: string };
      anchor_weights: Record<string, number>;
      keywords?: string[];
    };

    await storeFingerprint({
      platform: data.platform,
      version: data.version || "1.0.0",
      identity_short: data.identity.short,
      identity_extended: data.identity.extended,
      anchor_weights: data.anchor_weights,
      keywords: data.keywords || [],
      fingerprint_data: data,
    });
    count++;
    console.log(`  ✓ ${data.platform} fingerprint`);
  }

  return count;
}

async function embedComponents(): Promise<number> {
  console.log("\n🧩 Embedding component descriptions...");
  let count = 0;

  const registry = readJsonFile("registry/assets.json") as {
    assets?: Array<{
      id: string;
      name: string;
      description?: string;
      anchors?: { primary?: string[]; secondary?: string[] };
      translations?: string[];
      dialects?: string[];
    }>;
  } | null;

  if (!registry?.assets) {
    console.warn("  ⚠ No asset registry found");
    return 0;
  }

  for (const asset of registry.assets) {
    if (asset.type === "token") continue; // Skip token entries

    const content = `
      ${asset.name}: ${asset.description || ""}
      
      Primary Anchors: ${asset.anchors?.primary?.join(", ") || "N/A"}
      Secondary Anchors: ${asset.anchors?.secondary?.join(", ") || "N/A"}
      Translations: ${asset.translations?.join(", ") || "N/A"}
    `;

    await storeEmbedding({
      category: "component",
      source_id: `component-${asset.id}`,
      source_path: `registry/assets.json#${asset.id}`,
      title: asset.name,
      content: content.trim(),
      platforms: asset.dialects || ["shared"],
      metadata: {
        anchors: asset.anchors,
        translations: asset.translations,
      },
    });
    count++;
  }

  console.log(`  ✓ ${count} components embedded`);
  return count;
}

// Main execution
async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Thoughtform Semantic Design System          ║");
  console.log("║  Corpus Embedding Pipeline                   ║");
  console.log("╚══════════════════════════════════════════════╝");

  const counts = {
    philosophy: 0,
    platformIdentities: 0,
    anchors: 0,
    patterns: 0,
    references: 0,
    fingerprints: 0,
    components: 0,
  };

  try {
    counts.philosophy = await embedPhilosophy();
    counts.platformIdentities = await embedPlatformIdentities();
    counts.anchors = await embedAnchors();
    counts.patterns = await embedPatterns();
    counts.references = await embedReferences();
    counts.fingerprints = await embedFingerprints();
    counts.components = await embedComponents();

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    console.log("\n══════════════════════════════════════════════");
    console.log("✅ Embedding complete!");
    console.log(`   Total embeddings: ${total}`);
    console.log("   Breakdown:");
    console.log(`     - Philosophy: ${counts.philosophy}`);
    console.log(`     - Platform Identities: ${counts.platformIdentities}`);
    console.log(`     - Anchors: ${counts.anchors}`);
    console.log(`     - Patterns: ${counts.patterns}`);
    console.log(`     - References: ${counts.references}`);
    console.log(`     - Fingerprints: ${counts.fingerprints}`);
    console.log(`     - Components: ${counts.components}`);
    console.log("══════════════════════════════════════════════");
  } catch (error) {
    console.error("\n❌ Embedding failed:", error);
    process.exit(1);
  }
}

main();



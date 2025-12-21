#!/usr/bin/env npx tsx
/**
 * Thoughtform Semantic Design System - Local Corpus Embedding Script
 * 
 * Uses Voyage AI for embeddings and stores in local JSON files.
 * No external database required.
 * 
 * Usage:
 *   npx tsx scripts/embed-corpus-local.ts
 * 
 * Environment variables required:
 *   VOYAGE_API_KEY
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const EMBEDDINGS_DIR = path.join(ROOT_DIR, "semantic/embeddings");

// Configuration
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;

if (!VOYAGE_API_KEY) {
  console.error("❌ Missing VOYAGE_API_KEY environment variable");
  console.error("   Create .env.local with: VOYAGE_API_KEY=your-key");
  process.exit(1);
}

// Types
interface EmbeddingRecord {
  id: string;
  category: string;
  source_id: string;
  source_path?: string;
  title: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
  platforms?: string[];
  created_at: string;
}

interface EmbeddingsIndex {
  version: string;
  model: string;
  dimensions: number;
  count: number;
  updated_at: string;
  records: EmbeddingRecord[];
}

// Embeddings index
let index: EmbeddingsIndex = {
  version: "1.0.0",
  model: "voyage-3-lite",
  dimensions: 512,
  count: 0,
  updated_at: new Date().toISOString(),
  records: [],
};

// Helper functions
function readJsonFile(relativePath: string): unknown | null {
  try {
    const fullPath = path.join(ROOT_DIR, relativePath);
    return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  } catch {
    return null;
  }
}

function readTextFile(relativePath: string): string | null {
  try {
    const fullPath = path.join(ROOT_DIR, relativePath);
    return fs.readFileSync(fullPath, "utf-8");
  } catch {
    return null;
  }
}

// Voyage API with batching
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // Voyage supports batching up to 128 texts
  const batchSize = 32;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VOYAGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "voyage-3-lite",
        input: batch,
        input_type: "document",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Voyage API error: ${error}`);
    }

    const data = await response.json();
    const embeddings = data.data.map((d: { embedding: number[] }) => d.embedding);
    allEmbeddings.push(...embeddings);

    // Rate limiting - small delay between batches
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return allEmbeddings;
}

async function addRecord(
  category: string,
  sourceId: string,
  title: string,
  content: string,
  options: {
    sourcePath?: string;
    metadata?: Record<string, unknown>;
    platforms?: string[];
  } = {}
): Promise<void> {
  const id = `${category}-${sourceId}`;
  
  // Check if already exists
  const existing = index.records.findIndex(r => r.id === id);
  if (existing >= 0) {
    index.records.splice(existing, 1);
  }

  index.records.push({
    id,
    category,
    source_id: sourceId,
    source_path: options.sourcePath,
    title,
    content: content.trim(),
    embedding: [], // Will be filled in batch
    metadata: options.metadata || {},
    platforms: options.platforms || ["shared"],
    created_at: new Date().toISOString(),
  });
}

// Embedding functions
async function embedPhilosophy(): Promise<number> {
  console.log("\n📚 Collecting philosophy documents...");
  let count = 0;

  // Core navigation leitmotif
  const navigationLeitmotif = `
    AI sees meaning and language as a geometry that you must navigate through. 
    When you prompt, you don't open a register or access a database—you're navigating 
    multi-dimensional space with topology, clustering, and vectors. Navigation is what 
    users must learn to do with AI. Navigation is what Thoughtform teaches. Navigation 
    is the literal operation happening inside the models. The brand leitmotif and the 
    underlying technology are the same thing.
  `;
  await addRecord("philosophy", "navigation-core", "Navigation Leitmotif", navigationLeitmotif, {
    metadata: { type: "semantic-core", priority: "highest" },
  });
  count++;
  console.log("  ✓ Navigation Leitmotif");

  // Design principles
  const principles = readTextFile("philosophy/PRINCIPLES.md");
  if (principles) {
    await addRecord("philosophy", "principles", "Design Principles", principles, {
      sourcePath: "philosophy/PRINCIPLES.md",
    });
    count++;
    console.log("  ✓ Design Principles");
  }

  // Generative patterns
  const generative = readTextFile("philosophy/GENERATIVE-PATTERNS.md");
  if (generative) {
    await addRecord("philosophy", "generative", "Generative Patterns", generative, {
      sourcePath: "philosophy/GENERATIVE-PATTERNS.md",
    });
    count++;
    console.log("  ✓ Generative Patterns");
  }

  return count;
}

async function embedFingerprints(): Promise<number> {
  console.log("\n🔒 Collecting platform fingerprints...");
  let count = 0;

  const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];

  for (const platform of platforms) {
    const fp = readJsonFile(`semantic/fingerprints/${platform}.json`) as Record<string, unknown> | null;
    if (!fp) continue;

    const embeddingText = (fp.embedding_text as string) || 
      `${(fp.identity as { short?: string; extended?: string })?.short} ${(fp.identity as { short?: string; extended?: string })?.extended}`;

    await addRecord("fingerprint", platform, `${platform} Platform Fingerprint`, embeddingText, {
      sourcePath: `semantic/fingerprints/${platform}.json`,
      platforms: [platform],
      metadata: {
        anchor_weights: fp.anchor_weights,
        keywords: fp.keywords,
      },
    });
    count++;
    console.log(`  ✓ ${platform}`);
  }

  return count;
}

async function embedAnchors(): Promise<number> {
  console.log("\n⚓ Collecting semantic anchors...");
  let count = 0;

  const anchorsData = readJsonFile("tokens/anchors/definitions.json") as { anchors?: Record<string, unknown> } | null;
  if (!anchorsData?.anchors) {
    console.warn("  ⚠ No anchor definitions found");
    return 0;
  }

  for (const [anchorName, anchor] of Object.entries(anchorsData.anchors)) {
    const a = anchor as {
      meaning?: string;
      resonatesWith?: string[];
      expressions?: string[];
      note?: string;
    };

    const content = `
      ${anchorName}: ${a.meaning}
      Resonates with: ${a.resonatesWith?.join(", ") || ""}
      Expressions: ${a.expressions?.join(", ") || ""}
      ${a.note || ""}
    `;

    await addRecord("anchor", anchorName, `${anchorName} Anchor`, content, {
      sourcePath: "tokens/anchors/definitions.json",
      metadata: { colorAffinity: (anchor as { colorAffinity?: string }).colorAffinity },
    });
    count++;
    console.log(`  ✓ ${anchorName}`);
  }

  return count;
}

async function embedPlatformIdentities(): Promise<number> {
  console.log("\n🎨 Collecting platform identities...");
  let count = 0;

  const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];

  for (const platform of platforms) {
    const data = readJsonFile(`tokens/platforms/${platform}.json`) as Record<string, unknown> | null;
    if (!data) continue;

    const char = data.character as { short?: string; extended?: string; mood?: string } | undefined;
    if (!char) continue;

    const content = `
      ${data.name}: ${data.description}
      Character: ${char.short}
      ${char.extended}
      Mood: ${char.mood || ""}
      References: ${(data.resonatesWith as { strong?: string[] })?.strong?.join(", ") || ""}
    `;

    await addRecord("platform_identity", platform, `${data.name} Identity`, content, {
      sourcePath: `tokens/platforms/${platform}.json`,
      platforms: [platform],
      metadata: { mode: (data as { mode?: string }).mode },
    });
    count++;
    console.log(`  ✓ ${data.name}`);
  }

  return count;
}

async function embedPatterns(): Promise<number> {
  console.log("\n🔧 Collecting translation patterns...");
  let count = 0;

  const table = readJsonFile("semantic/translations/translation-table.json") as {
    anchors?: Record<string, { translations?: string[]; physicalPatterns?: Record<string, unknown> }>;
  } | null;

  if (!table?.anchors) {
    console.warn("  ⚠ No translation table found");
    return 0;
  }

  for (const [anchorName, anchorData] of Object.entries(table.anchors)) {
    const patterns = anchorData.physicalPatterns || {};

    for (const [patternName, pattern] of Object.entries(patterns)) {
      const p = pattern as {
        component?: string;
        elements?: string[];
        signalQuotient?: number[];
        dialects?: string[];
      };

      const content = `
        ${patternName} pattern for ${anchorName} anchor.
        Component: ${p.component || "N/A"}
        Elements: ${p.elements?.join(", ") || "N/A"}
        Dialects: ${p.dialects?.join(", ") || "shared"}
      `;

      await addRecord(
        "pattern",
        `${anchorName.toLowerCase()}-${patternName.toLowerCase().replace(/\s+/g, "-")}`,
        `${patternName} Pattern`,
        content,
        {
          sourcePath: "semantic/translations/translation-table.json",
          platforms: p.dialects || ["shared"],
          metadata: { anchor: anchorName, component: p.component },
        }
      );
      count++;
    }
    console.log(`  ✓ ${anchorName} patterns (${Object.keys(patterns).length})`);
  }

  return count;
}

async function embedReferences(): Promise<number> {
  console.log("\n🖼️ Collecting reference entries...");
  let count = 0;

  const referencesDir = path.join(ROOT_DIR, "references/entries");
  
  if (!fs.existsSync(referencesDir)) {
    console.warn("  ⚠ No references directory found");
    return 0;
  }

  const files = fs.readdirSync(referencesDir).filter(f => f.endsWith(".md"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(referencesDir, file), "utf-8");
    const sourceId = file.replace(".md", "");
    const title = sourceId.replace(/-/g, " ");

    await addRecord("reference", sourceId, title, content, {
      sourcePath: `references/entries/${file}`,
    });
    count++;
    console.log(`  ✓ ${title}`);
  }

  return count;
}

// Main execution
async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Thoughtform Semantic Design System          ║");
  console.log("║  Local Corpus Embedding (Voyage AI)          ║");
  console.log("╚══════════════════════════════════════════════╝");

  const counts = {
    philosophy: 0,
    fingerprints: 0,
    anchors: 0,
    platformIdentities: 0,
    patterns: 0,
    references: 0,
  };

  try {
    // Collect all content
    counts.philosophy = await embedPhilosophy();
    counts.fingerprints = await embedFingerprints();
    counts.anchors = await embedAnchors();
    counts.platformIdentities = await embedPlatformIdentities();
    counts.patterns = await embedPatterns();
    counts.references = await embedReferences();

    console.log("\n⏳ Generating embeddings with Voyage AI...");
    console.log(`   Processing ${index.records.length} documents...`);

    // Batch generate all embeddings
    const texts = index.records.map(r => r.content);
    const embeddings = await generateEmbeddings(texts);

    // Assign embeddings to records
    for (let i = 0; i < index.records.length; i++) {
      index.records[i].embedding = embeddings[i];
    }

    // Save to disk
    console.log("\n💾 Saving embeddings to disk...");
    
    if (!fs.existsSync(EMBEDDINGS_DIR)) {
      fs.mkdirSync(EMBEDDINGS_DIR, { recursive: true });
    }

    index.count = index.records.length;
    index.updated_at = new Date().toISOString();
    index.dimensions = embeddings[0]?.length || 512;

    const indexPath = path.join(EMBEDDINGS_DIR, "index.json");
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    console.log("\n══════════════════════════════════════════════");
    console.log("✅ Embedding complete!");
    console.log(`   Total embeddings: ${total}`);
    console.log(`   Dimensions: ${index.dimensions}`);
    console.log(`   Model: ${index.model}`);
    console.log("   Breakdown:");
    console.log(`     - Philosophy: ${counts.philosophy}`);
    console.log(`     - Fingerprints: ${counts.fingerprints}`);
    console.log(`     - Anchors: ${counts.anchors}`);
    console.log(`     - Platform Identities: ${counts.platformIdentities}`);
    console.log(`     - Patterns: ${counts.patterns}`);
    console.log(`     - References: ${counts.references}`);
    console.log(`\n   Saved to: ${indexPath}`);
    console.log("══════════════════════════════════════════════");
  } catch (error) {
    console.error("\n❌ Embedding failed:", error);
    process.exit(1);
  }
}

main();


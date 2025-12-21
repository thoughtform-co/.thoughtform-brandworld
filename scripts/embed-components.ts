#!/usr/bin/env npx tsx
/**
 * Thoughtform Semantic Design Navigation - Component Embedding Script
 * 
 * Generates Voyage AI embeddings for all extracted components.
 * This enables semantic search, matching, and design space navigation.
 * 
 * Usage:
 *   npx tsx scripts/embed-components.ts
 * 
 * Prerequisites:
 *   - Run extract-components.ts first
 *   - VOYAGE_API_KEY environment variable
 * 
 * Output:
 *   - semantic/components/embeddings.json
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

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;

if (!VOYAGE_API_KEY) {
  console.error("❌ Missing VOYAGE_API_KEY environment variable");
  console.error("   Create .env with: VOYAGE_API_KEY=your-key");
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ComponentMetadata {
  id: string;
  name: string;
  path: string;
  repo: string;
  platform: string;
  description: string;
  visualCharacteristics: string;
  implementation: string;
  imports: string[];
  usesTokens: string[];
  usesPatterns: string[];
  relatedComponents: string[];
  semanticPosition: {
    terminal_organic: number;
    minimal_dense: number;
    cool_warm: number;
    static_animated: number;
  };
  embeddingText: string;
  fileType: string;
  lineCount: number;
  lastModified: string;
}

interface ComponentIndex {
  version: string;
  extracted_at: string;
  count: number;
  components: ComponentMetadata[];
}

interface ComponentEmbedding {
  id: string;
  name: string;
  repo: string;
  platform: string;
  
  // Semantic content (for reference)
  embeddingText: string;
  
  // Relationships
  usesTokens: string[];
  usesPatterns: string[];
  relatedComponents: string[];
  
  // Semantic position
  semanticPosition: {
    terminal_organic: number;
    minimal_dense: number;
    cool_warm: number;
    static_animated: number;
  };
  
  // The actual embedding vector
  embedding: number[];
}

interface EmbeddingsIndex {
  version: string;
  model: string;
  dimensions: number;
  count: number;
  embedded_at: string;
  embeddings: ComponentEmbedding[];
}

// ═══════════════════════════════════════════════════════════════════════════
// VOYAGE API
// ═══════════════════════════════════════════════════════════════════════════

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const batchSize = 32; // Voyage supports up to 128
  const allEmbeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    process.stdout.write(`\r   Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}...`);
    
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
    
    // Rate limiting
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(" Done!");
  return allEmbeddings;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  Thoughtform Semantic Design Navigation                      ║");
  console.log("║  Component Embedding Script (Voyage AI)                      ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  
  // Load component index
  const indexPath = path.join(ROOT_DIR, "semantic/components/index.json");
  
  if (!fs.existsSync(indexPath)) {
    console.error("\n❌ Component index not found.");
    console.error("   Run 'npx tsx scripts/extract-components.ts' first.");
    process.exit(1);
  }
  
  console.log("\n📂 Loading component index...");
  const componentIndex: ComponentIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  console.log(`   ✓ Loaded ${componentIndex.count} components`);
  
  // Generate embeddings
  console.log("\n⏳ Generating embeddings with Voyage AI...");
  const texts = componentIndex.components.map(c => c.embeddingText);
  const embeddings = await generateEmbeddings(texts);
  
  // Build embeddings index
  console.log("\n📊 Building embeddings index...");
  const componentEmbeddings: ComponentEmbedding[] = componentIndex.components.map((comp, i) => ({
    id: comp.id,
    name: comp.name,
    repo: comp.repo,
    platform: comp.platform,
    embeddingText: comp.embeddingText,
    usesTokens: comp.usesTokens,
    usesPatterns: comp.usesPatterns,
    relatedComponents: comp.relatedComponents,
    semanticPosition: comp.semanticPosition,
    embedding: embeddings[i],
  }));
  
  const embeddingsIndex: EmbeddingsIndex = {
    version: "2.0.0",
    model: "voyage-3-lite",
    dimensions: embeddings[0]?.length || 512,
    count: componentEmbeddings.length,
    embedded_at: new Date().toISOString(),
    embeddings: componentEmbeddings,
  };
  
  // Save embeddings
  console.log("\n💾 Saving embeddings...");
  const outputPath = path.join(ROOT_DIR, "semantic/components/embeddings.json");
  fs.writeFileSync(outputPath, JSON.stringify(embeddingsIndex, null, 2));
  console.log(`   ✓ ${outputPath}`);
  
  // Also update the main embeddings index with component records
  console.log("\n📝 Updating main embeddings index...");
  const mainIndexPath = path.join(ROOT_DIR, "semantic/embeddings/index.json");
  let mainIndex: {
    version: string;
    model: string;
    dimensions: number;
    count: number;
    updated_at: string;
    records: Array<{
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
    }>;
  };
  
  if (fs.existsSync(mainIndexPath)) {
    mainIndex = JSON.parse(fs.readFileSync(mainIndexPath, "utf-8"));
    // Remove existing component records
    mainIndex.records = mainIndex.records.filter(r => r.category !== "component");
  } else {
    mainIndex = {
      version: "2.0.0",
      model: "voyage-3-lite",
      dimensions: embeddings[0]?.length || 512,
      count: 0,
      updated_at: new Date().toISOString(),
      records: [],
    };
  }
  
  // Add component records
  for (const ce of componentEmbeddings) {
    mainIndex.records.push({
      id: `component-${ce.id}`,
      category: "component",
      source_id: ce.id,
      source_path: componentIndex.components.find(c => c.id === ce.id)?.path,
      title: ce.name,
      content: ce.embeddingText,
      embedding: ce.embedding,
      metadata: {
        repo: ce.repo,
        platform: ce.platform,
        usesTokens: ce.usesTokens,
        usesPatterns: ce.usesPatterns,
        semanticPosition: ce.semanticPosition,
      },
      platforms: [ce.platform],
      created_at: new Date().toISOString(),
    });
  }
  
  mainIndex.count = mainIndex.records.length;
  mainIndex.updated_at = new Date().toISOString();
  
  // Ensure directory exists
  const mainIndexDir = path.dirname(mainIndexPath);
  if (!fs.existsSync(mainIndexDir)) {
    fs.mkdirSync(mainIndexDir, { recursive: true });
  }
  
  fs.writeFileSync(mainIndexPath, JSON.stringify(mainIndex, null, 2));
  console.log(`   ✓ ${mainIndexPath} (${mainIndex.count} total records)`);
  
  // Summary
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("✅ Embedding complete!");
  console.log(`   Components embedded: ${componentEmbeddings.length}`);
  console.log(`   Embedding dimensions: ${embeddingsIndex.dimensions}`);
  console.log(`   Model: ${embeddingsIndex.model}`);
  
  // By platform
  const byPlatform: Record<string, number> = {};
  for (const ce of componentEmbeddings) {
    byPlatform[ce.platform] = (byPlatform[ce.platform] || 0) + 1;
  }
  console.log("\n   By platform:");
  for (const [platform, count] of Object.entries(byPlatform).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${platform}: ${count}`);
  }
  
  console.log("\n══════════════════════════════════════════════════════════════");
}

main().catch(console.error);


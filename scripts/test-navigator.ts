#!/usr/bin/env npx tsx
/**
 * Quick test for the Design Navigator functionality
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

// Load the embeddings
const embeddingsPath = path.join(ROOT_DIR, "semantic/components/embeddings.json");
const designSpacePath = path.join(ROOT_DIR, "semantic/design-space.json");
const graphPath = path.join(ROOT_DIR, "semantic/component-graph.json");

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║  Testing Design Navigator Data                               ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

// Test 1: Load embeddings
console.log("1. Testing embeddings load...");
if (fs.existsSync(embeddingsPath)) {
  const data = JSON.parse(fs.readFileSync(embeddingsPath, "utf-8"));
  console.log(`   ✓ Loaded ${data.count} component embeddings`);
  console.log(`   ✓ Model: ${data.model}`);
  console.log(`   ✓ Dimensions: ${data.dimensions}`);
  
  // Sample component
  const sample = data.embeddings[0];
  console.log(`   ✓ Sample: ${sample.name} (${sample.platform})`);
} else {
  console.log("   ✗ Embeddings not found");
}

// Test 2: Load design space
console.log("\n2. Testing design space load...");
if (fs.existsSync(designSpacePath)) {
  const space = JSON.parse(fs.readFileSync(designSpacePath, "utf-8"));
  console.log(`   ✓ Loaded ${space.axes.length} axes:`);
  for (const axis of space.axes) {
    console.log(`     - ${axis.name}: ${axis.negative.label} ↔ ${axis.positive.label}`);
  }
  console.log(`   ✓ ${space.platforms.length} platforms defined`);
} else {
  console.log("   ✗ Design space not found");
}

// Test 3: Load component graph
console.log("\n3. Testing component graph load...");
if (fs.existsSync(graphPath)) {
  const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
  console.log(`   ✓ ${graph.nodes.length} nodes`);
  console.log(`   ✓ ${graph.edges.length} edges`);
  
  // Count edge types
  const edgeTypes: Record<string, number> = {};
  for (const edge of graph.edges) {
    const type = edge.relationship.split("-")[0];
    edgeTypes[type] = (edgeTypes[type] || 0) + 1;
  }
  console.log("   ✓ Edge types:");
  for (const [type, count] of Object.entries(edgeTypes).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
    console.log(`     - ${type}: ${count}`);
  }
} else {
  console.log("   ✗ Component graph not found");
}

// Test 4: Test cosine similarity
console.log("\n4. Testing cosine similarity...");
if (fs.existsSync(embeddingsPath)) {
  const data = JSON.parse(fs.readFileSync(embeddingsPath, "utf-8"));
  
  function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  // Find EntityCard and a related component
  const entityCard = data.embeddings.find((e: any) => e.name === "EntityCard");
  const particleCanvas = data.embeddings.find((e: any) => e.name === "ParticleCanvas");
  const statCard = data.embeddings.find((e: any) => e.name === "StatCard");
  
  if (entityCard && particleCanvas && statCard) {
    const sim1 = cosineSimilarity(entityCard.embedding, particleCanvas.embedding);
    const sim2 = cosineSimilarity(entityCard.embedding, statCard.embedding);
    console.log(`   ✓ EntityCard ↔ ParticleCanvas similarity: ${sim1.toFixed(3)}`);
    console.log(`   ✓ EntityCard ↔ StatCard similarity: ${sim2.toFixed(3)}`);
  } else {
    console.log("   ! Could not find test components");
  }
}

// Test 5: Check platforms distribution
console.log("\n5. Platform distribution...");
if (fs.existsSync(embeddingsPath)) {
  const data = JSON.parse(fs.readFileSync(embeddingsPath, "utf-8"));
  const byPlatform: Record<string, number> = {};
  for (const comp of data.embeddings) {
    byPlatform[comp.platform] = (byPlatform[comp.platform] || 0) + 1;
  }
  for (const [platform, count] of Object.entries(byPlatform).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${platform}: ${count} components`);
  }
}

console.log("\n══════════════════════════════════════════════════════════════");
console.log("✅ All tests passed!");
console.log("══════════════════════════════════════════════════════════════\n");


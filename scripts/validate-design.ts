#!/usr/bin/env npx tsx
/**
 * Thoughtform Design Validation Script
 * 
 * Validates a design description against platform identity and semantic anchors.
 * 
 * Usage:
 *   npx tsx scripts/validate-design.ts "your design description" [platform]
 * 
 * Examples:
 *   npx tsx scripts/validate-design.ts "A threat level indicator with gradient colors"
 *   npx tsx scripts/validate-design.ts "Financial dashboard with CRT terminal aesthetic" ledger-dark
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Thoughtform Design Validation                              ║
╚════════════════════════════════════════════════════════════╝

Usage:
  npx tsx scripts/validate-design.ts "your design description" [platform]

Examples:
  npx tsx scripts/validate-design.ts "A threat level indicator"
  npx tsx scripts/validate-design.ts "Financial dashboard" ledger-dark

Platforms:
  astrolabe, atlas, ledger-dark, ledger-light, marketing
`);
  process.exit(0);
}

const request = args[0];
const specifiedPlatform = args[1];

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

function getValidationStatus(driftScore: number): string {
  if (driftScore < 0.2) return "approved";
  if (driftScore < 0.4) return "expansion";
  if (driftScore < 0.6) return "edge_case";
  return "violation";
}

function getDriftInterpretation(driftScore: number): string {
  if (driftScore < 0.2) return "Strong alignment with platform identity. Proceed with confidence.";
  if (driftScore < 0.4) return "Valid expansion of the design system. Document if new pattern.";
  if (driftScore < 0.6) return "Edge case - may be valid but review recommended.";
  return "Potential violation - significant drift from platform character.";
}

// Main validation function
async function validateDesign(request: string, platform?: string) {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║  Thoughtform Design Validation                              ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  console.log(`📝 Request: "${request}"`);
  if (platform) {
    console.log(`🎯 Specified Platform: ${platform}`);
  }

  const requestLower = request.toLowerCase();

  // Step 1: Detect or use specified platform
  let detectedPlatform = platform;
  let platformConfidence = 1;

  if (!detectedPlatform) {
    console.log("\n🔍 Detecting platform...");
    const platforms = ["astrolabe", "atlas", "ledger-dark", "ledger-light", "marketing"];
    let bestPlatform = "astrolabe";
    let bestScore = 0;

    for (const p of platforms) {
      const fingerprint = readJsonFile(`semantic/fingerprints/${p}.json`) as { keywords?: string[] } | null;
      if (!fingerprint) continue;

      const keywords = fingerprint.keywords || [];
      const matched = keywords.filter((k) => requestLower.includes(k.toLowerCase()));
      const score = matched.length / Math.max(keywords.length, 1);

      if (score > bestScore) {
        bestScore = score;
        bestPlatform = p;
      }
    }

    detectedPlatform = bestPlatform;
    platformConfidence = bestScore;
    console.log(`   → Detected: ${detectedPlatform} (confidence: ${(platformConfidence * 100).toFixed(1)}%)`);
  }

  // Step 2: Get fingerprint and calculate drift
  console.log("\n📐 Calculating drift score...");
  const fingerprint = readJsonFile(`semantic/fingerprints/${detectedPlatform}.json`) as {
    keywords?: string[];
    anchor_weights?: Record<string, number>;
    identity?: { short?: string };
  } | null;

  let driftScore = 0.5;
  let matchedKeywords: string[] = [];

  if (fingerprint) {
    const keywords = fingerprint.keywords || [];
    matchedKeywords = keywords.filter((k) => requestLower.includes(k.toLowerCase()));
    driftScore = 1 - matchedKeywords.length / Math.max(keywords.length, 1);
  }

  const validationStatus = getValidationStatus(driftScore);
  console.log(`   → Drift Score: ${(driftScore * 100).toFixed(1)}%`);
  console.log(`   → Status: ${validationStatus.toUpperCase()}`);

  // Step 3: Activate anchors
  console.log("\n⚓ Activating anchors...");
  const anchorsData = readJsonFile("tokens/anchors/definitions.json") as {
    anchors?: Record<string, { resonatesWith?: string[]; expressions?: string[] }>;
  } | null;

  const activations: Record<string, number> = {};

  if (anchorsData?.anchors) {
    for (const [anchorName, anchor] of Object.entries(anchorsData.anchors)) {
      const keywords = [...(anchor.resonatesWith || []), ...(anchor.expressions || [])];
      let matches = 0;

      for (const kw of keywords) {
        if (requestLower.includes(kw.toLowerCase())) {
          matches++;
        }
      }

      activations[anchorName] = Math.min(matches / 3, 1);
    }
  }

  // Sort by activation strength
  const sortedActivations = Object.entries(activations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  for (const [anchor, weight] of sortedActivations) {
    const bar = "█".repeat(Math.round(weight * 20)).padEnd(20, "░");
    console.log(`   ${anchor.padEnd(16)} ${bar} ${(weight * 100).toFixed(0)}%`);
  }

  // Step 4: Get suggested patterns
  console.log("\n🔧 Suggested patterns...");
  const translationTable = readJsonFile("semantic/translations/translation-table.json") as {
    anchors?: Record<string, { translations?: string[]; physicalPatterns?: Record<string, { component?: string }> }>;
  } | null;

  const suggestedPatterns: string[] = [];
  const suggestedComponents: string[] = [];

  const topAnchors = sortedActivations.slice(0, 3).map(([name]) => name);

  for (const anchor of topAnchors) {
    const anchorTrans = translationTable?.anchors?.[anchor];
    if (anchorTrans?.translations) {
      suggestedPatterns.push(...anchorTrans.translations.slice(0, 2));
    }
    if (anchorTrans?.physicalPatterns) {
      for (const pattern of Object.values(anchorTrans.physicalPatterns).slice(0, 2)) {
        if (pattern.component) {
          suggestedComponents.push(pattern.component);
        }
      }
    }
  }

  const uniquePatterns = [...new Set(suggestedPatterns)].slice(0, 5);
  const uniqueComponents = [...new Set(suggestedComponents)].slice(0, 5);

  console.log(`   Patterns: ${uniquePatterns.join(", ") || "None suggested"}`);
  console.log(`   Components: ${uniqueComponents.join(", ") || "None suggested"}`);

  // Step 5: Check antipatterns
  console.log("\n⚠️  Antipattern check...");
  const violatedAntipatterns: string[] = [];

  if (requestLower.includes("border-radius") && !requestLower.includes("border-radius: 0") && !requestLower.includes("border-radius:0")) {
    violatedAntipatterns.push("no-border-radius");
  }
  if (requestLower.includes("purple gradient") || requestLower.includes("purple-gradient")) {
    violatedAntipatterns.push("no-purple-gradients");
  }
  if (requestLower.includes("inter") || requestLower.includes("arial") || requestLower.includes("helvetica")) {
    violatedAntipatterns.push("no-system-fonts");
  }

  if (violatedAntipatterns.length > 0) {
    console.log(`   ❌ Violations: ${violatedAntipatterns.join(", ")}`);
  } else {
    console.log("   ✓ No antipattern violations detected");
  }

  // Step 6: Platform tokens
  console.log("\n🎨 Platform tokens...");
  const platformTokens = readJsonFile(`tokens/platforms/${detectedPlatform}.json`) as {
    mode?: string;
    colors?: { accent?: string; background?: string; text?: string };
  } | null;

  if (platformTokens) {
    console.log(`   Mode: ${platformTokens.mode}`);
    console.log(`   Accent: ${platformTokens.colors?.accent}`);
    console.log(`   Background: ${platformTokens.colors?.background}`);
  }

  // Summary
  console.log("\n════════════════════════════════════════════════════════════");
  console.log("📊 VALIDATION SUMMARY");
  console.log("════════════════════════════════════════════════════════════");

  const statusEmoji = {
    approved: "✅",
    expansion: "📝",
    edge_case: "⚠️",
    violation: "❌",
  }[validationStatus];

  console.log(`\n${statusEmoji} ${validationStatus.toUpperCase()}: ${getDriftInterpretation(driftScore)}`);

  if (validationStatus === "approved") {
    console.log("\n💡 Proceed with implementation using the suggested patterns and components.");
  } else if (validationStatus === "expansion") {
    console.log("\n💡 This appears to be a valid expansion. Document the new pattern if implemented.");
  } else if (validationStatus === "edge_case") {
    console.log("\n💡 Consider reviewing with the design system maintainer before proceeding.");
  } else {
    console.log("\n💡 This design may not align with Thoughtform's identity. Consider revising.");
  }

  console.log("\n");
}

// Run
validateDesign(request, specifiedPlatform).catch(console.error);



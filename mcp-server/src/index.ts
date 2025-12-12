#!/usr/bin/env node
/**
 * Thoughtform Design System MCP Server
 * 
 * Serves design tokens, philosophy, platform specs, and reference components
 * to Claude and Cursor.
 * 
 * Resources:
 * - thoughtform://tokens/colors
 * - thoughtform://tokens/typography
 * - thoughtform://tokens/spacing
 * - thoughtform://tokens/{platform}
 * - thoughtform://philosophy
 * - thoughtform://particles
 * - thoughtform://skill
 * - thoughtform://components/atlas/{component}
 * - thoughtform://components/ledger/{component}
 * - thoughtform://components/astrolabe/{component}
 * - thoughtform://components/shared/{component}
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../..");

// Helper to read JSON files
function readJsonFile(relativePath: string): object | null {
  try {
    const fullPath = path.join(ROOT_DIR, relativePath);
    const content = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Helper to read text files
function readTextFile(relativePath: string): string | null {
  try {
    const fullPath = path.join(ROOT_DIR, relativePath);
    return fs.readFileSync(fullPath, "utf-8");
  } catch {
    return null;
  }
}

// Create server
const server = new Server(
  {
    name: "thoughtform-design",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

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
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  const resourceMap: Record<string, { path: string; type: "json" | "text" }> = {
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
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_design_tokens") {
    const platform = (args as { platform: string }).platform;
    const colors = readJsonFile("tokens/colors.json");
    const typography = readJsonFile("tokens/typography.json");
    const spacing = readJsonFile("tokens/spacing.json");
    const motion = readJsonFile("tokens/motion.json");
    const platformTokens = readJsonFile(`tokens/platforms/${platform}.json`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              platform,
              colors,
              typography,
              spacing,
              motion,
              platformSpecific: platformTokens,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === "get_color_css") {
    const platform = (args as { platform: string }).platform;
    const colors = readJsonFile("tokens/colors.json") as Record<string, any>;
    const platformTokens = readJsonFile(`tokens/platforms/${platform}.json`) as Record<string, any>;

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
    const { platform, includeShared = true } = args as { platform: string; includeShared?: boolean };
    
    const componentFiles: Record<string, string[]> = {
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

    const components: Record<string, string> = {};
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
          text: JSON.stringify(
            {
              platform,
              components,
              summary: `${Object.keys(components).length} components loaded for ${platform}`,
            },
            null,
            2
          ),
        },
      ],
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

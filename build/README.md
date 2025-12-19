# Build Outputs

Generated files from the registry. Do not edit directly — regenerate from source.

---

## Contents

| Folder | Purpose | Source |
|--------|---------|--------|
| `skills/` | Generated Claude/Cursor skill files | `registry/assets.json` + `semantic/` |

---

## Regenerating

```bash
npm run build:skills
```

This reads:
- `registry/assets.json` — all registered assets
- `semantic/anchors/` — anchor definitions
- `semantic/translations/` — translation table
- `semantic/dialects/` — dialect specs

And generates:
- `build/skills/thoughtform-design.skill.md`

---

## Why Generate?

**Registry is source of truth.** This ensures:
- Skill files stay in sync with actual assets
- No manual duplication
- Changes propagate automatically

---

## Deployment

Generated skill files can be:
1. Copied to `.claude/skills/` for Cursor
2. Published to Claude.ai's skill library
3. Served via MCP server

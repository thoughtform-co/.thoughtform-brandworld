# Context7 Documentation Skill

A Claude Agent Skill for fetching up-to-date library documentation via the Context7 API.

## What is Context7?

[Context7](https://context7.com) provides LLM-optimized documentation that stays current with library releases. Instead of relying on potentially outdated training data, Claude can fetch the latest docs on demand.

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition (Claude reads this) |
| `LIBRARIES.md` | Common library IDs across Thoughtform projects |
| `fetch-docs.sh` | Bash helper script (macOS/Linux) |
| `fetch-docs.ps1` | PowerShell helper script (Windows) |

## Quick Start

### Manual Fetch

```bash
# macOS/Linux
curl -s "https://context7.com/api/v1/vercel/next.js/llms.txt?tokens=5000"

# Windows PowerShell
(Invoke-WebRequest "https://context7.com/api/v1/vercel/next.js/llms.txt?tokens=5000").Content
```

### Using Helper Scripts

```bash
# macOS/Linux
chmod +x fetch-docs.sh
./fetch-docs.sh next.js 5000

# Windows PowerShell
.\fetch-docs.ps1 "next.js" 5000
```

## Adding to Other Repos

1. **Copy the skill folder** to `.claude/skills/context7/` in your repo
2. **Edit LIBRARIES.md** to list only your repo's dependencies
3. **Optionally add .cursorrules** integration for auto-invocation

### Example .cursorrules Addition

```markdown
## Context7 Documentation

When working with libraries or answering questions about APIs, use Context7 to fetch up-to-date documentation instead of relying on training data.

### Auto-Invoke Context7 For:
- Next.js App Router, Server Components, Server Actions
- Supabase authentication, realtime, RLS policies
- [Add your repo's key libraries here]
- Any library where the user asks "how do I..." or "what's the latest way to..."

### Common Library IDs:
- Next.js: `vercel/next.js`
- React: `facebook/react`
- Supabase: `supabase/supabase-js`
- [Add your repo's libraries here]
```

## Token Limits

| Use Case | Tokens | When to Use |
|----------|--------|-------------|
| Quick lookup | 2000-3000 | Simple API questions |
| Standard | 5000 | General implementation |
| Comprehensive | 10000-15000 | Complex features, learning new library |

## Thoughtform Platform Libraries

See `LIBRARIES.md` for the full list. Key ones:

| Platform | Primary Libraries |
|----------|-------------------|
| **thoughtform.co** | Next.js, Supabase, Three.js, R3F, Framer Motion, GSAP |
| **Atlas** | Next.js, Supabase, Tailwind, Zustand, Framer Motion |
| **Ledger** | Next.js, Supabase, Tailwind, Zustand |
| **Astrolabe** | React, Three.js, R3F, Drei |

## Notes

- Free tier: 50 queries/day
- Documentation is scraped from official sources and auto-updated
- Works best when you know the library ID (search first if unsure)
- Focus on practical code examples over theory

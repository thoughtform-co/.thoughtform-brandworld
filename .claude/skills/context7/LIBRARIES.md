# Common Library IDs for Context7

This file contains commonly used library IDs across Thoughtform projects.

## Thoughtform Tech Stack

Libraries used across multiple Thoughtform platforms:

| Library           | Context7 ID                | Used In                         |
| ----------------- | -------------------------- | ------------------------------- |
| Next.js           | `vercel/next.js`           | thoughtform.co, Atlas, Ledger   |
| React             | `facebook/react`           | All platforms                   |
| Supabase JS       | `supabase/supabase-js`     | All platforms                   |
| Tailwind CSS      | `tailwindlabs/tailwindcss` | All platforms                   |
| Three.js          | `mrdoob/three.js`          | thoughtform.co, Astrolabe       |
| React Three Fiber | `pmndrs/react-three-fiber` | thoughtform.co, Astrolabe       |
| Drei              | `pmndrs/drei`              | thoughtform.co, Astrolabe       |
| Framer Motion     | `framer/motion`            | thoughtform.co, Atlas           |
| Zustand           | `pmndrs/zustand`           | thoughtform.co, Atlas, Ledger   |
| GSAP              | `greensock/gsap`           | thoughtform.co                  |
| Vitest            | `vitest-dev/vitest`        | All platforms (testing)         |
| Playwright        | `microsoft/playwright`     | All platforms (E2E testing)     |

---

## Frontend Frameworks

| Library | Context7 ID       |
| ------- | ----------------- |
| Next.js | `vercel/next.js`  |
| React   | `facebook/react`  |
| Vue.js  | `vuejs/vue`       |
| Svelte  | `sveltejs/svelte` |
| Angular | `angular/angular` |
| Astro   | `withastro/astro` |
| Remix   | `remix-run/remix` |

## Styling

| Library           | Context7 ID                           |
| ----------------- | ------------------------------------- |
| Tailwind CSS      | `tailwindlabs/tailwindcss`            |
| Styled Components | `styled-components/styled-components` |
| Emotion           | `emotion-js/emotion`                  |
| Sass              | `sass/sass`                           |

## State Management

| Library        | Context7 ID      |
| -------------- | ---------------- |
| Zustand        | `pmndrs/zustand` |
| Redux          | `reduxjs/redux`  |
| Jotai          | `pmndrs/jotai`   |
| TanStack Query | `tanstack/query` |

## Backend / Database

| Library     | Context7 ID                |
| ----------- | -------------------------- |
| Supabase JS | `supabase/supabase-js`     |
| Prisma      | `prisma/prisma`            |
| Drizzle     | `drizzle-team/drizzle-orm` |

## Animation

| Library       | Context7 ID           |
| ------------- | --------------------- |
| Framer Motion | `framer/motion`       |
| GSAP          | `greensock/gsap`      |
| React Spring  | `pmndrs/react-spring` |

## 3D Graphics

| Library           | Context7 ID                |
| ----------------- | -------------------------- |
| Three.js          | `mrdoob/three.js`          |
| React Three Fiber | `pmndrs/react-three-fiber` |
| Drei              | `pmndrs/drei`              |

## Testing

| Library    | Context7 ID            |
| ---------- | ---------------------- |
| Vitest     | `vitest-dev/vitest`    |
| Playwright | `microsoft/playwright` |
| Cypress    | `cypress-io/cypress`   |
| Jest       | `jestjs/jest`          |

## Node.js & TypeScript

| Library    | Context7 ID                |
| ---------- | -------------------------- |
| TypeScript | `microsoft/typescript`     |
| Node.js    | `nodejs/node`              |
| Zod        | `colinhacks/zod`           |
| Date-fns   | `date-fns/date-fns`        |
| Lodash     | `lodash/lodash`            |

## MCP & AI

| Library          | Context7 ID                |
| ---------------- | -------------------------- |
| OpenAI           | `openai/openai-node`       |
| Anthropic Claude | `anthropics/anthropic-sdk-python` |
| LangChain        | `langchain-ai/langchainjs` |

---

## Quick Commands

### Bash/macOS/Linux

```bash
# By full ID
curl -s "https://context7.com/api/v1/vercel/next.js/llms.txt?tokens=5000"

# Search first
curl -s "https://context7.com/api/v1/search?query=next.js"
```

### PowerShell/Windows

```powershell
# By full ID
(Invoke-WebRequest "https://context7.com/api/v1/vercel/next.js/llms.txt?tokens=5000").Content

# Search first
Invoke-RestMethod "https://context7.com/api/v1/search?query=next.js"
```

---

## Repo-Specific Adaptation

When setting up Context7 for a specific repo, create a simplified version of this file that only includes the libraries that repo actually uses. Example for a Ledger-specific `LIBRARIES.md`:

```markdown
# Ledger Library IDs

| Library      | Context7 ID                |
| ------------ | -------------------------- |
| Next.js      | `vercel/next.js`           |
| React        | `facebook/react`           |
| Supabase JS  | `supabase/supabase-js`     |
| Tailwind CSS | `tailwindlabs/tailwindcss` |
| Zustand      | `pmndrs/zustand`           |
| Vitest       | `vitest-dev/vitest`        |
```

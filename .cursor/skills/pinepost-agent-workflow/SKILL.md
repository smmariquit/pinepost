---
name: pinepost-agent-workflow
description: >-
  Session workflow for Pinepost (Expo Christmas tree messaging). Use before
  coding, committing, or opening PRs in this repository.
---

# Pinepost Agent Workflow

Policy: [AGENTS.md](../../AGENTS.md). Domain Expo skills: [expo-stack](../expo-stack/SKILL.md).

## Session start

```sh
git status --short --branch
npm run typecheck
node scripts/selfcheck.mjs
```

## Coding practices

- Keep diffs small. Reuse `src/catalog.ts`, `src/store.ts`, `src/invite.ts`.
- Messages stay sealed until Christmas unless Settings demo unlock is on. Do not weaken that without an explicit request.
- Prefer `npx expo install` for SDK packages.
- After invite/unlock/store changes: `npm run selfcheck` and `npm run typecheck`.

## Commits

Only when the user asks. Conventional Commits. Base branch: `main`.

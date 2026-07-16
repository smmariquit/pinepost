# Pinepost Agent Guide

Virtual Christmas tree app (Expo). Offline invite codes, sealed messages until Dec 25.

## Doc map

| When | Read |
| --- | --- |
| Session start / commits | [.cursor/skills/pinepost-agent-workflow/SKILL.md](.cursor/skills/pinepost-agent-workflow/SKILL.md) |
| Expo Router, native UI, SDK, EAS | [.cursor/skills/expo-stack/SKILL.md](.cursor/skills/expo-stack/SKILL.md) → `~/.agents/skills/expo-*` / `eas-*` |
| Product overview | [README.md](README.md) |

## How to work

- Smallest correct diff. Match existing theme tokens in `src/theme.ts`.
- Prefer `npx expo install` for Expo packages.
- Persistence: `expo-sqlite` localStorage polyfill via `src/store.ts` (not AsyncStorage). Invite codec: `src/invite.ts`. Unlock math: `src/christmas.ts`.
- Prefer `npx expo install` for Expo packages. Prefer `process.env.EXPO_OS` over `Platform.OS`.
- Lists/ScrollViews: `contentInsetAdjustmentBehavior="automatic"`.
- Verify: `npm run typecheck`, `npm run selfcheck`, `npx expo-doctor` after dependency changes.
- Commit only when asked. Conventional Commits.

## Architecture

- **Router:** `app/` (expo-router)
- **State:** `src/store.ts`
- **Tree UI:** `src/components/TreeCanvas.tsx`
- **Scheme:** `pinepost://`

## Official Expo tooling

- Skills: installed globally (`npx skills add expo/skills -g --all`)
- Claude plugin: `expo@claude-plugins-official`
- MCP: `https://mcp.expo.dev/mcp` (Cursor + Claude user config)

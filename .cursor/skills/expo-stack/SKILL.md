---
name: expo-stack
description: >-
  Load official Expo/EAS agent skills for this Expo React Native app. Use for
  Expo Router, native UI, data fetching, SDK upgrades, EAS Build/Update/Submit,
  dev client, Tailwind/NativeWind, @expo/ui, modules, or store release work.
---

# Expo stack (official skills)

Official Expo Skills are installed globally under `~/.agents/skills/` (and via Claude plugin `expo@claude-plugins-official`). **Read the matching skill before changing Expo/EAS code.**

| Task | Skill path |
| --- | --- |
| Screens, HIG, native feel | `~/.agents/skills/expo-native-ui/SKILL.md` |
| Expo Router / navigation | `~/.agents/skills/expo-router/SKILL.md` |
| Networking, cache, offline | `~/.agents/skills/expo-data-fetching/SKILL.md` |
| SDK upgrade | `~/.agents/skills/expo-upgrade/SKILL.md` |
| Dev client / TestFlight internal | `~/.agents/skills/expo-dev-client/SKILL.md` |
| Store build + submit | `~/.agents/skills/eas-app-stores/SKILL.md` |
| EAS Workflows CI | `~/.agents/skills/eas-workflows/SKILL.md` |
| OTA health | `~/.agents/skills/eas-update-insights/SKILL.md` |
| Cloud simulator (Linux) | `~/.agents/skills/eas-simulator/SKILL.md` |
| `@expo/ui` Compose/SwiftUI | `~/.agents/skills/expo-ui/SKILL.md` |
| Native modules | `~/.agents/skills/expo-module/SKILL.md` |
| NativeWind / Tailwind | `~/.agents/skills/expo-tailwind-setup/SKILL.md` |
| Canonical examples | `~/.agents/skills/expo-examples/SKILL.md` |

Docs: https://docs.expo.dev/skills/

## MCP

Prefer Expo MCP (`https://mcp.expo.dev/mcp`) for live Expo/EAS docs and project ops when available. Auth via Expo account if prompted.

## Rules

1. Prefer `npx expo install <pkg>` over bare `npm install` for Expo SDK packages.
2. Do not invent EAS config; match this repo's `eas.json` / `app.json` / `app.config.*`.
3. Repo-specific OTA / architecture skills still win when they conflict with generic Expo guidance.

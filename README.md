# Pinepost

Virtual Christmas tree for sealed messages. Grow a fir, share an invite code, let friends hang ornaments with notes that stay locked until Christmas Day.

Built with Expo (SDK 57) to compete with Deco My Tree on the core loop: make tree → share → decorate → unlock on Dec 25.

## Why Pinepost

| Deco My Tree | Pinepost |
| --- | --- |
| Account + email signup | Local profile name only |
| Server-backed trees | Offline invite codes (`PINE1…`) that carry a tree snapshot |
| Privacy policy mentions Wi-Fi BSSID / SSID collection | No network identity harvesting; data stays on device |
| Top 100 dashboard | Discover ranked by ornament count, plus seeded featured trees |

## Features

1. **Grow your tree** – name, needle color (5), topper (5).
2. **Share invite** – system share sheet with a portable `PINE1…` code.
3. **Join a tree** – paste a code; hang ornaments with a private message.
4. **Christmas lock** – ornament text sealed until local midnight Dec 25 (demo unlock in Settings for QA).
5. **Discover** – ranked list including offline featured trees.
6. **Snow + SVG fir** – Reanimated snowfall, layered canopy, tappable ornaments.

## Run

```sh
npm install
npm start
```

Then press `a` / `i` / `w` for Android, iOS, or web.

```sh
npm run typecheck
node scripts/selfcheck.mjs
```

## Deep link

Scheme: `pinepost://`

Join path accepted by the paste field: `pinepost://join/PINE1…`

## Stack

- Expo Router
- AsyncStorage persistence
- react-native-svg tree
- React Native Animated snowfall

## Agent setup

Official Expo Skills are required for Expo/EAS work. See [AGENTS.md](AGENTS.md) and [.cursor/skills/expo-stack/SKILL.md](.cursor/skills/expo-stack/SKILL.md).

## License

MIT

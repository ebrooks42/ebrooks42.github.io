# Music Clicker Prototype

A browser-based idle/clicker game where you compose music to earn notes, purchase instruments, and unlock new phrases. Built with React 18, Vite, and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (v22 recommended)
- npm (included with Node.js)

## Install dependencies

```bash
cd courses/csci8266-ux-design/prototypes/music-clicker-prototype
npm install
```

## Run locally

```bash
npm run dev
```

Opens a dev server at `http://localhost:5173` with hot module replacement. The app uses the Web Audio API — your browser will prompt for audio permission on first interaction.

> **Note:** If you are running the dev server from a git worktree (e.g. via Claude Code's `.claude/launch.json`), pass the source directory as a positional argument to Vite so it resolves paths correctly:
> ```bash
> npx vite /path/to/worktree/courses/csci8266-ux-design/prototypes/music-clicker-prototype --port 5174
> ```

## Build for deployment

The app is deployed as a static site to GitHub Pages under the path `/courses/csci8266-ux-design/prototype-music-clicker/`. There is no server-side build step — you must build locally and commit the output before changes appear on the live site.

```bash
npm run build
```

This writes the production bundle to:

```
../../prototype-music-clicker/   # i.e. courses/csci8266-ux-design/prototype-music-clicker/
```

After building, stage and commit the output directory along with any source changes:

```bash
# From the repo root
git add courses/csci8266-ux-design/prototype-music-clicker/
git add courses/csci8266-ux-design/prototypes/music-clicker-prototype/src/
git commit -m "Build: <description of changes>"
git push
```

GitHub Pages serves the committed build directly — no CI build pipeline runs on push.

## Project structure

```
src/
  App.jsx              # Root component, audio sync, driver.js tutorial
  audio/
    audioEngine.js     # Web Audio API singleton (lookahead scheduler)
  components/
    LeftPane.jsx        # Timeline: instrument rows + step sequencer grid
    RightPane.jsx       # Shop: buy instruments, unlock phrases, upgrades
  data/
    gameData.js         # Instrument definitions, phrases, upgrades, step sequencer helpers
  store/
    useGameState.js     # useReducer state, localStorage persistence, game logic
  index.css            # Global styles, Tailwind base
```

## Tailwind / PostCSS notes

The project uses Tailwind CSS v3 with JIT. If running Vite from a directory other than this folder (e.g. a git worktree), PostCSS needs an explicit path to `tailwind.config.js` — this is already handled in `postcss.config.js` via `resolve(__dirname, 'tailwind.config.js')`, and content scanning uses `relative: true` in `tailwind.config.js` so paths resolve relative to the config file rather than the current working directory.

# Faith Talk Roulette

A clean, modern roulette wheel for Faith Talk conversation nights. Spin the wheel, land on a number 1–100, and a themed popup reveals that number's category and question. Every number is removed from the pool once used, so a game never repeats a question.

**100% static** — HTML, CSS, and vanilla JavaScript only. No build step, no dependencies, no backend. Works out of the box on GitHub Pages.

## Files

```
faith-talk-roulette/
├── index.html   Page structure — wheel, controls, and all three modals
├── style.css    All styling: 5 color themes, light/dark mode, wheel, popup, responsive rules
├── script.js    Game logic: the 100 questions, wheel geometry, spin animation, sound, storage
└── README.md    This file
```

## How it works

- The wheel is drawn entirely in JavaScript: 100 SVG segments are calculated from geometry (not hand-placed), each showing only its number.
- Pressing **SPIN** picks a random number from the numbers still available, spins the wheel so that number lands under the pointer, and automatically opens a popup with that number's category and question.
- Once a number is used it's removed from the pool for the rest of the game and greyed out on the wheel.
- Progress (used numbers, remaining numbers, wheel rotation, theme, light/dark mode, and sound preference) is saved to `localStorage`, so refreshing the page keeps your place in the current game.
- After all 100 numbers are used, a completion screen appears with a **RESET GAME** button (confirmation required) that reshuffles and starts a fresh game.
- Spin ticks and the result chime are generated live with the Web Audio API — there are no external audio files to load.

## Editing the questions

All 100 questions live in one place near the top of `script.js`, in the `QUESTIONS` object:

```javascript
const QUESTIONS = {
  1: { category: "PERSONAL FAITH", question: "What quality of Jehovah do you admire most?" },
  2: { category: "PERSONAL FAITH", question: "Why is prayer important?" },
  // ...
  100: { category: "PERSONAL FAITH", question: "What is one thing you can do this week..." }
};
```

Each key (1–100) must stay unique and map to exactly one `{ category, question }` pair. The wheel only ever displays the number — the category and question appear solely inside the popup.

Available categories (and their popup accent colors) are defined in `CATEGORY_ACCENTS`, also in `script.js`.

## Customizing themes

The five color themes (Royal, Forest, Sunset, Purple, Ocean) are defined as CSS custom properties in `style.css` under **Section 2 — Theme tokens**. Each theme sets four base colors (`--t-deep`, `--t-mid`, `--t-accent`, `--t-soft`) that drive the wheel, buttons, popup accents, and highlights automatically. Light/dark mode is a separate layer (**Section 3**) so every theme works in both modes.

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Add these four files to the repository root (or to a `/docs` folder — your choice).
3. Commit and push to GitHub.
4. In the repository, go to **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to "Deploy from a branch," choose your branch (e.g. `main`) and the folder (`/root` or `/docs`).
6. Save. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`.

No build step is required — the files are served as-is.

## Browser support

Built with modern, broadly-supported web features (CSS `color-mix()`, `conic-gradient()`, SVG, the Web Audio API). Works on current versions of Chrome, Edge, Firefox, and Safari on desktop, Android, and iOS.

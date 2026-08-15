[README.md](https://github.com/user-attachments/files/31099645/README.md)
# Faith Talk Roulette

A clean, modern roulette wheel for Faith Talk conversation nights. Spin the wheel, land on a number 1–100, and a themed popup reveals that number's category and question. Every number is removed from the pool once used, so a game never repeats a question.

The 100 questions are personal and reflective ("Faith Talk Personal") rather than textbook-style, and every question is available in **Tagalog (default) and English** via the language switcher in the top bar.

**100% static** — HTML, CSS, and vanilla JavaScript only. No build step, no dependencies, no backend. Works out of the box on GitHub Pages.

## Files

```
faith-talk-roulette/
├── index.html            Page structure — wheel, controls, and all three modals
├── style.css             All styling: 5 color themes, light/dark mode, wheel, popup, responsive rules
├── script.js             Game logic: questions, wheel geometry, spin animation, sound, storage, SW registration
├── manifest.json         Web app manifest — makes the site installable
├── sw.js                 Service worker — caches the app shell for offline use
├── logo.png              Transparent logo (speech bubble + heart), used as the top-bar brand mark via CSS mask
├── favicon-32.png        Browser tab icon
├── favicon-192.png       Standard app icon (Android home screen, manifest)
├── favicon-180.png       Apple touch icon (iOS home screen)
├── favicon-512.png       Larger standard app icon (manifest, splash screens)
├── icon-maskable-512.png Android adaptive icon (extra padding so it survives circular/squircle masking)
└── README.md             This file
```

## How it works

- The wheel is drawn entirely in JavaScript: 100 SVG segments are calculated from geometry (not hand-placed), each showing only its number.
- Pressing **SPIN** picks a random number from the numbers still available, spins the wheel so that number lands under the pointer, and automatically opens a popup with that number's category and question.
- Once a number is used it's removed from the pool for the rest of the game and greyed out on the wheel. It also appears as a chip in the **USED / NAGAMIT NA** history strip — tapping any chip reopens that question in a read-only recap popup (it doesn't affect the pool, the spin button, or trigger the completion screen).
- The question popup has its own small **TL / EN** toggle in the top-left corner, in addition to the one in the main top bar, so you can flip languages without leaving the popup.
- Progress (used numbers, remaining numbers, wheel rotation, theme, light/dark mode, and sound preference) is saved to `localStorage`, so refreshing the page keeps your place in the current game.
- A restart icon in the top bar is always available (not just at completion) and opens the same confirmation dialog as the completion screen's **RESET GAME** button. Confirming reshuffles all 100 questions and restores Tagalog, the royal theme, dark mode, and sound on.
- Spin ticks and the result chime are generated live with the Web Audio API — there are no external audio files to load.

## Editing the questions

All 100 questions live in one place near the top of `script.js`, in the `QUESTIONS` object. Each entry has a category id and a bilingual question:

```javascript
const QUESTIONS = {
  1: { cat: "PERSONAL_FAITH", question: {
        en: "What is something about Jehovah that you personally appreciate the most?",
        tl: "Ano ang isang bagay tungkol kay Jehova na talagang pinahahalagahan mo?"
      } },
  // ...
  100: { cat: "SPIRITUAL_GROWTH", question: { en: "...", tl: "..." } }
};
```

Each key (1–100) must stay unique, and every entry needs both an `en` and a `tl` question. The wheel only ever displays the number — the category and question appear solely inside the popup, in whichever language is currently selected.

Category ids map to their bilingual labels in `CATEGORIES`, and to their popup accent colors in `CATEGORY_ACCENTS` — both also in `script.js`. The ten categories (10 questions each) are: Personal Faith, Prayer, Bible, Gratitude, Challenges, Family, Friendships, Congregation, Ministry, and Spiritual Growth.

## Language

Tagalog is the default language. A "TL / EN" switcher sits in the top bar, and a matching one sits inside the question popup itself; both stay in sync and the choice is saved to `localStorage` and persists across visits. Switching languages only changes the displayed text — it never resets progress, the wheel, the theme, or the used-question history. All static interface text (buttons, labels, modal copy) lives in the `UI_STRINGS` object in `script.js`.

## Install / offline use

The site is a installable PWA (Progressive Web App):

- **Android (Chrome):** visiting the site shows an "Install app" prompt, or use the browser menu → **Add to Home screen / Install app**. It opens full-screen with no browser bar, like a native app.
- **iPhone/iPad (Safari):** tap the Share icon → **Add to Home Screen**. iOS doesn't show an automatic install prompt, but the result is the same — a home-screen icon that opens full-screen.
- **Offline:** a service worker (`sw.js`) caches the app shell (HTML, CSS, JS, icons) the first time it's opened with a connection. After that, it keeps working with no signal — this fits the actual use case (a hall, a home visit, weak wifi) since the game only ever needed `localStorage`, never a live connection.
- **Updates:** when you push new files (new questions, fixes, etc.) and the user has a connection, the service worker fetches the fresh version in the background and serves it on the next load. If they're fully offline, they keep using whatever was last cached until they're back online.
- If you ever change any cached file and want to force everyone's cache to refresh immediately rather than update in the background, bump `CACHE_VERSION` at the top of `sw.js` — that alone invalidates the old cache.

## Customizing themes

The five color themes (Royal, Forest, Sunset, Purple, Ocean) are defined as CSS custom properties in `style.css` under **Section 2 — Theme tokens**. Each theme sets four base colors (`--t-deep`, `--t-mid`, `--t-accent`, `--t-soft`) that drive the wheel, buttons, popup accents, and highlights automatically. Light/dark mode is a separate layer (**Section 3**) so every theme works in both modes.

## Logo / branding

`logo.png` is a transparent white silhouette. The top-bar `.brand-mark` doesn't draw it directly — it uses the image as a CSS `mask-image`, filled with `var(--accent)`, so the mark automatically recolors with whichever of the 5 themes is active and stays visible in both light and dark mode. To swap the logo, replace `logo.png` with another transparent, mostly-solid silhouette image (a logo with lots of internal detail or gradients won't mask cleanly). The three `favicon-*.png` files are separate flattened renders (logo centered on a solid rounded-square background) since favicons need to read at very small sizes against any browser chrome color.

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Add all the files above to the repository root (or to a `/docs` folder — your choice).
3. Commit and push to GitHub.
4. In the repository, go to **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to "Deploy from a branch," choose your branch (e.g. `main`) and the folder (`/root` or `/docs`).
6. Save. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`.

No build step is required — the files are served as-is.

## Browser support

Built with modern, broadly-supported web features (CSS `color-mix()`, `conic-gradient()`, SVG, the Web Audio API). Works on current versions of Chrome, Edge, Firefox, and Safari on desktop, Android, and iOS.

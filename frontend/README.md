# Frontend

Use Node.js 24 (`nvm use`) and npm. Install the locked dependencies with `npm ci`.

| Command | Purpose |
| --- | --- |
| `npm start` | Start Vite on port 3000; open http://localhost:3000/solarsystemmap/ |
| `npm run build` | Type-check and build the production app into `build/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Check application, test, and Vite configuration types |
| `npm test` | Run the frontend regression tests once |
| `npm run test:watch` | Run tests in watch mode |

The production deployment path remains `/solarsystemmap/`. To deploy elsewhere, change
`base` in `vite.config.ts`; images, translations, and HTML assets use that same base.
The build targets ES2022 browsers. Vite uses the root `index.html` as its entry point
and copies static assets from `public/` into `build/`.

Spacecraft data still comes from the existing API at `http://127.0.0.1:8000`.
Tests supply fixture responses and do not require the backend. Optional planet photos
still belong in `public/images/photos/` and are not included in the repository.

The frontend uses Vite, Vitest, Dart Sass, and TypeScript 7. React is kept on 18.3
because `react-collapsible` declares support through React 18. Upgrading React to 19
will require updating or replacing that accordion. jsdom 26 keeps tests compatible
with the supported Node versions, including Node 24.9.

`package-lock.json` is the dependency lockfile; the obsolete Yarn lockfile has been
removed. Create React App's `eject`, implicit ESLint checks, and Browserslist build
settings no longer apply. Production builds explicitly run TypeScript checks.

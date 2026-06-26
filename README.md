# Kings League Figma Plugin - Match Schedule Importer & PWA

A premium, modular Figma plugin and Mobile-First PWA to view the Kings/Queens League match schedules and import match cards directly onto the Figma canvas as vectorized, responsive, and pixel-perfect elements.

## 🚀 Key Features

*   **Real-time Integration**: Connects dynamically to the official KAMA REST API (`api.kingsleague.kama.sport`) to fetch competitions, seasons, matchdays (turns), matches, and team details.
*   **Dual-Thread Bridge Architecture**:
    *   **PWA UI (Next.js 16 + React 19 + Tailwind CSS)**: Runs inside a Figma iframe (during development via `localhost`, in production via hosted URL like Vercel or Firebase).
    *   **Figma Sandbox (`code.ts` -> `code.js`)**: Runs in Figma's sandboxed canvas thread to load fonts, download images, and draw nodes.
    *   **Source-Disambiguated Web Bridge (`ui.html`)**: Forwards messages between Next.js and Figma Sandbox cleanly using event source checks, preventing message loopbacks.
*   **Automated Dev Port Scanner**: The bridge sequentially scans dev ports (`3000`, `3001`, `3002`) on startup, automatically connecting to the active local Next.js server.
*   **Smart Credentials Caching**:
    *   Saves credentials locally in Figma's secure `clientStorage` (surviving session reloads).
    *   Implements a default read-only credentials fallback (`kosmos.design`) if none are configured.
*   **Vectorized Canvas Output**:
    *   Creates scoreboard cards with auto-layout vertically and horizontally.
    *   Fetches team logos over the network using `figma.createImageAsync` (with brand color background fallbacks).
    *   Styles team headers with their official hex colors.

---

## 📂 Project Structure

```
├── manifest.json            # Figma plugin configuration, permissions & domains
├── ui.html                  # Figma iframe loader (port scanner & postMessage bridge)
├── code.js                  # Compiled Figma sandbox code
├── package.json             # NPM dependencies & project scripts
├── tsconfig.json            # TypeScript configuration (excludes Sandbox from Next.js build)
├── public/                  # Static assets for Next.js
└── src/
    ├── app/                 # Next.js App Router pages and global styles
    ├── sandbox/
    │   └── code.ts          # Sandbox code source (Figma node vector drawing)
    ├── ui/
    │   ├── components/
    │   │   ├── MatchCard.tsx      # Individual match view card (glassmorphism)
    │   │   └── MatchSchedule.tsx  # Main list view, selectors & credentials panel
    │   └── hooks/
    │       └── useKamaData.ts     # Custom hook for Basic Auth fetches to KAMA API
    └── utils/
        └── dateFormatter.ts       # Native Intl date/time formatting utility (Spanish es-ES)
```

---

## 🛠️ Local Development & Setup

### 1. Install Dependencies
In the root directory, run:
```bash
npm install
```

### 2. Start the Dev Server
Run the local Next.js development server:
```bash
npm run dev
```
The server will start on `http://localhost:3000` (or another port if 3000 is occupied).

### 3. Load the Plugin in Figma Desktop
1.  Open the **Figma Desktop App**.
2.  Right-click on the canvas, go to **Plugins** -> **Development** -> **Import plugin from manifest...**.
3.  Choose the `manifest.json` file in this project's root folder.
4.  Launch the plugin: **Plugins** -> **Development** -> **Kings League Match Schedule Importer**.
5.  The plugin will scan and connect to your local Next.js server automatically!

---

## 🏗️ Production Deployment

1.  Build and deploy the Next.js app to your hosting provider (e.g., Vercel, Netlify, or Firebase Hosting):
    ```bash
    npm run build
    ```
2.  Update the `<iframe id="app-iframe" ...>` source URL in `ui.html` to point to your live hosted URL instead of `http://localhost:3000`.
3.  Distribute the plugin manifest to your design team!

---

## 📡 KAMA REST API Data Schema

The KAMA API wraps its responses in a `{ data: ... }` envelope, which is parsed dynamically:
*   `GET /competitions` -> returns `{ data: Competition[] }`
*   `GET /competitions/{id}/seasons` -> returns `{ data: { seasons: Season[] } }`
*   `GET /seasons/{id}` -> returns `{ data: { phases: Phase[] } }`
*   `GET /seasons/{id}/teams` -> returns `{ data: { teams: Team[] } }`

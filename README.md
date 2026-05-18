# Readers School — Futuristic Academic Portal

Welcome to the foundation architecture of **Readers School**, a highly scalable, secure, and modern web application built using **Next.js 15**, **React 19**, **Supabase Auth**, **Zustand**, and **Tailwind CSS v4**.

This application is tailored to provide a state-of-the-art educational interface featuring glassmorphic designs, secure cookies-based authentication, offline-first capabilities, and real-time visual analytics.

## 🚀 Key Features Built-In

1. **Next.js 15 App Router Architecture**:
   - Organized in a modular structure with dedicated subfolders (`components/`, `lib/`, `hooks/`, `services/`, `context/`, `types/`, `utils/`, and `dashboard/`).
   - Highly resilient, fully static-compatible, and future-proof.

2. **Supabase Secure SSR Integration**:
   - Integrates the advanced `@supabase/ssr` cookies module.
   - Built-in cookies exchange Route Handler (`app/auth/callback/route.ts`).
   - Pre-configured server (`lib/supabase/server.ts`), browser (`lib/supabase/client.ts`), and middleware cookies managers (`lib/supabase/middleware.ts`).

3. **Cryptographically Secure Redirection Guards**:
   - Built-in `middleware.ts` intercepts all deep routes.
   - Automatically redirects guest users away from `/dashboard` paths and authenticated users away from `/auth` paths.

4. **Progressive Web App (PWA) Offline Engine**:
   - Fully loaded Web Manifest (`public/manifest.json`) in dark cyber stellar themes.
   - Standard Service Worker (`public/sw.js`) provides smart offline-asset caching and fallback layouts.
   - Reactive `usePWA` hook captures install events, controls installation prompt clicks, and provides realtime connection monitoring.

5. **Global Zustand State Stores**:
   - Separate, lightweight stores for authentication (`lib/store/authStore.ts`) and global UI components (`lib/store/uiStore.ts`).
   - Automatic hydration and initial loaders integrated into root app wrappers.

6. **Interactive Visual Diagnostics (Recharts)**:
   - Configured with `recharts` for charting metrics.
   - Fully protected against Next.js 15 server hydration mismatches through dynamic client bundling wrappers.

7. **Futuristic Glassmorphic Theme (Tailwind CSS v4 & next-themes)**:
   - Deep cyber blue gradients, glowing radial rings, and frosted border overlays.
   - Class-based theme toggle supporting gorgeous light/dark toggling.
   - Premium modern fonts (Outfit and Inter) loaded with optimal layouts.

---

## 📂 Architectural Directory Layout

```bash
├── app/                  # Routing system & global styles
│   ├── auth/             # Login, signup, callback paths
│   ├── dashboard/        # Decoupled responsive main views
│   ├── globals.css       # Tailwind CSS v4 design variables & keyframe animations
│   ├── layout.tsx        # Standard HTML wrappers, Fonts, PWA headers
│   └── page.tsx          # Glassmorphism entrance portal
├── components/           # Reusable graphical segments
│   ├── layout/           # Sidebar & Navbar controllers
│   └── providers/        # Combined theme, PWA alert, & auth providers
├── context/              # Context providers (ThemeProvider next-themes)
├── dashboard/            # Local dashboard analytics modules & README
├── hooks/                # Stateful react helpers (useAuth, usePWA)
├── lib/                  # Library bindings
│   ├── store/            # Zustand global stores (auth, UI)
│   └── supabase/         # SSR cookie-handlers & client creators
├── public/               # Asset distributions (Service worker, Manifest, Icons)
├── services/             # Dedicated API abstractions (authService)
├── types/                # Typescript structures
├── utils/                # Utility helpers (cn.ts classname merging)
├── middleware.ts         # Global path interceptor & security guard
└── package.json          # Main package configuration
```

---

## 🛠️ Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm** or **pnpm** / **yarn**

### 2. Install Dependencies
```bash
npm install
```

### 3. Supply Supabase Environment Variables
Modify the placeholder variables inside `.env.local` to match your active Supabase project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Execute Local Development Terminal
Start the local server in developer mode:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎨 Design Tokens & Custom CSS Classes

We have loaded several custom visual classes that you can reuse immediately:

* **`.glass-panel`**: Highly polished, blurred, translucent white/dark background with frosted border overlays and subtle back shadows.
* **`.glass-card-hover`**: Adds translation offsets (`-4px`), glows, and shadow scales on hover using smooth cubics.
* **`.glass-input`**: Interactive glowing focus states for inputs.
* **`.bg-cyber-grid`**: Seamless mathematical grid lining overlay representing a futuristic command center.
* **`.animate-float`**: Soft, floating keyframe animation for secure panels.

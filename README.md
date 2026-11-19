# 光路 (Kouji — Path of Light)

> A cinematic AI/ML & Data Science portfolio built with React, WebGL, and Framer Motion.

---

## 🌟 Overview

**光路 (Kouji)** is a high-performance interactive developer portfolio crafted to showcase Data Science, AI/ML engineering, and Full-Stack projects through rich visual storytelling and dynamic aesthetics.

The application features custom WebGL shaders, Framer Motion spring physics, bilingual localization (English & Japanese), mobile-first cycling badge animations, and a fully responsive cinematic layout.

---

## 🛠️ Tech Stack & Libraries

- **Frontend Core:** React, JavaScript, Vite
- **Styling & Theme:** TailwindCSS, Vanilla CSS, Custom CSS variables
- **Animations:** Framer Motion (staggered entries, 3D tilts, spring physics, AnimatePresence)
- **Creative WebGL:** Custom WebGL fragment/vertex shader canvas for the Lightning hero effect & interactive sakura tree intro
- **Scroll Behavior:** Lenis (smooth inertial scrolling)
- **Email System:** Web3Forms API integration
- **Localization:** i18next (English & Japanese) with full technical context translation
- **Icons:** Lucide React & inline custom SVGs
- **Performance:** Vite Rollup chunk-splitting, font preloading, deferred heavy mounts, Low Power Mode API

---

## ✨ Key Features

### 1. Unified Intro Screen (Venetian Blind Reveal)
- Custom **WebGL-powered growing Sakura Tree** with floating canvas petals that glow under dynamic themes.
- After full bloom, the canvas state is captured, frozen, and split into multiple sliding strips (Venetian blind effect) to transition into the main page.
- Displays the site name **光路 / Kouji** as the reveal completes.

### 2. Hero Section — Lightning & Cycling Badges
- Full-screen **WebGL lightning shader** that fades in once on load and stays permanently static — no jank on scroll-up.
- **Desktop:** Four floating skill badges (Data Analytics, Python, Data Science, JLPT N4) stay visible at all times after load.
- **Mobile:** Reduced to 2 badges that **cycle every 4 seconds** — left slot alternates Python ↔ Data Analytics, right slot alternates JLPT N4 ↔ Data Science.

### 3. Technical Mastery & CV Download
- Showcases ML/data engineering capability (Python, Pandas, Scikit-learn, XGBoost, CatBoost, Power BI).
- Includes a **direct CV download button** that force-downloads the latest resume PDF.

### 4. Bento Projects Gallery
- Key projects displayed in a modern Bento Grid with random-direction fly-in animations that replay on every scroll-into-view.
- Interactive visuals: custom SVG map path tracer for tourism forecasting, ecommerce UI mockup, live GitHub contribution heat-map.
- **Project Modals** with full write-ups, tech tags, metrics, and links to GitHub / live demos.

### 5. Stereoscopic About Me
- 3D tilt cards with breath-pulsing Japanese Kanji watermarks (`工`, `房`, `脳`).
- Fully interactive spotlight overlay that tracks mouse movement across the card container.

### 6. Firefly Contact Form
- **Firefly Overlay** — canvas particle system with gravitational pull drawing glowing fireflies toward focused form inputs.
- Secure serverless form submission via **Web3Forms**.

### 7. Cinematic Footer
- Looping background video of cherry blossoms over a Tokyo skyline at night.
- Displays the **光路 / Kouji** brand mark and portfolio tagline.

### 8. High-Performance Architecture & Low Power Mode 🔋
- **Low Power Mode:** Respects OS "Reduced Motion" settings and offers a manual toggle — strips heavy Canvas physics, particle systems, and glassmorphic blurs for older devices.
- **Network Optimized:** Aggressive Vite/Rollup chunk-splitting; no initial JS payload exceeds 200 KB, fast on 3G.
- **SEO Ready:** `hreflang` detection for localization indexing, static `sitemap.xml` and `robots.txt`.

---

## 🚀 Getting Started

### Prerequisites

[Node.js](https://nodejs.org/) v18+ recommended.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Subhadeep12-gorain/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Lint the code:
   ```bash
   npm run lint
   ```

---

## 📁 File Structure

```text
├── public/
│   ├── videos/                  # Video assets and background loops
│   ├── Subhadeep_Gorain_Resume.pdf  # CV (force-downloadable)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/              # Global layout managers (Weather, UI)
│   │   └── ui/                  # Interactive individual components:
│   │                            #  - hero-odyssey.jsx     (WebGL lightning hero + cycling badges)
│   │                            #  - intro-screen.jsx     (WebGL sakura tree intro + blind reveal)
│   │                            #  - bento-visuals.jsx    (Project grid illustrations)
│   │                            #  - contact-section.jsx  (Web3Forms + Firefly overlay)
│   │                            #  - cinematic-footer.jsx (Looping video footer)
│   │                            #  - skills-redesign.jsx  (Skills section)
│   │                            #  - project-modal.jsx    (Full project detail modals)
│   ├── i18n/                    # Localization setup
│   ├── locales/                 # Translations (en, jp)
│   ├── App.jsx                  # Main app layout and section orchestration
│   └── main.jsx                 # Entry point
```

---

## 📝 License

© 2026 Subhadeep Gorain. All rights reserved.

# 夜桜 (YORU NO HANA — Sakura Nocturne)

> A premium, cinematic AI/ML Engineering Portfolio built with React, WebGL, and Framer Motion.

---

## 🌸 Overview

**夜桜 (Sakura Nocturne)** is a state-of-the-art interactive developer portfolio designed to show off AI/ML engineering projects, technical mastery, and professional experience through rich storytelling and dynamic visual aesthetics. 

The application utilizes high-performance custom WebGL shaders, elegant 3D tilt interactions, localizations (English & Japanese), and a responsive layout to create a premium experience.

---

## 🛠️ Tech Stack & Libraries

- **Frontend Core:** React, Javascript, Vite
- **Styling & Theme:** TailwindCSS, Vanilla CSS, Custom CSS variables
- **Animations:** Framer Motion (staggered entries, 3D tilts, spring physics)
- **Creative WebGL:** Custom WebGL fragment/vertex shader canvas for interactive sakura tree growth & petal rendering
- **Scroll Behavior:** Lenis (smooth inertial scrolling)
- **Email System:** Web3Forms API integration
- **Localization:** i18next (English & Japanese) with full technical context translation
- **Icons:** Lucide React & inline custom SVGs
- **Performance:** Vite Rollup Chunking, Font Preloading, and Low Power Mode API

---

## ✨ Key Features

### 1. Unified Intro Screen (Venetian Blind Reveal)
- Features a custom **WebGL-powered growing Sakura Tree** with floating canvas petals that glow under dynamic themes.
- After a complete bloom, the canvas state is captured, frozen, and split into multiple sliding strips (Venetian blinds effect) to transition to the main page.

### 2. Technical Mastery & Interactive CV
- Showcases deep learning/machine learning capability (Python, Pandas, Scikit-learn, XGBoost, CatBoost).
- Includes **Magnetic 3D CV Cards** that rotate dynamically based on mouse cursor position.

### 3. Bento Projects Gallery
- Displays key projects in a modern Bento Grid format.
- Interactive visuals include a custom SVG map path tracer for tourism forecasting, django-powered ecommerce UI mockup, and a live GitHub contribution heat-map.

### 4. Stereoscopic About Me
- Features 3D shifting cards with breath-pulsing Japanese Kanji watermarks (`工`, `房`, `脳`).
- Fully interactive spotlight overlay that tracks mouse movements on the card container.

### 5. Firefly Contact Form & Magnetic Socials
- Features the **Firefly Overlay**, a canvas particle overlay that applies a gravitational pull drawing glowing fireflies toward whichever form input currently holds focus.
- Implements secure, serverless form processing via **Web3Forms**.
- Includes smooth **Magnetic Social buttons** for LinkedIn, GitHub, and email links.

### 6. Cinematic Video Footer
- Implements a looping background video showing cherry blossoms falling over a Tokyo skyline at night with dark gradient blending.

### 7. High-Performance Architecture & Low Power Mode 🔋
- **Low Power Mode:** Automatically respects the user's OS "Reduced Motion" settings (and offers a manual toggle) to gracefully strip out heavy Canvas physics, particle systems, and glassmorphic blurs, ensuring maximum FPS on older smartphones and hardware.
- **Network Optimized:** Implements aggressive Vite/Rollup chunk-splitting to ensure no initial JS payload exceeds 200kb, making the app blazing fast on 3G networks. 
- **SEO Ready:** Implements automatic `hreflang` detection for localization indexing, along with static `sitemap.xml` and `robots.txt` endpoints.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Subhadeep12-gorain/portfolio.git
   cd portfolio
   ```

2. Install the dependencies:
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
│   └── videos/              # Video assets and background loops
├── src/
│   ├── assets/              # Static media assets (images, graphics)
│   ├── components/
│   │   ├── layout/          # Global layout managers (Weather, UI)
│   │   └── ui/              # Interactive individual components:
│   │                        #  - firefly-overlay.jsx (Interactive canvas particle form follower)
│   │                        #  - magnetic-button.jsx (Cursor tracking spring buttons)
│   │                        #  - intro-screen.jsx (WebGL intro tree canvas & blind sliders)
│   │                        #  - contact-section.jsx (Web3Forms client connection section)
│   │                        #  - bento-visuals.jsx (Project grid illustrations)
│   ├── hooks/               # Custom react hooks (scrolling, snapping, mouse interaction)
│   ├── i18n/                # Localization setup
│   ├── locales/             # Translations (en, jp)
│   ├── App.jsx              # Main app layout, routing, and snap setup
│   └── main.jsx             # Entry point
```

---

## 📝 License

© 2026 Subhadeep Gorain. All rights reserved.

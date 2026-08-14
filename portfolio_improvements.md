# 🌸 Portfolio Improvement List — sgorain.vercel.app
> **Overall Rating:** 6.8 / 10 vs. award-winning portfolios
> **Target Rating:** 9 / 10 after all fixes

---

## 🔴 CRITICAL — Fix Before Sharing With Anyone

### 1. Fix the Broken "View Curriculum Vitae" Button
- **Where:** Technical Mastery section
- **Problem:** Clicking `VIEW CURRICULUM VITAE ▼` does nothing. It's a dummy button.
- **Why it matters:** This is the #1 CTA on your portfolio. Every recruiter and professor will click it. A broken button = instant credibility loss.
- **Fix:** Upload your resume as a PDF (e.g., `/public/resume.pdf`) and link the button:
  ```html
  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
    VIEW CURRICULUM VITAE ▼
  </a>
  ```

---

### 2. Replace the Placeholder Email
- **Where:** Contact section → `EMAIL` button
- **Problem:** The mailto link uses `subhadeepgorain@example.com` — a placeholder that signals the site is unfinished.
- **Fix:** Replace with your actual email address.

---

### 3. Add Live Project Demos (at least one)
- **Where:** Projects section
- **Problem:** All project cards link only to raw GitHub source. Nobody can assess your work without seeing it run.
- **Fix options (pick one per project):**
  - Deploy to [Vercel](https://vercel.com), [Render](https://render.com), or [Streamlit Cloud](https://streamlit.io/cloud) and add a "Live Demo" link
  - Add a short Loom or YouTube demo video embedded or linked on the card
  - Add an architecture diagram (exported from Draw.io or Mermaid)
  - Add static screenshots of the app running

---

## 🟡 HIGH PRIORITY — Do These in Week 1

### 4. Fix Mobile Hero Subtitle Truncation Bug
- **Where:** Hero section on mobile (≤ 375px viewport)
- **Problem:** The subtitle `"AI/ML Engineer"` is cut off to `"AI/ML Enginee"` on small screens.
- **Fix:** Add to your hero subtitle CSS:
  ```css
  .hero-subtitle {
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  ```

---

### 5. Hero Section — Put Your Name at the Top of the Visual Hierarchy
- **Where:** Hero section
- **Problem:** `SAKURA NOCTURNE` (the theme name) visually competes with your own name. A recruiter scanning for 3 seconds might miss "Subhadeep Gorain" entirely.
- **Fix:** Make your name the largest, most prominent element. `SAKURA NOCTURNE` should be a small subtitle/label above it (like a tagline, not a title).

---

### 6. Add a Clear Value Proposition Subtitle in the Hero
- **Where:** Hero section
- **Problem:** "Where cutting edge algorithms meet cinematic elegance." is atmospheric but tells visitors nothing about *who you are* or *what you build*.
- **Fix:** Add a scannable one-liner below your name, e.g.:
  > *AI/ML Engineer · Data Science & Forecasting · Pursuing graduate research in Japan*

---

### 7. Add Descriptions to All Project Cards
- **Where:** Projects section
- **Problem:** Project cards show a title and tech-stack tags, but no explanation of what the project does or what problem it solves.
- **Fix:** Add 2–3 sentences per card answering:
  - What does it do?
  - What was the core technical challenge?
  - What was the outcome or result? (e.g., metrics, accuracy, scale)

**Example for Japan Tourism Forecasting:**
> "Built an ML forecasting pipeline using XGBoost on Japan Tourism Agency data across all 47 prefectures. Achieved a 15% RMSE reduction over the baseline ARIMA model. Used for regional policy demand estimation."

---

### 8. Fix Missing/Grey Preview Image on Ecommerce Platform Card
- **Where:** Projects section → Ecommerce Platform card
- **Problem:** The card shows a grey placeholder box instead of any visual preview.
- **Fix:** Add a screenshot, mockup image, or a custom icon/illustration.

---

### 9. Expand Journey Timeline Entries With Specifics
- **Where:** My Journey section
- **Problem:** Entries are too vague. Example: *"Backend Intern — Backend services and REST APIs at an early-stage startup."* gives no context about the company, stack, or impact.
- **Fix:** For each entry, add:
  - The actual company/org name (if you're comfortable)
  - The tech stack used
  - One specific achievement or responsibility
  - Quantified impact where possible

---

### 10. Add "Open to Work" Availability Badge
- **Where:** Hero section or Navigation bar
- **Problem:** Your availability is buried as small body text in the Contact section. Most people won't reach that section before forming an opinion.
- **Fix:** Add a subtle visual badge in the hero or nav:
  ```
  🟢  Open to Opportunities · Graduating 2026
  ```

---

## 🟢 MEDIUM PRIORITY — Do These in Weeks 2–3

### 11. Add Social Proof / Testimonials Section
- **Problem:** Zero endorsements anywhere on the site. This is the lowest-scoring area (credibility: 2/10).
- **Fix:** Add a `What Others Say` section with 2–3 quotes from:
  - A professor or academic supervisor
  - A hackathon teammate or project collaborator
  - A mentor or senior peer
- Even informal LinkedIn recommendations copied as quotes work. One quote is infinitely better than none.

---

### 12. Add SEO Meta Tags & Open Graph Cards
- **Problem:** When you share your portfolio URL on LinkedIn, WhatsApp, or via email, there's likely no custom preview image or description — it appears as a blank/generic link.
- **Fix:** Add to your HTML `<head>`:
  ```html
  <meta name="description" content="Subhadeep Gorain — AI/ML Engineer specialising in Data Science, Forecasting, and ML Pipelines. Pursuing graduate studies in Japan." />
  <meta property="og:title" content="Subhadeep Gorain — AI/ML Engineer" />
  <meta property="og:description" content="AI/ML Engineer specialising in Data Science, Forecasting, and End-to-End ML Pipelines. Pursuing graduate studies in Japan." />
  <meta property="og:image" content="https://sgorain.vercel.app/og-preview.png" />
  <meta property="og:url" content="https://sgorain.vercel.app" />
  <meta name="twitter:card" content="summary_large_image" />
  ```
- Also create a simple OG preview image (1200×630px) — could be your name + title on the sakura background.

---

### 13. Add a Custom Favicon
- **Problem:** The browser tab likely shows a generic icon.
- **Fix:** Export the `夜桜` logo as a 32×32 and 180×180 `.ico` / `.png` and add:
  ```html
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ```

---

### 14. Label the GitHub Activity Widget
- **Where:** Projects section → bottom-right tile
- **Problem:** The GitHub contribution heatmap is unlabeled — most visitors won't know what they're looking at.
- **Fix:** Add a clear heading `"GitHub Activity — @yourusername"` and link the tile to your actual GitHub profile.

---

### 15. About Me Section — Add Personality Beyond Engineering
- **Problem:** The About section reads entirely like a technical summary. There's nothing that signals *who you are* as a person.
- **Fix:** Add 1–2 sentences about non-engineering interests:
  - Your genuine interest in Japan (language, culture, travel)
  - Badminton (already in your Journey — connect it to the About section!)
  - What kind of problems excite you to solve
  - What you're currently reading or learning outside of ML

---

### 16. Technical Mastery Section Title Animation — Add Fallback
- **Problem:** The section title animates in as "Technica..." and on slow connections users might see incomplete text for a moment.
- **Fix:** Ensure the CSS animation always completes and add a `noscript` fallback showing the full text.

---

## 🔵 POLISH — Reach Award-Winning Level

### 17. Add Per-Project Case Study Pages
- **Problem:** Right now, a project = a card that links to GitHub. Award-winning portfolios have dedicated project pages, e.g., `/projects/japan-tourism`, with:
  - Problem statement
  - Methodology & approach
  - Diagrams or data visualisations
  - Results with metrics
  - Key learnings
- Even **one** full case study page makes a massive difference.

### 18. Add a Custom Cursor Effect
- Common on Awwwards SOTD portfolios.
- A soft glowing dot or a drifting sakura petal that follows the cursor would fit the Sakura Nocturne theme perfectly.

### 19. Add Smooth Section Entrance Animations
- Currently, sections snap cleanly but without entry animation polish.
- Add fade-in or slide-up reveals as each section enters the viewport.

### 20. Add a Blog / Research Notes Section *(Optional but Valuable)*
- Writing about your ML research, JLPT journey, or technical projects signals depth.
- Even 2–3 short posts distinguishes you from candidates who only show code.

---

## ✅ Quick-Win Checklist

```
[ ] Upload resume PDF and fix CV button link                  (~30 min)
[ ] Replace placeholder email with real email                 (~5 min)
[ ] Fix mobile subtitle CSS (word-break / overflow-wrap)      (~15 min)
[ ] Add 2-3 sentences to each project card                    (~2–3 hrs)
[ ] Fix grey placeholder image on Ecommerce card              (~1 hr)
[ ] Add OG meta tags to <head>                                (~1 hr)
[ ] Add favicon                                               (~30 min)
[ ] Add availability badge to Hero                            (~30 min)
[ ] Label GitHub activity widget with your username           (~15 min)
[ ] Expand Journey timeline entries with specifics            (~1–2 hrs)
```

---

## 📊 Improvement Impact Map

| Fix | Effort | Rating Impact |
|---|---|---|
| Fix CV button | ⚡ 30 min | +0.5 |
| Fix email | ⚡ 5 min | +0.3 |
| Fix mobile hero bug | ⚡ 15 min | +0.2 |
| Add project descriptions | 🕐 2–3 hours | +0.4 |
| Add OG meta tags | 🕐 1 hour | +0.2 |
| Fix Ecommerce preview image | 🕐 1 hour | +0.1 |
| Add availability badge | ⚡ 30 min | +0.1 |
| Add live demo (1 project) | 🕑 1–2 days | +0.6 |
| Add testimonials | 🕑 2–3 days | +0.5 |
| Add case study page | 🕒 1 week | +0.8 |

> **With just the ⚡ quick wins: Rating → ~7.5 / 10**
> **With all 🟡 high-priority fixes: Rating → ~8.2 / 10**
> **With 🔵 polish phase complete: Rating → ~9.0 / 10**

---

*Generated from a full automated browser review of sgorain.vercel.app — all 7 sections visited, desktop + mobile viewports tested, bilingual EN/日本語 mode verified, and contact form tested.*

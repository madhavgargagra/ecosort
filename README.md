# 🌿 EcoSort — AI Waste Classification & Recycling Guide

> **HackJKLU Year 1 · Circular Economy & Sustainability Track**

EcoSort uses a **client-side AI model** to identify household waste and instantly tell you which bin it belongs in. Sort smarter, play sorting games, bust recycling myths, track your environmental impact, and earn **Eco Credits** to redeem for 18 real community rewards — all running 100% in your browser with zero signup.

---

## 🚀 Quick Start

No build step or installation required. Just start a local web server:

```bash
# Python (recommended — pre-installed on most systems)
python -m http.server 3000

# Node.js alternative
npx serve . -p 3000
```

Then open **http://localhost:3000** in **Chrome** or **Edge**.

> ⚠️ A local server is required because TensorFlow.js and the Web Speech API need `localhost` or `HTTPS`. Opening `index.html` as a `file://` URL will block both the AI model and the microphone.

---

## 📄 Pages

| Page | URL | Description |
|---|---|---|
| 🏠 Home | `/index.html` | Landing page with hero, community counter, how-it-works, and category preview |
| 📸 Scan | `/scan.html` | AI waste scanner — upload photo / camera / text search / 🎤 voice search |
| 📊 Dashboard | `/dashboard.html` | Personal environmental impact tracker + shareable impact card |
| 🎮 Game | `/game.html` | Drag-and-drop sorting game + speed quiz mode |
| 🧠 Myths | `/myths.html` | Recycling Myth Buster quiz (30 myths, 15 per game) |
| 🪙 Rewards | `/rewards.html` | Eco Credits marketplace with 18 rewards + redemption history |

---

## ✨ Feature Overview

### 🤖 AI Waste Classification (Client-Side)
- **TensorFlow.js + MobileNet v2** — runs entirely in the browser, no backend needed
- **Three input methods:**
  - 📁 Photo upload (drag & drop or file picker)
  - 📷 Live camera with scanning overlay
  - 🔍 Text search with autocomplete over 50+ waste items
  - 🎤 **Voice search** via Web Speech API — say "plastic bottle" and it searches instantly
- Smart fallback: if AI confidence is low, a manual category picker appears
- Results show: correct bin, sorting tips, common mistakes, fun fact, confidence %

### ♻️ 8 Waste Categories
| Category | Bin | Examples |
|---|---|---|
| ♻️ Recyclable | Blue Bin | Bottles, cans, paper, cardboard |
| 🌱 Compostable | Green Bin | Food scraps, yard waste, banana peel |
| 🗑️ General Waste | Black Bin | Styrofoam, chip bags, cling film |
| ⚠️ Hazardous | Special Drop-off | Batteries, paint, chemicals |
| 💻 E-Waste | E-Waste Centre | Phones, cables, laptops |
| 👕 Textiles | Donation/Textile Bank | Clothing, shoes, fabric |
| 🏗️ Bulky Waste | Council Collection | Furniture, appliances |
| 💊 Medical Waste | Pharmacy Return | Medicines, sharps |

### 🎮 Sorting Game
- **Drag-and-drop mode** — items fall from the top; drag them into the correct bin before they pile up
- **Speed quiz mode** — four-option multiple-choice against a countdown timer
- Lives system (3 lives), score tracking, difficulty progression (spawn rate increases every 30s)
- High scores saved to `localStorage` and shown on the game over screen
- **Eco Credits** earned for every correct sort

### 🧠 Recycling Myth Buster
- Pool of **30 researched myths** — 15 chosen randomly each game (different every session)
- Categories: Plastics, Paper, Glass, Metal, Organics, E-Waste, Hazardous, Textiles, Best Practice
- Answer TRUE or FALSE → reveals detailed explanation + fun fact
- Keyboard shortcuts: **T** (True) · **F** (False) · **Enter** (Next)
- Earn **+3 Eco Credits** per correct answer (up to +45 per game)
- Results screen with accuracy grade: Expert / Champion / Getting Greener / Keep Learning

### ⏳ Decomposition Timeline
- Logarithmic-scale visual timeline from **2 weeks** (banana peel) to **1 million years** (glass)
- Animated pointer shows exactly where each item falls
- Horror note highlights items that will outlast civilisations

### 🌍 Environmental Impact Dashboard
- Animated SVG ring meters: **CO₂ saved**, **Water saved**, **Trees equivalent**, **Energy saved**
- Human-readable equivalents (e.g. "≈ 5 km not driven", "≈ 3 showers")
- **12 achievement badges** that unlock automatically
- Category breakdown bars showing sorting habits over time
- Full scan history (last 50 items, with timestamps)
- 📤 **Share Impact Card** — generates a 1200×630 PNG with your stats for social media (Canvas API)

### 🌍 Community Impact Counter
- Simulated live global counter on the home page (seeded from launch date, grows daily)
- Shows: items sorted globally, CO₂ prevented, eco champions, credits redeemed
- Includes your personal contribution in the totals

### 🪙 Eco Credits & 18 Real Rewards
Credits earned: **+10 per scan**, **+5 bonus** for ML confidence ≥70%, **+50** per badge, **+3** per myth correct

| Reward | Credits | Category |
|---|---|---|
| ☀️ Solar Phone Charger | 60 | Energy |
| 🌱 Herb Seed Starter Kit | 80 | Gardening |
| 🚲 Free 2-Hour Bicycle Hire | 90 | Transport |
| 🛒 10% Off at EcoMart | 100 | Discount |
| 🛍️ 15% Off Zero-Waste Grocery | 110 | Discount |
| 🔧 Free Repair Café Session | 120 | Repair |
| 👗 Secondhand Clothing Voucher | 120 | Fashion |
| 🚌 Free 1-Day Bus Pass | 130 | Transport |
| ♻️ TerraCycle Collection Box | 140 | Recycling |
| 🌿 Free Compost Bag | 150 | Garden |
| 🎨 Upcycling Workshop Ticket | 160 | Skill |
| 🌧️ Rainwater Harvesting Kit | 180 | Garden |
| 📱 Free E-Waste Pickup | 180 | E-Waste |
| 🍎 Fruit Tree Sapling | 200 | Impact |
| 🚛 Free Garbage Collection | 200 | Community |
| 💧 Reusable Water Filter Jug | 250 | Impact |
| 🌳 Plant a Tree in Your Name | 300 | Impact |
| 🍳 Zero-Waste Cooking Masterclass | 75 | Skill |

### 📱 Progressive Web App (PWA)
- **Installable** — "Add to Home Screen" on Android/Chrome (install button appears automatically)
- **Offline capable** — service worker pre-caches all pages, CSS, JS, and fonts
- Works without internet after first load
- Notifies user when an app update is available

### 🎨 Design
- **Dark mode** (default) + **Light mode** with instant toggle
- Glassmorphism cards, animated gradient background blobs, micro-animations
- Smooth page transitions and hover effects throughout
- Fully responsive — mobile, tablet, and desktop
- Google Fonts: **Outfit** (headings) + **Inter** (body)
- Toast notification system for feedback across all pages

---

## 🗂️ Project Structure

```
HackJKLU Year 1/
│
├── index.html          ← Home / Landing page
├── scan.html           ← AI Scan page (upload / camera / search / voice)
├── dashboard.html      ← Impact dashboard + share card
├── game.html           ← Drag-and-drop sorting game + quiz
├── myths.html          ← Recycling Myth Buster quiz
├── rewards.html        ← Credits & reward marketplace
├── manifest.json       ← PWA web app manifest
├── sw.js               ← Service Worker (offline caching)
├── favicon.svg         ← App icon
│
├── css/
│   ├── index.css       ← Global design system, CSS variables, themes, navbar
│   ├── scanner.css     ← Upload zone, camera, search, voice button
│   ├── results.css     ← Classification result card, confidence bar
│   ├── dashboard.css   ← SVG rings, stat cards, badges, scan history
│   ├── timeline.css    ← Decomposition timeline track & pointer
│   ├── rewards.css     ← Credits summary, reward cards, redemption list
│   ├── game.css        ← Game arena, bins, item cards, quiz UI
│   └── myths.css       ← Myth card, progress bar, answer buttons, results
│
└── js/
    ├── waste-data.js    ← 50+ waste items database + ML label mapping
    ├── storage.js       ← localStorage: scans, streaks, badges, redemptions
    ├── impact.js        ← Animated counters, ring fills, dashboard renderer
    ├── timeline.js      ← Logarithmic timeline renderer
    ├── rewards.js       ← 18-reward catalogue, redemption codes, marketplace UI
    ├── classifier.js    ← TensorFlow.js MobileNet v2 inference
    ├── camera.js        ← getUserMedia camera handler
    ├── share.js         ← Canvas API impact card generator (1200×630 PNG)
    ├── utils.js         ← Toast system, theme toggle, SW registration (shared)
    ├── nav.js           ← Navbar init, active link, credits badge sync (shared)
    ├── page-home.js     ← Home: hero stats + community counter animation
    ├── page-scan.js     ← Scan: classification flow + voice search
    ├── page-dashboard.js← Dashboard: impact render + share card trigger
    ├── page-game.js     ← Game: drag-and-drop + quiz engine
    ├── page-myths.js    ← Myths: 30-question quiz, random 15/game
    └── page-rewards.js  ← Rewards: init, credits UI
```

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Structure | HTML5, Semantic elements | 6 pages, no framework |
| Styling | Vanilla CSS | Custom design system, CSS variables, dark/light themes |
| Logic | Vanilla JavaScript ES2022+ | No build step, no dependencies |
| AI Model | TensorFlow.js 4.15 + MobileNet v2 | Runs 100% client-side in browser |
| Voice | Web Speech API | Built-in browser API, Chrome/Edge only |
| Share | Canvas API | Generates 1200×630 PNG impact card |
| PWA | Service Worker + Web App Manifest | Offline-capable, installable |
| Storage | Browser `localStorage` | No backend, no database, no cookies |
| Fonts | Google Fonts (Outfit + Inter) | Cached by service worker |
| Server | Any static file server | `python -m http.server` or `npx serve` |

---

## 🎯 3-Minute Demo Walkthrough

**Judges, here's the suggested demo flow:**

### Minute 1 — Scan & Classify
1. Open **http://localhost:3000** → Show animated hero with phone mockup and community counter
2. Click **"Scan Your Waste"** → Navigate to scan page
3. Go to **Search tab** → type `pizza box` → Select from autocomplete
4. Click **Analyze Waste** → Result: `📄 Paper → Compost the greasy half, recycle the clean half`
5. Show the decomposition timeline (20–30 years in landfill), then the environmental impact preview
6. Credits banner appears: `+10 Eco Credits`

### Minute 2 — Game & Myths
7. Navigate to **Game** → Click **"Drag & Drop"** → Play for 30 seconds showing items being sorted
8. Navigate to **Myths** → Answer 2–3 questions, show the fun fact reveal animation
9. Point out: keyboard shortcuts (T/F/Enter), 30-question pool, credits earned

### Minute 3 — Dashboard & Polish
10. Navigate to **Dashboard** → Show impact rings animating, badges, scan history
11. Click **"Download Impact Card"** → Show the 1200×630 PNG download
12. Navigate to **Rewards** → Point out the 18 different rewards (scroll the grid)
13. Toggle **Light Mode** → Instant theme switch (wow moment)
14. Final line: *"100% in-browser. No signup. No server. No data collected. Works offline as a PWA."*

---

## 🔧 Browser Compatibility

| Browser | AI Scan | Voice Search | PWA Install | Game |
|---|---|---|---|---|
| ✅ Chrome 90+ | ✅ | ✅ | ✅ | ✅ |
| ✅ Edge 90+ | ✅ | ✅ | ✅ | ✅ |
| ⚠️ Firefox | ✅ | ❌ (no Web Speech API) | ❌ | ✅ |
| ⚠️ Safari | ✅ | ⚠️ (limited) | ⚠️ | ✅ |

**Recommended: Chrome or Edge on localhost.**

---

## 👥 Team

Built for **HackJKLU Year 1** — Circular Economy & Sustainability Track.

---

*Sort smarter. Live greener. Earn rewards.* 🌱

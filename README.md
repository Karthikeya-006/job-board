# TalentFlow — Job Board & Profile Completion App

A responsive React.js application built for the internship assignment, featuring a Job Board and Profile Completion screen.

## Live Demo

Deploy to Vercel in one click after cloning.

---

## Features

### Job Board
- 12 mock job listings with company logos, salary, tags, and post dates
- Real-time search across title, company, location, and skill tags
- Filter by job type: All / Full-time / Part-time / Internship / Contract
- Save (bookmark) individual jobs
- One-click apply with persistent applied state
- Responsive grid layout (3 cols → 2 cols → 1 col)

### Profile Completion
- Live progress indicator (0–100%) with color feedback (red → amber → green)
- Per-field completion pills showing what's done
- Profile picture upload with initials avatar preview
- Full name, email, phone with inline validation
- Tag-based skill input (type + Enter or click Add)
- Education textarea
- Resume upload with drag & drop support
- Form validation with error messages
- Save confirmation state

---

## Tech Stack

- **React 18** — functional components + hooks
- **CSS Modules** — scoped styling, no global conflicts
- **Tabler Icons** — consistent icon set via CDN webfont
- **Google Fonts** — DM Sans + Syne for typography
- No external UI libraries — all components built from scratch

---

## Project Structure

```
src/
├── data/
│   └── jobs.js           # Mock job data (12 listings)
├── components/
│   ├── JobBoard.jsx       # Job listing screen
│   ├── JobBoard.module.css
│   ├── JobCard.jsx        # Individual job card
│   ├── JobCard.module.css
│   ├── ProfileScreen.jsx  # Profile completion screen
│   └── ProfileScreen.module.css
├── App.js                 # Root + navbar
├── App.module.css
├── index.js               # React entry point
└── index.css              # Global CSS variables & resets
```

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Karthikeya-006/talentflow.git
cd talentflow

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → import `talentflow`
4. Click **Deploy** — Vercel auto-detects Create React App

---

## Design Decisions

- **CSS Variables** for theming — easy to switch color palette
- **CSS Modules** — no class name conflicts across components
- **Controlled inputs** with `useState` for all form state
- **Inline validation** on blur, full validation on submit
- **Weighted completion** — fields contribute different % based on importance (education = 20%, avatar = 10%, etc.)
- **Mock data in a separate file** — easy to swap for an API call later

---

## Author

**Karthikeya** — [github.com/Karthikeya-006](https://github.com/Karthikeya-006)

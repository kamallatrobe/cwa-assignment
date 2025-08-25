# CWA Assignment Starter (Next.js App Router + TypeScript)

This project scaffolds your Assignment 1 requirements.

## Quick start

1. Install Node.js (LTS 18+).
2. Unzip this folder and open it in VS Code.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000

## Replace placeholders

- In `components/Header.tsx`, `components/Footer.tsx`, and `app/about/page.tsx`:
  - Replace **Your Name** with your full name.
  - Replace **12345678** with your student number.
- In `app/about/page.tsx`, replace `VIDEO_ID` with your YouTube video ID (unlisted).

## What’s included

- Global header (student number top-left), accessible hamburger menu, theme toggle.
- Footer with name, student number, today's date.
- Pages: Home (Tabs generator), About (with video), Escape Room, Coding Races, Court Room (placeholders).
- Cookies: remembers last clicked menu path (`lastMenuPath`) and theme.
- Accessibility: semantic landmarks, ARIA on menu/tabs, keyboard support on tabs.

## Tabs generator

On **Home**, configure tab labels/content, **Generate** to produce a complete HTML page (inline CSS + JS). Click **Copy**, paste into a file like `Hello.html`, and open in your browser.

## Submission tips

- Record a 3–8 min walkthrough.
- Zip the project without `node_modules`.
- Include screenshots of Git commits.

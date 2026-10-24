---
name: feedback-no-self-testing
description: "User tests UI/feature changes themselves; don't spin up browsers, dev servers, or screenshot scripts to verify."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f378bf02-d44a-4e3a-b206-6afabc8c0420
  modified: 2026-09-05T03:11:12.550Z
---

Don't launch headless browsers, dev servers, or write Playwright/screenshot scripts to visually verify changes in `dungeon-companion-web` / `dungeon-companion-api`. The user tests these themselves.

**Why:** After a dice-roll UI redesign in the character wizard, the user said "não precisa mais testar, deixa que das proximas eu testo" ("no need to test anymore, I'll test it from now on") — right after a session where verifying required a fair amount of setup (installing playwright, extracting missing shared libs, signing up throwaway test accounts in the dev DB) to get a headless browser working.

**How to apply:** Still verify with cheap, non-interactive checks — `tsc --noEmit`, `ng build`, lint, unit tests — since those aren't "testing the UI" in the sense the user meant. But stop short of driving the actual app in a browser (signup flows, screenshots, clicking through the wizard) unless the user explicitly asks for that again. Report what you changed and let them check it visually.

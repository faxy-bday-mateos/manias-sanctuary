# Project Handoff for AI Assistants

Last updated: 2026-11-24

## What this project is

This is a personal birthday website for Manuu. It is an interactive, static-first site with a warm, calm visual style. The main app is built with React, TypeScript, and Vite. It includes a landing page, an experience hub, several small birthday experiences, and an optional activity tracker.

The site is not a conventional multi-user product. Preserve its personal, gentle tone and avoid adding intrusive analytics, identity tracking, or unrelated features.

## Current status and ongoing work

**Ongoing task: verify the live deployment and authorized admin dashboard access. The site owner reports the site is live at `https://manias-sanctuary.netlify.app`, but the URL returns HTTP 401 and requires an invited Netlify account. Recent work added a keyboard skip link, raised small controls to 44px targets, and losslessly optimized the Observatory cat sprite.**

The frontend and Firestore adapter have been scaffolded:

- `/#/activity` provides a visible consent-based tracker, local event history, JSON export, and local clearing.
- `/#/admin` has an admin sign-in and activity dashboard UI. When configured, it shows the latest 100 remote events live, pages through older events, filters by event/page/time/search, summarizes loaded events, exports CSV/JSON, and lets the authorized admin delete all remote records.
- `src/activityTracker.ts` records events locally only after a visitor opts in. It dynamically loads Firebase to sync remotely only when remote configuration is complete.
- `src/firebaseClient.ts` signs visitors in anonymously and writes validated event fields to Firestore.
- The Observatory iframe forwards sanitized events to the parent app. It does not write to Firebase directly.

The app and Firebase backend are configured for `mania-4f364`, but remote tracking is **not yet verified end-to-end on the deployed site**:

1. The `.firebaserc` target and local `.env.local` project ID match; required local settings are populated, and the local admin UID matches the UID in `firestore.rules`.
2. Cloud Firestore is active in `asia-south1`. The newest rules revision visible in the Firebase Console matches local `firestore.rules`; the Rules Playground denied an anonymous non-admin read and allowed a request with the configured admin UID.
3. Firebase Authentication has Anonymous and Email/Password providers enabled.
4. The Web app is registered with App Check using reCAPTCHA Enterprise; `src/firebaseClient.ts` initializes `ReCaptchaEnterpriseProvider`. Firestore App Check enforcement is enabled.
5. A consented Chrome test successfully wrote a `page_visit` and a control `interaction` event with server timestamps to Firestore while App Check enforcement was enabled. The in-app browser attempt separately failed to obtain an App Check token (`appCheck/recaptcha-error`) and then hit Firebase Auth `auth/network-request-failed`.
6. Firestore Data Console showed the event records. Rules Playground denied an anonymous non-admin read and allowed a read using the configured admin UID. This is a rules simulation, not a live admin dashboard sign-in/read test.
7. The site owner reports that the site is now live at `https://manias-sanctuary.netlify.app`, but it redirects to Netlify's “This site is private” page and returns HTTP 401 without an invited account. Authorized admin sign-in/read and remote tracking on the deployed host remain unverified. The admin account password is not stored in the project and should not be requested in chat.
8. Keep activity in Cloud Firestore; do not use or change the separate 100-orgs Realtime Database or its rules.

### Next steps for the tracker

1. Use an invited Netlify account or make the site publicly accessible, then test an opted-in write plus authorized admin sign-in/read on the deployed site. The admin account password must be entered only by the authorized admin, never requested in chat.
2. Investigate why the in-app browser reports `appCheck/recaptcha-error`; Chrome already proved a local visitor can obtain a token and write remotely. Keep the site key value out of chat and docs.
3. Test loading, empty, error, filter, pagination, export, and delete flows against the real backend. Do not report the dashboard as operational before these steps pass.

Activity is consent-based and does not identify a real-world person. The admin can see events from consenting browser sessions, not prove that a particular person visited. Events intentionally omit names, typed text, answers, referrers, scrolling, and keystrokes.

Never put Firebase service-account credentials, admin passwords, or other secrets in `VITE_` variables, source files, or this document. Do not copy values from `.env.local` into documentation or chat. `.env.local` is ignored by Git; keep it that way.

## Stack and commands

- React 19, TypeScript, Vite 8, Firebase Web SDK.
- Node.js 20.19+ or 22.12+ and npm.
- `npm run dev` starts the local Vite server.
- `npm run build` runs `tsc -b` then the Vite production build into `dist/`.
- `npm run preview` previews the production build.
- There is no test or lint script in `package.json`. Run the build for type/build validation; use `node --check` for changed standalone Observatory scripts.
- `npm audit --omit=dev` could not complete in the latest attempt because the npm registry audit request failed; no current vulnerability result is available.
- The latest `npm run build` passes without a chunk-size warning. Firebase dependencies are split into lazy chunks and loaded only for remote activity or the admin route.

This workspace is a Git repository; check `git status` before making changes and do not overwrite unrelated user edits.

## Routes and experiences

The app uses hash routing in `src/App.tsx`:

| Route | Experience |
|---|---|
| `#/` | Birthday landing page with balloon surprises |
| `#/world` | Experience hub |
| `#/sky` | Sky Observatory iframe |
| `#/wallpaper` | Wallpaper scene selector and PNG download |
| `#/garden` | Butterfly/firefly garden |
| `#/note` | Friendship note |
| `#/wishes` | 100 Little Wishes |
| `#/organs` | 100 Organs tribute |
| `#/seasons` | Four Seasons Supremacy iframe |
| `#/activity` | Local/optional remote activity tracker |
| `#/admin` | Incomplete admin activity dashboard |

Important behavior:

- The Sky Observatory is a legacy standalone HTML/CSS/JavaScript experience in `public/observatory/`, embedded by `src/App.tsx`. Keep its parent/iframe `postMessage` origin and source validation intact.
- Four Seasons is embedded by the `/the-god-mode.html` URL, which Vite serves from `public/the-god-mode.html`. There is also a separate root-level `the-god-mode.html`; the files differ. Check which copy is being edited and keep them aligned only when the change requires it.
- The birthday countdown component exists but is not currently included in the live route flow.
- Wallpaper creation is local and downloads a 1080 x 1920 PNG.

## Source map

| Path | Responsibility |
|---|---|
| `src/main.tsx` | React entry point, global stylesheet, page title |
| `src/App.tsx` | Hash routing, shared nav, consent prompt, event collection, iframe message validation |
| `src/styles.css` | Global layout, responsive rules, shared experience styling |
| `src/birthdayContent.ts` | Main page copy and labels |
| `src/gardenContent.ts` | Butterfly/firefly and reflection data |
| `src/organData.ts` | Long-form 100 Organs content |
| `src/wallpaperCanvas.ts` | Wallpaper drawing/export |
| `src/sections/` | React page sections, including tracker/admin components |
| `src/components/SceneArtwork.tsx` | Shared scene artwork |
| `public/observatory/` | Separate legacy Observatory app and its scripts/assets |
| `public/the-god-mode.html` | Live-served Four Seasons experience |
| `the-god-mode.html` | Separate root copy; not automatically the same as the public copy |
| `firestore.rules` | Firestore security rules for activity events |
| `firebase.json`, `.firebaserc` | Firebase CLI rules target and project target |
| `.env.example` | Environment variable template |
| `.env.local` | Local Firebase config; ignored, do not publish |

## Activity tracking data and privacy

Consent keys and local event data are stored in browser `localStorage`:

- `birthday-activity-consent`
- `birthday-activity-log` (capped at 1,000 local events)

The event schema is a server timestamp, page identifier, event type (`page_visit` or `interaction`), and optional sanitized action identifier. Admin queries the most recent 500 remote events. The admin page is excluded from visitor logging.

Keep the consent prompt clear and voluntary. Never turn on tracking by default or collect form contents, identity, keystrokes, answers, or referrers. Stopping local tracking does not erase events already uploaded; the admin must remove those separately.

## Known issues and caution areas

- Admin tracker implementation exists. Firebase services, rules, Auth providers, and Firestore App Check enforcement are configured; local Chrome visitor writes were verified, while authorized dashboard sign-in/read and the deployed host remain unverified.
- The Firebase config in `.env.local` identifies the `mania-4f364` web app; it is not proof that visitor writes and admin reads work.
- Cloud Firestore is active in `asia-south1`; keep activity in Firestore with the restrictive rules in `firestore.rules`.
- The Observatory is a large, globally scripted standalone page. Inspect its script loading and initialization order before refactoring; test its iframe behavior after changes.
- The two Four Seasons HTML files differ. The app embeds the copy under `public/`.
- `src/organData.ts` contains very long, intimate, body-focused writing. The user has previously asked for appreciative, non-romantic wording in related UI. Avoid intensifying romantic/possessive tone; review content changes carefully.
- The user has asked for a Clean View in the Observatory. Preserve access to the sky, note/achievement controls, and a way to leave Clean View when editing that behavior.
- A prior audit PDF exists at `C:\Users\Dell\Desktop\Website_Audit_Report_2026-11-21.pdf`; it reflects an earlier audit, not a guarantee that every listed issue remains current or fixed.

## Working guidance for the next assistant

1. Read the relevant component and its callers before editing. Treat the standalone Observatory as a separate application.
2. Make small, focused changes and preserve existing content/behavior unless the request explicitly changes it.
3. Do not claim Firebase/admin functionality works until a real opt-in write and authorized admin read have both been tested.
4. Do not modify the 100-orgs Realtime Database rules as part of birthday-site work without explicit, narrowly scoped approval and an impact review.
5. Never infer that a tracked browser session belongs to a named person.
6. After code changes, run `npm run build`; run syntax checks for changed plain JavaScript and exercise the relevant route in a browser where possible.

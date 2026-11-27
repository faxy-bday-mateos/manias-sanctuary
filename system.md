# Project Handoff for AI Assistants

Last updated: 2026-11-27

## What this project is

This is a personal birthday website for Manuu. It is an interactive, static-first site with a warm, calm visual style. The main app is built with React, TypeScript, and Vite. It includes a landing page, an experience hub, several small birthday experiences, and an activity tracker.

The site is not a conventional multi-user product. Preserve its personal, gentle tone and avoid adding intrusive analytics, identity tracking, or unrelated features.

## Current status and ongoing work

**Ongoing task: verify the live deployment, authorized admin dashboard access, and cross-device saved-wish progress. The public URL `https://manias-sanctuary.netlify.app` now loads publicly, but the latest check showed an earlier deployed build; the current local changes are not yet confirmed live. 100 Little Wishes now uses canvas scratch cards backed by the shared `wishUnlocks` Firestore collection; the new rule is not deployed yet.**

The latest local birthday-world update adds the “Open When…” letters and a shared twilight/cream/gold visual system. It also removes the Observatory’s decorative custom cursor and mouse-following heart trail. These changes have not been deployed.

The frontend and Firestore adapter have been scaffolded:

- `/admin` (also `/#/admin`) has an admin sign-in and activity dashboard UI. When configured, it shows the latest 100 remote events live, pages through older events, filters by event/page/time/search, summarizes loaded events, exports CSV/JSON labeled with the download date and weekday, and lets the authorized admin delete all remote records.
- After admin sign-in, **Preview sample data** switches the dashboard to generated in-memory page_visit/interaction records with a realistic multi-day timestamp range. It does not write to Firestore or localStorage, does not call the real recording functions, and leaves live activity untouched. **Back to live data** restores the real timeline.
- `src/activityTracker.ts` records page visits and interactions automatically in local storage and dynamically loads Firebase to sync remotely when remote configuration is complete. The visitor opt-in gate and privacy banner were removed.
- `src/firebaseClient.ts` signs visitors in anonymously and writes validated event fields to Firestore. It loads and saves shared wishes under `wishUnlocks/wish-01` through `wishUnlocks/wish-100`.
- `src/sections/WishScratchCard.tsx` draws a Canvas foil cover over each wish. Pointer scratching reveals it after roughly 30% is cleared; Enter/Space also reveals it for keyboard users. The parent merges saved unlocks and writes each new unlock as `{ unlockedAt: serverTimestamp() }`.
- The Observatory iframe forwards sanitized events to the parent app. It does not write to Firebase directly.

The app and Firebase backend are configured for `mania-4f364`, but remote tracking is **not yet verified end-to-end on the deployed site**:

1. The `.firebaserc` target and local `.env.local` project ID match; required local settings are populated, and the local admin UID matches the UID in `firestore.rules`.
2. Cloud Firestore is active in `asia-south1`. Before the saved-wish change, the newest rules revision visible in the Firebase Console matched local `firestore.rules`; the Rules Playground denied an anonymous non-admin read and allowed a request with the configured admin UID. The current local file adds `wishUnlocks` and has not been deployed.
3. Firebase Authentication has Anonymous and Email/Password providers enabled.
4. The Web app is registered with App Check using reCAPTCHA Enterprise; `src/firebaseClient.ts` initializes `ReCaptchaEnterpriseProvider`. Firestore App Check enforcement is enabled.
5. A consented Chrome test successfully wrote a `page_visit` and a control `interaction` event with server timestamps to Firestore while App Check enforcement was enabled. The in-app browser attempt separately failed to obtain an App Check token (`appCheck/recaptcha-error`) and then hit Firebase Auth `auth/network-request-failed`.
6. Firestore Data Console showed the event records. Rules Playground denied an anonymous non-admin read and allowed a read using the configured admin UID. This is a rules simulation, not a live admin dashboard sign-in/read test.
7. The public URL `https://manias-sanctuary.netlify.app` now loads the site. At the latest check it still served the earlier build, so deployment of current local changes must be confirmed. Authorized admin sign-in/read and remote tracking on the deployed host remain unverified. The admin account password is not stored in the project and should not be requested in chat.
8. Keep activity in Cloud Firestore; do not use or change the separate 100-orgs Realtime Database or its rules.

### Next steps for the tracker

1. After publishing the current build, test an automatic write plus authorized admin sign-in/read on the deployed site. The admin account password must be entered only by the authorized admin, never requested in chat.
2. Investigate why the in-app browser reports `appCheck/recaptcha-error`; Chrome already proved a local visitor can obtain a token and write remotely. Keep the site key value out of chat and docs.
3. Test loading, empty, error, filter, pagination, export, and delete flows against the real backend. Do not report the dashboard as operational before these steps pass.

### Next steps for saved wishes

1. Deploy the updated `firestore.rules` with `firebase deploy --only firestore:rules` for `mania-4f364`. A local `npx firebase-tools` attempt failed during package download with `ERR_SSL_CIPHER_OPERATION_FAILED`, so deployment is still pending.
2. In a real browser, scratch a wish, confirm a `wishUnlocks/wish-NN` document with an `unlockedAt` server timestamp, reload, and confirm the card stays revealed. Repeat in a separate browser profile or device to verify shared progress.
3. Check keyboard reveal, touch scratching, resize redraw, and the loading/saving/error status text. Do not claim cross-device persistence until the Firestore rule is deployed and the round trip passes.

Activity is recorded automatically and does not identify a real-world person. The admin can see events from browser sessions, not prove that a particular person visited. Events intentionally omit names, typed text, answers, referrers, scrolling, and keystrokes.

Never put Firebase service-account credentials, admin passwords, or other secrets in `VITE_` variables, source files, or this document. Do not copy values from `.env.local` into documentation or chat. `.env.local` is ignored by Git; keep it that way.

## Stack and commands

- React 19, TypeScript, Vite 8, Firebase Web SDK.
- Node.js 20.19+ or 22.12+ and npm.
- `npm run dev` starts the local Vite server.
- `npm run build` runs `tsc -b` then the Vite production build into `dist/`.
- `npm run preview` previews the production build.
- There is no test or lint script in `package.json`. Run the build for type/build validation; use `node --check` for changed standalone Observatory scripts.
- `npm audit --omit=dev` could not complete in the latest attempt because the npm registry audit request failed; no current vulnerability result is available.
- The latest `npm run build` passes without a chunk-size warning. Firebase dependencies are split into lazy chunks and loaded only for remote activity and admin.

This workspace is a Git repository; check `git status` before making changes and do not overwrite unrelated user edits.

## Routes and experiences

The app uses hash routing in `src/App.tsx`:

| Route | Experience |
|---|---|
| `#/` | Birthday landing page with balloon surprises |
| `#/world` | Experience hub |
| `#/sky` | Sky Observatory iframe |
| `#/garden` | Butterfly/firefly garden with twelve selectable seasonal landscapes |
| `#/note` | Friendship note |
| `#/wishes` | 100 Little Wishes |
| `#/organs` | 100 Organs tribute |
| `#/seasons` | Four Seasons Supremacy iframe |
| `#/openwhen` | Six “Open When…” cards with question-first reminder pop-ups |
| `#/admin` | Admin sign-in and activity dashboard, including in-memory sample preview |

Important behavior:

- The Sky Observatory is a legacy standalone HTML/CSS/JavaScript experience in `public/observatory/`, embedded by `src/App.tsx`. Keep its parent/iframe `postMessage` origin and source validation intact.
- Four Seasons is embedded by the `/the-god-mode.html` URL, which Vite serves from `public/the-god-mode.html`. Keep the root-level `the-god-mode.html` copy aligned with the public copy when changing its design or behavior.
- The Observatory retains its sky scenes, controls, and navigation; the custom meme cursor and mouse-following heart trail were removed to bring its visual tone closer to the birthday world.
- Until the configured birthday (`src/birthdayContent.ts`), a full-screen countdown gate covers every route and locks page scrolling. It has no bypass; on the configured local calendar date (November 30), it disappears automatically. The hero has a long birthday paragraph, animated particle fireworks, and a decorated cake button that opens the candle/song dialog; on the birthday, fireworks become denser, and the birthday welcome and garland appear. Keep `isBirthdayToday` aligned with the configured month and day when changing countdown behavior.
- The Friendship Note ends with a styled keepsake explaining why the friendship matters, including that they have not met face-to-face. Keep future edits honest to that context and avoid inventing personal details.
- After the Friendship Note's three games are completed, falling heart/flower stickers and gentle fireworks appear behind the keepsake. Keep these effects limited to the revealed note and honor reduced-motion preferences.
- The World Landing experience hub places a dense layer of low-contrast floating birthday phrases behind its cards in `src/App.tsx` and `src/styles.css`; keep the text decorative, non-interactive, and behind the cards.
- The homepage includes a short birthday paragraph in the hero and a full birthday keepsake after it. The text lives in `src/birthdayContent.ts`; it explicitly reflects their friendship and that they have not met in person.
- The Butterfly Garden lets visitors select or randomize twelve day/night and weather landscapes. A snowy cabin is featured on the landing page.

## Source map

| Path | Responsibility |
|---|---|
| `src/main.tsx` | React entry point, global stylesheet, page title |
| `src/App.tsx` | Hash routing, shared nav, automatic event collection, iframe message validation |
| `src/styles.css` | Global layout, responsive rules, shared experience styling |
| `src/birthdayContent.ts` | Main page copy and labels |
| `src/gardenContent.ts` | Butterfly/firefly and reflection data |
| `src/organData.ts` | Long-form 100 Organs content |
| `src/openWhenLetters.ts` | Copy for the six question-first “Open When…” notes |
| `src/sections/OpenWhenLetters.tsx` | Accessible “Open When…” cards and question-first reminder dialog |
| `src/sections/WishScratchCard.tsx` | Canvas scratch cover and keyboard reveal for one wish |
| `src/seasonalScenery.ts` | Garden landscape and weather artwork |
| `src/sections/` | React page sections, including tracker/admin components |
| `src/components/SceneArtwork.tsx` | Shared scene artwork |
| `public/observatory/` | Separate legacy Observatory app and its scripts/assets |
| `public/the-god-mode.html` | Live-served Four Seasons experience |
| `the-god-mode.html` | Root copy kept aligned with the public Four Seasons experience |
| `firestore.rules` | Firestore security rules for activity events and saved wishes |
| `firebase.json`, `.firebaserc` | Firebase CLI rules target and project target |
| `.env.example` | Environment variable template |
| `.env.local` | Local Firebase config; ignored, do not publish |

## Activity tracking data and privacy

Local event data is stored in browser `localStorage` under `birthday-activity-log` (capped at 1,000 local events). The old `birthday-activity-consent` key may remain in browsers but is no longer read; the opt-in gate was removed at the site owner's request.

The event schema is a server timestamp, page identifier, event type (`page_visit` or `interaction`), and optional sanitized action identifier. Admin queries the most recent 100 remote events live and can page through older events. The admin page is excluded from visitor logging.

## Saved wish data

Unlocked wishes are stored in `wishUnlocks/{wishId}` where `wishId` is `wish-01` through `wish-100`. Each document contains only `unlockedAt`, written with a server timestamp. The collection is intentionally shared across all visitors so progress follows the site between devices; it is not tied to a named person or to the anonymous Auth UID. The rule allows any authenticated visitor to read the collection and to create/update a valid wish ID with only `unlockedAt == request.time`; only the admin can delete. Local UI state reveals cards immediately, then merges the saved set on load. Without Firebase, cards work only for the current visit.

## Known issues and caution areas

- The Wallpaper Studio and its photo upload/history feature have been removed. Historical Firestore data and rules are unchanged; no app code reads or writes those uploads.
- Admin tracker implementation exists. Firebase services, rules, Auth providers, and Firestore App Check enforcement are configured; local Chrome visitor writes were verified, while authorized dashboard sign-in/read and the deployed host remain unverified.
- The Firebase config in `.env.local` identifies the `mania-4f364` web app; it is not proof that visitor writes and admin reads work.
- The `wishUnlocks` rule exists only in local `firestore.rules` so far. Cross-device wish persistence will fail until it is deployed. No browser round trip has verified scratch, save, reload, or a second device.
- Cloud Firestore is active in `asia-south1`; keep activity in Firestore with the restrictive rules in `firestore.rules`.
- The Observatory is a large, globally scripted standalone page. Inspect its script loading and initialization order before refactoring; test its iframe behavior after changes.
- The two Four Seasons HTML files differ. The app embeds the copy under `public/`.
- `src/organData.ts` has been rewritten as non-sexual, non-romantic organ/body appreciation. Its prologue is one friendship-blessing paragraph. Keep this tone; do not reintroduce sexual or love/romantic content.
- The user has asked for a Clean View in the Observatory. Preserve access to the sky, note/achievement controls, and a way to leave Clean View when editing that behavior.
- A prior audit PDF exists at `C:\Users\Dell\Desktop\Website_Audit_Report_2026-11-21.pdf`; it reflects an earlier audit, not a guarantee that every listed issue remains current or fixed.

## Working guidance for the next assistant

1. Read the relevant component and its callers before editing. Treat the standalone Observatory as a separate application.
2. Make small, focused changes and preserve existing content/behavior unless the request explicitly changes it.
3. Do not claim Firebase/admin functionality works until a real automatic write, authorized admin read, and saved-wish unlock/reload/second-device round trip have all been tested.
4. Do not modify the 100-orgs Realtime Database rules as part of birthday-site work without explicit, narrowly scoped approval and an impact review.
5. Never infer that a tracked browser session belongs to a named person.
6. After code changes, run `npm run build`; run syntax checks for changed plain JavaScript and exercise the relevant route in a browser where possible.

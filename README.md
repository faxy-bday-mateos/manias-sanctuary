# Happy Birthday, Manuu

A calm, responsive birthday site built with Vite, React, and TypeScript. It includes a birthday home, an experience hub, an interactive sky observatory, seasonal skies, a butterfly garden with twelve selectable landscapes, a friendship note, six “Open When…” letters, 100 scratch-to-reveal Little Wishes, 100 Organs, and an activity tracker. Before the birthday, the home page opens with a live countdown that can be dismissed with **Enter the birthday world**; on the configured birthday, it reveals a birthday-day welcome with extra fireworks and decorations. The homepage features a snowy cabin scene, and its cake opens a candle-wish celebration with a locally synthesized Happy Birthday melody. Visuals are drawn locally with CSS, SVG, and Canvas. Remote activity reporting and saved wish unlocks require a separately configured Firebase project.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

From the project directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build and preview

Create the production site:

```bash
npm run build
```

Vite writes the static site to `dist/`. To test the production build locally:

```bash
npm run preview
```

## Deploy to a static host

Build the site with `npm run build`, then publish the contents of `dist/` to a static web host. The site works without Firebase; remote activity reporting remains disabled until configured.

For Netlify, either:

- Connect this repository, set the build command to `npm run build`, and the publish directory to `dist`; or
- Run the build locally and upload the generated `dist/` directory using Netlify's manual deploy.

The project is not deployed by these instructions.

## Remote activity dashboard

The activity tracker logs page visits and control clicks/changes automatically. It does not collect identity, referrers, typed text, puzzle answers, scrolling, or keystrokes. Without Firebase configuration, the log remains local to that browser. With Firebase configured, events are sent to a protected Firestore collection and can be viewed at `/admin` (or `/#/admin`).

The tracker is configured for the Firebase project `mania-4f364` and stores activity in the `activityEvents` Cloud Firestore collection. Keep this data in Firestore; do not use or change the separate 100-orgs Realtime Database or its rules.

## Saved wishes

Each of the 100 Little Wishes is hidden under a scratch card. Unlocking one writes a small document to `wishUnlocks/wish-01` through `wishUnlocks/wish-100` in Firestore, with only an `unlockedAt` server timestamp. The collection is shared by every visitor, so the same unlocks appear on any device that opens the site; it is not a per-person account. Without Firebase configuration or Anonymous Auth, cards still work locally for the current visit but do not persist. The local `firestore.rules` includes the `wishUnlocks` rule; deploy it with `firebase deploy --only firestore:rules` before relying on cross-device progress.

## Butterfly Garden progress

The Butterfly Garden has three storybook habitats, an island that visually blooms as visitors are discovered, and a field journal with each visitor’s colors, natural range, encounter tier, and saved reflection. The collection is stored in that browser’s local storage only; it is not sent to Firebase and does not sync across devices.

The garden also has twelve selectable landscapes with different times of day and weather, including snowfall, rain, mist, and autumn leaves. Use the landscape selector or **Surprise me** to change the scene. The snowy cabin and aurora are also featured in the landing-page hero.

The admin UI at `/admin` provides a live timeline (latest 100 records, with older-page loading), page/event/time/search filters, summary counts, and CSV/JSON export labeled with the download date and weekday. After sign-in, **Preview sample data** shows generated in-memory records for exploring the controls without writing to Firestore or changing live activity; **Back to live data** returns to the real timeline.

Firebase project `mania-4f364` has Cloud Firestore in `asia-south1`, Anonymous and Email/Password Authentication enabled, and the registered `mania Web App` configured in ignored `.env.local`. Firestore App Check uses the registered reCAPTCHA Enterprise provider and is enforced. The previously verified Firestore Rules Console revision covered activity and legacy wallpaper-upload data; the wallpaper upload feature has since been removed, while the newer local `firestore.rules` also adds `wishUnlocks` and must be deployed before cross-device wish progress is reliable. The Rules Playground denied an anonymous non-admin read and allowed a request with the configured admin UID. Activity data stays in Cloud Firestore; do not use or change the separate 100-orgs Realtime Database or its rules.

**The site is live at https://manias-sanctuary.netlify.app and is publicly accessible.** The latest check showed the earlier deployed build; the current local changes have not yet been confirmed on the live site. Local remote visitor writes are verified: in Chrome, a visitor generated a `page_visit` and a control `interaction` record in Firestore with server timestamps while Firestore App Check enforcement was on. The Rules Playground denied a non-admin read and allowed the configured admin UID. An in-app browser attempt separately failed at reCAPTCHA token acquisition (`appCheck/recaptcha-error`) and Firebase Auth (`auth/network-request-failed`). Authorized admin dashboard sign-in/read and remote tracking on the deployed host remain unverified.

On a clean checkout, copy `.env.example` to `.env.local` and fill in the Web app config, exact admin UID, and reCAPTCHA Enterprise site key. `.env.local` is ignored by Git, and `.env.example` contains placeholders only. The Firebase Web API key and App Check site key are client identifiers, not admin secrets. Never put service-account keys or admin passwords in `VITE_` variables or source control. Configure hosting build variables only when preparing a requested site deployment; the Firebase CLI target is `mania-4f364`.

Activity is recorded automatically; there is no visitor opt-in control. Events are not tied to a real-world identity, and browser-side event reporting is not proof of who used the site. The admin can delete all remote activity events from the dashboard.

## Editing

- All editable page copy and labels: `src/birthdayContent.ts`
- Butterfly species, encounter tiers, regions, and garden reflections: `src/gardenContent.ts`
- The 100 Organs page's grouped tribute text: `src/organData.ts`
- The “Open When…” letter text: `src/openWhenLetters.ts`
- Global styles and responsive layout: `src/styles.css`
- The “Open When…” letter experience: `src/sections/OpenWhenLetters.tsx`
- Page sections: `src/sections/`
- Garden landscapes and weather effects: `src/seasonalScenery.ts`
- Homepage keepsake canvas artwork and PNG export: `src/homeKeepsakeCanvas.ts`
- Scratch-card canvas and unlock interaction: `src/sections/WishScratchCard.tsx`
- Firebase activity and saved-wish persistence: `src/firebaseClient.ts`

The 100 Organs page uses local React content and includes an optional Matrix Rain canvas with selectable visual modes; the effect is loaded only on that page and is stopped and cleaned up when you leave. The 100 Little Wishes page keeps local UI state and loads/saves unlock progress through Firebase when configured. The separate Observatory has its own legacy scripts; activity is forwarded to the same-origin app.

## Visual style and Open When letters

The site keeps a twilight storybook look, with shared indigo, teal, cream, and gold design tokens in `src/styles.css`; individual experiences can keep their own paper, garden, or night-sky atmosphere. The Four Seasons page uses the same palette and serif heading style. The Observatory keeps its immersive sky and controls, with the decorative custom cursor and mouse-following heart trail removed.

The Experience Hub includes six “Open When…” cards. Each card says “Open when you are…”; selecting “Read & cheer” opens a question-first pop-up, then reveals the reminder. The original three reminder texts are preserved, with three additional notes. The wording is intentionally general and does not assume an in-person relationship or specific details about her appearance or experiences.

These changes are local until a new build is published. The current local preview and production build do not update the hosted site by themselves.

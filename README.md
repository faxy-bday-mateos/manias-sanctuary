# Happy Birthday, Manuu

A calm, responsive birthday site built with Vite, React, and TypeScript. It includes a birthday home, an experience hub, an interactive sky observatory, seasonal skies, a butterfly garden, a friendship note, 100 Little Wishes, 100 Organs, wallpaper creation, and an optional activity tracker. Visuals are drawn locally with CSS, SVG, and Canvas. Remote activity reporting is optional and requires a separately configured Firebase project.

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

## Optional remote activity dashboard

The activity tracker asks visitors for opt-in consent before logging page visits and control clicks/changes. It does not collect identity, referrers, typed text, puzzle answers, scrolling, or keystrokes. Without Firebase configuration, the opt-in log remains local to that browser. With Firebase configured, consented events are sent to a protected Firestore collection and can be viewed at `/#/admin`.

The tracker is configured for the Firebase project `mania-4f364` and stores activity in the `activityEvents` Cloud Firestore collection. Keep visitor activity in Firestore; do not use or change the separate 100-orgs Realtime Database or its rules.

The admin UI at `/#/admin` provides a live timeline (latest 100 records, with older-page loading), page/event/time/search filters, summary counts, CSV/JSON export, and admin-only bulk deletion.

Firebase project `mania-4f364` has Cloud Firestore in `asia-south1`, Anonymous and Email/Password Authentication enabled, and the registered `mania Web App` configured in ignored `.env.local`. Firestore App Check uses the registered reCAPTCHA Enterprise provider and is enforced. The latest Firestore Rules Console revision matches `firestore.rules`; the Rules Playground denied an anonymous non-admin read and allowed a request with the configured admin UID. Activity data stays in Cloud Firestore; do not use or change the separate 100-orgs Realtime Database or its rules.

**The site owner reports that the site is live at https://manias-sanctuary.netlify.app.** That URL currently returns HTTP 401 and redirects to Netlify's “This site is private” page, which requires an invited Netlify account; the deployed content cannot be inspected without access. Local remote visitor writes are verified: in Chrome, an opted-in visitor generated a `page_visit` and a control `interaction` record in Firestore with server timestamps while Firestore App Check enforcement was on. The Rules Playground denied a non-admin read and allowed the configured admin UID. An in-app browser attempt separately failed at reCAPTCHA token acquisition (`appCheck/recaptcha-error`) and Firebase Auth (`auth/network-request-failed`). Authorized admin dashboard sign-in/read and remote tracking on the deployed host remain unverified.

On a clean checkout, copy `.env.example` to `.env.local` and fill in the Web app config, exact admin UID, and reCAPTCHA Enterprise site key. `.env.local` is ignored by Git, and `.env.example` contains placeholders only. The Firebase Web API key and App Check site key are client identifiers, not admin secrets. Never put service-account keys or admin passwords in `VITE_` variables or source control. Configure hosting build variables only when preparing a requested site deployment; the Firebase CLI target is `mania-4f364`.

Visitors can stop tracking and clear their local copy at Activity Tracker. Already-submitted remote events remain until the admin deletes them there. Events are not tied to a real-world identity, and browser-side event reporting is not proof of who used the site.

## Editing

- All editable page copy and labels: `src/birthdayContent.ts`
- Butterfly species, encounter tiers, regions, and garden reflections: `src/gardenContent.ts`
- The 100 Organs page's grouped tribute text: `src/organData.ts`
- Global styles and responsive layout: `src/styles.css`
- Page sections: `src/sections/`
- Local wallpaper drawing and PNG export: `src/wallpaperCanvas.ts`

The 100 Organs page uses local React content. The separate Observatory has its own legacy scripts; visitor activity is consent-gated and forwarded to the same-origin app only for opted-in sessions.

The wallpaper downloads as `manuu-birthday-wallpaper.png` at 1080 × 1920 pixels.

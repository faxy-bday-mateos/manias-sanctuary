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

The admin UI at `/#/admin` provides a live timeline (latest 100 records, with older-page loading), page/event/time/search filters, summary counts, CSV/JSON export, and admin-only bulk deletion. The Firebase backend is configured, but end-to-end visitor writes, admin reads, and deployment settings have not been verified.

1. Cloud Firestore is created in project `mania-4f364` in `asia-south1`; leave any Realtime Database and its rules unchanged.
2. Firebase Authentication has **Anonymous** and **Email/Password** providers enabled. The existing admin account UID is configured in `firestore.rules`.
3. The local `firestore.rules` have been published to Cloud Firestore. They allow anonymous-authenticated visitors to create only small, validated activity events; only the configured admin UID may read or delete them.
4. The Web app is registered in App Check with **Fraud Defense (reCAPTCHA Enterprise)**. The client initializes `ReCaptchaEnterpriseProvider`, and Firestore App Check enforcement is enabled.
5. This workspace's ignored `.env.local` is populated for `mania-4f364`; verify its Web app config, admin UID, and App Check site key match Firebase Console. On a clean checkout, copy `.env.example` to `.env.local` and fill in all values. The Firebase Web API key and App Check site key are client identifiers, not admin secrets. Never put service-account keys or admin passwords in `VITE_` variables or source control. `.env.local` is ignored by Git.
6. Add the same `VITE_FIREBASE_*` values to the static host's build environment and rebuild/redeploy. Before calling the remote tracker operational, test an opted-in visitor write and an authorized admin read. The `/#/admin` page shows remote events only to the UID allowed by Firestore rules.

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

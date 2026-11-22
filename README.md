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

The tracker uses the existing Firebase project `faxy-ash`, but stores activity in a separate Cloud Firestore collection. The 100-orgs project's Realtime Database has a root-level public-read rule; do not store visitor activity in that database or loosen its existing rules. The birthday site's Firestore rules are separate and restrict reading/deleting activity to the configured admin UID.

The admin UI at `/#/admin` provides a live timeline (latest 100 records, with older-page loading), page/event/time/search filters, summary counts, CSV/JSON export, and admin-only bulk deletion. It is not operational until Firestore, Auth, App Check, and deployment settings below are configured and tested.

1. In Firebase Console, enable/create Cloud Firestore in project `faxy-ash` if it is not already enabled. Leave the existing Realtime Database and its rules unchanged.
2. Ensure Firebase Authentication has **Anonymous** and **Email/Password** providers enabled. Use the existing admin account whose UID is configured in `firestore.rules`, or update that rule to the exact UID of the admin account you intend to use.
3. Publish this project's `firestore.rules` to Cloud Firestore (Firebase Console → Firestore Database → Rules). The rules allow signed-in visitors to create only small, validated activity events; only the configured admin UID may read or delete them. The Firebase CLI target is `faxy-ash`.
4. Configure Firebase App Check with reCAPTCHA v3 for the Web app and enable App Check enforcement for Firestore before enabling remote visitor logging.
5. This workspace's ignored `.env.local` is prefilled with the existing Web app config and admin UID; add the reCAPTCHA v3 site key as `VITE_FIREBASE_APPCHECK_SITE_KEY`. On a clean checkout, copy `.env.example` to `.env.local` and fill in all values. The Firebase Web API key and App Check site key are client identifiers, not admin secrets. Never put service-account keys or admin passwords in `VITE_` variables or source control. `.env.local` is ignored by Git.
6. Add the same `VITE_FIREBASE_*` values to the static host's build environment and rebuild/redeploy. The `/#/admin` page uses Firebase Authentication and shows remote events only to the UID allowed by Firestore rules.

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

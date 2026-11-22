export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredConfig = Object.values(firebaseConfig)
export const adminUid = import.meta.env.VITE_FIREBASE_ADMIN_UID?.trim() || ''
export const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY?.trim() || ''
export const firebaseAppConfigured = requiredConfig.every(Boolean)
export const remoteActivityConfigured = requiredConfig.every(Boolean) && Boolean(adminUid) && Boolean(appCheckSiteKey)
export const missingFirebaseSettings = [
  ...Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`),
  ...(!adminUid ? ['VITE_FIREBASE_ADMIN_UID'] : []),
  ...(!appCheckSiteKey ? ['VITE_FIREBASE_APPCHECK_SITE_KEY'] : []),
]

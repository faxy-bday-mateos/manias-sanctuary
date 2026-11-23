import { getApp, getApps, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
} from 'firebase/auth'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'
import { appCheckSiteKey, firebaseAppConfigured, firebaseConfig } from './firebase'

const app = firebaseAppConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

if (app && appCheckSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
}

export const firebaseAuth = app ? getAuth(app) : null
export const firestore = app ? getFirestore(app) : null

let anonymousSignIn: Promise<void> | null = null

export async function saveRemoteActivity(event: {
  page: string
  type: 'page_visit' | 'interaction'
  action?: string
}) {
  if (!firebaseAuth || !firestore) throw new Error('Firebase is not configured.')

  if (!firebaseAuth.currentUser) {
    if (!anonymousSignIn) {
      anonymousSignIn = setPersistence(firebaseAuth, browserSessionPersistence)
        .then(() => signInAnonymously(firebaseAuth))
        .then(() => undefined)
        .catch((error: unknown) => {
          anonymousSignIn = null
          throw error
        })
    }
    await anonymousSignIn
  }

  await addDoc(collection(firestore, 'activityEvents'), {
    timestamp: serverTimestamp(),
    page: event.page,
    type: event.type,
    ...(event.action ? { action: event.action } : {}),
  })
}

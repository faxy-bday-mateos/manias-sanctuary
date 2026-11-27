import { getApp, getApps, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
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

async function ensureRemoteUser() {
  if (!firebaseAuth) throw new Error('Firebase is not configured.')
  if (!firebaseAuth.currentUser) {
    if (!anonymousSignIn) {
      anonymousSignIn = setPersistence(firebaseAuth, browserLocalPersistence)
        .then(() => signInAnonymously(firebaseAuth))
        .then(() => undefined)
        .finally(() => {
          anonymousSignIn = null
        })
    }
    await anonymousSignIn
  }
  if (!firebaseAuth.currentUser) throw new Error('Could not start a visitor session.')
  return firebaseAuth.currentUser
}

export async function saveRemoteActivity(event: {
  page: string
  type: 'page_visit' | 'interaction'
  action?: string
}) {
  if (!firestore) throw new Error('Firebase is not configured.')
  const user = await ensureRemoteUser()
  if (!user.isAnonymous) return

  await addDoc(collection(firestore, 'activityEvents'), {
    timestamp: serverTimestamp(),
    page: event.page,
    type: event.type,
    ...(event.action ? { action: event.action } : {}),
  })
}

export async function loadUnlockedWishes(): Promise<number[]> {
  if (!firestore) return []
  await ensureRemoteUser()
  const snapshot = await getDocs(collection(firestore, 'wishUnlocks'))
  return snapshot.docs.flatMap((document) => {
    const match = /^wish-(\d{2,3})$/.exec(document.id)
    const wishNumber = Number(match?.[1])
    return Number.isInteger(wishNumber) && wishNumber >= 1 && wishNumber <= 100 ? [wishNumber] : []
  })
}

export async function saveWishUnlock(wishNumber: number) {
  if (!firestore) throw new Error('Firebase is not configured.')
  if (!Number.isInteger(wishNumber) || wishNumber < 1 || wishNumber > 100) {
    throw new Error('Invalid wish number.')
  }
  await ensureRemoteUser()
  await setDoc(doc(firestore, 'wishUnlocks', `wish-${String(wishNumber).padStart(2, '0')}`), {
    unlockedAt: serverTimestamp(),
  })
}

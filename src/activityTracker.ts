import { remoteActivityConfigured } from './firebase'

export type RemoteActivityStatus = 'syncing' | 'synced' | 'error'

export type ActivityEvent = {
  timestamp: number
  page: string
  type: 'page_visit' | 'interaction'
  action?: string
}

const EVENTS_KEY = 'birthday-activity-log'
const MAX_EVENTS = 1000
let pendingRemoteSaves = 0
let remoteSaveFailed = false
let currentRemoteActivityStatus: RemoteActivityStatus | null = null

function notifyChange() {
  window.dispatchEvent(new Event('birthday-activity-change'))
}

function notifyRemoteStatus(status: RemoteActivityStatus) {
  currentRemoteActivityStatus = status
  window.dispatchEvent(new CustomEvent<RemoteActivityStatus>('birthday-activity-sync', { detail: status }))
}

export function getRemoteActivityStatus() {
  return currentRemoteActivityStatus
}

export function getActivityEvents(): ActivityEvent[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((event): event is ActivityEvent =>
      typeof event === 'object' &&
      event !== null &&
      typeof event.timestamp === 'number' &&
      typeof event.page === 'string' &&
      (event.type === 'page_visit' || event.type === 'interaction') &&
      (event.action === undefined || typeof event.action === 'string'),
    )
  } catch {
    return []
  }
}

function saveEvent(event: ActivityEvent) {
  try {
    const events = getActivityEvents()
    events.push(event)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
    notifyChange()
  } catch (error) {
    console.warn('Could not save the local activity log.', error)
  }

  if (remoteActivityConfigured) {
    pendingRemoteSaves += 1
    notifyRemoteStatus('syncing')
    void import('./firebaseClient')
      .then(({ saveRemoteActivity }) => saveRemoteActivity(event))
      .then(() => {
        remoteSaveFailed = false
      })
      .catch((error: unknown) => {
        console.error('Could not sync activity to the remote admin log.', error)
        remoteSaveFailed = true
      })
      .finally(() => {
        pendingRemoteSaves -= 1
        notifyRemoteStatus(pendingRemoteSaves > 0 ? 'syncing' : remoteSaveFailed ? 'error' : 'synced')
      })
  }
}

export function recordPageVisit(page: string) {
  saveEvent({ timestamp: Date.now(), page, type: 'page_visit' })
}

export function recordInteraction(page: string, action: string) {
  saveEvent({ timestamp: Date.now(), page, type: 'interaction', action })
}

export function clearActivityEvents() {
  try {
    localStorage.removeItem(EVENTS_KEY)
  } catch (error) {
    console.warn('Could not clear the local activity log.', error)
  }
  notifyChange()
}

export function exportActivityEvents() {
  const blob = new Blob([JSON.stringify(getActivityEvents(), null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'birthday-activity-log.json'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

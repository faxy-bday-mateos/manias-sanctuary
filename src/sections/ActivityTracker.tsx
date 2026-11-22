import { useEffect, useState } from 'react'
import {
  clearActivityEvents,
  exportActivityEvents,
  getActivityConsent,
  getActivityEvents,
  getRemoteActivityStatus,
  setActivityConsent,
  type ActivityConsent,
  type ActivityEvent,
  type RemoteActivityStatus,
} from '../activityTracker'
import { remoteActivityConfigured } from '../firebase'

function pageName(page: string) {
  if (page === 'home') return 'Birthday home'
  if (page === 'world') return 'Birthday world'
  if (page === 'activity') return 'Activity tracker'
  return page.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function ActivityTracker() {
  const [consent, setConsent] = useState<ActivityConsent>(getActivityConsent)
  const [events, setEvents] = useState<ActivityEvent[]>(getActivityEvents)
  const [syncStatus, setSyncStatus] = useState<RemoteActivityStatus | null>(getRemoteActivityStatus)

  useEffect(() => {
    const refresh = () => {
      setConsent(getActivityConsent())
      setEvents(getActivityEvents())
    }
    window.addEventListener('birthday-activity-change', refresh)
    window.addEventListener('storage', refresh)
    const onSync = (event: Event) => {
      setSyncStatus((event as CustomEvent<'syncing' | 'synced' | 'error'>).detail)
    }
    window.addEventListener('birthday-activity-sync', onSync)
    return () => {
      window.removeEventListener('birthday-activity-change', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('birthday-activity-sync', onSync)
    }
  }, [])

  function optIn() {
    setActivityConsent('accepted')
    setConsent('accepted')
  }

  function stopAndDelete() {
    setActivityConsent('declined')
    clearActivityEvents()
    setConsent('declined')
    setEvents([])
  }

  return (
    <section className="activity-tracker" aria-labelledby="activity-title">
      <header className="activity-tracker__heading">
        <p className="eyebrow">Optional · consent-based activity log</p>
        <h1 id="activity-title">Activity tracker</h1>
        <p>
          With permission, the site records page visits and clicks or changes
          to interface controls. It does not record identity, typed text,
          answers, scrolling, keystrokes, or referrers.
        </p>
      </header>

      <div className="activity-tracker__controls">
        {consent === 'accepted' ? (
          <p role="status">
            Tracking is on for this browser{remoteActivityConfigured ? ' with remote admin sync' : ' only'}.
          </p>
        ) : (
          <p role="status">
            Tracking is off. {consent === 'declined' ? 'You opted out.' : 'No choice has been made.'}
          </p>
        )}
        {consent !== 'accepted' && (
          <button type="button" data-activity-ignore onClick={optIn}>
            Opt in on this device
          </button>
        )}
        <button type="button" data-activity-ignore onClick={exportActivityEvents} disabled={!events.length}>
          Export local log
        </button>
        <button type="button" data-activity-ignore onClick={stopAndDelete} disabled={consent !== 'accepted' && !events.length}>
          Stop tracking and clear local log
        </button>
      </div>

      {remoteActivityConfigured && consent === 'accepted' && (
        <p className={`activity-tracker__sync activity-tracker__sync--${syncStatus || 'ready'}`} role="status">
          {syncStatus === 'error'
            ? 'Remote sync failed. Your local log is still available; check Firebase configuration.'
            : syncStatus === 'syncing'
              ? 'Sending consented activity to the protected admin log…'
              : 'Remote admin logging is configured for consenting visitors.'}
        </p>
      )}
      <p className="activity-tracker__limitation">
        {remoteActivityConfigured
          ? 'The authorized site admin can view remotely submitted events. Stopping tracking prevents future events; ask the admin to delete already submitted records.'
          : 'Remote reporting is not configured. Records stay in this browser and are not visible to the site owner on another device.'}
      </p>
      <a className="activity-tracker__admin-link" href="#/admin" data-activity-ignore>
        Admin sign-in
      </a>

      {events.length ? (
        <ol className="activity-tracker__list" reversed>
          {[...events].reverse().map((event, index) => (
            <li key={`${event.timestamp}-${index}`}>
              <time dateTime={new Date(event.timestamp).toISOString()}>
                {new Date(event.timestamp).toLocaleString()}
              </time>
              <span>
                {event.type === 'page_visit'
                  ? `Visited ${pageName(event.page)}`
                  : `Used ${event.action || 'a control'} on ${pageName(event.page)}`}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="activity-tracker__empty">
          No activity has been recorded in this browser.
        </p>
      )}
    </section>
  )
}

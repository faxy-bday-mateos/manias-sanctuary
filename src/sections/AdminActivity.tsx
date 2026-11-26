import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { adminUid, missingFirebaseSettings, remoteActivityConfigured } from '../firebase'
import { firebaseAuth, firestore } from '../firebaseClient'

type RemoteActivityEvent = {
  id: string
  timestamp: number
  page: string
  type: 'page_visit' | 'interaction'
  action?: string
}

type EventFilter = 'all' | 'page_visit' | 'interaction'
type TimeFilter = 'all' | '24h' | '7d' | '30d'

const PAGE_SIZE = 100
const PAGE_LABELS: Record<string, string> = {
  home: 'Birthday home',
  world: 'Birthday world',
  sky: 'Sky Observatory',
  'sky-observatory': 'Sky Observatory',
  wallpaper: 'Wallpaper Studio',
  garden: 'Butterfly Garden',
  note: 'A Note for You',
  wishes: '100 Little Wishes',
  organs: '100 Organs',
  seasons: 'Four Seasons Supremacy',
  activity: 'Activity Tracker',
}

const SAMPLE_ACTIVITY: {
  minutesAgo: number
  page: string
  type: RemoteActivityEvent['type']
  action?: string
}[] = [
  { minutesAgo: 20160, page: 'home', type: 'page_visit' },
  { minutesAgo: 20158, page: 'world', type: 'page_visit' },
  { minutesAgo: 20155, page: 'garden', type: 'page_visit' },
  { minutesAgo: 20152, page: 'garden', type: 'interaction', action: 'catch-butterfly' },
  { minutesAgo: 20148, page: 'note', type: 'page_visit' },
  { minutesAgo: 17280, page: 'home', type: 'page_visit' },
  { minutesAgo: 17277, page: 'wallpaper', type: 'page_visit' },
  { minutesAgo: 17274, page: 'wallpaper', type: 'interaction', action: 'choose-scene-ocean' },
  { minutesAgo: 17270, page: 'wallpaper', type: 'interaction', action: 'download-birthday-wallpaper' },
  { minutesAgo: 14400, page: 'home', type: 'page_visit' },
  { minutesAgo: 14397, page: 'wishes', type: 'page_visit' },
  { minutesAgo: 14392, page: 'wishes', type: 'interaction', action: 'turn-wish-page' },
  { minutesAgo: 14388, page: 'wishes', type: 'interaction', action: 'bookmark-wish' },
  { minutesAgo: 11520, page: 'home', type: 'page_visit' },
  { minutesAgo: 11515, page: 'organs', type: 'page_visit' },
  { minutesAgo: 11510, page: 'organs', type: 'interaction', action: 'next-organ-page' },
  { minutesAgo: 10080, page: 'home', type: 'page_visit' },
  { minutesAgo: 10076, page: 'seasons', type: 'page_visit' },
  { minutesAgo: 10072, page: 'seasons', type: 'interaction', action: 'change-season' },
  { minutesAgo: 10068, page: 'seasons', type: 'interaction', action: 'change-weather' },
  { minutesAgo: 7200, page: 'home', type: 'page_visit' },
  { minutesAgo: 7196, page: 'sky', type: 'page_visit' },
  { minutesAgo: 7194, page: 'sky-observatory', type: 'page_visit' },
  { minutesAgo: 7190, page: 'sky-observatory', type: 'interaction', action: 'toggle-constellation' },
  { minutesAgo: 7186, page: 'sky-observatory', type: 'interaction', action: 'clean-view' },
  { minutesAgo: 5760, page: 'home', type: 'page_visit' },
  { minutesAgo: 5755, page: 'garden', type: 'page_visit' },
  { minutesAgo: 5750, page: 'garden', type: 'interaction', action: 'release-firefly' },
  { minutesAgo: 4320, page: 'home', type: 'page_visit' },
  { minutesAgo: 4316, page: 'world', type: 'page_visit' },
  { minutesAgo: 4312, page: 'world', type: 'interaction', action: 'open-note' },
  { minutesAgo: 4308, page: 'note', type: 'page_visit' },
  { minutesAgo: 4303, page: 'note', type: 'interaction', action: 'read-letter' },
  { minutesAgo: 2880, page: 'home', type: 'page_visit' },
  { minutesAgo: 2876, page: 'wallpaper', type: 'page_visit' },
  { minutesAgo: 2872, page: 'wallpaper', type: 'interaction', action: 'choose-scene-room' },
  { minutesAgo: 2868, page: 'wallpaper', type: 'interaction', action: 'upload-wallpaper-photo' },
  { minutesAgo: 1440, page: 'home', type: 'page_visit' },
  { minutesAgo: 1436, page: 'garden', type: 'page_visit' },
  { minutesAgo: 1431, page: 'garden', type: 'interaction', action: 'find-butterfly' },
  { minutesAgo: 1426, page: 'wishes', type: 'page_visit' },
  { minutesAgo: 1421, page: 'wishes', type: 'interaction', action: 'turn-wish-page' },
  { minutesAgo: 360, page: 'home', type: 'page_visit' },
  { minutesAgo: 355, page: 'world', type: 'page_visit' },
  { minutesAgo: 350, page: 'sky', type: 'page_visit' },
  { minutesAgo: 345, page: 'sky-observatory', type: 'interaction', action: 'open-star-map' },
  { minutesAgo: 180, page: 'home', type: 'page_visit' },
  { minutesAgo: 175, page: 'note', type: 'page_visit' },
  { minutesAgo: 170, page: 'note', type: 'interaction', action: 'play-note-music' },
  { minutesAgo: 45, page: 'home', type: 'page_visit' },
  { minutesAgo: 41, page: 'wallpaper', type: 'page_visit' },
  { minutesAgo: 37, page: 'wallpaper', type: 'interaction', action: 'choose-scene-night' },
  { minutesAgo: 20, page: 'wallpaper', type: 'interaction', action: 'download-birthday-wallpaper' },
  { minutesAgo: 8, page: 'home', type: 'page_visit' },
]

function createSampleEvents(now = Date.now()): RemoteActivityEvent[] {
  return SAMPLE_ACTIVITY.map((item, index) => ({
    id: `sample-${String(index + 1).padStart(2, '0')}`,
    timestamp: now - item.minutesAgo * 60_000,
    page: item.page,
    type: item.type,
    ...(item.action ? { action: item.action } : {}),
  })).sort((first, second) => second.timestamp - first.timestamp)
}

function parseEvent(id: string, data: DocumentData): RemoteActivityEvent | null {
  if (
    !(data.timestamp instanceof Timestamp) ||
    typeof data.page !== 'string' ||
    !/^[a-zA-Z0-9_-]{1,40}$/.test(data.page) ||
    (data.type !== 'page_visit' && data.type !== 'interaction') ||
    (data.action !== undefined &&
      (typeof data.action !== 'string' || !/^[a-zA-Z0-9:_-]{1,80}$/.test(data.action)))
  ) return null

  return {
    id,
    timestamp: data.timestamp.toMillis(),
    page: data.page,
    type: data.type,
    ...(typeof data.action === 'string' ? { action: data.action } : {}),
  }
}

function pageName(page: string) {
  return PAGE_LABELS[page] || page.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function mergeEvents(existing: RemoteActivityEvent[], incoming: RemoteActivityEvent[]) {
  const events = new Map(existing.map((event) => [event.id, event]))
  incoming.forEach((event) => events.set(event.id, event))
  return [...events.values()].sort((first, second) => second.timestamp - first.timestamp)
}

function downloadFile(fileName: string, mimeType: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function getExportLabel(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dayOfMonth = String(date.getDate()).padStart(2, '0')
  const dateLabel = `${year}-${month}-${dayOfMonth}`
  const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
  const generatedAt = date.toISOString()
  return { dateLabel, dayLabel, generatedAt }
}

function exportCsv(events: RemoteActivityEvent[], isSample: boolean) {
  const quote = (value: string) => `"${value.replace(/"/g, '""')}"`
  const report = getExportLabel()
  const rows = [
    ['Report date', report.dateLabel],
    ['Report day', report.dayLabel],
    ['Generated at', report.generatedAt],
    ['Data source', isSample ? 'Sample preview (in-memory)' : 'Live Firestore'],
    ['Records', String(events.length)],
    [],
    ['timestamp', 'page', 'event_type', 'action'],
    ...events.map((event) => [
      new Date(event.timestamp).toISOString(),
      pageName(event.page),
      event.type,
      event.action || '',
    ]),
  ]
  downloadFile(
    `${isSample ? 'sample-' : ''}visitor-activity-${report.dayLabel.toLowerCase()}-${report.dateLabel}.csv`,
    'text/csv;charset=utf-8',
    rows.map((row) => row.map(quote).join(',')).join('\r\n'),
  )
}

function exportJson(events: RemoteActivityEvent[], isSample: boolean) {
  const report = getExportLabel()
  const records = events.map(({ id, timestamp, page, type, action }) => ({
    id,
    timestamp: new Date(timestamp).toISOString(),
    page,
    type,
    ...(action ? { action } : {}),
  }))
  const payload = {
    reportDate: report.dateLabel,
    reportDay: report.dayLabel,
    generatedAt: report.generatedAt,
    dataSource: isSample ? 'sample-preview' : 'live',
    recordCount: records.length,
    events: records,
  }
  downloadFile(
    `${isSample ? 'sample-' : ''}visitor-activity-${report.dayLabel.toLowerCase()}-${report.dateLabel}.json`,
    'application/json',
    JSON.stringify(payload, null, 2),
  )
}

export function AdminActivity() {
  const [user, setUser] = useState<User | null>(null)
  const [liveEvents, setLiveEvents] = useState<RemoteActivityEvent[]>([])
  const [olderEvents, setOlderEvents] = useState<RemoteActivityEvent[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [eventFilter, setEventFilter] = useState<EventFilter>('all')
  const [pageFilter, setPageFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [search, setSearch] = useState('')
  const [showSample, setShowSample] = useState(false)
  const [sampleEvents] = useState(createSampleEvents)
  const liveDocs = useRef<QueryDocumentSnapshot<DocumentData>[]>([])
  const olderCursor = useRef<QueryDocumentSnapshot<DocumentData> | null>(null)

  useEffect(() => {
    const auth = firebaseAuth
    if (!remoteActivityConfigured || !auth) {
      setAuthLoading(false)
      return
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setAuthLoading(false)
      if (!nextUser) {
        setUser(null)
        setLiveEvents([])
        setOlderEvents([])
        liveDocs.current = []
        olderCursor.current = null
        setHasMore(false)
        return
      }

      if (nextUser.uid !== adminUid) {
        setUser(null)
        setLiveEvents([])
        setOlderEvents([])
        setError('This account is not authorized for the activity dashboard.')
        void signOut(auth).catch((reason: unknown) => {
          console.error('Could not sign out an unauthorized activity dashboard account.', reason)
        })
        return
      }

      setUser(nextUser)
      setError('')
    })
  }, [])

  useEffect(() => {
    if (!user || !firestore) return

    setLoading(true)
    liveDocs.current = []
    olderCursor.current = null
    setLiveEvents([])
    setOlderEvents([])
    setHasMore(false)
    const activityQuery = query(
      collection(firestore, 'activityEvents'),
      orderBy('timestamp', 'desc'),
      limit(PAGE_SIZE),
    )
    return onSnapshot(activityQuery, (snapshot) => {
      const currentIds = new Set(snapshot.docs.map((document) => document.id))
      const movedOutOfLivePage = liveDocs.current
        .filter((document) => !currentIds.has(document.id))
        .flatMap((document) => {
          const event = parseEvent(document.id, document.data())
          return event ? [event] : []
        })

      if (movedOutOfLivePage.length) {
        setOlderEvents((previous) => mergeEvents(previous, movedOutOfLivePage))
      }

      liveDocs.current = snapshot.docs
      setLiveEvents(snapshot.docs.flatMap((document) => {
        const event = parseEvent(document.id, document.data())
        return event ? [event] : []
      }))
      if (!olderCursor.current && snapshot.docs.length) {
        olderCursor.current = snapshot.docs[snapshot.docs.length - 1]
        setHasMore(snapshot.docs.length === PAGE_SIZE)
      }
      setLastUpdated(Date.now())
      setLoading(false)
      setError('')
    }, (reason) => {
      console.error('Could not load the remote activity log.', reason)
      setLoading(false)
      setError('Could not load activity. Check the Firestore admin rules and Firebase setup.')
    })
  }, [user])

  const events = useMemo(
    () => mergeEvents(olderEvents, liveEvents),
    [olderEvents, liveEvents],
  )
  const displayedEvents = showSample ? sampleEvents : events

  const pageOptions = useMemo(() => {
    const observedPages = displayedEvents.map((event) => event.page)
    return [...new Set([...Object.keys(PAGE_LABELS), ...observedPages])]
      .sort((first, second) => pageName(first).localeCompare(pageName(second)))
  }, [displayedEvents])

  const filteredEvents = useMemo(() => {
    const now = Date.now()
    const cutoff = timeFilter === '24h' ? now - 24 * 60 * 60 * 1000
      : timeFilter === '7d' ? now - 7 * 24 * 60 * 60 * 1000
        : timeFilter === '30d' ? now - 30 * 24 * 60 * 60 * 1000
          : 0
    const normalizedSearch = search.trim().toLowerCase()

    return displayedEvents.filter((event) =>
      (eventFilter === 'all' || event.type === eventFilter) &&
      (pageFilter === 'all' || event.page === pageFilter) &&
      event.timestamp >= cutoff &&
      (!normalizedSearch ||
        pageName(event.page).toLowerCase().includes(normalizedSearch) ||
        (event.action || '').toLowerCase().includes(normalizedSearch)),
    )
  }, [displayedEvents, eventFilter, pageFilter, search, timeFilter])

  const visitCount = displayedEvents.filter((event) => event.type === 'page_visit').length
  const interactionCount = displayedEvents.length - visitCount
  const visitedPageCount = new Set(
    displayedEvents.filter((event) => event.type === 'page_visit').map((event) => event.page),
  ).size

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!firebaseAuth || !adminUid) return
    setError('')
    setMessage('')
    setSigningIn(true)
    try {
      await setPersistence(firebaseAuth, browserSessionPersistence)
      await signInWithEmailAndPassword(firebaseAuth, email, password)
      setPassword('')
    } catch (reason) {
      console.error('Admin activity sign-in failed.', reason)
      setError('Sign-in failed. Check the account and Firebase Authentication setup.')
    } finally {
      setSigningIn(false)
    }
  }

  async function handleLoadOlder() {
    if (!firestore || !olderCursor.current || loadingOlder) return
    setLoadingOlder(true)
    setError('')
    try {
      const olderQuery = query(
        collection(firestore, 'activityEvents'),
        orderBy('timestamp', 'desc'),
        startAfter(olderCursor.current),
        limit(PAGE_SIZE),
      )
      const snapshot = await getDocs(olderQuery)
      const page = snapshot.docs.flatMap((document) => {
        const event = parseEvent(document.id, document.data())
        return event ? [event] : []
      })
      setOlderEvents((previous) => mergeEvents(previous, page))
      if (snapshot.docs.length) olderCursor.current = snapshot.docs[snapshot.docs.length - 1]
      setHasMore(snapshot.docs.length === PAGE_SIZE)
    } catch (reason) {
      console.error('Could not load older activity records.', reason)
      setError('Could not load older activity. Check the Firestore rules and connection.')
    } finally {
      setLoadingOlder(false)
    }
  }

  async function handleDeleteAll() {
    if (!firestore || !window.confirm('Delete all remote activity records? This cannot be undone.')) return
    setDeleting(true)
    setError('')
    setMessage('')
    let deleted = 0
    try {
      while (true) {
        const batchQuery = query(
          collection(firestore, 'activityEvents'),
          orderBy('timestamp', 'desc'),
          limit(400),
        )
        const snapshot = await getDocs(batchQuery)
        if (snapshot.empty) break
        const batch = writeBatch(firestore)
        snapshot.docs.forEach((document) => batch.delete(document.ref))
        await batch.commit()
        deleted += snapshot.size
        if (snapshot.size < 400) break
      }
      liveDocs.current = []
      olderCursor.current = null
      setLiveEvents([])
      setOlderEvents([])
      setHasMore(false)
      setMessage(`Deleted ${deleted} remote activity record${deleted === 1 ? '' : 's'}.`)
    } catch (reason) {
      console.error('Could not delete the remote activity log.', reason)
      setError('Could not delete all activity. Check the Firestore admin rules.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleSignOut() {
    if (!firebaseAuth) return
    setError('')
    setMessage('')
    try {
      await signOut(firebaseAuth)
      setUser(null)
      setShowSample(false)
      setLiveEvents([])
      setOlderEvents([])
      liveDocs.current = []
      olderCursor.current = null
      setHasMore(false)
    } catch (reason) {
      console.error('Admin activity sign-out failed.', reason)
      setError('Could not sign out. Please try again.')
    }
  }

  return (
    <section className="admin-activity" aria-labelledby="admin-activity-title" data-activity-ignore>
      <header className="admin-activity__heading">
        <p className="eyebrow">Protected admin area</p>
        <h1 id="admin-activity-title">Visitor activity</h1>
        <p>
          A live timeline of activity from consenting visitors. Records include
          page names, timestamps, and control identifiers; they do not identify a person.
        </p>
      </header>

      {!remoteActivityConfigured ? (
        <div className="admin-activity__notice" role="status">
          <strong>Remote tracking is not configured.</strong>
          <p>Enable Cloud Firestore in the existing Firebase project, configure App Check, and add the remaining settings before visitors can appear here.</p>
          {missingFirebaseSettings.length > 0 && (
            <ul>{missingFirebaseSettings.map((setting) => <li key={setting}>{setting}</li>)}
            </ul>
          )}
        </div>
      ) : authLoading ? (
        <p className="admin-activity__status" role="status">Checking admin session…</p>
      ) : !user ? (
        <form className="admin-activity__login" onSubmit={handleSignIn}>
          <h2>Admin sign-in</h2>
          <label>
            Admin email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={signingIn}>
            {signingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-activity__toolbar">
            {showSample ? (
              <p role="status">
                <span className="admin-activity__sample-dot" aria-hidden="true" />
                Sample preview · in-memory only
              </p>
            ) : (
              <p role="status">
                <span className="admin-activity__live-dot" aria-hidden="true" />
                Live updates
                {lastUpdated ? ` · updated ${new Date(lastUpdated).toLocaleTimeString()}` : ''}
              </p>
            )}
            <button
              type="button"
              aria-pressed={showSample}
              onClick={() => setShowSample((current) => !current)}
            >
              {showSample ? 'Back to live data' : 'Preview sample data'}
            </button>
            <button type="button" onClick={handleSignOut}>Sign out</button>
            {!showSample && (
              <button
                className="admin-activity__danger"
                type="button"
                onClick={handleDeleteAll}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete all remote activity'}
              </button>
            )}
          </div>

          {showSample && (
            <div className="admin-activity__notice" role="status">
              <strong>Sample activity preview</strong>
              <p>
                These {sampleEvents.length} generated records exist only in this page.
                Nothing is written to Firestore or localStorage, no network requests are sent for them,
                and real activity is left exactly as it is.
              </p>
            </div>
          )}

          {!showSample && loading ? (
            <p className="admin-activity__status" role="status">Loading the latest activity…</p>
          ) : (
            <>
              <dl className="admin-activity__metrics" aria-label="Loaded activity summary">
                <div><dt>Loaded events</dt><dd>{displayedEvents.length.toLocaleString()}</dd></div>
                <div><dt>Page visits</dt><dd>{visitCount.toLocaleString()}</dd></div>
                <div><dt>Interactions</dt><dd>{interactionCount.toLocaleString()}</dd></div>
                <div><dt>Pages visited</dt><dd>{visitedPageCount.toLocaleString()}</dd></div>
              </dl>

              <div className="admin-activity__filters" aria-label="Filter activity">
                <label>
                  Search page or control
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search activity"
                  />
                </label>
                <label>
                  Event
                  <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value as EventFilter)}>
                    <option value="all">All events</option>
                    <option value="page_visit">Page visits</option>
                    <option value="interaction">Interactions</option>
                  </select>
                </label>
                <label>
                  Page
                  <select value={pageFilter} onChange={(event) => setPageFilter(event.target.value)}>
                    <option value="all">All pages</option>
                    {pageOptions.map((page) => <option value={page} key={page}>{pageName(page)}</option>)}
                  </select>
                </label>
                <label>
                  Time period
                  <select value={timeFilter} onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}>
                    <option value="all">All loaded time</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                  </select>
                </label>
              </div>

              <div className="admin-activity__export">
                <p>{filteredEvents.length.toLocaleString()} matching event{filteredEvents.length === 1 ? '' : 's'} loaded</p>
                <button type="button" onClick={() => exportCsv(filteredEvents, showSample)} disabled={!filteredEvents.length}>
                  Export CSV
                </button>
                <button type="button" onClick={() => exportJson(filteredEvents, showSample)} disabled={!filteredEvents.length}>
                  Export JSON
                </button>
              </div>

              {filteredEvents.length ? (
                <ol className="admin-activity__timeline">
                  {filteredEvents.map((event) => (
                    <li key={event.id}>
                      <span className={`admin-activity__event-mark admin-activity__event-mark--${event.type}`} aria-hidden="true">
                        {event.type === 'page_visit' ? '↗' : '•'}
                      </span>
                      <div className="admin-activity__event-content">
                        <strong>
                          {event.type === 'page_visit'
                            ? `Visited ${pageName(event.page)}`
                            : `Used ${event.action || 'a control'} on ${pageName(event.page)}`}
                        </strong>
                        <span>{event.type === 'page_visit' ? 'Page visit' : 'Interface interaction'}</span>
                      </div>
                      <time dateTime={new Date(event.timestamp).toISOString()}>
                        {new Date(event.timestamp).toLocaleString()}
                      </time>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="admin-activity__empty">
                  {displayedEvents.length
                    ? 'No events match these filters. Try broadening your search.'
                    : 'No activity has been recorded yet.'}
                </p>
              )}

              {!showSample && hasMore && (
                <button
                  className="admin-activity__load-more"
                  type="button"
                  onClick={handleLoadOlder}
                  disabled={loadingOlder}
                >
                  {loadingOlder ? 'Loading older activity…' : 'Load older activity'}
                </button>
              )}
            </>
          )}
        </>
      )}

      {error && <p className="admin-activity__error" role="alert">{error}</p>}
      {message && <p className="admin-activity__message" role="status">{message}</p>}
    </section>
  )
}

import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Hero } from './sections/Hero'
import { BirthdayMessage } from './sections/BirthdayMessage'
import { FriendshipNote } from './sections/FriendshipNote'
import { HomeKeepsake } from './sections/HomeKeepsake'
import { ClosingWish } from './sections/ClosingWish'
import { ButterflyGarden } from './sections/ButterflyGarden'
import { HundredOrgans, HundredWishes } from './sections/Experiences'
import { OpenWhenLetters } from './sections/OpenWhenLetters'
import { BirthdayCountdown, isBirthdayToday } from './sections/BirthdayCountdown'
import { birthdayContent } from './birthdayContent'
import { recordInteraction, recordPageVisit } from './activityTracker'

const AdminActivity = lazy(() =>
  import('./sections/AdminActivity').then((module) => ({ default: module.AdminActivity })),
)

const pages = [
  { id: 'sky', title: 'Sky Observatory', hint: 'Find a star and make a wish.', icon: '✦' },
  { id: 'garden', title: 'Butterfly Garden', hint: 'Follow the lights to find tiny wishes.', icon: '❋' },
  { id: 'note', title: 'A Note for You', hint: 'A few words, just for today.', icon: '♡' },
  { id: 'wishes', title: '100 Little Wishes', hint: 'A book of birthday hopes, one page at a time.', icon: '✧' },
  { id: 'organs', title: '100 Things I Appreciate About You', hint: 'A little book of details and qualities I appreciate about you.', icon: '❀' },
  { id: 'seasons', title: 'Four Seasons Supremacy', hint: 'Explore four seasonal skies with weather, wind, and light controls.', icon: '❄' },
  { id: 'openwhen', title: 'Open When…', hint: 'A few kind words for the days you need them.', icon: '✉' },
] as const
const worldPages = pages
const birthdayWorldPhrases = [
  'Happy Birthday, Manuu — this day is yours.',
  'May today bring you reasons to smile.',
  'I hope you feel celebrated and cared for.',
  'May the year ahead be kind to you.',
  'I’m grateful to have you as my friend.',
  'You deserve a birthday full of warmth.',
  'Keep being proud of the person you are.',
  'Here’s to your wishes, laughter, and new beginnings.',
  'Happy Birthday', 'Make a Wish', 'Celebrate You', 'A Little Birthday Magic',
  'Your Day to Shine', 'Birthday Wishes', 'Here’s to You', 'All the Lovely Things',
  'Another Year of You', 'Make Today Yours', 'A Day Full of Wonder', 'Keep Glowing',
  'Candles & Wishes', 'So Much to Celebrate', 'Little Joys, Big Wishes', 'Let the Day Sparkle',
  'Wishing You Joy', 'A Birthday Made for You', 'A Little Extra Magic', 'May Your Wishes Find You',
  'Here’s to New Adventures', 'Today, We Celebrate You', 'Joy in Every Little Thing', 'May This Year Be Kind',
  'A Heart Full of Wishes', 'Shine in Your Own Way', 'Let the Candles Shine', 'Your Story Keeps Blooming',
  'More Reasons to Smile', 'A Day to Feel Proud', 'May Good Things Find You', 'Keep Making Wishes',
  'A Year of Little Wonders', 'Your Kind of Birthday Magic', 'The Best Is Still Unfolding', 'Sending Birthday Cheer',
  'A Wish for Every Candle', 'Celebrate Every Bit of You', 'Here’s to Happy Moments', 'May Today Feel Special',
]
type PageId = (typeof pages)[number]['id']
type AppPage = PageId | 'world' | 'home' | 'admin'

function App() {
  const [page, setPage] = useState<AppPage>(() => readPage())
  const [birthdayIsToday, setBirthdayIsToday] = useState(() => isBirthdayToday())
  const [skyCleanView, setSkyCleanView] = useState(false)
  const observatoryFrame = useRef<HTMLIFrameElement>(null)
  const mainContent = useRef<HTMLElement>(null)
  const focusPageAfterNavigation = useRef(false)
  const lastRecordedVisit = useRef('')
  const isAdminPath = window.location.pathname.replace(/\/+$/, '') === '/admin'

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#main-content') return
      focusPageAfterNavigation.current = true
      setPage(readPage())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const title = page === 'home'
      ? birthdayContent.pageTitle
      : page === 'world'
        ? 'Birthday World'
        : page === 'admin'
          ? 'Admin Activity'
          : pages.find((item) => item.id === page)?.title
    if (title) document.title = page === 'home' ? title : `${title} · Manuu’s Birthday`
    if (focusPageAfterNavigation.current) {
      focusPageAfterNavigation.current = false
      mainContent.current?.focus()
    }
  }, [page])

  useEffect(() => {
    if (page !== 'admin' && lastRecordedVisit.current !== page) {
      lastRecordedVisit.current = page
      recordPageVisit(page)
    }
  }, [page])

  useEffect(() => {
    if (page === 'admin') return

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      let control = event.target.closest<HTMLElement>('button, a[href], summary, [role="tab"], [role="button"], [onclick]')
      if (!control) {
        let element = event.target instanceof HTMLElement ? event.target : event.target.parentElement
        for (; element && element !== document.body; element = element.parentElement) {
          if (getComputedStyle(element).cursor === 'pointer') {
            control = element
            break
          }
        }
      }
      if (!control || control.closest('[data-activity-ignore]')) return

      const className = typeof control.className === 'string' ? control.className.split(/\s+/)[0] : ''
      const action = control.dataset.activityAction || control.id || className || control.tagName.toLowerCase()
      recordInteraction(page, action.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 80))
    }

    const onChange = (event: Event) => {
      if (!(event.target instanceof HTMLElement)) return
      const field = event.target.closest<HTMLElement>('input, select, textarea')
      if (!field || field.closest('[data-activity-ignore]')) return
      const identifier = field.id || (field instanceof HTMLInputElement ? field.type : field.tagName.toLowerCase())
      recordInteraction(page, `changed:${identifier}`.replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 80))
    }

    document.addEventListener('click', onClick)
    document.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('change', onChange)
    }
  }, [page])

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== observatoryFrame.current?.contentWindow) return
      const data = event.data
      if (typeof data !== 'object' || data === null || !('type' in data)) return
      if (
        data.type === 'observatory-clean-view' &&
        'enabled' in data &&
        typeof data.enabled === 'boolean'
      ) {
        setSkyCleanView(data.enabled)
      }
      if (
        data.type === 'birthday-activity-event' &&
        'event' in data &&
        isIframeActivityEvent(data.event)
      ) {
        if (data.event.type === 'page_visit') recordPageVisit(data.event.page)
        else recordInteraction(data.event.page, data.event.action)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  function goHome() {
    if (isAdminPath) {
      window.location.assign('/')
      return
    }
    window.location.hash = '/'
  }
  const activeTitle = page === 'admin' ? 'Admin Activity' : pages.find((item) => item.id === page)?.title

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main ref={mainContent} id="main-content" tabIndex={-1} className={`birthday-app${page === 'sky' && skyCleanView ? ' birthday-app--sky-clean' : ''}`}>
      {page !== 'sky' && <header className={`site-nav${page === 'seasons' ? ' site-nav--fullscreen' : ''}`}>
        {page !== 'seasons' && <a className="site-brand" href={isAdminPath ? '/' : '#/'} aria-label="Manuu's birthday home">✦ <span>for Manuu</span></a>}
        {page !== 'home' && <button className="back-home" type="button" onClick={goHome}>← Birthday home</button>}
      </header>}
      {birthdayContent.countdown.enabled && !birthdayIsToday && (
        <BirthdayCountdown onComplete={() => setBirthdayIsToday(true)} />
      )}
      {page === 'home' ? (
        <div className="birthday-home birthday-home--landing">
          <Hero birthdayMode={birthdayIsToday} />
          <BirthdayMessage />
          <HomeKeepsake />
        </div>
      ) : page === 'world' ? (
        <div className="birthday-world">
          <section className="journey section" aria-labelledby="journey-title">
          <div className="birthday-world__words" aria-hidden="true">
            {birthdayWorldPhrases.map((phrase, index) => (
              <span
                className={`birthday-world__word birthday-world__word--${index % 4}${index < 8 ? ' birthday-world__word--message' : ''}`}
                style={{ '--phrase-left': `${(index * 43 + 7) % 79}%`, '--phrase-top': `${(index * 37 + 11) % 88}%`, animationDelay: `${-((index * 1.25) % 9)}s`, animationDuration: `${12 + (index % 6)}s` } as CSSProperties}
                key={phrase}
              >{phrase}</span>
            ))}
          </div>
          <div className="section__inner">
            <div className="section__heading">
              <p className="eyebrow">A small birthday world</p>
              <h1 id="journey-title">Where would you like to wander?</h1>
              <p className="section__intro">{worldPages.length} little places, each with something to discover. Take them at your own pace.</p>
            </div>
            <nav className="experience-grid" id="experiences" aria-label="Birthday experiences">
              {worldPages.map((item, index) => <a className="experience-card" href={`#/${item.id}`} key={item.id}>
                <span className="experience-card__number">0{index + 1}</span><span className="experience-card__icon" aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3><p>{item.hint}</p><span className="experience-card__link">Open this little world <span aria-hidden="true">↗</span></span>
              </a>)}
            </nav>
          </div>
        </section>
        <ClosingWish />
        </div>
      ) : <>
        <div className={`destination destination--${page}`}>
        {page !== 'sky' && page !== 'seasons' && page !== 'garden' && page !== 'note' && page !== 'wishes' && page !== 'organs' && page !== 'openwhen' && page !== 'admin' && <div className="destination__heading"><p className="eyebrow">A birthday place for Manuu</p><h1>{activeTitle}</h1></div>}
          {page === 'sky' && <iframe
            ref={observatoryFrame}
            className="observatory-iframe"
            title="Dreambox Sky Observatory"
            src="/observatory/sky-observatory.html"
            onLoad={() => setSkyCleanView(false)}
          />}
          {page === 'seasons' && <iframe
            className="seasons-iframe"
            title="Four Seasons Supremacy"
            src="/the-god-mode.html"
            allowFullScreen
          />}
          {page === 'garden' && <ButterflyGarden />}
          {page === 'note' && <FriendshipNote />}
          {page === 'wishes' && <HundredWishes />}
          {page === 'organs' && <HundredOrgans />}
          {page === 'openwhen' && <OpenWhenLetters />}
          {page === 'admin' && (
            <Suspense fallback={<p role="status">Loading admin dashboard…</p>}>
              <AdminActivity />
            </Suspense>
          )}
        </div>
        {page !== 'sky' && page !== 'seasons' && <footer className="destination-footer"><button type="button" onClick={goHome}>← Back to birthday home</button></footer>}
      </>}
      </main>
    </>
  )
}

function readPage(): AppPage {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') return 'admin'
  const id = window.location.hash.replace(/^#\/?/, '')
  if (id === 'world') return 'world'
  if (id === 'admin') return 'admin'
  return pages.some((item) => item.id === id) ? id as PageId : 'home'
}

function isIframeActivityEvent(value: unknown): value is {
  type: 'page_visit'
  page: string
} | {
  type: 'interaction'
  page: string
  action: string
} {
  if (typeof value !== 'object' || value === null || !('type' in value) || !('page' in value)) return false
  return value.page === 'sky-observatory' &&
    (value.type === 'page_visit' || value.type === 'interaction') &&
    (value.type === 'page_visit' || ('action' in value && typeof value.action === 'string' && /^[a-zA-Z0-9:_-]{1,80}$/.test(value.action)))
}

export default App

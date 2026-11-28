import { useEffect, useRef, useState } from 'react'
import { organGroups } from '../organData'
import { remoteWishStoreConfigured } from '../firebase'
import { WishScratchCard } from './WishScratchCard'

const wishGroups = [
  { title: 'For the days ahead', icon: '☼', wishes: ['May the year ahead feel like a window opening on a fresh morning.', 'May there be more unhurried afternoons than you expect.', 'May you find a new favorite place, even if it is just a corner of a room.', 'May the plans you are excited about come together gently.', 'May a good surprise find you on a very ordinary day.', 'May you have the energy for what matters and permission to rest from the rest.', 'May the next chapter bring more ease than the last one.', 'May you have many reasons to look forward to tomorrow.', 'May the little things you are hoping for happen one by one.', 'May every season bring something that feels made for you.', 'May your calendar leave room for spontaneous joy.', 'May the road ahead have beautiful places to pause.', 'May you get to try something new just because it sounds fun.', 'May good news arrive when you could use it.', 'May the things you build this year make you proud.', 'May home feel warm wherever you happen to be.', 'May you collect small moments that become favorite memories.', 'May your curiosity keep opening unexpected doors.', 'May you be surprised by how much can go right.', 'May this year be kind to the person you are becoming.'] },
  { title: 'For your quiet moments', icon: '☾', wishes: ['May you find a calm sky when you need one.', 'May a favorite song meet you at exactly the right time.', 'May your tea, coffee, or evening snack always hit the spot.', 'May a cozy room and a soft blanket be easy to find.', 'May you get a little more sleep than you planned on.', 'May rain sound peaceful when you are safe and warm inside.', 'May a walk outside help untangle a busy mind.', 'May you have a place where you never need to pretend.', 'May silence feel comfortable and company feel easy.', 'May your favorite small rituals stay yours.', 'May you catch a beautiful sunset without having to hurry.', 'May you get a day with nowhere urgent to be.', 'May a pet, plant, or passing bird make you smile.', 'May the night sky remind you that there is room for wonder.', 'May you make time to do absolutely nothing sometimes.', 'May your favorite comfort food taste extra good.', 'May a deep breath make a difficult moment feel smaller.', 'May you notice the first lovely thing in every new place.', 'May the world give you a softer landing when you need one.', 'May peace find you in small, ordinary ways.'] },
  { title: 'For your adventures', icon: '✈', wishes: ['May you visit somewhere that stays in your thoughts long after you return.', 'May every journey have at least one unexpectedly perfect view.', 'May you find a new path worth taking the scenic route for.', 'May your next trip be full of little stories to tell.', 'May you always have someone good to share the view with.', 'May a new hobby surprise you by becoming a favorite.', 'May your brave ideas get a chance to become real.', 'May you try something that makes you laugh at yourself.', 'May you find a book, film, or song that feels like a discovery.', 'May plans change in a way that leads somewhere lovely.', 'May you get delightfully lost somewhere safe and beautiful.', 'May every new beginning bring a little more confidence.', 'May your curiosity take you somewhere memorable.', 'May the best part of an adventure be the unexpected part.', 'May you collect moments, not just photographs.', 'May a day out feel longer in the nicest possible way.', 'May you discover a view that makes you stop mid-sentence.', 'May there be more yes days for things you genuinely want.', 'May you get to celebrate every little milestone along the way.', 'May your life keep making space for wonder.'] },
  { title: 'For the person you are', icon: '♡', wishes: ['May you give yourself the same patience you give other people.', 'May you remember that growing slowly still counts as growing.', 'May you feel appreciated without having to ask.', 'May you trust your own timing a little more.', 'May you let yourself be proud before everything is perfect.', 'May you keep the parts of you that make you unmistakably yourself.', 'May you know that resting is part of making progress.', 'May you feel free to change your mind as you learn.', 'May you find people who listen with care.', 'May you be gentle with yourself on the complicated days.', 'May your effort be seen, even when the result takes time.', 'May you keep asking questions and finding your own answers.', 'May you feel at home in your own company.', 'May you never have to shrink to make others comfortable.', 'May you remember that your worth is not a to-do list.', 'May you have courage for the things that matter to you.', 'May you speak to yourself like someone you love.', 'May you feel allowed to take up space and take your time.', 'May you notice how much you already bring to the world.', 'May you always know that simply being you is enough.'] },
  { title: 'For the joy in between', icon: '✿', wishes: ['May laughter sneak into the middle of a busy day.', 'May the perfect snack appear exactly when you want it.', 'May you get a message that makes you grin at your phone.', 'May you find something beautiful on the way to somewhere else.', 'May your next favorite memory begin with “remember when…”', 'May you have a reason to wear something that makes you feel wonderful.', 'May the little celebration become a big happy one.', 'May your favorite people make time for you.', 'May your jokes land and your silly moments be treasured.', 'May you always find one more reason to celebrate.', 'May flowers, clouds, or city lights catch your eye today.', 'May a tiny win turn an average day around.', 'May you receive a compliment you actually believe.', 'May something you thought was lost turn up again.', 'May your birthday sweetness last beyond today.', 'May you always find room for a little play.', 'May every good moment feel like it has nowhere else to be.', 'May you hear your favorite song in an unexpected place.', 'May joy show up in forms you did not think to ask for.', 'And most of all, may you feel celebrated—today and all year long.'] },
]

type WishSyncStatus = 'loading' | 'ready' | 'saving' | 'error' | 'unavailable'

function describeWishSyncError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : ''
  if (code.toLowerCase().includes('recaptcha') || code.toLowerCase().includes('app-check')) {
    return import.meta.env.DEV
      ? 'Local App Check needs setup: copy the AppCheck debug token from the browser console and add it under App Check → Apps → Manage debug tokens in Firebase.'
      : 'App Check rejected this request. Verify the production reCAPTCHA Enterprise key and allowed domain in Firebase.'
  }
  if (code.includes('permission-denied')) {
    if (import.meta.env.DEV) {
      return 'Local wish sync was denied. Register this browser’s App Check debug token in Firebase; also verify Anonymous sign-in and deployed wishUnlocks rules.'
    }
    return 'Firebase denied wish sync. Enable Anonymous sign-in and deploy the wishUnlocks Firestore rules for this project.'
  }
  return 'Could not sync wishes. Check the browser console for the Firebase error.'
}

const matrixRainModes = [
  { value: 'matrix', label: 'Matrix' },
  { value: 'binary', label: 'Binary' },
  { value: 'dream', label: 'Dream' },
  { value: 'galaxy', label: 'Galaxy' },
  { value: 'love', label: 'Hearts' },
  { value: 'storm', label: 'Storm' },
  { value: 'secret', label: 'Secret' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'notes', label: 'Music notes' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'random', label: 'Surprise me' },
] as const

type MatrixRainMode = (typeof matrixRainModes)[number]['value']

interface MatrixRainEngine {
  active: () => boolean
  destroy: () => void
  getMode: () => string
  setMode: (mode: MatrixRainMode) => void
  start: (mode: MatrixRainMode) => void
  stop: () => void
}

declare global {
  interface Window {
    MatrixRain?: MatrixRainEngine
  }
}

function isMatrixRainMode(value: string): value is MatrixRainMode {
  return matrixRainModes.some((option) => option.value === value)
}

function MatrixRainTool() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [mode, setMode] = useState<MatrixRainMode>('matrix')
  const [active, setActive] = useState(false)

  useEffect(() => {
    let disposed = false
    const script = document.createElement('script')
    const syncState = () => {
      const engine = window.MatrixRain
      if (!engine) return
      setActive(engine.active())
      const currentMode = engine.getMode()
      if (isMatrixRainMode(currentMode)) setMode(currentMode)
    }

    script.src = '/100-organs-matrix-rain.js'
    script.async = true
    script.onload = () => {
      if (disposed) return
      if (!window.MatrixRain) {
        setStatus('error')
        return
      }
      window.addEventListener('matrix-rain:change', syncState)
      setStatus('ready')
    }
    script.onerror = () => {
      if (!disposed) setStatus('error')
    }
    document.head.appendChild(script)

    return () => {
      disposed = true
      window.removeEventListener('matrix-rain:change', syncState)
      window.MatrixRain?.destroy()
      script.remove()
    }
  }, [])

  function toggleRain() {
    const engine = window.MatrixRain
    if (!engine) {
      setStatus('error')
      return
    }
    if (engine.active()) {
      engine.stop()
      setActive(false)
      return
    }
    engine.setMode(mode)
    engine.start(mode)
    setActive(true)
  }

  function changeMode(value: string) {
    if (!isMatrixRainMode(value)) return
    setMode(value)
    if (window.MatrixRain?.active()) window.MatrixRain.setMode(value)
  }

  const message = status === 'loading'
    ? 'Preparing the rain…'
    : status === 'error'
      ? 'The visual effect could not load. Please refresh and try again.'
      : active
        ? 'The rain is flowing over the page.'
        : 'An optional, full-screen layer of drifting light.'

  return <div className={`matrix-rain-tool${active ? ' is-active' : ''}`}>
    <label className="matrix-rain-tool__mode">
      <span>Choose a current</span>
      <select value={mode} disabled={status !== 'ready'} onChange={(event) => changeMode(event.currentTarget.value)}>
        {matrixRainModes.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
    <button className="matrix-rain-tool__toggle" type="button" disabled={status !== 'ready'} aria-pressed={active} onClick={toggleRain}>
      <span aria-hidden="true">{active ? '■' : '✦'}</span> {active ? 'Stop the rain' : 'Open the rain'}
    </button>
    <p className="matrix-rain-tool__message" role={status === 'error' ? 'alert' : 'status'}>{message}</p>
  </div>
}

export function HundredWishes() {
  const [open, setOpen] = useState<number | null>(0)
  const [openedWishes, setOpenedWishes] = useState<number[]>([])
  const [wishSync, setWishSync] = useState<WishSyncStatus>(remoteWishStoreConfigured ? 'loading' : 'unavailable')
  const [wishSyncError, setWishSyncError] = useState('')
  const pendingWishSaves = useRef(0)
  const wishSaveFailed = useRef(false)
  const wishTotal = wishGroups.reduce((sum, group) => sum + group.wishes.length, 0)

  useEffect(() => {
    if (!remoteWishStoreConfigured) return
    let cancelled = false
    void import('../firebaseClient')
      .then(({ loadUnlockedWishes }) => loadUnlockedWishes())
      .then((savedWishes) => {
        if (cancelled) return
        if (savedWishes.length) {
          setOpenedWishes((current) => [...new Set([...current, ...savedWishes])].sort((a, b) => a - b))
        }
        if (pendingWishSaves.current === 0) setWishSync('ready')
      })
      .catch((error: unknown) => {
        console.error('Could not load saved wishes.', error)
        if (!cancelled) {
          setWishSyncError(describeWishSyncError(error))
          setWishSync('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  function unlockWish(wishNumber: number) {
    setOpenedWishes((current) => current.includes(wishNumber) ? current : [...current, wishNumber].sort((a, b) => a - b))
    if (!remoteWishStoreConfigured) {
      setWishSync('unavailable')
      return
    }
    pendingWishSaves.current += 1
    setWishSync('saving')
    void import('../firebaseClient')
      .then(({ saveWishUnlock }) => saveWishUnlock(wishNumber))
      .catch((error: unknown) => {
        console.error('Could not save this wish unlock.', error)
        wishSaveFailed.current = true
        setWishSyncError(describeWishSyncError(error))
        setWishSync('error')
      })
      .finally(() => {
        pendingWishSaves.current -= 1
        if (pendingWishSaves.current > 0) setWishSync('saving')
        else if (!wishSaveFailed.current) setWishSync('ready')
      })
  }

  const syncMessage = wishSync === 'loading'
    ? 'Loading saved wishes…'
    : wishSync === 'saving'
      ? 'Saving this wish…'
      : wishSync === 'error'
        ? wishSyncError || 'Could not sync every wish. Unlocks from this visit may not appear on other devices.'
        : wishSync === 'unavailable'
          ? 'Saved wishes are unavailable right now.'
          : 'Scratch a card to reveal it. Unlocked wishes stay saved across devices.'

  return <section className="wishes-book">
    <header className="book-cover book-cover--wishes">
      <span className="book-cover__eyebrow">A birthday keepsake <span aria-hidden="true">✧</span> 01</span>
      <span className="book-cover__ornament" aria-hidden="true">✦ ⋆ ✦</span>
      <h1>100 Little Wishes</h1>
      <p>One hundred small hopes for the year ahead</p>
      <span className="book-cover__seal">FOR MANUU</span>
    </header>
    <div className="book-progress">
      <div className="book-progress__label"><span>Your wishes</span><strong aria-live="polite">{openedWishes.length} <span>/ {wishTotal}</span></strong></div>
      <progress value={openedWishes.length} max={wishTotal} aria-label={`${openedWishes.length} of ${wishTotal} wishes revealed`} />
      <p className={`wish-sync wish-sync--${wishSync}`} role="status">{syncMessage}</p>
    </div>
    <div className="wishes-groups">{wishGroups.map((group, groupIndex) => <section className={`wish-group${open === groupIndex ? ' is-open' : ''}`} key={group.title}>
      <button className="wish-group__toggle" type="button" aria-expanded={open === groupIndex} onClick={() => setOpen(open === groupIndex ? null : groupIndex)}><span className="wish-group__icon" aria-hidden="true">{group.icon}</span><span><small>CHAPTER {String(groupIndex + 1).padStart(2, '0')} · WISHES {groupIndex * 20 + 1}–{groupIndex * 20 + 20}</small><strong>{group.title}</strong></span><span className="wish-group__plus" aria-hidden="true">{open === groupIndex ? '−' : '+'}</span></button>
      {open === groupIndex && <ol className="wish-list" start={groupIndex * 20 + 1}>{group.wishes.map((wish, i) => {
        const wishNumber = groupIndex * 20 + i + 1
        const isUnlocked = openedWishes.includes(wishNumber)
        return <li key={wishNumber} className={`wish-list__item${isUnlocked ? ' is-unlocked' : ''}`}>
          <span className="wish-list__number">{String(wishNumber).padStart(2, '0')}</span>
          <WishScratchCard number={wishNumber} wish={wish} unlocked={isUnlocked} onUnlock={unlockWish} />
          <span className="wish-check" aria-hidden="true">{isUnlocked ? '✓' : '＋'}</span>
        </li>
      })}</ol>}
    </section>)}</div>
    <p className="wishes-endnote">Made of little hopes, with birthday care. <span aria-hidden="true">✦</span></p>
  </section>
}

export function HundredOrgans() {
  const [openGroup, setOpenGroup] = useState<number | null>(0)
  const [readItems, setReadItems] = useState<number[]>([])
  const total = organGroups.reduce((sum, group) => sum + group.items.length, 0)
  return <section className="organs-book">
    <header className="book-cover book-cover--organs">
      <span className="book-cover__eyebrow">A birthday keepsake <span aria-hidden="true">·</span> 02</span>
      <span className="book-cover__ornament" aria-hidden="true">❀　✧　❀</span>
      <h1>100 Things I Appreciate About You</h1>
      <p>One hundred little things that make you, you.</p>
      <span className="book-cover__seal">FOR MANUU</span>
      <MatrixRainTool />
    </header>
    <div className="book-progress">
      <div className="book-progress__label"><span>Pages explored</span><strong aria-live="polite">{readItems.length} <span>/ {total}</span></strong></div>
      <progress value={readItems.length} max={total} aria-label={`${readItems.length} of ${total} tributes opened`} />
    </div>
    <div className="organs-groups">{organGroups.map((group, groupIndex) => <section className={`organ-group${openGroup === groupIndex ? ' is-open' : ''}`} key={group.title}>
      <button className="organ-group__toggle" type="button" aria-expanded={openGroup === groupIndex} onClick={() => setOpenGroup(openGroup === groupIndex ? null : groupIndex)}>
        <span className="organ-group__number">{String(groupIndex + 1).padStart(2, '0')}</span><span className="organ-group__label"><small>CHAPTER {String(groupIndex + 1).padStart(2, '0')} · {String(group.items[0]?.number ?? 0).padStart(2, '0')}–{String(group.items[group.items.length - 1]?.number ?? 0).padStart(2, '0')}</small><strong>{group.title}</strong></span><span className="organ-group__plus" aria-hidden="true">{openGroup === groupIndex ? '−' : '+'}</span>
      </button>
      {openGroup === groupIndex && <ol className="organ-list" start={group.items[0]?.number ?? 1}>{group.items.map((item) => <li key={item.number}>
        <details onToggle={(event) => { if (event.currentTarget.open) setReadItems((old) => old.includes(item.number) ? old : [...old, item.number]) }}>
          <summary><span className="organ-list__number">{String(item.number).padStart(2, '0')}</span><strong>{item.title}</strong><span className="organ-list__chevron" aria-hidden="true">⌄</span></summary>
          <div className="organ-list__note">{item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
        </details>
      </li>)}</ol>}
    </section>)}</div>
    <p className="organs-endnote">A hundred small reminders that you are worth knowing. <span aria-hidden="true">✦</span></p>
  </section>
}

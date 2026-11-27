import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { birthdayContent } from '../birthdayContent'

type BalloonColor = 'gold' | 'pink' | 'blue'
type BalloonSlot = 0 | 1 | 2

type Balloon = {
  id: number
  color: BalloonColor
  slot: BalloonSlot
  entering: boolean
  popping: boolean
}

type FireworkStyle = CSSProperties & {
  '--firework-angle': string
  '--firework-color': string
}

type PartyConfettiStyle = CSSProperties & {
  '--confetti-color': string
  '--confetti-left': string
  '--confetti-delay': string
}

const birthdayMelody = [
  { frequency: 392, beats: 0.5 }, { frequency: 392, beats: 0.5 },
  { frequency: 440, beats: 1 }, { frequency: 392, beats: 1 },
  { frequency: 523.25, beats: 1 }, { frequency: 493.88, beats: 2 },
  { frequency: 392, beats: 0.5 }, { frequency: 392, beats: 0.5 },
  { frequency: 440, beats: 1 }, { frequency: 392, beats: 1 },
  { frequency: 587.33, beats: 1 }, { frequency: 523.25, beats: 2 },
  { frequency: 392, beats: 0.5 }, { frequency: 392, beats: 0.5 },
  { frequency: 783.99, beats: 1 }, { frequency: 659.25, beats: 1 },
  { frequency: 523.25, beats: 1 }, { frequency: 493.88, beats: 1 },
  { frequency: 440, beats: 2 },
  { frequency: 698.46, beats: 0.5 }, { frequency: 698.46, beats: 0.5 },
  { frequency: 659.25, beats: 1 }, { frequency: 523.25, beats: 1 },
  { frequency: 587.33, beats: 1 }, { frequency: 523.25, beats: 2 },
] as const

const partyConfetti = [
  '#eacb86', '#a9b9a2', '#e4d7ed', '#d99687', '#9bc2c6', '#f0d7a3',
  '#c9a8be', '#9ec4ae', '#dfbb88', '#b2bfe0', '#cda2ad', '#dce3bc',
  '#ebc0a6', '#f5dc9a', '#b9d5d8', '#dda0a3', '#d2bd8a', '#c8b1e0',
]

const initialBalloons: Balloon[] = [
  { id: 1, color: 'gold', slot: 0, entering: false, popping: false },
  { id: 2, color: 'pink', slot: 1, entering: false, popping: false },
  { id: 3, color: 'blue', slot: 2, entering: false, popping: false },
]

const balloonColors: BalloonColor[] = ['gold', 'pink', 'blue']

const confettiPieces = [
  ['c1', '12%', '-12%', '#eacb86'],
  ['c2', '19%', '-18%', '#a9b9a2'],
  ['c3', '28%', '-8%', '#e4d7ed'],
  ['c4', '37%', '-20%', '#d99687'],
  ['c5', '46%', '-10%', '#9bc2c6'],
  ['c6', '55%', '-16%', '#f0d7a3'],
  ['c7', '64%', '-7%', '#c9a8be'],
  ['c8', '73%', '-19%', '#9ec4ae'],
  ['c9', '82%', '-11%', '#dfbb88'],
  ['c10', '90%', '-17%', '#b2bfe0'],
  ['c11', '23%', '-28%', '#cda2ad'],
  ['c12', '59%', '-31%', '#dce3bc'],
  ['c13', '78%', '-24%', '#ebc0a6'],
] as const

const ambientFireworks = [
  { id: 'left-high', top: '20%', left: '16%', color: '#ffe6a1', delay: '-.8s' },
  { id: 'right-high', top: '16%', left: '82%', color: '#ffd1cb', delay: '-2.1s' },
  { id: 'center-left', top: '38%', left: '33%', color: '#bce4d3', delay: '-1.6s' },
  { id: 'center-right', top: '35%', left: '70%', color: '#d8c7f0', delay: '-.3s' },
  { id: 'far-left', top: '53%', left: '8%', color: '#f4ca7d', delay: '-2.8s' },
] as const

export function Hero({ birthdayMode = false }: { birthdayMode?: boolean }) {
  const [balloons, setBalloons] = useState(initialBalloons)
  const [balloonNote, setBalloonNote] = useState<{ id: number; text: string } | null>(null)
  const [firework, setFirework] = useState<{ id: number; slot: BalloonSlot } | null>(null)
  const [birthdayOpen, setBirthdayOpen] = useState(false)
  const [candlesBlown, setCandlesBlown] = useState(false)
  const [birthdaySongStatus, setBirthdaySongStatus] = useState(
    'Make a wish, then blow out the candles to start the song.',
  )
  const [celebrationId, setCelebrationId] = useState(0)
  const birthdayDialog = useRef<HTMLDialogElement>(null)
  const birthdayAudio = useRef<AudioContext | null>(null)
  const birthdayAudioTimeout = useRef<number | null>(null)
  const nextBalloonId = useRef(initialBalloons.length + 1)
  const nextNoteIndex = useRef(0)
  const nextFireworkId = useRef(0)

  useEffect(() => {
    const dialog = birthdayDialog.current
    if (!birthdayOpen || !dialog) return
    if (!dialog.open) dialog.showModal()

    return () => {
      if (dialog.open) dialog.close()
      if (birthdayAudioTimeout.current !== null) {
        window.clearTimeout(birthdayAudioTimeout.current)
        birthdayAudioTimeout.current = null
      }
      const audio = birthdayAudio.current
      birthdayAudio.current = null
      if (audio && audio.state !== 'closed') void audio.close()
    }
  }, [birthdayOpen])

  async function playBirthdaySong() {
    if (birthdayAudioTimeout.current !== null) {
      window.clearTimeout(birthdayAudioTimeout.current)
      birthdayAudioTimeout.current = null
    }
    const previousAudio = birthdayAudio.current
    birthdayAudio.current = null
    let audio: AudioContext | null = null
    try {
      if (previousAudio && previousAudio.state !== 'closed') {
        await previousAudio.close()
      }
      if (!birthdayDialog.current?.open) return

      const AudioContextConstructor = window.AudioContext
      if (!AudioContextConstructor) {
        setBirthdaySongStatus('Audio is not available in this browser, but the celebration is still yours.')
        return
      }

      audio = new AudioContextConstructor()
      birthdayAudio.current = audio
      await audio.resume()
      if (birthdayAudio.current !== audio) return

      const beatSeconds = 60 / 112
      const firstNoteAt = audio.currentTime + 0.05
      let noteAt = firstNoteAt
      for (const note of birthdayMelody) {
        const duration = note.beats * beatSeconds
        const oscillator = audio.createOscillator()
        const volume = audio.createGain()
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(note.frequency, noteAt)
        volume.gain.setValueAtTime(0.0001, noteAt)
        volume.gain.exponentialRampToValueAtTime(0.065, noteAt + 0.025)
        volume.gain.setTargetAtTime(0.0001, noteAt + duration * 0.72, duration * 0.09)
        oscillator.connect(volume)
        volume.connect(audio.destination)
        oscillator.start(noteAt)
        oscillator.stop(noteAt + duration)
        noteAt += duration
      }

      setBirthdaySongStatus('Happy Birthday is playing!')
      birthdayAudioTimeout.current = window.setTimeout(() => {
        if (birthdayAudio.current !== audio) return
        birthdayAudio.current = null
        birthdayAudioTimeout.current = null
        void audio?.close()
        setBirthdaySongStatus('The song is finished. Make another wish whenever you like.')
      }, (noteAt - firstNoteAt) * 1000 + 500)
    } catch (error) {
      console.error('Unable to play the birthday song.', error)
      if (audio && birthdayAudio.current !== audio) return
      birthdayAudio.current = null
      if (audio && audio.state !== 'closed') void audio.close()
      setBirthdaySongStatus('The song could not play here. You can still enjoy the celebration.')
    }
  }

  function openBirthdayCelebration() {
    setCandlesBlown(false)
    setBirthdaySongStatus('Make a wish, then blow out the candles to start the song.')
    setBirthdayOpen(true)
  }

  function blowOutCandles() {
    setCandlesBlown(true)
    setCelebrationId((current) => current + 1)
    void playBirthdaySong()
  }

  function popBalloon(balloon: Balloon) {
    if (balloon.popping) return

    const noteId = nextNoteIndex.current++
    const burstId = nextFireworkId.current++
    setBalloons((current) =>
      current.map((item) => item.id === balloon.id ? { ...item, popping: true } : item),
    )
    setBalloonNote({
      id: noteId,
      text: birthdayContent.welcome.balloonNotes[
        noteId % birthdayContent.welcome.balloonNotes.length
      ],
    })
    window.setTimeout(() => {
      setBalloonNote((current) => current?.id === noteId ? null : current)
    }, 4500)
    setFirework({ id: burstId, slot: balloon.slot })

    window.setTimeout(() => {
      setFirework((current) => current?.id === burstId ? null : current)
    }, 1000)

    window.setTimeout(() => {
      const replacementId = nextBalloonId.current++
      const replacementIndex = replacementId - initialBalloons.length - 1
      const replacement: Balloon = {
        id: replacementId,
        color: balloonColors[replacementIndex % balloonColors.length],
        slot: balloon.slot,
        entering: true,
        popping: false,
      }

      setBalloons((current) =>
        current.map((item) => item.id === balloon.id ? replacement : item),
      )
    }, 240)
  }

  function finishArrival(balloonId: number) {
    setBalloons((current) =>
      current.map((item) => item.id === balloonId ? { ...item, entering: false } : item),
    )
  }

  return (
    <section className="hero" id="welcome" aria-labelledby="hero-heading">
      <div className="hero__sky" aria-hidden="true">
        <span className="hero__moon" />
        <span className="hero__star hero__star--one" />
        <span className="hero__star hero__star--two" />
        <span className="hero__star hero__star--three" />
        <span className="hero__star hero__star--four" />
        <span className="hero__star hero__star--five" />
        <span className="hero__star hero__star--six" />
        <svg className="hero__landscape" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="hero__aurora">
            <path d="M-40 151C170 77 342 175 522 133s319-89 488-23 291 65 468 8" />
            <path d="M-60 190c190-76 353 13 542-12s320-66 486-4 313 47 491-11" />
          </g>
          <path className="hero__ridge hero__ridge--back" d="M0 245 130 158 250 220 395 112 535 212 680 134 805 220 955 112 1090 214 1230 140 1440 226V420H0Z" />
          <path className="hero__ridge hero__ridge--middle" d="M0 270q185-100 360-10 165 82 345 6 183-76 365-8 190 72 370-2v164H0Z" />
          <g className="hero__snowcaps">
            <path d="m82 190 48-32 41 45-22-12-19-14-18 17-11-8z" />
            <path d="m343 143 52-31 50 42-27-12-22-14-19 18-14-8z" />
            <path d="m631 165 49-31 46 41-24-11-20-15-17 17-12-7z" />
            <path d="m906 143 49-31 48 41-25-10-21-15-17 17-13-7z" />
            <path d="m1183 170 47-30 52 43-27-11-23-15-16 17-15-8z" />
          </g>
          <path className="hero__lake" d="M0 305q228-54 446 0t440 0q260-60 554 4v111H0Z" />
          <path className="hero__reflection" d="M105 335q80-9 160 0m93 29q55-7 110 0m374-49q95-9 190 0m148 47q70-7 140 0M290 396q40-5 80 0m615-19q55-6 110 0" />
          <path className="hero__shore" d="M0 370q230-55 430 6 174 53 353 2 185-53 372-9 159 37 285-5v56H0Z" />
          <g className="hero__pines">
            <path d="m88 365 53-189 54 189h-30l43 55H74l44-55zm1240 0 53-189 54 189h-30l43 55h-134l44-55z" />
          </g>
          <g className="hero__pine-snow">
            <path d="m121 255 20-79 22 78-14-17-8 7-8-7zm1240 0 20-79 22 78-14-17-8 7-8-7z" />
          </g>
          <g className="hero__cottage">
            <path d="M598 284h98v82h-98z" />
            <path d="m584 289 63-55 64 55z" />
            <path d="M638 326h20v40h-20z" />
            <path d="M607 302h18v18h-18zm61 0h18v18h-18z" />
          </g>
          <path className="hero__cottage-snow" d="m584 289 63-55 64 55-17-4-47-39-45 40z" />
        </svg>
        <div className="hero__snowfall" />
      </div>
      <div className="hero__celebration" aria-hidden="true">
        <div className={`hero__ambient-fireworks${birthdayMode ? ' hero__ambient-fireworks--birthday' : ''}`}>
          {ambientFireworks.map((burst) => (
            <span className="hero__ambient-burst" key={burst.id} style={{ top: burst.top, left: burst.left, '--ambient-firework-color': burst.color, '--ambient-firework-delay': burst.delay } as CSSProperties}>
              {Array.from({ length: birthdayMode ? 22 : 16 }, (_, index) => (
                <i key={index} style={{ '--ambient-firework-angle': `${(360 / (birthdayMode ? 22 : 16)) * index}deg`, '--ambient-firework-particle-delay': `${index * 18}ms` } as CSSProperties} />
              ))}
            </span>
          ))}
        </div>
        {birthdayMode && <div className="hero__birthday-fireworks">
          <span className="hero__birthday-burst hero__birthday-burst--one">✦</span>
          <span className="hero__birthday-burst hero__birthday-burst--two">✧</span>
          <span className="hero__birthday-burst hero__birthday-burst--three">✦</span>
        </div>}
        {firework && (
          <div
            className={`hero__firework hero__firework--slot-${firework.slot}`}
            key={firework.id}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <span
                style={{
                  '--firework-angle': `${index * 30}deg`,
                  '--firework-color': ['#fff0ae', '#f0a3a1', '#9fd4cf', '#c8b1e0'][index % 4],
                } as FireworkStyle}
                key={index}
              />
            ))}
          </div>
        )}
        {confettiPieces.map(([className, left]) => (
          <span
            className={`hero__confetti hero__confetti--${className}`}
            style={{ left }}
            key={className}
          />
        ))}
        <span className="hero__spark hero__spark--one">✦</span>
        <span className="hero__spark hero__spark--two">✧</span>
        <span className="hero__spark hero__spark--three">✦</span>
        <div className="hero__chits">
          <span>today is yours</span>
          <span>a little magic</span>
          <span>make a wish</span>
        </div>
      </div>
      {birthdayMode && <div className="hero__birthday-garland" aria-hidden="true"><span>✦</span> HAPPY BIRTHDAY <span>✦</span></div>}
      <button
        type="button"
        className="hero__cake"
        aria-label="Open the birthday candle celebration"
        aria-haspopup="dialog"
        onClick={openBirthdayCelebration}
      >
        <CakeArtwork candlesBlown={false} />
        <span className="hero__cake-hint">Make a wish <span aria-hidden="true">✦</span></span>
      </button>
      <div className="hero__balloons">
        {balloons.map((balloon) => (
            <button
              type="button"
              key={balloon.id}
              className={`hero__balloon-button hero__balloon-button--${balloon.color} hero__balloon-button--slot-${balloon.slot}${
                balloon.entering ? ' is-entering' : ''
              }${balloon.popping ? ' is-popping' : ''}`}
              aria-label={`Pop the ${balloon.color} birthday balloon for a sweet note`}
              onClick={() => popBalloon(balloon)}
              onAnimationEnd={(event) => {
                if (
                  event.target === event.currentTarget &&
                  balloon.entering &&
                  event.animationName.startsWith('hero-balloon-arrive')
                ) {
                  finishArrival(balloon.id)
                }
              }}
            >
              <span className="hero__balloon">
                <i />
              </span>
            </button>
          ))}
      </div>
      <div className="hero__content">
        {birthdayMode && <p className="hero__birthday-today">Today is your day, Manuu ✨</p>}
        <p className="eyebrow">{birthdayContent.welcome.kicker}</p>
        <h1 id="hero-heading">{birthdayContent.greeting}</h1>
        <p className="hero__subtitle">{birthdayContent.welcome.subtitle}</p>
        <p className="hero__birthday-message">{birthdayContent.welcome.birthdayMessage}</p>
        <span className="hero__ornament" aria-hidden="true">✦</span>
        <nav className="hero__actions" aria-label="Explore the birthday site">
          <a className="hero__action hero__action--primary" href="#/world">
            Explore her birthday world <span aria-hidden="true">↓</span>
          </a>
          <a className="hero__action hero__action--secondary" href="#/garden">
            Visit the butterfly garden <span aria-hidden="true">↗</span>
          </a>
        </nav>
        {balloonNote && (
          <p className="hero__balloon-note" role="status" aria-live="polite" key={balloonNote.id}>
            <span aria-hidden="true">✦</span>
            {balloonNote.text}
          </p>
        )}
      </div>
      <dialog
        className="birthday-dialog"
        ref={birthdayDialog}
        aria-labelledby="birthday-dialog-title"
        onCancel={() => setBirthdayOpen(false)}
        onClose={() => setBirthdayOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setBirthdayOpen(false)
        }}
      >
        <button
          type="button"
          className="birthday-dialog__close"
          aria-label="Close birthday celebration"
          onClick={() => setBirthdayOpen(false)}
        >
          ×
        </button>
        {candlesBlown && (
          <div className="birthday-dialog__party" key={celebrationId} aria-hidden="true">
            {partyConfetti.map((color, index) => {
              const style: PartyConfettiStyle = {
                '--confetti-color': color,
                '--confetti-left': `${(index * 37) % 100}%`,
                '--confetti-delay': `${(index % 6) * 0.06}s`,
              }
              return <span key={index} style={style} />
            })}
            <span className="birthday-dialog__spark birthday-dialog__spark--one">✦</span>
            <span className="birthday-dialog__spark birthday-dialog__spark--two">✧</span>
            <span className="birthday-dialog__spark birthday-dialog__spark--three">✦</span>
          </div>
        )}
        <div className="birthday-dialog__content">
          <p className="birthday-dialog__eyebrow">A little birthday magic</p>
          <h2 id="birthday-dialog-title">
            {candlesBlown ? 'Happy Birthday, Manuu!' : 'Make a wish, Manuu'}
          </h2>
          <CakeArtwork candlesBlown={candlesBlown} inDialog />
          <p className="birthday-dialog__message">
            {candlesBlown
              ? 'May your year be full of bright surprises, warm people, and wishes coming true.'
              : 'Take a breath, think of a wish, and blow out the candles.'}
          </p>
          <button
            type="button"
            className="birthday-dialog__celebrate"
            onClick={candlesBlown ? () => void playBirthdaySong() : blowOutCandles}
          >
            {candlesBlown ? 'Play Happy Birthday again' : 'Blow out the candles'}
          </button>
          <p className="birthday-dialog__song-status" role="status" aria-live="polite">
            {birthdaySongStatus}
          </p>
        </div>
      </dialog>
    </section>
  )
}

function CakeArtwork({
  candlesBlown,
  inDialog = false,
}: {
  candlesBlown: boolean
  inDialog?: boolean
}) {
  return (
    <span
      className={`birthday-cake${inDialog ? ' birthday-dialog__cake' : ''}${
        candlesBlown ? ' birthday-cake--blown' : ''
      }`}
      aria-hidden="true"
    >
      <span className="hero__cake-flame" />
      <span className="hero__cake-candle" />
      <span className="hero__cake-candle hero__cake-candle--two" />
      <span className="hero__cake-candle hero__cake-candle--three" />
      <span className="hero__cake-top" />
      <span className="hero__cake-berry" />
      <span className="hero__cake-base" />
      <span className="hero__cake-plate" />
    </span>
  )
}

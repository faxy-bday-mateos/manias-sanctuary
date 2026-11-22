import { useRef, useState, type CSSProperties } from 'react'
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

export function Hero() {
  const [balloons, setBalloons] = useState(initialBalloons)
  const [balloonNote, setBalloonNote] = useState<{ id: number; text: string } | null>(null)
  const [firework, setFirework] = useState<{ id: number; slot: BalloonSlot } | null>(null)
  const nextBalloonId = useRef(initialBalloons.length + 1)
  const nextNoteIndex = useRef(0)
  const nextFireworkId = useRef(0)

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
          <path className="hero__ridge hero__ridge--back" d="M0 245 130 158 250 220 395 112 535 212 680 134 805 220 955 112 1090 214 1230 140 1440 226V420H0Z" />
          <path className="hero__ridge hero__ridge--middle" d="M0 270q185-100 360-10 165 82 345 6 183-76 365-8 190 72 370-2v164H0Z" />
          <path className="hero__lake" d="M0 305q228-54 446 0t440 0q260-60 554 4v111H0Z" />
          <path className="hero__reflection" d="M105 335q80-9 160 0m93 29q55-7 110 0m374-49q95-9 190 0m148 47q70-7 140 0M290 396q40-5 80 0m615-19q55-6 110 0" />
          <path className="hero__shore" d="M0 370q230-55 430 6 174 53 353 2 185-53 372-9 159 37 285-5v56H0Z" />
          <g className="hero__pines">
            <path d="m88 365 53-189 54 189h-30l43 55H74l44-55zm1240 0 53-189 54 189h-30l43 55h-134l44-55z" />
          </g>
          <g className="hero__cottage">
            <path d="M598 284h98v82h-98z" />
            <path d="m584 289 63-55 64 55z" />
            <path d="M638 326h20v40h-20z" />
            <path d="M607 302h18v18h-18zm61 0h18v18h-18z" />
          </g>
        </svg>
      </div>
      <div className="hero__celebration" aria-hidden="true">
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
        <div className="hero__cake">
          <span className="hero__cake-flame" />
          <span className="hero__cake-candle" />
          <span className="hero__cake-candle hero__cake-candle--two" />
          <span className="hero__cake-candle hero__cake-candle--three" />
          <span className="hero__cake-top" />
          <span className="hero__cake-base" />
          <span className="hero__cake-plate" />
        </div>
      </div>
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
        <p className="eyebrow">{birthdayContent.welcome.kicker}</p>
        <h1 id="hero-heading">{birthdayContent.greeting}</h1>
        <p className="hero__subtitle">{birthdayContent.welcome.subtitle}</p>
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
    </section>
  )
}

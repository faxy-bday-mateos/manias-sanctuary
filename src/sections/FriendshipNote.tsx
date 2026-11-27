import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { birthdayContent } from '../birthdayContent'

const mazeRows = [
  ['start', 'open', 'open', 'wall', 'open'],
  ['wall', 'open', 'wall', 'open', 'open'],
  ['open', 'open', 'open', 'open', 'wall'],
  ['wall', 'open', 'wall', 'open', 'open'],
  ['open', 'open', 'open', 'wall', 'goal'],
] as const

const directions = [
  { name: 'Up', key: 'ArrowUp', dx: 0, dy: -1, icon: '↑' },
  { name: 'Left', key: 'ArrowLeft', dx: -1, dy: 0, icon: '←' },
  { name: 'Down', key: 'ArrowDown', dx: 0, dy: 1, icon: '↓' },
  { name: 'Right', key: 'ArrowRight', dx: 1, dy: 0, icon: '→' },
] as const

const fireflyChoices = [
  { id: 'moon', label: 'Moon', icon: '☾' },
  { id: 'flower', label: 'Flower', icon: '✿' },
  { id: 'firefly', label: 'Firefly', icon: '✦' },
] as const

const patternRounds = [
  ['moon', 'flower', 'firefly'],
  ['firefly', 'moon', 'flower', 'moon'],
  ['flower', 'firefly', 'moon', 'flower', 'firefly'],
] as const

const memoryFaces = [
  { id: 'moon-a', pair: 'moon', icon: '☾', label: 'Moon' },
  { id: 'flower-a', pair: 'flower', icon: '✿', label: 'Flower' },
  { id: 'heart-a', pair: 'heart', icon: '♡', label: 'Heart' },
  { id: 'leaf-a', pair: 'leaf', icon: '❧', label: 'Leaf' },
  { id: 'leaf-b', pair: 'leaf', icon: '❧', label: 'Leaf' },
  { id: 'moon-b', pair: 'moon', icon: '☾', label: 'Moon' },
  { id: 'heart-b', pair: 'heart', icon: '♡', label: 'Heart' },
  { id: 'flower-b', pair: 'flower', icon: '✿', label: 'Flower' },
] as const

const celebrationStickers = ['♡', '✦', '♡', '✿', '♡', '✧', '♡', '✦', '♡', '✿', '♡', '✧', '♡', '✦', '♡', '✿']
const celebrationFireworks = [
  { left: '15%', top: '24%', delay: '-1.2s' },
  { left: '82%', top: '20%', delay: '-2.3s' },
  { left: '72%', top: '63%', delay: '-.4s' },
]

type MemoryCard = (typeof memoryFaces)[number]

function shuffleCards(cards: readonly MemoryCard[]): MemoryCard[] {
  const shuffled = [...cards]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  return shuffled
}

export function FriendshipNote() {
  const [stage, setStage] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visited, setVisited] = useState<Set<string>>(() => new Set(['0,0']))
  const [hint, setHint] = useState(false)
  const [status, setStatus] = useState('The note is waiting at the end of the garden path.')
  const [patternRound, setPatternRound] = useState(0)
  const [playbackIndex, setPlaybackIndex] = useState<number | null>(null)
  const [litChoice, setLitChoice] = useState<string | null>(null)
  const [patternInput, setPatternInput] = useState<string[]>([])
  const [cards] = useState<MemoryCard[]>(() => shuffleCards(memoryFaces))
  const [flipped, setFlipped] = useState<string[]>([])
  const [matches, setMatches] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    if (stage !== 2 || playbackIndex === null) return

    const sequence = patternRounds[patternRound]
    if (playbackIndex >= sequence.length) {
      const timer = window.setTimeout(() => {
        setPlaybackIndex(null)
        setLitChoice(null)
        setStatus('Your turn. Repeat the firefly pattern in the same order.')
      }, 350)
      return () => window.clearTimeout(timer)
    }

    const nextLight = sequence[playbackIndex]
    setLitChoice(nextLight)
    const lightName = fireflyChoices.find(({ id }) => id === nextLight)?.label
    setStatus(`Watch light ${playbackIndex + 1} of ${sequence.length}: ${lightName}.`)
    const timer = window.setTimeout(() => {
      setLitChoice(null)
      setPlaybackIndex(playbackIndex + 1)
    }, 680)
    return () => window.clearTimeout(timer)
  }, [stage, patternRound, playbackIndex])

  useEffect(() => {
    if (stage !== 3 || flipped.length !== 2) return

    const first = cards.find((card) => card.id === flipped[0])
    const second = cards.find((card) => card.id === flipped[1])
    if (!first || !second) return

    const timer = window.setTimeout(() => {
      if (first.pair === second.pair) {
        const nextMatches = new Set(matches)
        nextMatches.add(first.pair)
        setMatches(nextMatches)
        setStatus('A pair found. Keep going; the note is almost yours.')
        if (nextMatches.size === 4) {
          setStatus('Every pair is together. Your note is ready.')
          setStage(4)
        }
      } else {
        setStatus('Not a match this time. Try to remember where each one was.')
      }
      setFlipped([])
    }, first.pair === second.pair ? 350 : 850)

    return () => window.clearTimeout(timer)
  }, [stage, flipped, cards, matches])

  function move(dx: number, dy: number) {
    if (stage !== 1) return

    const x = position.x + dx
    const y = position.y + dy

    if (
      x < 0 ||
      x >= mazeRows[0].length ||
      y < 0 ||
      y >= mazeRows.length ||
      mazeRows[y][x] === 'wall'
    ) {
      setStatus('A little pause in the path. Try another direction.')
      return
    }

    const nextVisited = new Set(visited)
    nextVisited.add(`${x},${y}`)
    setPosition({ x, y })
    setVisited(nextVisited)

    if (mazeRows[y][x] === 'goal') {
      setStage(2)
      setPlaybackIndex(0)
      setStatus('The path is open. Watch the fireflies, then repeat their pattern.')
    } else {
      setStatus('One gentle step closer.')
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const direction = directions.find(({ key }) => key === event.key)
    if (!direction) return
    event.preventDefault()
    move(direction.dx, direction.dy)
  }

  function chooseFirefly(id: string) {
    if (stage !== 2 || playbackIndex !== null) return

    const sequence = patternRounds[patternRound]
    const nextInput = [...patternInput, id]
    if (sequence[nextInput.length - 1] !== id) {
      setPatternInput([])
      setPlaybackIndex(0)
      setStatus('A different order this time. Watch the lights again.')
      return
    }

    if (nextInput.length === sequence.length) {
      setPatternInput([])
      if (patternRound === patternRounds.length - 1) {
        setStage(3)
        setStatus('Beautifully remembered. Find all four matching pairs.')
      } else {
        setPatternRound(patternRound + 1)
        setPlaybackIndex(0)
        setStatus('You have it. The next firefly pattern is a little longer.')
      }
      return
    }

    setPatternInput(nextInput)
    setStatus(`${nextInput.length} of ${sequence.length} lights remembered.`)
  }

  function chooseMemoryCard(card: MemoryCard) {
    if (
      stage !== 3 ||
      flipped.length === 2 ||
      flipped.includes(card.id) ||
      matches.has(card.pair)
    ) return
    setFlipped([...flipped, card.id])
  }

  function resetJourney() {
    setStage(1)
    setPosition({ x: 0, y: 0 })
    setVisited(new Set(['0,0']))
    setHint(false)
    setPatternRound(0)
    setPlaybackIndex(null)
    setLitChoice(null)
    setPatternInput([])
    setFlipped([])
    setMatches(new Set())
    setStatus('The note is waiting at the end of the garden path.')
  }

  const stageNames = ['Garden maze', 'Firefly pattern', 'Memory garden']

  return (
    <section
      className={`section friendship${stage === 4 ? ' friendship--celebrating' : ''}`}
      id="friendship-note"
      aria-labelledby="friendship-title"
    >
      {stage === 4 && <div className="friendship__celebration" aria-hidden="true">
        {celebrationStickers.map((symbol, index) => (
          <span
            className={`friendship__sticker${symbol === '♡' ? ' friendship__sticker--heart' : ''}`}
            style={{ left: `${(index * 37 + 6) % 94}%`, animationDelay: `${-((index * 1.17) % 10)}s`, animationDuration: `${7 + (index % 5)}s`, fontSize: `${1 + (index % 3) * 0.35}rem` }}
            key={`${symbol}-${index}`}
          >{symbol}</span>
        ))}
        {celebrationFireworks.map((firework) => (
          <span className="friendship__firework" style={{ left: firework.left, top: firework.top, animationDelay: firework.delay }} key={firework.left}>
            {Array.from({ length: 12 }, (_, index) => <i style={{ '--note-firework-angle': `${index * 30}deg` } as CSSProperties} key={index} />)}
          </span>
        ))}
      </div>}
      <div className="friendship__journey">
        <header className="friendship__journey-heading">
          <span className="friendship__eyebrow">A small moment of care</span>
          <h1 id="friendship-title">A Note for You</h1>
          <p>
            Follow three little games through the garden. Each one brings you a
            little closer to the note.
          </p>
        </header>

        {stage <= 4 && (
          <ol className="friendship__progress" aria-label="Note journey progress">
            {stageNames.map((name, index) => (
              <li
                className={index + 1 < stage ? 'is-complete' : index + 1 === stage && stage < 4 ? 'is-current' : ''}
                aria-current={index + 1 === stage && stage < 4 ? 'step' : undefined}
                key={name}
              >
                <span>{index + 1 < stage ? '✓' : `0${index + 1}`}</span>
                <small>{name}</small>
              </li>
            ))}
          </ol>
        )}

        {stage === 1 && (
          <div className="friendship__maze-wrap">
            <p className="friendship__game-title">01 · Find the garden path</p>
            <div
              className="friendship__maze"
              role="grid"
              aria-label="Garden path maze. Guide the glowing star to the envelope."
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              {mazeRows.map((row, y) => (
                <div className="friendship__maze-row" role="row" key={y}>
                  {row.map((cell, x) => {
                    const key = `${x},${y}`
                    const occupied = position.x === x && position.y === y
                    const wasVisited = visited.has(key)
                    const icon =
                      occupied ? '✦' : cell === 'goal' ? '✉' : cell === 'wall' ? '✿' : wasVisited ? '·' : ''

                    return (
                      <div
                        className={[
                          'friendship__cell',
                          `friendship__cell--${cell}`,
                          wasVisited ? 'is-visited' : '',
                          occupied ? 'is-current' : '',
                        ].filter(Boolean).join(' ')}
                        role="gridcell"
                        aria-label={
                          occupied
                            ? 'Your place on the path'
                            : cell === 'wall'
                              ? 'Garden obstacle'
                              : cell === 'goal'
                                ? 'Envelope at the end of the path'
                                : wasVisited ? 'Garden path' : 'Unexplored path'
                        }
                        key={key}
                      >
                        <span aria-hidden="true">{icon}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="friendship__controls" aria-label="Path controls">
              {directions.map((direction) => (
                <button
                  type="button"
                  key={direction.name}
                  aria-label={`Move ${direction.name.toLowerCase()}`}
                  onClick={() => move(direction.dx, direction.dy)}
                >
                  {direction.icon}
                </button>
              ))}
            </div>
            <p className="friendship__status" role="status" aria-live="polite">{status}</p>
            <div className="friendship__journey-actions">
              <button type="button" className="friendship__hint-toggle" onClick={() => setHint((shown) => !shown)}>
                {hint ? 'Hide hint' : 'A little hint'}
              </button>
              <button type="button" className="friendship__reset" onClick={resetJourney}>Start again</button>
            </div>
            {hint && (
              <p className="friendship__hint" role="note">From the start, go right once, then follow the path downward. The flowers mark places to pause.</p>
            )}
          </div>
        )}

        {stage === 2 && (
          <div className="friendship__maze-wrap friendship__game">
            <p className="friendship__game-title">02 · Follow the fireflies</p>
            <p className="friendship__game-copy">
              Watch each light, then repeat the pattern. It grows longer each round.
            </p>
            <div className="friendship__fireflies" aria-label={`Round ${patternRound + 1} of ${patternRounds.length}`}>
              {patternRounds[patternRound].map((id, index) => (
                <span className={`friendship__firefly ${litChoice === id && playbackIndex === index ? 'is-lit' : ''}`} aria-hidden="true" key={`${id}-${index}`}>
                  {litChoice === id && playbackIndex === index
                    ? fireflyChoices.find((choice) => choice.id === id)?.icon
                    : '·'}
                </span>
              ))}
            </div>
            <div className="friendship__choice-grid" aria-label="Repeat the firefly sequence">
              {fireflyChoices.map((choice) => (
                <button
                  className={litChoice === choice.id ? 'is-lit' : ''}
                  type="button"
                  key={choice.id}
                  disabled={playbackIndex !== null}
                  aria-label={choice.label}
                  onClick={() => chooseFirefly(choice.id)}
                >
                  <span aria-hidden="true">{choice.icon}</span>
                  <small>{choice.label}</small>
                </button>
              ))}
            </div>
            {playbackIndex === null && (
              <button className="friendship__replay" type="button" onClick={() => setPlaybackIndex(0)}>
                Replay pattern
              </button>
            )}
            <p className="friendship__status" role="status" aria-live="polite">{status}</p>
            <button className="friendship__replay" type="button" onClick={resetJourney}>Restart journey</button>
          </div>
        )}

        {stage === 3 && (
          <div className="friendship__maze-wrap friendship__game">
            <p className="friendship__game-title">03 · Pair the garden keepsakes</p>
            <p className="friendship__game-copy">
              Turn over two cards at a time and find all four matching pairs.
            </p>
            <div className="friendship__memory-grid" aria-label="Memory matching game">
              {cards.map((card, index) => {
                const isFaceUp = flipped.includes(card.id) || matches.has(card.pair)
                return (
                  <button
                    className={`friendship__memory-card${isFaceUp ? ' is-face-up' : ''}${matches.has(card.pair) ? ' is-matched' : ''}`}
                    type="button"
                    key={card.id}
                    aria-label={isFaceUp ? `${card.label}${matches.has(card.pair) ? ', matched' : ''}` : `Hidden card ${index + 1}`}
                    aria-pressed={isFaceUp}
                    disabled={matches.has(card.pair) || (flipped.length === 2 && !flipped.includes(card.id))}
                    onClick={() => chooseMemoryCard(card)}
                  >
                    <span aria-hidden="true">{isFaceUp ? card.icon : '✧'}</span>
                    <small>{isFaceUp ? card.label : `0${index + 1}`}</small>
                  </button>
                )
              })}
            </div>
            <p className="friendship__status" role="status" aria-live="polite">{status}</p>
            <button className="friendship__replay" type="button" onClick={resetJourney}>Restart journey</button>
          </div>
        )}

        {stage === 4 && (
          <article className="friendship__paper">
            <header className="friendship__header">
              <span className="friendship__eyebrow">A birthday keepsake</span>
              <span className="friendship__mark" aria-hidden="true">
                <svg viewBox="0 0 48 48" focusable="false">
                  <path d="M7 14.5h34v23H7zM7 15l17 13 17-13M7 37.5l12-12M41 37.5 29 25.5" />
                  <path d="M24 7v9m-4.5-4.5h9" />
                </svg>
              </span>
              <h2>A little note, chosen with care</h2>
              <span className="friendship__rule" aria-hidden="true" />
            </header>
            <p className="eyebrow friendship__kicker">{birthdayContent.friendship.kicker}</p>
            <h3>{birthdayContent.friendship.title}</h3>
            <p className="friendship__paragraph">{birthdayContent.friendship.paragraph}</p>
            <ul className="friendship__reasons" aria-label="What I value in our friendship">
              {birthdayContent.friendship.reasons.map((reason) => (
                <li key={reason.text}><span aria-hidden="true">{reason.symbol}</span>{reason.text}</li>
              ))}
            </ul>
            <footer className="friendship__signoff">
              <span className="friendship__closing">{birthdayContent.friendship.closing}</span>
              <span className="friendship__flourish" aria-hidden="true">✦　✦　✦</span>
            </footer>
          </article>
        )}
      </div>
    </section>
  )
}

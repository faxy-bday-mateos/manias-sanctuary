import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  butterflySpecies,
  fireflySpecies,
  gardenReflections,
  type GardenRarity,
} from '../gardenContent'

type CreatureKind = 'butterfly' | 'firefly'

type GardenCreature = {
  id: number
  kind: CreatureKind
  speciesId: string
  name: string
  scientificName: string
  region: string
  rarity: GardenRarity
  wingColor: string
  detailColor: string
  x: number
  y: number
  delay: number
  duration: number
  driftX: number
  driftY: number
  driftBackX: number
  driftBackY: number
  entering: boolean
  entryX: number
  entryY: number
}

type GardenStyle = CSSProperties & {
  '--wing-color': string
  '--detail-color': string
  '--flight-delay': string
  '--flight-duration': string
  '--drift-x': string
  '--drift-y': string
  '--drift-back-x': string
  '--drift-back-y': string
  '--garden-x': string
  '--garden-y': string
  '--entry-x': string
  '--entry-y': string
}

type CollectionEntry = {
  key: string
  kind: CreatureKind
  name: string
  scientificName: string
  region: string
  rarity: GardenRarity
  count: number
}

type CaptureMessage = {
  creature: GardenCreature
  reflection: string
}

const rarityWeight: Record<GardenRarity, number> = {
  Common: 36,
  Uncommon: 30,
  Rare: 20,
  Epic: 10,
  Legendary: 4,
}

const rarityOrder: GardenRarity[] = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
]

const maximumVisibleCreatures = 10
const spawnIntervalMs = 1500

function choose<T extends { rarity: GardenRarity }>(items: readonly T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + rarityWeight[item.rarity], 0)
  let choice = Math.random() * totalWeight

  for (const item of items) {
    choice -= rarityWeight[item.rarity]
    if (choice < 0) return item
  }

  return items[items.length - 1]
}

function createCreature(
  id: number,
  excludedSpecies: ReadonlySet<string>,
  forceKind?: CreatureKind,
  entering = false,
): GardenCreature {
  const isFirefly = forceKind ? forceKind === 'firefly' : Math.random() < 0.38
  let speciesId: string
  let name: string
  let scientificName: string
  let region: string
  let rarity: GardenRarity
  let wingColor: string
  let detailColor: string

  if (isFirefly) {
    const species = choose(fireflySpecies)
    speciesId = species.id
    name = species.name
    scientificName = species.scientificName
    region = species.region
    rarity = species.rarity
    wingColor = species.color
    detailColor = species.color
  } else {
    const availableSpecies = butterflySpecies.filter(
      (butterfly) => !excludedSpecies.has(`butterfly:${butterfly.id}`),
    )
    const species = choose(
      availableSpecies.length > 0 ? availableSpecies : butterflySpecies,
    )
    speciesId = species.id
    name = species.name
    scientificName = species.scientificName
    region = species.region
    rarity = species.rarity
    wingColor = species.wing
    detailColor = species.detail
  }

  const x = 5 + Math.random() * 88
  const y = 7 + Math.random() * 84
  const edge = Math.floor(Math.random() * 4)

  return {
    id,
    kind: isFirefly ? 'firefly' : 'butterfly',
    speciesId,
    name,
    scientificName,
    region,
    rarity,
    wingColor,
    detailColor,
    x,
    y,
    delay: Math.random() * -4,
    duration: 5 + Math.random() * 5,
    driftX: 12 + Math.random() * 32,
    driftY: 14 + Math.random() * 28,
    driftBackX: -16 - Math.random() * 34,
    driftBackY: 10 + Math.random() * 24,
    entering,
    entryX: edge === 0 ? -12 : edge === 1 ? 112 : x,
    entryY: edge === 2 ? -14 : edge === 3 ? 114 : y,
  }
}

function ButterflyShape() {
  return (
    <svg viewBox="0 0 64 54" aria-hidden="true" focusable="false">
      <path className="garden-wing" d="M30 26C22 8 8 3 5 10 1 19 14 29 30 29Z" />
      <path className="garden-wing" d="M34 26C42 8 56 3 59 10c4 9-9 19-25 19Z" />
      <path className="garden-wing garden-wing--lower" d="M30 29C18 23 10 29 14 39c3 7 11 8 17-5Z" />
      <path className="garden-wing garden-wing--lower" d="M34 29c12-6 20 0 16 10-3 7-11 8-17-5Z" />
      <path className="garden-mark" d="M13 13c4 0 7 3 9 7m29-7c-4 0-7 3-9 7M18 32c3 0 6 2 8 5m20-5c-3 0-6 2-8 5" />
      <path className="garden-body" d="M31 20c0-5 2-8 4-9m-4 9c0-5-2-8-4-9m5 7v22" />
      <ellipse className="garden-body" cx="32" cy="31" rx="2.2" ry="10" />
    </svg>
  )
}

function FireflyShape() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true" focusable="false">
      <circle className="firefly-halo" cx="26" cy="26" r="20" />
      <path className="firefly-wing" d="M24 24c-9-13-17-3-7 5m11-5c9-13 17-3 7 5" />
      <ellipse className="firefly-body" cx="26" cy="29" rx="4" ry="10" />
      <circle className="firefly-glow" cx="26" cy="37" r="4" />
    </svg>
  )
}

export function ButterflyGarden() {
  const [creatures, setCreatures] = useState<GardenCreature[]>(() => {
    const initialSpecies = new Set<string>()
    return Array.from({ length: 6 }, (_, index) => {
      const creature = createCreature(
        index + 1,
        initialSpecies,
        index === 2 || index === 5 ? 'firefly' : 'butterfly',
      )
      initialSpecies.add(`${creature.kind}:${creature.speciesId}`)
      return creature
    })
  })
  const [collection, setCollection] = useState<Record<string, CollectionEntry>>({})
  const [capture, setCapture] = useState<CaptureMessage | null>(null)
  const [jarOpen, setJarOpen] = useState(false)
  const nextId = useRef(7)
  const reflectionIndex = useRef(0)
  const collectedSpecies = useRef(new Set<string>())

  useEffect(() => {
    let lastSpawn = Date.now()

    const timer = window.setInterval(() => {
      const currentTime = Date.now()
      if (currentTime - lastSpawn < spawnIntervalMs) return

      lastSpawn = currentTime
      const spawnId = nextId.current++
      setCreatures((current) => {
        const visible = [...current]

        if (visible.length < maximumVisibleCreatures) {
          const visibleSpecies = new Set(collectedSpecies.current)
          let visibleFireflies = 0
          visible.forEach((creature) => {
            visibleSpecies.add(`${creature.kind}:${creature.speciesId}`)
            if (creature.kind === 'firefly') visibleFireflies += 1
          })
          visible.push(
            createCreature(
              spawnId,
              visibleSpecies,
              visibleFireflies < 2 ? 'firefly' : undefined,
              !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            ),
          )
        }

        return visible
      })
    }, 500)

    return () => window.clearInterval(timer)
  }, [])

  function collect(creature: GardenCreature) {
    const key = `${creature.kind}:${creature.speciesId}`
    collectedSpecies.current.add(key)
    setCreatures((current) =>
      current.filter((visibleCreature) => visibleCreature.id !== creature.id),
    )
    setCollection((current) => ({
      ...current,
      [key]: {
        key,
        kind: creature.kind,
        name: creature.name,
        scientificName: creature.scientificName,
        region: creature.region,
        rarity: creature.rarity,
        count: (current[key]?.count ?? 0) + 1,
      },
    }))
    setCapture({
      creature,
      reflection:
        gardenReflections[
          reflectionIndex.current++ % gardenReflections.length
        ],
    })
  }

  const entries = Object.values(collection).sort(
    (a, b) =>
      rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity) ||
      a.name.localeCompare(b.name),
  )
  const totalCollected = entries.reduce((sum, entry) => sum + entry.count, 0)
  const uniqueButterflies = entries.filter(
    (entry) => entry.kind === 'butterfly',
  ).length

  return (
    <section className="garden-panel" aria-labelledby="garden-title">
      <div className="garden-landscape" aria-hidden="true">
        <span className="garden-moon" />
        <svg
          className="garden-scenery"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="garden-lake" x2="0" y2="1">
              <stop offset="0" stopColor="#648d86" />
              <stop offset="1" stopColor="#243f49" />
            </linearGradient>
            <linearGradient id="garden-shore" x2="0" y2="1">
              <stop stopColor="#8e9867" />
              <stop offset="1" stopColor="#3c5948" />
            </linearGradient>
          </defs>
          <path
            className="garden-distant-ridge"
            d="M0 495 120 430 220 472 360 382 485 466 620 392 755 469 890 374 1030 462 1170 390 1305 456 1440 392V710H0Z"
          />
          <g className="garden-tree-line">
            <path d="m455 605 34-146 35 146h-18l29 73h-97l30-73z" />
            <path d="m550 615 28-115 30 115h-17l24 57h-75l25-57z" />
            <path d="m870 600 38-162 39 162h-21l31 78h-98l31-78z" />
            <path d="m979 614 28-112 30 112h-17l24 59h-76l25-59z" />
          </g>
          <path className="garden-lake" d="M0 632q235-42 470 4t474 0q260-40 496 6v258H0Z" />
          <g className="garden-water-glints">
            <path d="M78 706q64-8 128 0m93 39q48-7 96 0m174-48q82-9 164 0m147 48q67-8 134 0m107-56q42-6 84 0m-973 140q54-7 108 0m458-20q72-9 144 0m165 30q55-7 110 0" />
            <path d="M52 792q25-4 50 0m340-69q28-4 56 0m519 15q32-4 64 0m-236 117q29-4 58 0" />
          </g>
          <g className="garden-cottage">
            <path className="cottage-shadow" d="M600 674h254v27H600z" />
            <path className="cottage-wall" d="M641 552h169v135H641z" />
            <path className="cottage-roof" d="m619 562 105-91 109 91z" />
            <path className="cottage-chimney" d="M769 494h25v57h-25z" />
            <path className="cottage-door" d="M705 609h43v78h-43z" />
            <path className="cottage-window cottage-window--left" d="M656 583h32v35h-32z" />
            <path className="cottage-window cottage-window--right" d="M766 583h31v35h-31z" />
            <path className="cottage-window-cross" d="M672 583v35m-16-18h32m94-17v35m-15-18h31" />
            <path className="cottage-step" d="M695 687h62v9h-62z" />
            <path className="cottage-path" d="m716 695-49 112h139l-62-112z" />
          </g>
          <g className="garden-foreground-trees">
            <path d="m70 724 77-267 78 267h-41l63 115H48l62-115z" />
            <path d="m254 755 57-194 58 194h-31l46 85H239l46-85z" />
            <path d="m1162 733 78-275 80 275h-43l64 112h-201l65-112z" />
            <path d="m1008 766 56-192 58 192h-31l46 79h-145l46-79z" />
          </g>
          <g className="garden-shore">
            <path d="M0 778q195-76 408-18 169 46 324 0 197-59 386-7 189 52 322-13v160H0Z" />
          </g>
          <g className="garden-meadow">
            <path d="M0 817q215-62 420-7 186 50 360 5 205-54 390 8 153 50 270-3v80H0Z" />
          </g>
          <g className="garden-flower-patch">
            <circle cx="305" cy="820" r="5" /><circle cx="318" cy="827" r="4" />
            <circle cx="1070" cy="817" r="5" /><circle cx="1084" cy="824" r="4" />
            <circle cx="440" cy="856" r="4" /><circle cx="986" cy="852" r="4" />
          </g>
          <g className="garden-smoke">
            <circle cx="781" cy="478" r="8" /><circle cx="790" cy="454" r="6" />
            <circle cx="784" cy="433" r="4" />
          </g>
        </svg>
      </div>

      <div className="garden-heading">
        <p className="garden-kicker">A little world of wings and light</p>
        <h1 id="garden-title">The Butterfly Garden</h1>
        <p>
          Catch a visitor to add it to your jar and find a small thought to
          carry with you.
        </p>
        <small>
          25 butterfly species from around the world. Garden rarity is a playful
          encounter tier, not conservation status.
        </small>
      </div>

      <div
        className="garden-field"
        role="group"
        aria-label="Butterflies and fireflies drifting through the garden"
      >
        {creatures.map((creature) => {
          const style: GardenStyle = {
            '--wing-color': creature.wingColor,
            '--detail-color': creature.detailColor,
            '--flight-delay': `${creature.delay}s`,
            '--flight-duration': `${creature.duration}s`,
            '--drift-x': `${creature.driftX}px`,
            '--drift-y': `${creature.driftY}px`,
            '--drift-back-x': `${creature.driftBackX}px`,
            '--drift-back-y': `${creature.driftBackY}px`,
            '--garden-x': `${creature.x}%`,
            '--garden-y': `${creature.y}%`,
            '--entry-x': `${creature.entryX}%`,
            '--entry-y': `${creature.entryY}%`,
          }

          return (
            <button
              type="button"
              key={creature.id}
              className={`garden-creature garden-creature--${creature.kind}${
                creature.entering ? ' garden-creature--entering' : ''
              }`}
              style={style}
              onAnimationEnd={(event) => {
                if (
                  event.target === event.currentTarget &&
                  event.animationName === 'garden-arrive'
                ) {
                  setCreatures((current) =>
                    current.map((visibleCreature) =>
                      visibleCreature.id === creature.id
                        ? { ...visibleCreature, entering: false }
                        : visibleCreature,
                    ),
                  )
                }
              }}
              aria-label={`Catch ${creature.name}, ${creature.scientificName}, ${creature.rarity}, found in ${creature.region}`}
              onClick={() => collect(creature)}
            >
              {creature.kind === 'butterfly' ? (
                <ButterflyShape />
              ) : (
                <FireflyShape />
              )}
              <span className="garden-creature__name" aria-hidden="true">
                {creature.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="garden-quote" role="status" aria-live="polite">
        {capture ? (
          <>
            <p className="garden-quote__label">
              {capture.creature.name} · {capture.creature.rarity}
            </p>
            <blockquote>“{capture.reflection}”</blockquote>
          </>
        ) : (
          <p className="garden-quote__hint">
            A small reflection will appear here with each visitor you catch.
          </p>
        )}
      </div>

      <aside className="garden-jar-area">
        <div
          className="garden-jar-inventory"
          id="garden-collection"
          role="region"
          aria-label="Collected garden visitors"
          hidden={!jarOpen}
        >
            <div className="garden-jar-inventory__heading">
              <strong>Your little collection</strong>
              <span>
                {uniqueButterflies} / {butterflySpecies.length} butterflies
              </span>
            </div>
            {entries.length === 0 ? (
              <p className="garden-jar-inventory__empty">
                Your jar is waiting for its first visitor.
              </p>
            ) : (
              <ul>
                {entries.map((entry) => (
                  <li key={entry.key}>
                    <span
                      className={`garden-inventory__icon garden-inventory__icon--${entry.kind}`}
                      aria-hidden="true"
                    >
                      {entry.kind === 'firefly' ? '✦' : '❋'}
                    </span>
                    <span className="garden-inventory__name">
                      <strong>{entry.name}</strong>
                      <small>
                        {entry.scientificName}
                      </small>
                      <small>{entry.region} · {entry.rarity}</small>
                    </span>
                    <span className="garden-inventory__count">
                      ×{entry.count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
        </div>

        <button
          type="button"
          className="garden-jar"
          aria-expanded={jarOpen}
          aria-controls="garden-collection"
          aria-label={`Collection jar, ${totalCollected} visitors collected`}
          onClick={() => setJarOpen((open) => !open)}
        >
          <svg viewBox="0 0 76 88" aria-hidden="true" focusable="false">
            <path
              className="garden-jar__lid"
              d="M22 8h32v10H22zM18 17h40v7H18z"
            />
            <path
              className="garden-jar__glass"
              d="M20 24h36l-3 48a9 9 0 0 1-9 8H32a9 9 0 0 1-9-8z"
            />
            <path className="garden-jar__glint" d="m28 32-2 30m7-30-1 16" />
            <circle className="garden-jar__spark" cx="45" cy="47" r="4" />
            <circle className="garden-jar__spark" cx="37" cy="61" r="3" />
            <circle className="garden-jar__spark" cx="48" cy="67" r="2.5" />
          </svg>
          <span>
            Jar <strong>{totalCollected}</strong>
          </span>
          <span className="garden-jar__hint">
            {jarOpen ? 'Close collection' : 'View collection'}
          </span>
        </button>
      </aside>
    </section>
  )
}

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import {
  butterflySpecies,
  fireflySpecies,
  gardenHabitats,
  gardenReflections,
  type GardenHabitatId,
  type GardenRarity,
} from '../gardenContent'
import {
  drawSeasonalScene,
  drawSeasonalMotion,
  gardenTreePerches,
  getSeasonalScenery,
  seasonalSceneries,
  type SeasonalSceneryId,
} from '../seasonalScenery'

type CreatureKind = 'butterfly' | 'firefly'
type CreatureBehavior = 'drift' | 'follow' | 'perch'

type GardenPointer = {
  x: number
  y: number
}

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
  behavior: CreatureBehavior
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
  speciesId: string
  name: string
  scientificName: string
  region: string
  rarity: GardenRarity
  wingColor: string
  detailColor: string
  habitat: GardenHabitatId
  reflection: string
  count: number
}

type WingPatternStyle = CSSProperties & {
  '--wing-color': string
  '--detail-color': string
}

type CaptureMessage = {
  creature: GardenCreature
  reflection: string
}

type SavedGarden = {
  collection: Record<string, CollectionEntry>
  error: string | null
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
const collectionStorageKey = 'manias-sanctuary:butterfly-garden:v1'
const bloomMilestones = [3, 8, 15, butterflySpecies.length + fireflySpecies.length]
const bloomNames = [
  'First blooms',
  'Cottage lights',
  'Grove glimmers',
  'Island in full bloom',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isGardenRarity(value: unknown): value is GardenRarity {
  return typeof value === 'string' && rarityOrder.some((rarity) => rarity === value)
}

function isGardenHabitatId(value: unknown): value is GardenHabitatId {
  return (
    typeof value === 'string' &&
    gardenHabitats.some((habitat) => habitat.id === value)
  )
}

function isSeasonalScenery(value: string): value is SeasonalSceneryId {
  return seasonalSceneries.some((scenery) => scenery.id === value)
}

function parseCollectionEntry(
  value: unknown,
  key: string,
): CollectionEntry | null {
  if (!isRecord(value)) return null

  const {
    kind,
    speciesId,
    name,
    scientificName,
    region,
    rarity,
    wingColor,
    detailColor,
    habitat,
    reflection,
    count,
  } = value
  if (
    (kind !== 'butterfly' && kind !== 'firefly') ||
    typeof speciesId !== 'string' ||
    key !== `${kind}:${speciesId}` ||
    typeof name !== 'string' ||
    typeof scientificName !== 'string' ||
    typeof region !== 'string' ||
    !isGardenRarity(rarity) ||
    typeof wingColor !== 'string' ||
    typeof detailColor !== 'string' ||
    !isGardenHabitatId(habitat) ||
    typeof reflection !== 'string' ||
    typeof count !== 'number' ||
    !Number.isSafeInteger(count) ||
    count < 1
  ) {
    return null
  }

  return {
    key,
    kind,
    speciesId,
    name,
    scientificName,
    region,
    rarity,
    wingColor,
    detailColor,
    habitat,
    reflection,
    count,
  }
}

function readSavedGarden(): SavedGarden {
  if (typeof window === 'undefined') return { collection: {}, error: null }

  try {
    const stored = window.localStorage.getItem(collectionStorageKey)
    if (!stored) return { collection: {}, error: null }

    const parsed: unknown = JSON.parse(stored)
    if (!isRecord(parsed)) throw new Error('Invalid collection format')

    const collection: Record<string, CollectionEntry> = {}
    for (const [key, value] of Object.entries(parsed)) {
      const entry = parseCollectionEntry(value, key)
      if (!entry) throw new Error('Invalid collection entry')
      collection[key] = entry
    }

    return { collection, error: null }
  } catch {
    return {
      collection: {},
      error: 'Saved collection could not be read. New discoveries may replace it.',
    }
  }
}

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
  habitat: GardenHabitatId,
  forceKind?: CreatureKind,
  entering = false,
): GardenCreature {
  const habitatFireflies = fireflySpecies.filter((item) =>
    item.habitats.some((itemHabitat) => itemHabitat === habitat),
  )
  const availableFireflies = habitatFireflies.filter(
    (item) => !excludedSpecies.has(`firefly:${item.id}`),
  )
  const habitatButterflies = butterflySpecies.filter((butterfly) =>
    butterfly.habitats.some((itemHabitat) => itemHabitat === habitat),
  )
  const availableButterflies = habitatButterflies.filter(
    (butterfly) => !excludedSpecies.has(`butterfly:${butterfly.id}`),
  )
  let isFirefly = forceKind ? forceKind === 'firefly' : Math.random() < 0.38
  if (
    isFirefly &&
    availableFireflies.length === 0 &&
    availableButterflies.length > 0
  ) {
    isFirefly = false
  } else if (
    !isFirefly &&
    availableButterflies.length === 0 &&
    availableFireflies.length > 0
  ) {
    isFirefly = true
  }
  let speciesId: string
  let name: string
  let scientificName: string
  let region: string
  let rarity: GardenRarity
  let wingColor: string
  let detailColor: string

  if (isFirefly) {
    const species = choose(
      availableFireflies.length > 0 ? availableFireflies : habitatFireflies,
    )
    speciesId = species.id
    name = species.name
    scientificName = species.scientificName
    region = species.region
    rarity = species.rarity
    wingColor = species.color
    detailColor = species.color
  } else {
    const species = choose(
      availableButterflies.length > 0
        ? availableButterflies
        : habitatButterflies,
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
    behavior: isFirefly ? 'drift' : id % 3 === 1 ? 'follow' : id % 3 === 2 ? 'perch' : 'drift',
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
  const [savedGarden] = useState(readSavedGarden)
  const [habitat, setHabitat] = useState<GardenHabitatId>('meadow')
  const [scenery, setScenery] = useState<SeasonalSceneryId>('summer-meadow')
  const [sceneryReady, setSceneryReady] = useState(false)
  const [sceneryStatus, setSceneryStatus] = useState('')
  const [collection, setCollection] = useState(savedGarden.collection)
  const [collectionDirty, setCollectionDirty] = useState(false)
  const [storageError, setStorageError] = useState(savedGarden.error)
  const [creatures, setCreatures] = useState<GardenCreature[]>(() => {
    const initialSpecies = new Set(Object.keys(savedGarden.collection))
    return Array.from({ length: 6 }, (_, index) => {
      const creature = createCreature(
        index + 1,
        initialSpecies,
        'meadow',
        index === 2 || index === 5 ? 'firefly' : 'butterfly',
      )
      initialSpecies.add(`${creature.kind}:${creature.speciesId}`)
      return creature
    })
  })
  const [capture, setCapture] = useState<CaptureMessage | null>(null)
  const [jarOpen, setJarOpen] = useState(false)
  const [pointer, setPointer] = useState<GardenPointer | null>(null)
  const nextId = useRef(7)
  const reflectionIndex = useRef(0)
  const collectedSpecies = useRef(new Set(Object.keys(savedGarden.collection)))
  const gardenPanel = useRef<HTMLElement>(null)
  const gardenField = useRef<HTMLDivElement>(null)
  const sceneryCanvas = useRef<HTMLCanvasElement>(null)
  const motionCanvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = sceneryCanvas.current
    if (!canvas) return

    try {
      canvas.width = 1440
      canvas.height = 900
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas rendering is not available in this browser.')
      drawSeasonalScene(context, scenery, canvas.width, canvas.height)
      setSceneryReady(true)
      setSceneryStatus('')
    } catch (error) {
      console.error('Unable to render butterfly garden scenery.', error)
      setSceneryReady(false)
      setSceneryStatus('This landscape could not be rendered in this browser.')
    }
  }, [scenery])

  useEffect(() => {
    const canvas = motionCanvas.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      const error = new Error('Canvas animation is not available in this browser.')
      console.error('Unable to animate the butterfly garden scenery.', error)
      setSceneryStatus('This landscape could not be animated in this browser.')
      return
    }

    canvas.width = 1440
    canvas.height = 900
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startedAt = performance.now()
    const staticTime = getSeasonalScenery(scenery).staticFrame?.time ?? 0
    const frameInterval = 1000 / 30
    let lastFrameAt = -frameInterval
    let animationFrame = 0

    const renderFrame = (now: number) => {
      if (now - lastFrameAt >= frameInterval) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawSeasonalMotion(
          context,
          scenery,
          canvas.width,
          canvas.height,
          reducedMotion ? staticTime : (now - startedAt) / 1000,
          !reducedMotion,
        )
        lastFrameAt = now
      }
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(renderFrame)
    }

    try {
      renderFrame(startedAt)
    } catch (error) {
      console.error('Unable to animate the butterfly garden scenery.', error)
      setSceneryStatus('This landscape could not be animated in this browser.')
      return
    }

    return () => window.cancelAnimationFrame(animationFrame)
  }, [scenery])

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
              habitat,
              visibleFireflies < 2 ? 'firefly' : undefined,
              !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            ),
          )
        }

        return visible
      })
    }, 500)

    return () => window.clearInterval(timer)
  }, [habitat])

  useEffect(() => {
    if (!collectionDirty) return

    try {
      window.localStorage.setItem(
        collectionStorageKey,
        JSON.stringify(collection),
      )
      setStorageError(null)
      setCollectionDirty(false)
    } catch {
      setStorageError(
        'Your collection could not be saved in this browser. It may be lost when you leave.',
      )
    }
  }, [collection, collectionDirty])

  function collect(creature: GardenCreature) {
    const key = `${creature.kind}:${creature.speciesId}`
    const reflection =
      gardenReflections[
        reflectionIndex.current++ % gardenReflections.length
      ]
    collectedSpecies.current.add(key)
    setCreatures((current) =>
      current.filter((visibleCreature) => visibleCreature.id !== creature.id),
    )
    setCollection((current) => {
      const previous = current[key]
      return {
        ...current,
        [key]: {
          key,
          kind: creature.kind,
          speciesId: creature.speciesId,
          name: creature.name,
          scientificName: creature.scientificName,
          region: creature.region,
          rarity: creature.rarity,
          wingColor: previous?.wingColor ?? creature.wingColor,
          detailColor: previous?.detailColor ?? creature.detailColor,
          habitat: previous?.habitat ?? habitat,
          reflection: previous?.reflection ?? reflection,
          count: (previous?.count ?? 0) + 1,
        },
      }
    })
    setCollectionDirty(true)
    setCapture({ creature, reflection })
  }

  function visitHabitat(nextHabitat: GardenHabitatId) {
    if (nextHabitat === habitat) return

    const visibleSpecies = new Set(collectedSpecies.current)
    const visitors = Array.from({ length: 6 }, (_, index) => {
      const creature = createCreature(
        nextId.current++,
        visibleSpecies,
        nextHabitat,
        index === 2 || index === 5 ? 'firefly' : 'butterfly',
      )
      visibleSpecies.add(`${creature.kind}:${creature.speciesId}`)
      return creature
    })

    setHabitat(nextHabitat)
    setCreatures(visitors)
    setCapture(null)
  }

  function surpriseScenery() {
    const alternatives = seasonalSceneries.filter((item) => item.id !== scenery)
    const nextScenery = alternatives[Math.floor(Math.random() * alternatives.length)]
    if (nextScenery) setScenery(nextScenery.id)
  }

  function trackPointer(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch') return
    if (
      event.target instanceof Element &&
      event.target.closest('.garden-heading, .garden-quote, .garden-jar-area')
    ) {
      return
    }

    const field = gardenField.current
    const bounds = field?.getBoundingClientRect()
    if (!bounds || bounds.width === 0 || bounds.height === 0) return

    const nextPointer = {
      x: Math.max(5, Math.min(95, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(5, Math.min(85, ((event.clientY - bounds.top) / bounds.height) * 100)),
    }
    setPointer((current) =>
      current &&
      Math.abs(current.x - nextPointer.x) < 1 &&
      Math.abs(current.y - nextPointer.y) < 1
        ? current
        : nextPointer,
    )
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
  const uniqueFireflies = entries.filter(
    (entry) => entry.kind === 'firefly',
  ).length
  const uniqueVisitors = entries.length
  const bloomLevel = bloomMilestones.filter(
    (milestone) => uniqueVisitors >= milestone,
  ).length
  const nextMilestone = bloomMilestones[bloomLevel]
  const selectedHabitat = gardenHabitats.find((item) => item.id === habitat)
  const selectedScenery = getSeasonalScenery(scenery)
  const scenePerches = selectedScenery.perches ?? gardenTreePerches
  const totalSpecies = butterflySpecies.length + fireflySpecies.length
  const bloomName =
    bloomLevel === 0 ? 'Waiting for its first bloom' : bloomNames[bloomLevel - 1]
  const panelBounds = gardenPanel.current?.getBoundingClientRect()
  const fieldBounds = gardenField.current?.getBoundingClientRect()

  return (
    <section
      ref={gardenPanel}
      className={`garden-panel garden-panel--${habitat}`}
      data-bloom={bloomLevel}
      data-scenery-ready={sceneryReady}
      aria-labelledby="garden-title"
      onPointerMove={trackPointer}
      onPointerLeave={() => setPointer(null)}
    >
      <div className="garden-landscape" aria-hidden="true">
        <canvas ref={sceneryCanvas} className="garden-scenery-canvas" />
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
          <g className="garden-scenery-base">
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
          </g>
          <g className="garden-flower-patch">
            <circle cx="305" cy="820" r="5" /><circle cx="318" cy="827" r="4" />
            <circle cx="1070" cy="817" r="5" /><circle cx="1084" cy="824" r="4" />
            <circle cx="440" cy="856" r="4" /><circle cx="986" cy="852" r="4" />
          </g>
          <g className="garden-awakened-flowers">
            <path d="M235 844v-21m0 14-7-7m7 11 8-8m733 28v-25m0 17-8-8m8 13 9-9m172-12v-20m0 13-7-7m7 10 7-7" />
            <circle cx="235" cy="819" r="4" /><circle cx="968" cy="825" r="4" />
            <circle cx="1140" cy="817" r="4" />
          </g>
          <g className="garden-awakened-lights">
            <circle cx="619" cy="594" r="4" /><circle cx="835" cy="599" r="4" />
            <circle cx="348" cy="735" r="3" /><circle cx="1095" cy="748" r="3" />
            <circle cx="520" cy="792" r="3" /><circle cx="905" cy="780" r="3" />
          </g>
          <g className="garden-full-bloom">
            <circle cx="273" cy="824" r="5" /><circle cx="286" cy="833" r="4" />
            <circle cx="1176" cy="827" r="5" /><circle cx="1190" cy="835" r="4" />
            <circle cx="602" cy="863" r="4" /><circle cx="827" cy="853" r="4" />
          </g>
        </svg>
        <canvas className="garden-motion-canvas" ref={motionCanvas} aria-hidden="true" />
      </div>

      <div className="garden-heading">
        <p className="garden-kicker">A little world of wings and light</p>
        <h1 id="garden-title">The Butterfly Garden</h1>
        <p>
          Catch a visitor to add it to your jar and find a small thought to
          carry with you.
        </p>
        <small>
          25 butterfly species. Island habitats are storybook encounters; the
          journal shows each visitor’s natural range and playful rarity tier.
        </small>
        <div className="garden-habitats" role="group" aria-label="Island habitats">
          {gardenHabitats.map((option) => (
            <button
              type="button"
              key={option.id}
              aria-pressed={habitat === option.id}
              onClick={() => visitHabitat(option.id)}
            >
              {option.name}
            </button>
          ))}
        </div>
        <p className="garden-habitat-note">{selectedHabitat?.description}</p>
        <div className="garden-scenery-controls">
          <label htmlFor="garden-scenery-select">Change the landscape</label>
          <select
            id="garden-scenery-select"
            value={scenery}
            onChange={(event) => {
              const nextScenery = event.currentTarget.value
              if (isSeasonalScenery(nextScenery)) setScenery(nextScenery)
            }}
          >
            {seasonalSceneries.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} · {option.time} · {option.weather}
              </option>
            ))}
          </select>
          <button type="button" onClick={surpriseScenery}>Surprise me ✦</button>
        </div>
        <p className="garden-scenery-caption" role="status" aria-live="polite">
          <strong>{selectedScenery.label}</strong> · {selectedScenery.time} · {selectedScenery.weather}
          <span>{sceneryStatus || selectedScenery.description}</span>
        </p>
        <div className="garden-progress">
          <div className="garden-progress__heading">
            <strong>{bloomName}</strong>
            <span>
              {uniqueVisitors} / {totalSpecies} visitors found
            </span>
          </div>
          <progress
            max={totalSpecies}
            value={uniqueVisitors}
            aria-label="Unique visitors discovered"
          />
          <p>
            {nextMilestone
              ? `The island changes again at ${nextMilestone} discoveries.`
              : 'Every visitor has helped the island bloom.'}
          </p>
          <small className="garden-storage-status" role="status">
            {storageError ?? 'Your discoveries are saved on this device only.'}
          </small>
        </div>
      </div>

      <div
        ref={gardenField}
        className="garden-field"
        role="group"
        aria-label="Butterflies and fireflies drifting through the garden"
      >
        {creatures.map((creature) => {
          const perch = scenePerches[(creature.id - 1) % scenePerches.length]
          const perchX = panelBounds && fieldBounds
            ? (perch.x * panelBounds.width / fieldBounds.width) * 100
            : creature.x
          const perchY = panelBounds && fieldBounds
            ? ((perch.y * panelBounds.height - (fieldBounds.top - panelBounds.top)) / fieldBounds.height) * 100
            : creature.y
          const followX = pointer
            ? Math.max(4, Math.min(96, pointer.x + ((creature.id % 3) - 1) * 5))
            : creature.x
          const followY = pointer
            ? Math.max(5, Math.min(86, pointer.y + (creature.id % 2 === 0 ? 7 : -7)))
            : creature.y
          const positionX = creature.behavior === 'perch'
            ? perchX
            : creature.behavior === 'follow'
              ? followX
              : creature.x
          const positionY = creature.behavior === 'perch'
            ? perchY
            : creature.behavior === 'follow'
              ? followY
              : creature.y
          const style: GardenStyle = {
            '--wing-color': creature.wingColor,
            '--detail-color': creature.detailColor,
            '--flight-delay': `${creature.delay}s`,
            '--flight-duration': `${creature.duration}s`,
            '--drift-x': `${creature.driftX}px`,
            '--drift-y': `${creature.driftY}px`,
            '--drift-back-x': `${creature.driftBackX}px`,
            '--drift-back-y': `${creature.driftBackY}px`,
            '--garden-x': `${positionX}%`,
            '--garden-y': `${positionY}%`,
            '--entry-x': `${creature.entryX}%`,
            '--entry-y': `${creature.entryY}%`,
          }

          return (
            <button
              type="button"
              key={creature.id}
              className={`garden-creature garden-creature--${creature.kind}${
                creature.entering ? ' garden-creature--entering' : ''
              } garden-creature--${creature.behavior}`}
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
          aria-label="Garden field journal"
          hidden={!jarOpen}
        >
          <div className="garden-jar-inventory__heading">
            <strong>Your field journal</strong>
            <span>
              {uniqueButterflies}/{butterflySpecies.length} butterflies ·{' '}
              {uniqueFireflies}/{fireflySpecies.length} fireflies
            </span>
          </div>
          {entries.length === 0 ? (
            <p className="garden-jar-inventory__empty">
              Your journal is waiting for its first visitor.
            </p>
          ) : (
            <ul>
              {entries.map((entry) => {
                const patternStyle: WingPatternStyle = {
                  '--wing-color': entry.wingColor,
                  '--detail-color': entry.detailColor,
                }
                const entryHabitat = gardenHabitats.find(
                  (item) => item.id === entry.habitat,
                )

                return (
                  <li key={entry.key}>
                    <details className="garden-journal-entry">
                      <summary>
                        <span
                          className={`garden-journal-entry__pattern garden-journal-entry__pattern--${entry.kind}`}
                          style={patternStyle}
                          aria-hidden="true"
                        >
                          {entry.kind === 'butterfly' ? (
                            <ButterflyShape />
                          ) : (
                            <FireflyShape />
                          )}
                        </span>
                        <span className="garden-inventory__name">
                          <strong>{entry.name}</strong>
                          <small>{entry.scientificName}</small>
                        </span>
                        <span className="garden-inventory__count">
                          ×{entry.count}
                        </span>
                      </summary>
                      <div className="garden-journal-entry__notes">
                        <p>
                          <strong>Island habitat:</strong>{' '}
                          {entryHabitat?.name ?? entry.habitat}
                        </p>
                        <p>
                          <strong>Natural range:</strong> {entry.region}
                        </p>
                        <p>
                          <strong>Garden encounter:</strong> {entry.rarity}
                        </p>
                        <blockquote>“{entry.reflection}”</blockquote>
                      </div>
                    </details>
                  </li>
                )
              })}
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
            {jarOpen ? 'Close journal' : 'Open field journal'}
          </span>
        </button>
      </aside>
    </section>
  )
}

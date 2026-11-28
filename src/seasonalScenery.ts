type Landscape =
  | 'cabin-lake'
  | 'frozen-lake'
  | 'pine-forest'
  | 'mountain-pass'
  | 'village'
  | 'blossom-garden'
  | 'greenhouse'
  | 'misty-lake'
  | 'orchard'
  | 'bridge'
  | 'meadow'
  | 'lighthouse'

export type SeasonalSceneryId =
  | 'snowbound-cabin'
  | 'aurora-frozen-lake'
  | 'pine-forest-flurry'
  | 'whiteout-pass'
  | 'winter-village'
  | 'cherry-blossom-rain'
  | 'rainlit-greenhouse'
  | 'misty-lake-dawn'
  | 'amber-orchard'
  | 'lantern-bridge'
  | 'summer-meadow'
  | 'monsoon-lighthouse'

type WeatherKind =
  | 'snow'
  | 'rain'
  | 'petals'
  | 'leaves'
  | 'mist'
  | 'fireflies'
  | 'clear'
  | 'cozy'
  | 'seeds'
  | 'ice-sparkle'
  | 'ground-blizzard'

type WaterStyle = 'flow' | 'ice' | 'mirror' | 'rain-pocked' | 'swell' | 'none'
type TreeKind = 'winter' | 'blossom' | 'autumn' | 'summer' | 'wind-bent'
type SceneEvent =
  | 'shooting-star'
  | 'bough-puff'
  | 'window-lights'
  | 'beam-sweep'
  | 'lightning'
  | 'gust'
  | 'lantern-rise'
  | 'fish-ripple'

type GlowSource = {
  x: number
  y: number
  radius: number
  color: string
  pulse?: number
}

type NormalizedPoint = {
  x: number
  y: number
}

export type SeasonalSceneryDefinition = {
  id: SeasonalSceneryId
  label: string
  time: string
  weather: string
  description: string
  landscape: Landscape | null
  sky: readonly [string, string, string]
  ridge: string
  ground: string
  water: string
  accent: string
  celestial: 'sun' | 'moon' | 'none'
  weatherKind: WeatherKind
  intensity: number
  particleKind?: WeatherKind
  waterStyle?: WaterStyle
  treeKind?: TreeKind
  perches?: readonly NormalizedPoint[]
  glow?: readonly GlowSource[]
  events?: readonly SceneEvent[]
  staticFrame?: { time: number; seed: number }
  celestialPosition?: NormalizedPoint
  wind?: number
  stars?: boolean
  aurora?: boolean
  featured?: boolean
}

export const gardenTreePerches: readonly NormalizedPoint[] = [
  { x: 0.79, y: 0.67 },
  { x: 0.875, y: 0.73 },
  { x: 0.94, y: 0.8 },
] as const

export const seasonalSceneries: readonly SeasonalSceneryDefinition[] = [
  {
    id: 'snowbound-cabin',
    label: 'Chimney-Warm',
    time: 'Blue hour',
    weather: 'Heavy snowfall',
    description: 'One amber window warms a snowbound cabin as its light catches the falling flakes.',
    landscape: 'cabin-lake',
    sky: ['#0b1530', '#16264a', '#27406b'],
    ridge: '#1d2f55',
    ground: '#dfe9f7',
    water: '#5c78a8',
    accent: '#ffb85c',
    celestial: 'moon',
    weatherKind: 'snow',
    intensity: 1,
    wind: 0.3,
    stars: true,
    particleKind: 'snow',
    waterStyle: 'ice',
    treeKind: 'winter',
    glow: [{ x: 0.69, y: 0.73, radius: 0.2, color: '#ffd08a', pulse: 0.03 }],
    events: ['bough-puff'],
    staticFrame: { time: 2, seed: 11 },
    celestialPosition: { x: 0.08, y: 0.3 },
    featured: true,
  },
  {
    id: 'aurora-frozen-lake',
    label: 'Aurora Frozen Lake',
    time: 'Midnight',
    weather: 'Diamond snow',
    description: 'Green and violet northern lights shimmer over a glassy winter lake.',
    landscape: 'frozen-lake',
    sky: ['#050b22', '#0c2a4a', '#134d5c'],
    ridge: '#0a1630',
    ground: '#1a2a45',
    water: '#0b1f3a',
    accent: '#5dffc8',
    celestial: 'moon',
    weatherKind: 'clear',
    intensity: 0.28,
    wind: 0.08,
    stars: true,
    aurora: true,
    particleKind: 'ice-sparkle',
    waterStyle: 'ice',
    treeKind: 'winter',
    glow: [{ x: 0.3, y: 0.8, radius: 0.19, color: '#7de9ff', pulse: 0.32 }],
    events: ['shooting-star'],
    staticFrame: { time: 0, seed: 23 },
    celestialPosition: { x: 0.91, y: 0.18 },
  },
  {
    id: 'pine-forest-flurry',
    label: 'Light Through the Pines',
    time: 'Winter golden hour',
    weather: 'Soft snow',
    description: 'Low golden light pours through snow-laden pines and turns drifting flakes to sparks.',
    landscape: 'pine-forest',
    sky: ['#3b4a7a', '#d98a7a', '#ffd9a0'],
    ridge: '#5b5f8c',
    ground: '#f2f0f7',
    water: '#7fa0c8',
    accent: '#ffcf8a',
    celestial: 'sun',
    weatherKind: 'snow',
    intensity: 0.34,
    wind: 0.12,
    particleKind: 'snow',
    waterStyle: 'ice',
    treeKind: 'winter',
    glow: [{ x: 0.17, y: 0.48, radius: 0.28, color: '#ffe0a8' }],
    events: ['bough-puff'],
    staticFrame: { time: 1, seed: 31 },
    celestialPosition: { x: 0.17, y: 0.48 },
  },
  {
    id: 'whiteout-pass',
    label: 'Fading Trail',
    time: 'Whiteout midday',
    weather: 'Blizzard',
    description: 'Red trail markers fade into a near-white blizzard, one by one.',
    landscape: 'mountain-pass',
    sky: ['#cfd8e6', '#e6ecf4', '#f5f8fc'],
    ridge: '#aeb9cc',
    ground: '#eef2f8',
    water: '#b9c8de',
    accent: '#e5483b',
    celestial: 'none',
    weatherKind: 'snow',
    intensity: 0.65,
    wind: 0.55,
    particleKind: 'ground-blizzard',
    waterStyle: 'none',
    treeKind: 'winter',
    perches: [{ x: 0.83, y: 0.58 }, { x: 0.81, y: 0.72 }],
    events: ['gust'],
    staticFrame: { time: 3, seed: 47 },
  },
  {
    id: 'winter-village',
    label: 'Blue-Hour Windows',
    time: 'Twilight',
    weather: 'Steady snowfall',
    description: 'Village windows light up beneath a rippling string of festival lamps.',
    landscape: 'village',
    sky: ['#1a2350', '#4a4f8f', '#e59a8e'],
    ridge: '#2a3566',
    ground: '#cdd8ef',
    water: '#3a4f86',
    accent: '#ffb347',
    celestial: 'moon',
    weatherKind: 'snow',
    intensity: 0.8,
    wind: 0.18,
    stars: true,
    particleKind: 'snow',
    waterStyle: 'ice',
    treeKind: 'winter',
    glow: [{ x: 0.66, y: 0.75, radius: 0.22, color: '#ffc46b', pulse: 0.04 }],
    events: ['window-lights'],
    staticFrame: { time: 5, seed: 59 },
  },
  {
    id: 'cherry-blossom-rain',
    label: 'Cherry Blossom Rain',
    time: 'Spring afternoon',
    weather: 'Gentle rain',
    description: 'Rain and petals ripple together across puddles reflecting blossom canopies.',
    landscape: 'blossom-garden',
    sky: ['#cfd3e3', '#e8cfdc', '#f7e3e6'],
    ridge: '#a9a8c4',
    ground: '#9aa6a0',
    water: '#8fb0c4',
    accent: '#ff9fbd',
    celestial: 'none',
    weatherKind: 'rain',
    intensity: 0.28,
    wind: 0.22,
    particleKind: 'petals',
    waterStyle: 'rain-pocked',
    treeKind: 'blossom',
    glow: [{ x: 0.65, y: 0.7, radius: 0.12, color: '#ffd7e2' }],
    staticFrame: { time: 2, seed: 71 },
  },
  {
    id: 'rainlit-greenhouse',
    label: 'Rainlit Greenhouse',
    time: 'Rainy evening',
    weather: 'Steady rain',
    description: 'Rain beads slide over a glowing glasshouse full of vivid green leaves.',
    landscape: 'greenhouse',
    sky: ['#0d1a26', '#14303a', '#1f4a4a'],
    ridge: '#10242b',
    ground: '#1b2f2a',
    water: '#2d6a6a',
    accent: '#9dffb8',
    celestial: 'none',
    weatherKind: 'rain',
    intensity: 0.45,
    wind: 0.16,
    particleKind: 'rain',
    waterStyle: 'rain-pocked',
    treeKind: 'summer',
    glow: [
      { x: 0.5, y: 0.62, radius: 0.2, color: '#b8ffd0', pulse: 0.035 },
      { x: 0.5, y: 0.75, radius: 0.09, color: '#ffe39a' },
    ],
    staticFrame: { time: 1, seed: 83 },
  },
  {
    id: 'misty-lake-dawn',
    label: 'Sun Breaks the Mist',
    time: 'First light',
    weather: 'Soft mist',
    description: 'A gold-edged mist lifts over a mirror lake as the sun breaks the ridgeline.',
    landscape: 'misty-lake',
    sky: ['#3c4a7a', '#f2a6a0', '#ffe3b8'],
    ridge: '#7a7fa8',
    ground: '#5f7d68',
    water: '#a9c4d8',
    accent: '#ffb27a',
    celestial: 'sun',
    weatherKind: 'mist',
    intensity: 0.7,
    particleKind: 'mist',
    waterStyle: 'mirror',
    treeKind: 'blossom',
    glow: [{ x: 0.83, y: 0.5, radius: 0.2, color: '#fff0cc', pulse: 0.02 }],
    events: ['fish-ripple'],
    staticFrame: { time: 1, seed: 97 },
    celestialPosition: { x: 0.83, y: 0.5 },
  },
  {
    id: 'amber-orchard',
    label: 'Amber Orchard',
    time: 'Autumn afternoon',
    weather: 'Falling leaves',
    description: 'Backlit orchard leaves glow like stained glass above fallen apples and old crates.',
    landscape: 'orchard',
    sky: ['#5d7fb0', '#f2b16a', '#ffd89a'],
    ridge: '#b9774e',
    ground: '#c98a3d',
    water: '#d9a05a',
    accent: '#e8602c',
    celestial: 'sun',
    weatherKind: 'leaves',
    intensity: 0.42,
    wind: 0.22,
    particleKind: 'leaves',
    waterStyle: 'none',
    treeKind: 'autumn',
    glow: [{ x: 0.84, y: 0.48, radius: 0.24, color: '#ffcf7a' }],
    events: ['gust'],
    staticFrame: { time: 2, seed: 101 },
    celestialPosition: { x: 0.84, y: 0.48 },
  },
  {
    id: 'lantern-bridge',
    label: 'Lantern Bridge',
    time: 'Autumn dusk',
    weather: 'Drifting leaves',
    description: 'A stone arch and its reflection make a glowing ring beneath rising lanterns.',
    landscape: 'bridge',
    sky: ['#1c1a3d', '#54386b', '#d97a5e'],
    ridge: '#2a2349',
    ground: '#3a2b3d',
    water: '#2b3a66',
    accent: '#ff8a3d',
    celestial: 'none',
    weatherKind: 'leaves',
    intensity: 0.2,
    wind: 0.2,
    particleKind: 'leaves',
    waterStyle: 'mirror',
    treeKind: 'autumn',
    glow: [{ x: 0.5, y: 0.7, radius: 0.23, color: '#ffb066', pulse: 0.05 }],
    events: ['lantern-rise'],
    staticFrame: { time: 0, seed: 113 },
    celestialPosition: { x: 0.14, y: 0.2 },
  },
  {
    id: 'summer-meadow',
    label: 'Wind Across the Wildflowers',
    time: 'Late summer morning',
    weather: 'Clear skies',
    description: 'Waves of wind sweep through saturated wildflowers beneath drifting cloud shadows.',
    landscape: 'meadow',
    sky: ['#4aa8e8', '#8ed0f5', '#fff1c9'],
    ridge: '#6fae8a',
    ground: '#7cc05a',
    water: '#6cc4e8',
    accent: '#ffd84a',
    celestial: 'sun',
    weatherKind: 'clear',
    intensity: 0.28,
    particleKind: 'seeds',
    waterStyle: 'flow',
    treeKind: 'summer',
    glow: [{ x: 0.84, y: 0.18, radius: 0.18, color: '#fff6c8' }],
    staticFrame: { time: 1, seed: 127 },
    celestialPosition: { x: 0.84, y: 0.18 },
  },
  {
    id: 'monsoon-lighthouse',
    label: 'Monsoon Lighthouse',
    time: 'Stormy dusk',
    weather: 'Driving rain',
    description: 'A lighthouse beam sweeps through slanted rain over a restless, white-capped sea.',
    landscape: 'lighthouse',
    sky: ['#1b1f3a', '#3a3f66', '#8a6a8f'],
    ridge: '#232842',
    ground: '#2a2f46',
    water: '#2f5f7f',
    accent: '#ffe29a',
    celestial: 'none',
    weatherKind: 'rain',
    intensity: 0.62,
    wind: 0.52,
    particleKind: 'rain',
    waterStyle: 'swell',
    treeKind: 'wind-bent',
    glow: [{ x: 0.3, y: 0.52, radius: 0.2, color: '#fff1b8' }],
    events: ['beam-sweep', 'lightning'],
    staticFrame: { time: 0, seed: 139 },
  },
]

export function getSeasonalScenery(sceneId: SeasonalSceneryId) {
  const scene = seasonalSceneries.find((item) => item.id === sceneId)
  if (!scene) throw new Error(`Unknown seasonal scenery: ${sceneId}`)
  return scene
}

function drawAurora(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.lineCap = 'round'
  for (const [index, color] of ['#75f0c2', '#75c9e8', '#c18cf2'].entries()) {
    const y = 157 + index * 27
    const gradient = ctx.createLinearGradient(0, y - 45, 360, y + 20)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(0.35, color)
    gradient.addColorStop(0.7, '#c6f7df')
    gradient.addColorStop(1, 'transparent')
    ctx.globalAlpha = 0.18 - index * 0.025
    ctx.strokeStyle = gradient
    ctx.lineWidth = 24 - index * 4
    ctx.shadowColor = color
    ctx.shadowBlur = 24
    ctx.beginPath()
    ctx.moveTo(-20, y + 32)
    ctx.bezierCurveTo(70, y - 12, 150, y + 38, 235, y - 8)
    ctx.bezierCurveTo(285, y - 34, 330, y + 24, 380, y - 24)
    ctx.stroke()
  }
  ctx.restore()
}

function drawSky(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  const sky = ctx.createLinearGradient(0, 0, 0, 320)
  sky.addColorStop(0, scene.sky[0])
  sky.addColorStop(0.62, scene.sky[1])
  sky.addColorStop(1, scene.sky[2])
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 360, 420)

  if (scene.aurora) drawAurora(ctx)

  if (scene.stars || scene.celestial === 'moon') {
    ctx.fillStyle = '#fff5db'
    for (let index = 0; index < 38; index++) {
      const x = (index * 97 + 23) % 360
      const y = (index * 53 + 19) % 210
      if (x > 90 && x < 270 && y < 120) continue
      const radius = 0.6 + (index % 4) * 0.25
      ctx.globalAlpha = 0.35 + (index % 5) * 0.12
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  if (scene.celestial !== 'none') {
    const x = (scene.celestialPosition?.x ?? (scene.celestial === 'sun' ? 0.82 : 0.9)) * 360
    const y = (scene.celestialPosition?.y ?? (scene.celestial === 'sun' ? 0.27 : 0.2)) * 420
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 48)
    glow.addColorStop(0, `${scene.accent}aa`)
    glow.addColorStop(1, `${scene.accent}00`)
    ctx.fillStyle = glow
    ctx.fillRect(x - 50, y - 50, 100, 100)
    ctx.fillStyle = scene.accent
    ctx.globalAlpha = scene.celestial === 'sun' ? 0.92 : 0.78
    ctx.beginPath()
    ctx.arc(x, y, scene.celestial === 'sun' ? 17 : 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function drawMountains(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  ctx.fillStyle = `${scene.sky[2]}55`
  ctx.beginPath()
  ctx.moveTo(0, 286)
  ctx.lineTo(0, 220)
  ctx.lineTo(80, 182)
  ctx.lineTo(160, 238)
  ctx.lineTo(252, 180)
  ctx.lineTo(360, 238)
  ctx.lineTo(360, 300)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = scene.ridge
  ctx.beginPath()
  ctx.moveTo(0, 296)
  ctx.lineTo(0, 236)
  ctx.lineTo(55, 169)
  ctx.lineTo(100, 233)
  ctx.lineTo(164, 144)
  ctx.lineTo(234, 239)
  ctx.lineTo(296, 184)
  ctx.lineTo(360, 245)
  ctx.lineTo(360, 296)
  ctx.closePath()
  ctx.fill()

  const haze = ctx.createLinearGradient(0, 224, 0, 316)
  haze.addColorStop(0, 'rgba(255,255,255,0)')
  haze.addColorStop(0.62, `${scene.sky[2]}22`)
  haze.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = haze
  ctx.fillRect(0, 224, 360, 92)

  ctx.fillStyle = `${scene.sky[2]}cc`
  ctx.beginPath()
  ctx.moveTo(118, 209)
  ctx.lineTo(164, 144)
  ctx.lineTo(197, 190)
  ctx.lineTo(174, 178)
  ctx.lineTo(162, 193)
  ctx.lineTo(150, 178)
  ctx.closePath()
  ctx.fill()
}

function drawGround(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  const ground = ctx.createLinearGradient(0, 278, 0, 420)
  ground.addColorStop(0, scene.ground)
  ground.addColorStop(1, `${scene.ground}e8`)
  ctx.fillStyle = ground
  ctx.beginPath()
  ctx.moveTo(0, 300)
  ctx.quadraticCurveTo(75, 270, 142, 306)
  ctx.quadraticCurveTo(235, 271, 360, 303)
  ctx.lineTo(360, 420)
  ctx.lineTo(0, 420)
  ctx.closePath()
  ctx.fill()
}

function drawLake(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition, horizon = 296) {
  const water = ctx.createLinearGradient(0, horizon, 0, 420)
  water.addColorStop(0, scene.water)
  water.addColorStop(1, '#101e34')
  ctx.fillStyle = water
  ctx.fillRect(0, horizon, 360, 124)
  ctx.fillStyle = `${scene.accent}24`
  ctx.fillRect(125, horizon + 7, 110, 82)

  for (let index = 0; index < 9; index++) {
    const x = (index * 43 + 17) % 330
    const y = horizon + 17 + index * 11
    ctx.globalAlpha = 0.2 + (index % 3) * 0.08
    ctx.strokeStyle = scene.accent
    ctx.lineWidth = index % 3 === 0 ? 1.4 : 0.8
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + 16, y - 2, x + 34, y)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawPine(ctx: CanvasRenderingContext2D, x: number, base: number, size: number, color: string, snowy: boolean) {
  ctx.fillStyle = '#4d403a'
  ctx.fillRect(x - size * 0.055, base - size * 0.18, size * 0.11, size * 0.2)
  ctx.fillStyle = color
  for (let layer = 0; layer < 3; layer++) {
    const top = base - size * (0.46 + layer * 0.24)
    const halfWidth = size * (0.42 - layer * 0.09)
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(x - halfWidth, base - size * (0.16 + layer * 0.21))
    ctx.lineTo(x + halfWidth, base - size * (0.16 + layer * 0.21))
    ctx.closePath()
    ctx.fill()
    if (snowy) {
      ctx.strokeStyle = '#f4f8f6'
      ctx.lineWidth = Math.max(1.2, size * 0.025)
      ctx.beginPath()
      ctx.moveTo(x, top + size * 0.09)
      ctx.lineTo(x - halfWidth * 0.62, base - size * (0.19 + layer * 0.21))
      ctx.stroke()
    }
  }
}

function drawCabin(ctx: CanvasRenderingContext2D, x: number, base: number, size: number, scene: SeasonalSceneryDefinition) {
  const width = size
  const height = size * 0.64
  ctx.fillStyle = '#684e49'
  ctx.fillRect(x, base - height, width, height)
  ctx.fillStyle = '#3d3947'
  ctx.beginPath()
  ctx.moveTo(x - width * 0.12, base - height + 4)
  ctx.lineTo(x + width * 0.5, base - height - size * 0.38)
  ctx.lineTo(x + width * 1.12, base - height + 4)
  ctx.closePath()
  ctx.fill()
  if (scene.weatherKind === 'snow') {
    ctx.strokeStyle = '#f4f7f5'
    ctx.lineWidth = size * 0.07
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x - width * 0.06, base - height)
    ctx.lineTo(x + width * 0.5, base - height - size * 0.33)
    ctx.lineTo(x + width * 1.06, base - height)
    ctx.stroke()
  }
  ctx.save()
  ctx.shadowColor = scene.accent
  ctx.shadowBlur = 15
  ctx.fillStyle = scene.accent
  ctx.fillRect(x + width * 0.17, base - height * 0.7, width * 0.2, height * 0.25)
  ctx.fillRect(x + width * 0.61, base - height * 0.7, width * 0.2, height * 0.25)
  ctx.restore()
  ctx.fillStyle = '#443b3c'
  ctx.fillRect(x + width * 0.43, base - height * 0.42, width * 0.16, height * 0.42)
}

function drawBlossomTree(ctx: CanvasRenderingContext2D, x: number, base: number, color: string) {
  ctx.strokeStyle = '#604943'
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, base)
  ctx.lineTo(x + 4, base - 62)
  ctx.moveTo(x + 2, base - 42)
  ctx.lineTo(x - 20, base - 65)
  ctx.moveTo(x + 3, base - 50)
  ctx.lineTo(x + 26, base - 72)
  ctx.stroke()
  ctx.fillStyle = color
  for (let index = 0; index < 13; index++) {
    const px = x - 27 + ((index * 19) % 58)
    const py = base - 64 - ((index * 13) % 35)
    ctx.globalAlpha = 0.62 + (index % 3) * 0.12
    ctx.beginPath()
    ctx.arc(px, py, 7 + (index % 3), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawGreenhouse(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  ctx.save()
  ctx.shadowColor = scene.accent
  ctx.shadowBlur = 20
  ctx.fillStyle = 'rgba(230, 203, 151, .35)'
  ctx.fillRect(105, 235, 154, 77)
  ctx.restore()
  ctx.fillStyle = '#3f554e'
  ctx.beginPath()
  ctx.moveTo(95, 239)
  ctx.lineTo(182, 183)
  ctx.lineTo(270, 239)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(189, 220, 207, .58)'
  ctx.fillRect(108, 242, 148, 66)
  ctx.strokeStyle = '#d1d8c8'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(182, 242)
  ctx.lineTo(182, 308)
  ctx.moveTo(110, 275)
  ctx.lineTo(255, 275)
  ctx.stroke()
  ctx.fillStyle = '#7fa06d'
  ctx.fillRect(83, 309, 192, 8)

  ctx.save()
  ctx.globalAlpha = 0.9
  for (const [x, base, size] of [[126, 303, 30], [173, 303, 38], [222, 303, 32]] as const) {
    ctx.strokeStyle = '#527e58'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, base)
    ctx.quadraticCurveTo(x - 4, base - size * 0.7, x - size * 0.42, base - size)
    ctx.quadraticCurveTo(x - 1, base - size * 0.86, x, base)
    ctx.quadraticCurveTo(x + 3, base - size * 0.72, x + size * 0.42, base - size)
    ctx.quadraticCurveTo(x + 2, base - size * 0.82, x, base)
    ctx.stroke()
  }
  ctx.restore()
}

function drawGlowSources(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  if (!scene.glow?.length) return
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const source of scene.glow) {
    const x = source.x * 360
    const y = source.y * 420
    const radius = source.radius * 360
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, `${source.color}55`)
    glow.addColorStop(1, `${source.color}00`)
    ctx.fillStyle = glow
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }
  ctx.restore()
}

function drawSnowTrailPoles(ctx: CanvasRenderingContext2D) {
  const poles = [
    { x: 41, y: 390, height: 45, alpha: 0.96 },
    { x: 82, y: 365, height: 39, alpha: 0.8 },
    { x: 126, y: 336, height: 32, alpha: 0.6 },
    { x: 176, y: 300, height: 26, alpha: 0.4 },
    { x: 231, y: 264, height: 20, alpha: 0.24 },
  ]
  ctx.save()
  ctx.strokeStyle = '#687b94'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(24, 420)
  ctx.bezierCurveTo(62, 370, 75, 348, 112, 337)
  ctx.bezierCurveTo(160, 322, 184, 284, 248, 252)
  ctx.stroke()
  poles.forEach(({ x, y, height, alpha }) => {
    ctx.globalAlpha = alpha
    ctx.strokeStyle = '#78859a'
    ctx.lineWidth = Math.max(1.2, height * 0.055)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 2, y - height)
    ctx.stroke()
    ctx.fillStyle = '#e5483b'
    ctx.beginPath()
    ctx.arc(x + 2, y - height, Math.max(2, height * 0.13), Math.PI, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function drawLandscape(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  const snowy = scene.weatherKind === 'snow'
  switch (scene.landscape) {
    case 'cabin-lake':
      drawLake(ctx, scene, 294)
      drawPine(ctx, 31, 342, 112, '#172643', snowy)
      drawPine(ctx, 55, 342, 82, '#24334d', snowy)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = '#ffb85c35'
      ctx.beginPath()
      ctx.moveTo(228, 306)
      ctx.lineTo(129, 420)
      ctx.lineTo(249, 420)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      drawCabin(ctx, 205, 356, 76, scene)
      ctx.strokeStyle = 'rgba(255,230,187,.42)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(239, 278)
      ctx.bezierCurveTo(228, 255, 251, 247, 239, 226)
      ctx.bezierCurveTo(228, 211, 249, 202, 242, 188)
      ctx.stroke()
      ctx.strokeStyle = '#fbfdff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, 382)
      ctx.quadraticCurveTo(102, 352, 176, 388)
      ctx.quadraticCurveTo(270, 412, 360, 370)
      ctx.stroke()
      break
    case 'frozen-lake':
      drawLake(ctx, scene, 286)
      ctx.fillStyle = '#09172b'
      ctx.fillRect(0, 286, 360, 134)
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.42
      for (let ray = 0; ray < 7; ray++) {
        const x = 28 + ray * 49
        const gradient = ctx.createLinearGradient(x, 245, x + 24, 405)
        gradient.addColorStop(0, '#7de9ff00')
        gradient.addColorStop(0.52, '#7de9ff66')
        gradient.addColorStop(1, '#7de9ff00')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, 252)
        ctx.lineTo(x + 17, 252)
        ctx.lineTo(x + 40, 418)
        ctx.lineTo(x + 18, 418)
        ctx.closePath()
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#7de9ff'
      ctx.lineWidth = 1.4
      ctx.globalAlpha = 0.45
      ctx.beginPath()
      ctx.moveTo(104, 356)
      ctx.lineTo(87, 332)
      ctx.moveTo(104, 356)
      ctx.lineTo(131, 344)
      ctx.lineTo(151, 320)
      ctx.moveTo(104, 356)
      ctx.lineTo(127, 378)
      ctx.lineTo(157, 385)
      ctx.moveTo(104, 356)
      ctx.lineTo(76, 377)
      ctx.stroke()
      ctx.globalAlpha = 1
      drawPine(ctx, 45, 320, 95, '#101e32', false)
      drawPine(ctx, 306, 324, 108, '#14243a', false)
      break
    case 'pine-forest':
      drawGround(ctx, scene)
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      for (let ray = 0; ray < 4; ray++) {
        ctx.globalAlpha = 0.1
        ctx.fillStyle = '#ffe0a8'
        ctx.beginPath()
        ctx.moveTo(48 + ray * 16, 185)
        ctx.lineTo(76 + ray * 27, 185)
        ctx.lineTo(248 + ray * 15, 390)
        ctx.lineTo(203 + ray * 20, 390)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
      ;[18, 54, 91, 278, 315, 348].forEach((x, index) =>
        drawPine(ctx, x, 360 - (index % 2) * 12, 88 + (index % 3) * 15, index % 2 ? '#455275' : '#353f67', snowy))
      break
    case 'mountain-pass':
      drawGround(ctx, scene)
      drawSnowTrailPoles(ctx)
      ctx.fillStyle = '#f0f4f3'
      ctx.globalAlpha = 0.64
      ctx.beginPath()
      ctx.moveTo(0, 307)
      ctx.lineTo(48, 246)
      ctx.lineTo(89, 291)
      ctx.lineTo(133, 225)
      ctx.lineTo(187, 301)
      ctx.lineTo(226, 247)
      ctx.lineTo(290, 304)
      ctx.lineTo(360, 246)
      ctx.lineTo(360, 420)
      ctx.lineTo(0, 420)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
      drawPine(ctx, 34, 346, 74, '#36544c', snowy)
      drawPine(ctx, 326, 350, 91, '#314e47', snowy)
      ctx.fillStyle = '#8b909b'
      ctx.beginPath()
      ctx.arc(300, 367, 13, Math.PI, Math.PI * 2)
      ctx.lineTo(315, 389)
      ctx.lineTo(282, 389)
      ctx.closePath()
      ctx.fill()
      break
    case 'village':
      drawGround(ctx, scene)
      drawPine(ctx, 26, 348, 82, '#243459', snowy)
      drawCabin(ctx, 34, 356, 40, scene)
      drawCabin(ctx, 78, 368, 53, scene)
      drawCabin(ctx, 137, 359, 43, scene)
      drawCabin(ctx, 187, 374, 58, scene)
      drawCabin(ctx, 250, 362, 47, scene)
      drawCabin(ctx, 304, 355, 39, scene)
      drawPine(ctx, 342, 346, 83, '#243459', snowy)
      ctx.strokeStyle = '#ffca73'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(38, 300)
      ctx.quadraticCurveTo(132, 325, 225, 294)
      ctx.stroke()
      for (let index = 0; index < 8; index++) {
        const x = 42 + index * 26
        const y = 302 + Math.sin(index / 7 * Math.PI) * 13
        ctx.fillStyle = index % 3 === 0 ? '#fff1be' : '#ffb347'
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#ffd36e'
      ctx.fillRect(250, 256, 2, 24)
      break
    case 'blossom-garden':
      drawGround(ctx, scene)
      drawBlossomTree(ctx, 73, 322, '#f2b3cc')
      drawBlossomTree(ctx, 288, 326, '#e99fbd')
      ctx.fillStyle = '#7c8391'
      ctx.beginPath()
      ctx.moveTo(126, 304)
      ctx.lineTo(258, 304)
      ctx.lineTo(310, 420)
      ctx.lineTo(84, 420)
      ctx.closePath()
      ctx.fill()
      for (let index = 0; index < 4; index++) {
        const y = 335 + index * 21
        ctx.fillStyle = 'rgba(156, 194, 205, .42)'
        ctx.beginPath()
        ctx.ellipse(194 + (index % 2) * 15, y, 29 - index * 3, 5, -0.08, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,215,226,.5)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(194 + (index % 2) * 15, y, 12, 2, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = '#68624f'
      ctx.fillRect(267, 281, 13, 30)
      ctx.beginPath()
      ctx.moveTo(263, 282)
      ctx.lineTo(273, 270)
      ctx.lineTo(284, 282)
      ctx.closePath()
      ctx.fill()
      for (let index = 0; index < 11; index++) {
        ctx.fillStyle = index % 2 ? '#f5c46e' : '#e98eaa'
        ctx.beginPath()
        ctx.arc(18 + index * 31, 345 + (index % 3) * 15, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case 'greenhouse':
      drawGround(ctx, scene)
      drawPine(ctx, 38, 347, 82, '#325246', false)
      drawGreenhouse(ctx, scene)
      drawPine(ctx, 320, 346, 88, '#325246', false)
      break
    case 'misty-lake':
      drawLake(ctx, scene, 278)
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.34
      ctx.fillStyle = '#fff0cc'
      ctx.beginPath()
      ctx.moveTo(284, 225)
      ctx.lineTo(309, 225)
      ctx.lineTo(337, 418)
      ctx.lineTo(260, 418)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#665846'
      ctx.beginPath()
      ctx.ellipse(83, 348, 27, 5, -0.08, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#9b8060'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(64, 344)
      ctx.lineTo(103, 344)
      ctx.moveTo(80, 339)
      ctx.lineTo(80, 351)
      ctx.stroke()
      ctx.strokeStyle = '#557762'
      for (let index = 0; index < 5; index++) {
        const x = 15 + index * 12
        ctx.beginPath()
        ctx.moveTo(x, 408)
        ctx.quadraticCurveTo(x - 8, 382, x + 2, 361 + (index % 2) * 9)
        ctx.stroke()
      }
      drawPine(ctx, 42, 326, 91, '#385349', false)
      drawPine(ctx, 326, 329, 102, '#3c574a', false)
      break
    case 'orchard':
      drawGround(ctx, scene)
      ctx.strokeStyle = '#855b3c'
      ctx.lineWidth = 5
      for (let row = 0; row < 4; row++) {
        const x = 36 + row * 96
        ctx.beginPath()
        ctx.moveTo(177 + (x - 177) * 0.2, 265)
        ctx.lineTo(x, 352 + (row % 2) * 12)
        ctx.stroke()
      }
      drawBlossomTree(ctx, 48, 350, '#e8602c')
      drawBlossomTree(ctx, 156, 365, '#f39b38')
      drawBlossomTree(ctx, 275, 348, '#c75436')
      ctx.fillStyle = '#b95b31'
      for (const [x, y] of [[45, 381], [84, 399], [222, 387], [294, 402]]) {
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.strokeStyle = '#72503a'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(31, 351)
      ctx.lineTo(45, 304)
      ctx.lineTo(59, 351)
      ctx.moveTo(37, 331)
      ctx.lineTo(53, 331)
      ctx.stroke()
      ctx.fillStyle = '#87513a'
      ctx.fillRect(282, 383, 32, 20)
      ctx.strokeStyle = '#dfaa62'
      ctx.lineWidth = 2
      ctx.strokeRect(282, 383, 32, 20)
      break
    case 'bridge':
      drawLake(ctx, scene, 299)
      ctx.save()
      ctx.globalAlpha = 0.25
      ctx.strokeStyle = '#ffb066'
      ctx.lineWidth = 11
      ctx.beginPath()
      ctx.moveTo(38, 350)
      ctx.quadraticCurveTo(180, 414, 322, 350)
      ctx.stroke()
      ctx.restore()
      ctx.strokeStyle = '#57483f'
      ctx.lineWidth = 13
      ctx.beginPath()
      ctx.moveTo(36, 332)
      ctx.quadraticCurveTo(180, 244, 324, 332)
      ctx.stroke()
      ctx.strokeStyle = '#d4a36a'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(45, 318)
      ctx.quadraticCurveTo(180, 245, 315, 318)
      ctx.stroke()
      for (let index = 0; index < 8; index++) {
        const x = 52 + index * 36
        const y = 309 - Math.sin(index / 7 * Math.PI) * 17
        ctx.fillStyle = index % 2 ? '#ff8a3d' : '#ffcf7a'
        ctx.beginPath()
        ctx.arc(x, y, 2.8, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#a8493e'
      for (let index = 0; index < 9; index++) {
        const x = 20 + index * 38
        const y = 387 + (index % 3) * 7
        ctx.beginPath()
        ctx.ellipse(x, y, 5, 2.5, index * 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case 'meadow':
      drawGround(ctx, scene)
      ctx.fillStyle = '#6fae8a'
      ctx.beginPath()
      ctx.moveTo(0, 321)
      ctx.quadraticCurveTo(90, 285, 172, 326)
      ctx.quadraticCurveTo(258, 278, 360, 317)
      ctx.lineTo(360, 370)
      ctx.lineTo(0, 370)
      ctx.closePath()
      ctx.fill()
      for (let index = 0; index < 26; index++) {
        const x = (index * 59 + 17) % 360
        const y = 325 + ((index * 23) % 72)
        ctx.strokeStyle = '#477647'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y + 14)
        ctx.lineTo(x + ((index % 3) - 1) * 3, y)
        ctx.stroke()
        ctx.fillStyle = ['#ff6fa5', '#ffd84a', '#ffffff', '#8a6bff'][index % 4]
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case 'lighthouse':
      drawLake(ctx, scene, 292)
      ctx.fillStyle = '#232842'
      ctx.beginPath()
      ctx.moveTo(0, 294)
      ctx.lineTo(84, 279)
      ctx.lineTo(162, 306)
      ctx.lineTo(146, 420)
      ctx.lineTo(0, 420)
      ctx.closePath()
      ctx.fill()
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = '#fff1b822'
      ctx.beginPath()
      ctx.moveTo(104, 211)
      ctx.lineTo(345, 169)
      ctx.lineTo(345, 230)
      ctx.lineTo(104, 223)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#475b57'
      ctx.beginPath()
      ctx.moveTo(0, 300)
      ctx.lineTo(84, 279)
      ctx.lineTo(162, 306)
      ctx.lineTo(146, 420)
      ctx.lineTo(0, 420)
      ctx.fill()
      ctx.fillStyle = '#e8e2d4'
      ctx.fillRect(92, 207, 32, 90)
      ctx.fillStyle = '#46535b'
      ctx.beginPath()
      ctx.moveTo(87, 211)
      ctx.lineTo(108, 193)
      ctx.lineTo(130, 211)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = scene.accent
      ctx.fillRect(97, 222, 22, 14)
      ctx.fillRect(97, 258, 22, 12)
      ctx.strokeStyle = '#d4edf3'
      ctx.lineWidth = 2
      for (let wave = 0; wave < 5; wave++) {
        const y = 322 + wave * 20
        ctx.globalAlpha = 0.24 + wave * 0.04
        ctx.beginPath()
        ctx.moveTo(170 + wave * 7, y)
        ctx.quadraticCurveTo(222 + wave * 12, y - 9, 280 + wave * 10, y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      break
  }
}

// Retain the original portrait-scene helpers for callers of drawSeasonalWeather
// and for downstream consumers while the garden itself uses the wide renderer.
void drawSky
void drawMountains
void drawGlowSources
void drawLandscape

export function drawSeasonalScenery(
  ctx: CanvasRenderingContext2D,
  sceneId: SeasonalSceneryId,
  width = 1440,
  height = 900,
) {
  const scene = getSeasonalScenery(sceneId)
  if (!scene.landscape) throw new Error(`Scenery artwork is missing: ${sceneId}`)
  ctx.save()
  try {
    const scale = Math.max(width / 1440, height / 900)
    const sceneWidth = 1440 * scale
    ctx.translate(width < height * 1.15 ? width - sceneWidth : (width - sceneWidth) / 2, (height - 900 * scale) / 2)
    ctx.scale(scale, scale)
    drawWideLandscape(ctx, scene)
  } finally {
    ctx.restore()
  }
}

function drawWideLandscape(ctx: CanvasRenderingContext2D, scene: SeasonalSceneryDefinition) {
  const [top, middle, horizon] = scene.sky
  const sky = ctx.createLinearGradient(0, 0, 0, 760)
  sky.addColorStop(0, top); sky.addColorStop(.62, middle); sky.addColorStop(1, horizon)
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 1440, 900)
  if (scene.stars || scene.celestial === 'moon') {
    ctx.fillStyle = '#fff5db'
    for (let i = 0; i < 92; i++) {
      const x = (i * 193 + 37) % 1440, y = (i * 97 + 29) % 430
      if (x > 465 && x < 980 && y < 300) continue
      ctx.globalAlpha = .28 + (i % 5) * .1
      ctx.beginPath(); ctx.arc(x, y, .8 + (i % 3) * .45, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1
  }
  if (scene.celestial !== 'none') {
    const x = (scene.celestialPosition?.x ?? .82) * 1440, y = (scene.celestialPosition?.y ?? .2) * 900
    const glow = ctx.createRadialGradient(x, y, 4, x, y, 130)
    glow.addColorStop(0, `${scene.accent}88`); glow.addColorStop(1, `${scene.accent}00`)
    ctx.fillStyle = glow; ctx.fillRect(x - 140, y - 140, 280, 280)
    ctx.fillStyle = scene.accent; ctx.globalAlpha = .86; ctx.beginPath(); ctx.arc(x, y, scene.celestial === 'sun' ? 43 : 30, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
  }
  const ridge = (color: string, y: number, amp: number, phase: number) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, y)
    for (let x = 0; x <= 1440; x += 90) ctx.lineTo(x, y + Math.sin(x * .008 + phase) * amp + Math.sin(x * .019) * amp * .3)
    ctx.lineTo(1440, 900); ctx.lineTo(0, 900); ctx.closePath(); ctx.fill()
  }
  ridge(`${scene.sky[2]}88`, 480, 65, 1); ridge(scene.ridge, 565, 54, 3)
  const lake = ['cabin-lake', 'frozen-lake', 'misty-lake', 'bridge', 'lighthouse'].includes(scene.landscape ?? '')
  const groundY = lake ? 710 : 690
  const ground = ctx.createLinearGradient(0, groundY, 0, 900)
  ground.addColorStop(0, scene.ground); ground.addColorStop(1, `${scene.ground}c9`)
  ctx.fillStyle = ground; ctx.fillRect(0, groundY, 1440, 210)
  if (lake) {
    const water = ctx.createLinearGradient(0, 690, 0, 900)
    water.addColorStop(0, scene.water); water.addColorStop(1, '#101e34')
    ctx.fillStyle = water; ctx.fillRect(0, 690, 1440, 210)
    ctx.globalAlpha = .2; ctx.strokeStyle = scene.accent; ctx.lineWidth = 2
    for (let i = 0; i < 22; i++) { const x = (i * 167 + 29) % 1440, y = 724 + (i * 37) % 155; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 35, y - 4, x + 82, y); ctx.stroke() }
    ctx.globalAlpha = 1
  }
  // Broad, scene-specific landmarks preserve open sky for the heading and tree space on the right.
  const pine = (x: number, base: number, size: number, color: string) => {
    ctx.fillStyle = '#403d3b'; ctx.fillRect(x - size * .035, base - size * .17, size * .07, size * .18)
    ctx.fillStyle = color
    for (let n = 0; n < 4; n++) { const y = base - size * (.35 + n * .18), w = size * (.42 - n * .055); ctx.beginPath(); ctx.moveTo(x, y - size * .25); ctx.lineTo(x - w, y + size * .18); ctx.lineTo(x + w, y + size * .18); ctx.closePath(); ctx.fill() }
  }
  if (['cabin-lake','frozen-lake','pine-forest','mountain-pass','village','greenhouse'].includes(scene.landscape ?? '')) {
    for (let i = 0; i < 24; i++) { const x = i * 67 - 20, size = 100 + (i * 37) % 130; pine(x, 690 + (i % 3) * 24, size, i % 2 ? '#233b43' : '#1a303c') }
  }
  if (scene.landscape === 'cabin-lake') {
    ctx.fillStyle = '#58484a'; ctx.fillRect(490, 555, 330, 155)
    ctx.fillStyle = '#352f3c'; ctx.beginPath(); ctx.moveTo(455, 570); ctx.lineTo(650, 440); ctx.lineTo(855, 570); ctx.closePath(); ctx.fill()
    ctx.fillStyle = scene.accent; ctx.shadowColor = scene.accent; ctx.shadowBlur = 32
    ctx.fillRect(535, 600, 52, 55); ctx.fillRect(720, 600, 52, 55); ctx.shadowBlur = 0
    ctx.fillStyle = '#443b3c'; ctx.fillRect(630, 620, 55, 90); ctx.fillStyle = '#493b38'; ctx.fillRect(744, 460, 30, 92)
  } else if (scene.landscape === 'village') {
    for (let i = 0; i < 10; i++) { const x = 90 + i * 130, y = 610 + (i % 3) * 25; ctx.fillStyle = '#59464a'; ctx.fillRect(x, y, 92, 90); ctx.fillStyle = '#392f3c'; ctx.beginPath(); ctx.moveTo(x - 14, y + 4); ctx.lineTo(x + 46, y - 54); ctx.lineTo(x + 108, y + 4); ctx.fill(); ctx.fillStyle = scene.accent; ctx.fillRect(x + 20, y + 27, 19, 24); ctx.fillRect(x + 57, y + 27, 19, 24) }
  } else if (scene.landscape === 'greenhouse') {
    ctx.fillStyle = '#59866b88'; ctx.strokeStyle = '#e2d7b6'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(480, 700); ctx.lineTo(550, 480); ctx.lineTo(910, 480); ctx.lineTo(990, 700); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(730, 490); ctx.lineTo(730, 698); ctx.moveTo(530, 600); ctx.lineTo(940, 600); ctx.stroke()
  } else if (scene.landscape === 'blossom-garden') {
    for (const x of [100, 380, 1090, 1280]) { ctx.strokeStyle = '#604943'; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(x, 720); ctx.lineTo(x + 12, 470); ctx.moveTo(x + 5, 560); ctx.lineTo(x - 100, 490); ctx.moveTo(x + 8, 535); ctx.lineTo(x + 100, 470); ctx.stroke(); ctx.fillStyle = '#ecabc0'; for (let n = 0; n < 20; n++) { ctx.globalAlpha = .5 + (n % 4) * .12; ctx.beginPath(); ctx.arc(x - 115 + (n * 53) % 230, 440 + (n * 29) % 100, 18 + n % 12, 0, Math.PI * 2); ctx.fill() } }
    ctx.globalAlpha = 1
  } else if (scene.landscape === 'bridge') {
    ctx.strokeStyle = '#594943'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(0, 735); ctx.quadraticCurveTo(720, 500, 1440, 735); ctx.stroke(); ctx.strokeStyle = '#c69b66'; ctx.lineWidth = 8; ctx.stroke()
  } else if (scene.landscape === 'lighthouse') {
    ctx.fillStyle = '#e7e1d2'; ctx.fillRect(275, 455, 92, 260); ctx.fillStyle = '#4a5357'; ctx.beginPath(); ctx.moveTo(255, 466); ctx.lineTo(321, 405); ctx.lineTo(388, 466); ctx.fill(); ctx.fillStyle = scene.accent; ctx.fillRect(294, 488, 55, 38)
  } else if (scene.landscape === 'meadow') {
    ctx.fillStyle = '#6fae8a'; ctx.beginPath(); ctx.moveTo(0, 692); ctx.quadraticCurveTo(360, 610, 720, 690); ctx.quadraticCurveTo(1080, 610, 1440, 680); ctx.lineTo(1440, 900); ctx.lineTo(0, 900); ctx.fill()
    for (let i = 0; i < 100; i++) { const x = (i * 137 + 29) % 1440, y = 718 + (i * 71) % 160; ctx.strokeStyle = '#477647'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + 24); ctx.lineTo(x + (i % 2 ? 7 : -5), y); ctx.stroke(); ctx.fillStyle = ['#ff6fa5','#ffd84a','#ffffff','#8a6bff'][i % 4]; ctx.beginPath(); ctx.arc(x + (i % 2 ? 7 : -5), y, 5, 0, Math.PI * 2); ctx.fill() }
  } else if (scene.landscape === 'orchard') {
    for (const x of [80, 330, 580, 830, 1080, 1330]) { ctx.fillStyle = '#70513c'; ctx.fillRect(x, 485, 24, 250); ctx.fillStyle = '#d57934'; ctx.beginPath(); ctx.arc(x + 12, 485, 105, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(x + 80, 545, 72, 0, Math.PI * 2); ctx.fill() }
  } else if (scene.landscape === 'mountain-pass') {
    ctx.fillStyle = '#e7edf0'; ctx.beginPath(); ctx.moveTo(0, 670); ctx.lineTo(220, 500); ctx.lineTo(410, 650); ctx.lineTo(670, 460); ctx.lineTo(900, 680); ctx.lineTo(1190, 505); ctx.lineTo(1440, 650); ctx.lineTo(1440, 900); ctx.lineTo(0, 900); ctx.fill()
  }
  if (scene.aurora) drawAuroraWide(ctx)
  const wash = ctx.createLinearGradient(0, 0, 0, 900); wash.addColorStop(0, '#09152312'); wash.addColorStop(.7, '#09152300'); wash.addColorStop(1, '#09152324'); ctx.fillStyle = wash; ctx.fillRect(0, 0, 1440, 900)
}

function drawAuroraWide(ctx: CanvasRenderingContext2D) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.lineCap = 'round'
  for (const [i, color] of ['#75f0c2','#75c9e8','#c18cf2'].entries()) { const y = 250 + i * 44, g = ctx.createLinearGradient(0, y, 1440, y); g.addColorStop(0, `${color}00`); g.addColorStop(.28, `${color}55`); g.addColorStop(.7, `${color}33`); g.addColorStop(1, `${color}00`); ctx.globalAlpha = .42; ctx.strokeStyle = g; ctx.lineWidth = 40 - i * 8; ctx.beginPath(); ctx.moveTo(-30, y + 60); ctx.bezierCurveTo(360, y - 80, 800, y + 95, 1470, y - 25); ctx.stroke() }
  ctx.restore()
}

export function drawSeasonalWeather(
  ctx: CanvasRenderingContext2D,
  sceneId: SeasonalSceneryId,
  width = 360,
  height = 420,
) {
  const scene = getSeasonalScenery(sceneId)
  const kind = scene.particleKind ?? scene.weatherKind
  const scaleX = width / 360
  const scaleY = height / 420
  const particleScale = Math.min(scaleX, scaleY)

  if (kind === 'mist') {
    const mist = ctx.createLinearGradient(0, 255 * scaleY, 0, 390 * scaleY)
    mist.addColorStop(0, 'rgba(243, 235, 225, 0)')
    mist.addColorStop(0.55, `rgba(243, 235, 225, ${0.22 + scene.intensity * 0.18})`)
    mist.addColorStop(1, 'rgba(243, 235, 225, 0)')
    ctx.fillStyle = mist
    ctx.fillRect(0, 250 * scaleY, width, 150 * scaleY)
  }

  if (kind === 'rain') {
    ctx.fillStyle = 'rgba(33, 47, 66, .22)'
    ctx.beginPath()
    ctx.ellipse(82 * scaleX, 72 * scaleY, 74 * scaleX, 24 * scaleY, 0, 0, Math.PI * 2)
    ctx.ellipse(171 * scaleX, 60 * scaleY, 94 * scaleX, 31 * scaleY, 0, 0, Math.PI * 2)
    ctx.ellipse(274 * scaleX, 76 * scaleY, 80 * scaleX, 24 * scaleY, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(224, 238, 246, .58)'
    ctx.lineWidth = particleScale
    const count = Math.round(36 + scene.intensity * 56)
    for (let index = 0; index < count; index++) {
      const x = ((index * 71 + 13) % 370) * scaleX
      const y = ((index * 47 + 28) % 350) * scaleY
      const length = (7 + (index % 5) * 2) * particleScale
      ctx.globalAlpha = 0.32 + (index % 4) * 0.12
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - (scene.wind ?? 0.2) * 8 * particleScale, y + length)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  if (kind === 'snow' || kind === 'ground-blizzard') {
    const count = Math.round(30 + scene.intensity * 52)
    for (let index = 0; index < count; index++) {
      const x = ((index * 67 + index * index * 3 + 19) % 366) / 366 * width
      const y = ((index * 43 + index * index * 5 + 7) % 420) / 420 * height
      if (x > 90 * scaleX && x < 270 * scaleX && y < 120 * scaleY) continue
      if (kind === 'ground-blizzard' && y < 295 * scaleY) continue
      const radius = (0.9 + (index % 5) * 0.3) * particleScale
      ctx.globalAlpha = 0.3 + (index % 4) * 0.1
      ctx.fillStyle = index % 8 === 0 ? '#fff8e9' : '#f7fbff'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      if (index % 17 === 0) {
        ctx.save()
        ctx.shadowColor = '#eaf7ff'
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.restore()
      }
    }
  }
  ctx.globalAlpha = 1

  if (kind === 'leaves' || kind === 'petals' || kind === 'seeds') {
    const colors = kind === 'leaves'
      ? ['#d17b36', '#e5ae4d', '#a95537']
      : kind === 'seeds'
        ? ['#fff6c8', '#f4edcf', '#d2e7ac']
        : ['#f3b4ca', '#fff1f4', '#e98dab']
    for (let index = 0; index < 35; index++) {
      const x = (index * 89 + 21) % 360
      const y = (index * 61 + 17) % 350
      if (x > 90 && x < 270 && y < 120) continue
      ctx.save()
      ctx.translate(x * scaleX, y * scaleY)
      ctx.rotate((index % 7) * 0.42)
      ctx.globalAlpha = 0.5 + (index % 4) * 0.12
      ctx.fillStyle = colors[index % colors.length]
      ctx.beginPath()
      ctx.ellipse(
        0,
        0,
        (kind === 'seeds' ? 1.4 : 2 + (index % 3)) * particleScale,
        (kind === 'seeds' ? 5 : 5 + (index % 4)) * particleScale,
        0,
        0,
        Math.PI * 2,
      )
      ctx.fill()
      if (kind === 'seeds') {
        ctx.strokeStyle = '#fff6c8'
        ctx.lineWidth = particleScale
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-4 * particleScale, 2 * particleScale)
        ctx.stroke()
      }
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  if (kind === 'fireflies' || kind === 'ice-sparkle') {
    for (let index = 0; index < 27; index++) {
      const x = ((index * 83 + 29) % 360) * scaleX
      const y = (174 + ((index * 47) % 190)) * scaleY
      ctx.save()
      ctx.globalAlpha = 0.55 + (index % 4) * 0.1
      ctx.shadowColor = kind === 'ice-sparkle' ? '#7de9ff' : '#e5f7a2'
      ctx.shadowBlur = 8 * particleScale
      ctx.fillStyle = kind === 'ice-sparkle' ? '#c8f7ff' : '#e9f4ad'
      ctx.beginPath()
      ctx.arc(x, y, (1.5 + (index % 3) * 0.5) * particleScale, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
}

export function drawSeasonalScene(
  ctx: CanvasRenderingContext2D,
  sceneId: SeasonalSceneryId,
  width: number,
  height: number,
) {
  drawSeasonalScenery(ctx, sceneId, width, height)
}

function drawFlowingStream(ctx: CanvasRenderingContext2D, time: number) {
  const waterline = (x: number, phase = 0) =>
    744 + Math.sin(x * 0.008 + time * 0.8 + phase) * 8 +
    Math.sin(x * 0.003 - time * 0.45 + phase) * 11

  ctx.save()
  ctx.beginPath()
  for (let x = 0; x <= 1440; x += 24) {
    const y = waterline(x)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  for (let x = 1440; x >= 0; x -= 24) {
    ctx.lineTo(x, waterline(x) + 35)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(61, 132, 151, .48)'
  ctx.fill()

  ctx.strokeStyle = 'rgba(202, 241, 231, .55)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.setLineDash([28, 54])
  ctx.lineDashOffset = -time * 38
  for (const phase of [2, 17]) {
    ctx.beginPath()
    for (let x = 0; x <= 1440; x += 24) {
      const y = waterline(x, phase)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  for (let index = 0; index < 7; index++) {
    const x = (index * 223 + time * (18 + index * 2)) % 1440
    const y = waterline(x, index * 2) + 10
    const pulse = 0.35 + (Math.sin(time * 1.8 + index) + 1) * 0.18
    ctx.globalAlpha = pulse
    ctx.strokeStyle = '#f2f4d2'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.ellipse(x, y, 10 + (index % 3) * 4, 2, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

function drawSceneWater(
  ctx: CanvasRenderingContext2D,
  scene: SeasonalSceneryDefinition,
  time: number,
) {
  const style = scene.waterStyle ?? 'flow'
  if (style === 'none') return
  if (style === 'flow') {
    drawFlowingStream(ctx, time)
    return
  }

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(0, 744)
  for (let x = 0; x <= 1440; x += 24) {
    const y = 744 + Math.sin(x * 0.006 + time * 0.3) * (style === 'swell' ? 16 : 4)
    ctx.lineTo(x, y)
  }
  ctx.lineTo(1440, 900)
  ctx.lineTo(0, 900)
  ctx.closePath()
  const water = ctx.createLinearGradient(0, 744, 0, 900)
  water.addColorStop(0, style === 'ice' ? 'rgba(24, 45, 70, .83)' : `${scene.water}cc`)
  water.addColorStop(1, style === 'ice' ? 'rgba(8, 24, 43, .9)' : 'rgba(16, 30, 52, .78)')
  ctx.fillStyle = water
  ctx.fill()

  if (style === 'ice') {
    ctx.globalCompositeOperation = 'screen'
    ctx.strokeStyle = scene.accent
    ctx.lineWidth = 1.4
    ctx.globalAlpha = 0.23 + (Math.sin(time * 0.7) + 1) * 0.12
    for (let index = 0; index < 5; index++) {
      const x = 150 + index * 257
      const y = 780 + (index % 2) * 26
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 24, y + 14)
      ctx.lineTo(x + 31, y + 37)
      ctx.moveTo(x + 24, y + 14)
      ctx.lineTo(x + 3, y + 29)
      ctx.stroke()
    }
    ctx.globalAlpha = 0.38
    ctx.setLineDash([35, 57])
    ctx.lineDashOffset = -time * 9
    ctx.beginPath()
    ctx.moveTo(0, 778)
    ctx.quadraticCurveTo(720, 756, 1440, 783)
    ctx.stroke()
    ctx.setLineDash([])
  } else if (style === 'mirror') {
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.24
    const reflection = ctx.createLinearGradient(0, 748, 0, 900)
    reflection.addColorStop(0, scene.accent)
    reflection.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = reflection
    ctx.fillRect(700, 748, 130, 152)
    ctx.strokeStyle = '#d9e9ee'
    ctx.lineWidth = 1.4
    for (let index = 0; index < 5; index++) {
      const x = (index * 281 + 170) % 1440
      const phase = ((time * 0.12 + index * 0.19) % 1)
      const radius = 8 + phase * 35
      ctx.globalAlpha = (1 - phase) * 0.35
      ctx.beginPath()
      ctx.ellipse(x, 790 + (index % 2) * 28, radius, radius * 0.18, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  } else if (style === 'rain-pocked') {
    ctx.strokeStyle = '#dbeaf2'
    ctx.lineWidth = 1.3
    for (let index = 0; index < 8; index++) {
      const phase = (time * 0.32 + index * 0.17) % 1
      const radius = 5 + phase * 23
      ctx.globalAlpha = (1 - phase) * 0.36
      ctx.beginPath()
      ctx.ellipse((index * 193 + 70) % 1440, 770 + (index % 3) * 34, radius, radius * 0.22, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  } else {
    ctx.strokeStyle = '#cfe8f2'
    ctx.lineCap = 'round'
    ctx.lineWidth = 2
    for (let index = 0; index < 10; index++) {
      const x = (index * 171 + time * (14 + index % 4 * 3)) % 1440
      const y = 780 + (index * 31) % 105 + Math.sin(time + index) * 8
      ctx.globalAlpha = 0.2 + (index % 4) * 0.12
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.quadraticCurveTo(x + 28, y - 10, x + 58, y)
      ctx.stroke()
      if (index % 3 === 0) {
        ctx.beginPath()
        ctx.moveTo(x + 36, y - 4)
        ctx.lineTo(x + 42, y - 17)
        ctx.stroke()
      }
    }
  }
  ctx.restore()
}

function drawLivingTree(
  ctx: CanvasRenderingContext2D,
  scene: SeasonalSceneryDefinition,
  time: number,
) {
  const treeKind = scene.treeKind ?? 'summer'
  const winter = treeKind === 'winter'
  const foliage = treeKind === 'winter'
    ? ['#8aa4ad', '#b6c8cd', '#e5eef0']
    : treeKind === 'autumn'
      ? ['#b84f35', '#dd7837', '#efa94b']
      : treeKind === 'blossom'
        ? ['#d77e9c', '#ecabc0', '#f4c8d2']
        : ['#31594b', '#45745b', '#78a36e']
  const breeze = Math.sin(time * 0.45) * 0.012

  ctx.save()
  ctx.translate(1225, 900)
  ctx.rotate(treeKind === 'wind-bent' ? breeze * 1.8 : breeze)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = treeKind === 'winter' ? '#4b4d55' : '#49382f'
  ctx.lineWidth = 34
  ctx.beginPath()
  ctx.moveTo(0, 20)
  ctx.bezierCurveTo(-22, -155, 20, -310, -4, -455)
  ctx.stroke()
  ctx.strokeStyle = treeKind === 'winter' ? '#89999d' : '#82634a'
  ctx.lineWidth = 8.5
  ctx.beginPath()
  ctx.moveTo(-8, -260)
  ctx.quadraticCurveTo(-48, -286, -88, -297)
  ctx.moveTo(-5, -242)
  ctx.quadraticCurveTo(13, -249, 35, -243)
  ctx.moveTo(1, -190)
  ctx.quadraticCurveTo(73, -207, 130, -180)
  ctx.moveTo(0, -320)
  ctx.quadraticCurveTo(-115, -342, -184, -390)
  ctx.moveTo(-4, -372)
  ctx.quadraticCurveTo(70, -399, 129, -432)
  ctx.stroke()

  const clusters = [
    [-182, -397, 42, 34],
    [-133, -420, 53, 38],
    [-77, -441, 62, 42],
    [-19, -453, 58, 40],
    [42, -438, 62, 43],
    [98, -416, 58, 42],
    [151, -390, 48, 34],
    [-93, -355, 62, 40],
    [66, -370, 68, 42],
  ] as const
  if (!winter) {
    clusters.forEach(([x, y, rx, ry], index) => {
      const sway = Math.sin(time * 0.7 + index * 1.3) * 3
      ctx.globalAlpha = 0.86
      ctx.fillStyle = foliage[index % foliage.length]
      ctx.beginPath()
      ctx.ellipse(x + sway, y, rx, ry, sway * 0.004, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.24
      ctx.fillStyle = treeKind === 'blossom' ? '#fff0f6' : '#fff0c9'
      ctx.beginPath()
      ctx.ellipse(x - rx * 0.18 + sway, y - ry * 0.32, rx * 0.55, ry * 0.28, -0.2, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let index = 0; index < 24; index++) {
      const x = -195 + ((index * 73) % 375)
      const y = -456 + ((index * 47) % 132)
      ctx.globalAlpha = 0.48 + (Math.sin(time * 1.5 + index) + 1) * 0.18
      ctx.fillStyle = foliage[index % foliage.length]
      ctx.beginPath()
      ctx.ellipse(
        x + Math.sin(time + index) * 2,
        y,
        7,
        treeKind === 'blossom' ? 4 : 6,
        index * 0.4,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
  } else {
    ctx.strokeStyle = 'rgba(244, 249, 246, .88)'
    ctx.lineWidth = 5
    for (let index = 0; index < 13; index++) {
      const x = -190 + index * 31
      const y = -444 + (index % 3) * 21
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 16, y + 9)
      ctx.stroke()
    }
    ctx.fillStyle = '#edf7fa'
    for (const [x, y, radius] of [[-88, -297, 6], [35, -243, 6], [130, -180, 7]] as const) {
      ctx.beginPath()
      ctx.ellipse(x, y - 3, radius, 2.5, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

function drawMovingWeather(
  ctx: CanvasRenderingContext2D,
  scene: SeasonalSceneryDefinition,
  time: number,
) {
  const kind = scene.particleKind ?? scene.weatherKind
  const particleCount = kind === 'snow'
    ? scene.id === 'snowbound-cabin' ? 78 : 42
    : kind === 'ground-blizzard'
      ? 36
      : kind === 'rain'
      ? 48
      : kind === 'leaves' || kind === 'petals' || kind === 'seeds'
        ? 22
        : kind === 'mist'
          ? 0
          : kind === 'ice-sparkle'
            ? 26
            : 18

  if (kind === 'mist') {
    ctx.save()
    for (let layer = 0; layer < 3; layer++) {
      const top = 440 + layer * 76
      ctx.globalAlpha = 0.07 + (Math.sin(time * 0.22 + layer) + 1) * 0.035
      const mist = ctx.createLinearGradient(0, top, 0, top + 145)
      mist.addColorStop(0, 'rgba(244, 244, 237, 0)')
      mist.addColorStop(0.55, 'rgba(244, 244, 237, .9)')
      mist.addColorStop(1, 'rgba(244, 244, 237, 0)')
      ctx.fillStyle = mist
      ctx.fillRect(Math.sin(time * (0.1 + layer * .025) + layer) * (70 + layer * 35), top, 1440, 145)
    }
    ctx.restore()
    return
  }

  for (let index = 0; index < particleCount; index++) {
    const xBase = (index * 173 + 31) % 1440
    const speed = kind === 'rain'
      ? 270
      : kind === 'ground-blizzard'
        ? 5 + index % 12
        : kind === 'snow'
          ? 20 + index % 20
          : 26
    const y = kind === 'ground-blizzard'
      ? 680 + ((index * 19 + time * speed) % 210)
      : (index * 97 + time * speed) % 900
    const wind = (scene.wind ?? 0.2) * Math.sin(time * 0.6 + index * 0.8)
    const x = (xBase + Math.sin(time * 0.7 + index) * (kind === 'snow' ? 24 : 12) + time * wind * 18 + 1440) % 1440
    if (x > 480 && x < 960 && y < 270) continue

    ctx.save()
    if (kind === 'ground-blizzard') {
      ctx.globalAlpha = 0.16 + (index % 4) * 0.1
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1 + (index % 2)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 24 + index % 21, y - 2)
      ctx.stroke()
    } else if (kind === 'rain') {
      ctx.globalAlpha = 0.22 + (index % 4) * 0.08
      ctx.strokeStyle = '#e5f1f3'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - 5, y + 17 + (index % 3) * 3)
      ctx.stroke()
    } else if (kind === 'snow') {
      const inCabinGlow = scene.id === 'snowbound-cabin' && x > 500 && x < 1000 && y > 640
      ctx.globalAlpha = 0.45 + (index % 4) * 0.1
      ctx.fillStyle = inCabinGlow ? '#ffd08a' : '#f7fbff'
      if (inCabinGlow && index % 3 === 0) {
        ctx.shadowColor = '#ffd08a'
        ctx.shadowBlur = 12
      }
      ctx.beginPath()
      ctx.arc(x, y, 1.5 + (index % 3) * 0.7, 0, Math.PI * 2)
      ctx.fill()
    } else if (kind === 'ice-sparkle') {
      ctx.globalAlpha = 0.25 + (Math.sin(time * 1.7 + index) + 1) * 0.3
      ctx.strokeStyle = '#baf5ff'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(x - 3, y)
      ctx.lineTo(x + 3, y)
      ctx.moveTo(x, y - 3)
      ctx.lineTo(x, y + 3)
      ctx.stroke()
    } else if (kind === 'leaves' || kind === 'petals' || kind === 'seeds') {
      const colors = kind === 'leaves'
        ? ['#d17b36', '#e5ae4d', '#a95537']
        : kind === 'seeds'
          ? ['#fff6c8', '#f4edcf', '#d2e7ac']
          : ['#f3b4ca', '#fff1f4', '#e98dab']
      ctx.translate(x, y)
      ctx.rotate(time * (index % 2 ? 0.7 : -0.55) + index)
      ctx.globalAlpha = 0.64
      ctx.fillStyle = colors[index % colors.length]
      ctx.beginPath()
      ctx.ellipse(0, 0, kind === 'seeds' ? 1.5 : 3, kind === 'seeds' ? 5 : 7, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      const glow = 0.35 + (Math.sin(time * 1.8 + index) + 1) * 0.3
      ctx.globalAlpha = glow
      ctx.shadowColor = scene.accent
      ctx.shadowBlur = 10
      ctx.fillStyle = scene.accent
      ctx.beginPath()
      ctx.arc(x, 170 + ((index * 71 + Math.sin(time + index) * 18) % 460), 2 + (index % 2), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

function drawAnimatedGlows(
  ctx: CanvasRenderingContext2D,
  scene: SeasonalSceneryDefinition,
  time: number,
) {
  if (!scene.glow?.length) return
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  scene.glow.forEach((source, index) => {
    const radius = source.radius * 1440
    const pulse = source.pulse ?? 0
    const breathing = 1 + Math.sin(time * 0.7 + index) * pulse
    const x = source.x * 1440
    const y = source.y * 900
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * breathing)
    glow.addColorStop(0, `${source.color}55`)
    glow.addColorStop(1, `${source.color}00`)
    ctx.globalAlpha = 0.76 + Math.sin(time * 0.6 + index) * pulse
    ctx.fillStyle = glow
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  })
  ctx.restore()
}

function drawMovingAurora(ctx: CanvasRenderingContext2D, time: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.lineCap = 'round'
  for (const [index, color] of ['#75f0c2', '#75c9e8', '#c18cf2'].entries()) {
    const y = 316 + index * 36
    const drift = Math.sin(time * 0.17 + index) * 28
    const gradient = ctx.createLinearGradient(0, y - 70, 1440, y + 34)
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(0.25, `${color}66`)
    gradient.addColorStop(0.52, `${color}22`)
    gradient.addColorStop(0.78, `${color}55`)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalAlpha = 0.32 + Math.sin(time * 0.42 + index * 1.7) * 0.08
    ctx.strokeStyle = gradient
    ctx.lineWidth = 30 - index * 6
    ctx.shadowColor = color
    ctx.shadowBlur = 28
    ctx.beginPath()
    ctx.moveTo(-40, y + drift)
    ctx.bezierCurveTo(320, y - 60 - drift, 510, y + 70, 770, y + drift * 0.3)
    ctx.bezierCurveTo(1020, y - 56 + drift, 1180, y + 42, 1480, y - drift)
    ctx.stroke()
  }
  ctx.restore()
}

function eventPulse(time: number, period: number, duration: number, offset = 0) {
  const phase = ((time + offset) % period + period) % period
  if (phase >= duration) return 0
  return Math.sin(Math.PI * phase / duration)
}

function drawSceneEvents(
  ctx: CanvasRenderingContext2D,
  scene: SeasonalSceneryDefinition,
  time: number,
) {
  if (!scene.events?.length) return
  const seed = scene.staticFrame?.seed ?? 0
  const offset = seed * 0.137

  if (scene.id === 'snowbound-cabin') {
    ctx.save()
    ctx.globalAlpha = .16 + (Math.sin(time * .55) + 1) * .06
    ctx.strokeStyle = '#dce8f0'; ctx.lineWidth = 8; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(765, 468); ctx.bezierCurveTo(740, 430, 790, 410, 760, 372); ctx.bezierCurveTo(735, 343, 785, 321, 766, 292); ctx.stroke()
    ctx.restore()
  }

  if (scene.id === 'whiteout-pass') {
    const fade = .25 + (Math.sin(time * .38) + 1) * .3
    ctx.save(); ctx.globalAlpha = fade; ctx.strokeStyle = '#d54c43'; ctx.fillStyle = '#d54c43'; ctx.lineWidth = 5
    for (let i = 0; i < 6; i++) { const x = 110 + i * 230, y = 770 - i * 24; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y - 52); ctx.stroke(); ctx.beginPath(); ctx.arc(x + 2, y - 52, 8, Math.PI, Math.PI * 2); ctx.fill() }
    ctx.restore()
  }

  if (scene.id === 'cherry-blossom-rain' || scene.id === 'rainlit-greenhouse') {
    ctx.save(); ctx.globalAlpha = scene.id === 'cherry-blossom-rain' ? .24 : .18; ctx.strokeStyle = '#e6f0f4'; ctx.lineWidth = 1.4
    for (let i = 0; i < 30; i++) { const x = (i * 179 + time * 95) % 1480 - 20, y = (i * 83 + time * 230) % 900; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 9, y + 27); ctx.stroke() }
    ctx.restore()
  }

  if (scene.id === 'cherry-blossom-rain') {
    ctx.save(); ctx.strokeStyle = '#f8e4e8'; ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) { const phase = (time * .18 + i * .21) % 1, radius = 4 + phase * 48; ctx.globalAlpha = (1 - phase) * .42; ctx.beginPath(); ctx.ellipse(180 + i * 275, 748 + (i % 2) * 42, radius, radius * .2, 0, 0, Math.PI * 2); ctx.stroke() }
    ctx.restore()
  }

  if (scene.id === 'rainlit-greenhouse') {
    ctx.save(); ctx.strokeStyle = '#d7f2e5'; ctx.lineWidth = 3; ctx.globalAlpha = .52
    for (let i = 0; i < 8; i++) { const phase = (time * .12 + i * .13) % 1, x = 510 + (i * 53) % 430, y = 510 + phase * 168; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 4, y + 12, x + 1, y + 25); ctx.stroke() }
    ctx.restore()
  }

  if (scene.id === 'summer-meadow') {
    ctx.save(); ctx.globalAlpha = .1 + (Math.sin(time * .17) + 1) * .035; ctx.fillStyle = '#4d6480'
    for (let i = 0; i < 3; i++) { const x = ((i * 570 + time * 16) % 1900) - 230; ctx.beginPath(); ctx.ellipse(x, 630, 260, 45, 0, 0, Math.PI * 2); ctx.ellipse(x + 170, 638, 190, 38, 0, 0, Math.PI * 2); ctx.fill() }
    ctx.restore()
  }

  if (scene.id === 'pine-forest-flurry') {
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .16 + (Math.sin(time * .24) + 1) * .035
    for (let i = 0; i < 4; i++) {
      const x = 90 + i * 330 + Math.sin(time * .18 + i) * 24
      const g = ctx.createLinearGradient(x, 250, x + 130, 720)
      g.addColorStop(0, '#ffe0a800'); g.addColorStop(.5, '#ffe0a866'); g.addColorStop(1, '#ffe0a800')
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, 250); ctx.lineTo(x + 28, 250); ctx.lineTo(x + 170, 720); ctx.lineTo(x + 70, 720); ctx.closePath(); ctx.fill()
    }
    ctx.restore()
  }

  if (scene.id === 'snowbound-cabin' || scene.id === 'winter-village') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'
    const points = scene.id === 'snowbound-cabin' ? [[560, 630], [744, 630]] : Array.from({length: 20}, (_, i) => [120 + i * 130, 650 + (i % 3) * 24] as const)
    points.forEach(([x, y], i) => { const pulse = .55 + (Math.sin(time * .8 + i * 1.7) + 1) * .12, g = ctx.createRadialGradient(x, y, 1, x, y, 68); g.addColorStop(0, '#ffd27a66'); g.addColorStop(1, '#ffd27a00'); ctx.globalAlpha = pulse; ctx.fillStyle = g; ctx.fillRect(x - 68, y - 68, 136, 136) })
    ctx.restore()
  }

  if (scene.events.includes('bough-puff')) {
    const pulse = eventPulse(time, 8 + seed % 4, 1.5, offset)
    if (pulse > 0) {
      ctx.save()
      ctx.globalAlpha = pulse * 0.48
      ctx.fillStyle = '#f5fbff'
      ctx.beginPath()
      ctx.ellipse(1138, 602 + pulse * 26, 28 + pulse * 18, 8 + pulse * 9, -0.16, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  if (scene.events.includes('window-lights')) {
    const positions = [
      [250, 680], [330, 715], [530, 685], [748, 720],
      [1000, 695], [1160, 708], [1280, 675], [1375, 720],
    ] as const
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    positions.forEach(([x, y], index) => {
      const on = Math.max(0, Math.sin((time / 8 + index * 0.19 + offset) * Math.PI))
      const glow = ctx.createRadialGradient(x, y, 1, x, y, 29)
      glow.addColorStop(0, '#ffc46bcc')
      glow.addColorStop(1, '#ffc46b00')
      ctx.globalAlpha = 0.32 + on * 0.45
      ctx.fillStyle = glow
      ctx.fillRect(x - 29, y - 29, 58, 58)
    })
    ctx.restore()
  }

  if (scene.events.includes('shooting-star')) {
    const period = 16 + seed % 5
    const phase = ((time + offset) % period + period) % period
    if (phase < 0.72) {
      const x = seed % 2 === 0 ? 1080 + phase * 300 : 350 - phase * 300
      const y = 225 + phase * 58
      const star = ctx.createLinearGradient(x, y, x + (seed % 2 === 0 ? -70 : 70), y - 19)
      star.addColorStop(0, '#ffffff')
      star.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.save()
      ctx.strokeStyle = star
      ctx.lineWidth = 2
      ctx.globalAlpha = 1 - phase / 0.72
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + (seed % 2 === 0 ? -70 : 70), y - 19)
      ctx.stroke()
      ctx.restore()
    }
  }

  if (scene.events.includes('beam-sweep')) {
    const angle = Math.sin(time * 0.76) * 0.36
    const originX = 428
    const originY = 480
    const distance = 1150
    const left = angle - 0.045
    const right = angle + 0.045
    const beam = ctx.createLinearGradient(originX, originY, 1390, originY + Math.sin(angle) * 620)
    beam.addColorStop(0, '#fff1b855')
    beam.addColorStop(1, '#fff1b800')
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.7
    ctx.fillStyle = beam
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + Math.cos(left) * distance, originY + Math.sin(left) * distance)
    ctx.lineTo(originX + Math.cos(right) * distance, originY + Math.sin(right) * distance)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  if (scene.events.includes('lightning')) {
    const period = 10 + seed % 5
    const phase = ((time + offset) % period + period) % period
    const flash = phase < 0.12 ? 1 - phase / 0.12 : phase > 0.2 && phase < 0.27 ? 0.5 - (phase - 0.2) / 0.14 : 0
    if (flash > 0) {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = flash * 0.22
      ctx.fillStyle = '#dcefff'
      ctx.fillRect(1080, 0, 360, 900)
      ctx.globalAlpha = flash
      ctx.strokeStyle = '#f4fbff'
      ctx.lineWidth = 2
      ctx.shadowColor = '#d9edff'
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.moveTo(1270, 170)
      ctx.lineTo(1246, 234)
      ctx.lineTo(1262, 234)
      ctx.lineTo(1228, 305)
      ctx.lineTo(1268, 246)
      ctx.lineTo(1254, 246)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    }
  }

  if (scene.events.includes('lantern-rise')) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (let index = 0; index < 3; index++) {
      const phase = (time * (0.025 + index * 0.003) + index * 0.34 + offset) % 1
      const x = (index % 2 === 0 ? 180 : 1230) + Math.sin(time * 0.3 + index) * 24
      const y = 820 - phase * 510
      const alpha = Math.min(1, (1 - phase) * 2.2)
      const glow = ctx.createRadialGradient(x, y, 1, x, y, 36)
      glow.addColorStop(0, '#ffb066cc')
      glow.addColorStop(1, '#ffb06600')
      ctx.globalAlpha = alpha * 0.8
      ctx.fillStyle = glow
      ctx.fillRect(x - 36, y - 36, 72, 72)
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#ffd08c'
      ctx.fillRect(x - 5, y - 7, 10, 14)
    }
    ctx.restore()
  }

  if (scene.events.includes('gust')) {
    const pulse = eventPulse(time, 12 + seed % 5, 2.8, offset)
    if (pulse > 0) {
      ctx.save()
      ctx.globalAlpha = pulse * (scene.id === 'whiteout-pass' ? 0.24 : 0.13)
      const gust = ctx.createLinearGradient(0, 660, 0, 900)
      gust.addColorStop(0, 'rgba(255,255,255,0)')
      gust.addColorStop(0.65, scene.id === 'whiteout-pass' ? '#f5f8fc' : '#f7dba4')
      gust.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gust
      ctx.fillRect(0, 650, 1440, 250)
      ctx.restore()
    }
  }
}

export function drawSeasonalMotion(
  ctx: CanvasRenderingContext2D,
  sceneId: SeasonalSceneryId,
  width: number,
  height: number,
  time: number,
  animateEvents = true,
) {
  const scene = getSeasonalScenery(sceneId)
  ctx.save()
  try {
    const scale = Math.max(width / 1440, height / 900)
    const sceneWidth = 1440 * scale
    ctx.translate(width < height * 1.15 ? width - sceneWidth : (width - sceneWidth) / 2, (height - 900 * scale) / 2)
    ctx.scale(scale, scale)
    drawSceneWater(ctx, scene, time)
    drawLivingTree(ctx, scene, time)
    drawMovingWeather(ctx, scene, time)
    if (scene.aurora) drawMovingAurora(ctx, time)
    drawAnimatedGlows(ctx, scene, time)
    if (animateEvents) drawSceneEvents(ctx, scene, time)
  } finally {
    ctx.restore()
  }
}

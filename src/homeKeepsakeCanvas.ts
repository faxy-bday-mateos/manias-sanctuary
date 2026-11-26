export type PhotoStyle = 'film' | 'moonlight' | 'garden'

const WIDTH = 360
const HEIGHT = 640
const SCALE = 3

const photoStyles: Record<PhotoStyle, { filter: string; tint: string; accent: string }> = {
  film: {
    filter: 'sepia(.2) saturate(1.04) contrast(1.02)',
    tint: 'rgba(230, 177, 108, .11)',
    accent: '#b58a54',
  },
  moonlight: {
    filter: 'saturate(.78) hue-rotate(12deg)',
    tint: 'rgba(49, 74, 117, .16)',
    accent: '#8a9ab5',
  },
  garden: {
    filter: 'saturate(1.12) contrast(1.02)',
    tint: 'rgba(108, 146, 104, .12)',
    accent: '#718b68',
  },
}

const moodColors: Record<string, string> = {
  quiet: '#293752',
  curious: '#544d70',
  bright: '#b97968',
  brave: '#7e5261',
  gentle: '#5b746e',
  becoming: '#3b5860',
}

function contextFor(canvas: HTMLCanvasElement, height: number) {
  canvas.width = WIDTH * SCALE
  canvas.height = height * SCALE
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas rendering is not available in this browser.')
  context.setTransform(SCALE, 0, 0, SCALE, 0, 0)
  return context
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.trim().split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && context.measureText(next).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawSparkle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  context.save()
  context.translate(x, y)
  context.fillStyle = color
  context.shadowColor = color
  context.shadowBlur = radius * 2
  context.beginPath()
  for (let index = 0; index < 8; index += 1) {
    const angle = -Math.PI / 2 + index * Math.PI / 4
    const distance = index % 2 === 0 ? radius : radius * 0.28
    const pointX = Math.cos(angle) * distance
    const pointY = Math.sin(angle) * distance
    if (index === 0) context.moveTo(pointX, pointY)
    else context.lineTo(pointX, pointY)
  }
  context.closePath()
  context.fill()
  context.restore()
}

function drawFlower(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
  context.save()
  context.fillStyle = color
  for (let index = 0; index < 5; index += 1) {
    const angle = (index * Math.PI * 2) / 5
    context.beginPath()
    context.ellipse(
      x + Math.cos(angle) * 7,
      y + Math.sin(angle) * 7,
      4,
      7,
      angle,
      0,
      Math.PI * 2,
    )
    context.fill()
  }
  context.fillStyle = '#f2d89c'
  context.beginPath()
  context.arc(x, y, 3, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

export function drawPhotoKeepsake(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  wish: string,
  caption: string,
  style: PhotoStyle,
) {
  const context = contextFor(canvas, 500)
  const treatment = photoStyles[style]
  const targetRatio = WIDTH / 360
  const sourceRatio = image.naturalWidth / image.naturalHeight
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = image.naturalWidth
  let sourceHeight = image.naturalHeight

  if (sourceRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio
    sourceX = (image.naturalWidth - sourceWidth) / 2
  } else {
    sourceHeight = image.naturalWidth / targetRatio
    sourceY = (image.naturalHeight - sourceHeight) / 2
  }

  context.fillStyle = '#f6f1e6'
  context.fillRect(0, 0, WIDTH, 500)
  context.save()
  context.filter = treatment.filter
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, WIDTH, 360)
  context.restore()

  context.fillStyle = treatment.tint
  context.fillRect(0, 0, WIDTH, 360)
  context.strokeStyle = 'rgba(255, 249, 235, .86)'
  context.lineWidth = 1
  context.strokeRect(12, 12, 336, 336)
  context.strokeStyle = treatment.accent
  context.globalAlpha = 0.82
  context.strokeRect(17, 17, 326, 326)
  context.globalAlpha = 1
  if (style === 'garden') {
    drawFlower(context, 34, 36, '#f8ead2')
    drawFlower(context, 326, 324, '#f8ead2')
  } else {
    drawSparkle(context, 34, 36, 8, '#fff0c1')
    drawSparkle(context, 326, 324, 6, '#fff0c1')
  }

  context.fillStyle = '#f6f1e6'
  context.fillRect(0, 360, WIDTH, 140)
  context.strokeStyle = `${treatment.accent}88`
  context.beginPath()
  context.moveTo(40, 373)
  context.lineTo(320, 373)
  context.stroke()
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = treatment.accent
  context.font = '700 9px Segoe UI, sans-serif'
  context.letterSpacing = '1.8px'
  context.fillText('A LITTLE WISH TO KEEP', 180, 388)

  context.fillStyle = '#35434a'
  context.font = 'italic 15px Georgia, serif'
  context.letterSpacing = '0px'
  const wishLines = wrapText(context, wish, 310)
  const visibleWishLines = wishLines.slice(0, 3)
  visibleWishLines.forEach((line, index) => context.fillText(line, 180, 416 + index * 19))

  context.fillStyle = '#84785f'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '1px'
  context.fillText(caption.trim() || 'FOR MANUU · WITH CARE', 180, 480)
}

function randomFrom(seed: string) {
  let value = 0
  for (const character of seed) value = (Math.imul(value, 31) + character.charCodeAt(0)) | 0
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) | 0
    return (value >>> 0) / 4294967296
  }
}

function drawSky(context: CanvasRenderingContext2D) {
  const sky = context.createLinearGradient(0, 0, 0, 440)
  sky.addColorStop(0, '#18243f')
  sky.addColorStop(1, '#64758b')
  context.fillStyle = sky
  context.fillRect(0, 0, WIDTH, 440)

  const random = randomFrom('manuu-constellation-sky')
  for (let index = 0; index < 72; index += 1) {
    context.beginPath()
    context.arc(14 + random() * 332, 24 + random() * 350, 0.5 + random() * 1.1, 0, Math.PI * 2)
    context.fillStyle = `rgba(255, 246, 221, ${0.3 + random() * 0.6})`
    context.fill()
  }
  context.save()
  context.shadowColor = '#f2d9a5a8'
  context.shadowBlur = 22
  context.fillStyle = '#f2d9a5'
  context.beginPath()
  context.arc(285, 116, 28, 0, Math.PI * 2)
  context.fill()
  context.restore()

  context.fillStyle = '#283b50'
  context.beginPath()
  context.moveTo(0, 370)
  context.quadraticCurveTo(92, 322, 190, 371)
  context.quadraticCurveTo(270, 335, 360, 373)
  context.lineTo(360, 440)
  context.lineTo(0, 440)
  context.fill()
  context.fillStyle = '#1c3442'
  context.beginPath()
  context.moveTo(0, 398)
  context.quadraticCurveTo(104, 363, 214, 402)
  context.quadraticCurveTo(292, 372, 360, 400)
  context.lineTo(360, 440)
  context.lineTo(0, 440)
  context.fill()
}

function drawWishPanel(context: CanvasRenderingContext2D, wish: string) {
  context.fillStyle = '#f6f1e6'
  context.fillRect(0, 440, WIDTH, HEIGHT - 440)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#987d56'
  context.font = '700 9px Segoe UI, sans-serif'
  context.letterSpacing = '1.6px'
  context.fillText('A WISH TO KEEP', 180, 478)
  context.fillStyle = '#35434a'
  context.font = 'italic 15px Georgia, serif'
  context.letterSpacing = '0px'
  wrapText(context, wish, 300)
    .slice(0, 4)
    .forEach((line, index) => context.fillText(line, 180, 516 + index * 22))
  context.fillStyle = '#9b855f'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '2px'
  context.fillText('FOR MANUU · WITH CARE', 180, 615)
}

export type ConstellationPoint = { x: number; y: number }

export function drawConstellationWallpaper(
  canvas: HTMLCanvasElement,
  wish: string,
  points: ConstellationPoint[],
  isClosed: boolean,
) {
  const context = contextFor(canvas, HEIGHT)
  drawSky(context)
  context.textAlign = 'center'
  context.fillStyle = '#f5e6c6'
  context.font = '600 9px Segoe UI, sans-serif'
  context.letterSpacing = '2px'
  context.fillText('A LITTLE SKY, DRAWN BY YOU', 180, 55)

  if (points.length > 1) {
    context.save()
    context.strokeStyle = '#f3d9a5'
    context.lineWidth = 1.4
    context.shadowColor = '#f3d9a5'
    context.shadowBlur = 8
    context.beginPath()
    context.moveTo(points[0].x, points[0].y)
    points.slice(1).forEach((point) => context.lineTo(point.x, point.y))
    if (isClosed) context.closePath()
    context.stroke()
    context.restore()
  }

  points.forEach((point, index) => drawSparkle(context, point.x, point.y, index === 0 ? 5 : 3.4, '#fff0bd'))
  drawWishPanel(context, wish)
}

export function drawMoodMap(canvas: HTMLCanvasElement, selectedMoods: string[]) {
  const context = contextFor(canvas, HEIGHT)
  const selected = [...selectedMoods].sort()
  const colors = (selected.length ? selected : ['quiet']).map((mood) => moodColors[mood] ?? moodColors.quiet)
  const random = randomFrom(selected.join('|') || 'quiet')
  const gradient = context.createLinearGradient(0, 0, 300, HEIGHT)
  gradient.addColorStop(0, colors[0] ?? '#293752')
  gradient.addColorStop(0.55, colors[1] ?? '#8092a0')
  gradient.addColorStop(1, colors[2] ?? colors[0] ?? '#5b746e')
  context.fillStyle = gradient
  context.fillRect(0, 0, WIDTH, HEIGHT)

  for (let index = 0; index < 5; index += 1) {
    const color = colors[index % colors.length]
    const x = 55 + random() * 250
    const y = 110 + random() * 330
    const radius = 32 + random() * 64
    const glow = context.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, `${color}a8`)
    glow.addColorStop(1, `${color}00`)
    context.fillStyle = glow
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  context.strokeStyle = 'rgba(255, 240, 215, .25)'
  context.lineWidth = 1
  for (let index = 0; index < 3; index += 1) {
    context.beginPath()
    context.ellipse(180, 300, 65 + index * 36, 104 + index * 26, -0.28, 0, Math.PI * 2)
    context.stroke()
  }
  for (let index = 0; index < 25; index += 1) {
    drawSparkle(context, 28 + random() * 304, 36 + random() * 390, 1 + random() * 2, '#fff0cc')
  }

  context.fillStyle = '#f6f1e6'
  context.fillRect(0, 470, WIDTH, 170)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#987d56'
  context.font = '600 9px Segoe UI, sans-serif'
  context.letterSpacing = '2px'
  context.fillText('A LITTLE MOOD MAP', 180, 512)
  context.fillStyle = '#35434a'
  context.font = 'italic 18px Georgia, serif'
  context.letterSpacing = '0px'
  const label = selected.join(' · ') || 'choose a feeling'
  wrapText(context, label, 310).slice(0, 2).forEach((line, index) => {
    context.fillText(line, 180, 554 + index * 24)
  })
  context.fillStyle = '#9b855f'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '2px'
  context.fillText('A SKY THAT FEELS LIKE YOU', 180, 615)
}

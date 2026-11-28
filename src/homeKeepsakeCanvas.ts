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

function moodColor(word: string) {
  const known = moodColors[word.toLocaleLowerCase()]
  if (known) return known
  const palette = ['#d68a67', '#7d91c1', '#b786b0', '#8ba876', '#d0a64f', '#679ba0']
  let hash = 0
  for (const character of word.toLocaleLowerCase()) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) | 0
  return palette[((hash % palette.length) + palette.length) % palette.length]
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

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
}

function drawPaper(context: CanvasRenderingContext2D, height: number, base = '#f6f1e6') {
  context.fillStyle = base
  context.fillRect(0, 0, WIDTH, height)
  const grain = randomFrom(`paper-grain-${height}`)
  for (let index = 0; index < 380; index += 1) {
    context.globalAlpha = .035 + grain() * .055
    context.fillStyle = index % 2 ? '#796a52' : '#fffdf6'
    context.fillRect(grain() * WIDTH, grain() * height, .35 + grain() * .6, .35 + grain() * .6)
  }
  context.globalAlpha = 1
}

function drawPrintFrame(context: CanvasRenderingContext2D, accent: string, bottom: number) {
  context.save()
  context.strokeStyle = `${accent}55`
  context.lineWidth = .7
  context.strokeRect(8, 8, WIDTH - 16, bottom - 16)
  context.strokeStyle = `${accent}99`
  context.lineWidth = .8
  const inset = 13, length = 13
  for (const [x, y, sx, sy] of [[inset, inset, 1, 1], [WIDTH - inset, inset, -1, 1], [inset, bottom - inset, 1, -1], [WIDTH - inset, bottom - inset, -1, -1]] as const) {
    context.beginPath(); context.moveTo(x, y + sy * length); context.lineTo(x, y); context.lineTo(x + sx * length, y); context.stroke()
  }
  context.restore()
}

function drawDivider(context: CanvasRenderingContext2D, y: number, color: string) {
  context.save()
  context.strokeStyle = `${color}72`; context.fillStyle = color; context.lineWidth = .7
  context.beginPath(); context.moveTo(42, y); context.lineTo(156, y); context.moveTo(204, y); context.lineTo(318, y); context.stroke()
  drawSparkle(context, 180, y, 4, color)
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
  const targetRatio = 320 / 298
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

  drawPaper(context, 500)
  drawPrintFrame(context, treatment.accent, 500)

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = treatment.accent
  context.font = '700 8px Segoe UI, sans-serif'
  context.letterSpacing = '2px'
  context.fillText('A MOMENT, MADE TO KEEP', 180, 26)

  context.save()
  context.shadowColor = '#29323d35'; context.shadowBlur = 14; context.shadowOffsetY = 5
  roundedRect(context, 12, 39, 336, 314, 12)
  context.fillStyle = '#fffdf8'; context.fill()
  context.restore()

  roundedRect(context, 20, 47, 320, 298, 8)
  context.save()
  context.clip()
  context.save()
  context.filter = treatment.filter
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 20, 47, 320, 298)
  context.restore()

  context.fillStyle = treatment.tint
  context.fillRect(20, 47, 320, 298)
  const photoShade = context.createLinearGradient(0, 240, 0, 345)
  photoShade.addColorStop(0, 'rgba(19, 30, 37, 0)')
  photoShade.addColorStop(1, 'rgba(19, 30, 37, .28)')
  context.fillStyle = photoShade; context.fillRect(20, 240, 320, 105)
  context.restore()
  context.strokeStyle = 'rgba(255, 249, 235, .9)'
  context.lineWidth = 1.2
  roundedRect(context, 20, 47, 320, 298, 8); context.stroke()
  context.strokeStyle = treatment.accent
  context.globalAlpha = .78
  context.lineWidth = .8
  roundedRect(context, 16, 43, 328, 306, 10); context.stroke()
  context.globalAlpha = 1
  if (style === 'garden') {
    drawFlower(context, 33, 62, '#f8ead2')
    drawFlower(context, 327, 330, '#f8ead2')
  } else {
    drawSparkle(context, 33, 62, 8, '#fff0c1')
    drawSparkle(context, 327, 330, 6, '#fff0c1')
  }

  drawDivider(context, 368, treatment.accent)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = treatment.accent
  context.font = '700 8px Segoe UI, sans-serif'
  context.letterSpacing = '1.7px'
  context.fillText('A WISH FOR YOUR NEXT CHAPTER', 180, 388)

  context.fillStyle = '#35434a'
  context.font = 'italic 14px Georgia, serif'
  context.letterSpacing = '0px'
  const wishLines = wrapText(context, wish, 310)
  const visibleWishLines = wishLines.slice(0, 3)
  visibleWishLines.forEach((line, index) => context.fillText(line, 180, 414 + index * 18))

  context.fillStyle = '#84785f'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '1px'
  context.fillText(caption.trim() || 'FOR MANUU · WITH CARE', 180, 478)
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
  sky.addColorStop(0, '#111a31')
  sky.addColorStop(.48, '#293c5b')
  sky.addColorStop(1, '#7c8794')
  context.fillStyle = sky
  context.fillRect(0, 0, WIDTH, 440)

  const haze = [
    { x: 74, y: 255, radius: 150, color: '#bf8bb8' },
    { x: 260, y: 280, radius: 170, color: '#77a4c2' },
  ]
  haze.forEach(({ x, y, radius, color }) => {
    const glow = context.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, `${color}30`); glow.addColorStop(1, `${color}00`)
    context.fillStyle = glow; context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  })

  const random = randomFrom('manuu-constellation-sky')
  for (let index = 0; index < 132; index += 1) {
    const x = 12 + random() * 336
    const y = 18 + random() * 352
    const radius = index % 17 === 0 ? 1.5 + random() * .7 : .35 + random() * .85
    context.globalAlpha = .34 + random() * .58
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fillStyle = '#fff6dd'
    context.fill()
    if (index % 17 === 0) {
      context.strokeStyle = 'rgba(255, 246, 221, .55)'; context.lineWidth = .45
      context.beginPath(); context.moveTo(x - radius * 2.5, y); context.lineTo(x + radius * 2.5, y); context.moveTo(x, y - radius * 2.5); context.lineTo(x, y + radius * 2.5); context.stroke()
    }
  }
  context.globalAlpha = 1
  context.strokeStyle = 'rgba(255, 245, 223, .56)'; context.lineWidth = 1.1
  context.beginPath(); context.moveTo(30, 142); context.lineTo(47, 126); context.lineTo(63, 134); context.lineTo(78, 109); context.stroke()
  context.fillStyle = '#fff2c9'; [[30, 142], [47, 126], [63, 134], [78, 109]].forEach(([x, y]) => { context.beginPath(); context.arc(x, y, 1.4, 0, Math.PI * 2); context.fill() })

  context.save()
  const moonGlow = context.createRadialGradient(285, 116, 4, 285, 116, 63)
  moonGlow.addColorStop(0, 'rgba(255, 231, 181, .28)'); moonGlow.addColorStop(1, 'rgba(255, 231, 181, 0)')
  context.fillStyle = moonGlow; context.fillRect(222, 53, 126, 126)
  context.shadowColor = '#f2d9a5a8'; context.shadowBlur = 22; context.fillStyle = '#f2d9a5'
  context.beginPath()
  context.arc(285, 116, 28, 0, Math.PI * 2)
  context.fill()
  context.restore()

  const distantHill = context.createLinearGradient(0, 330, 0, 440)
  distantHill.addColorStop(0, '#50617a'); distantHill.addColorStop(1, '#2d3b52')
  context.fillStyle = distantHill
  context.beginPath()
  context.moveTo(0, 370)
  context.quadraticCurveTo(92, 322, 190, 371)
  context.quadraticCurveTo(270, 335, 360, 373)
  context.lineTo(360, 440)
  context.lineTo(0, 440)
  context.fill()
  const nearHill = context.createLinearGradient(0, 365, 0, 440)
  nearHill.addColorStop(0, '#304c59'); nearHill.addColorStop(1, '#172d3a')
  context.fillStyle = nearHill
  context.beginPath()
  context.moveTo(0, 398)
  context.quadraticCurveTo(104, 363, 214, 402)
  context.quadraticCurveTo(292, 372, 360, 400)
  context.lineTo(360, 440)
  context.lineTo(0, 440)
  context.fill()

  context.fillStyle = '#203544'
  for (const [x, base, size] of [[19, 395, 55], [47, 389, 38], [312, 393, 50], [342, 399, 62]] as const) {
    context.fillRect(x - 2, base - size * .14, 4, size * .18)
    for (let layer = 0; layer < 3; layer += 1) {
      const top = base - size * (.8 - layer * .23), spread = size * (.27 - layer * .035)
      context.beginPath(); context.moveTo(x, top); context.lineTo(x - spread, top + size * .32); context.lineTo(x + spread, top + size * .32); context.closePath(); context.fill()
    }
  }
}

function drawWishPanel(context: CanvasRenderingContext2D, wish: string) {
  context.fillStyle = '#f6f1e6'
  context.fillRect(0, 440, WIDTH, HEIGHT - 440)
  const grain = randomFrom('constellation-paper-grain')
  for (let index = 0; index < 130; index += 1) {
    context.globalAlpha = .025 + grain() * .045
    context.fillStyle = index % 2 ? '#796a52' : '#fffdf6'
    context.fillRect(grain() * WIDTH, 444 + grain() * 192, .35 + grain() * .5, .35 + grain() * .5)
  }
  context.globalAlpha = 1
  context.strokeStyle = 'rgba(151, 125, 86, .55)'; context.lineWidth = .7
  context.strokeRect(10, 450, 340, 180)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#987d56'
  context.font = '700 9px Segoe UI, sans-serif'
  context.letterSpacing = '1.9px'
  context.fillText('A WISH TO KEEP', 180, 476)
  drawDivider(context, 492, '#987d56')
  context.fillStyle = '#35434a'
  context.font = 'italic 14px Georgia, serif'
  context.letterSpacing = '0px'
  wrapText(context, wish, 300)
    .slice(0, 4)
    .forEach((line, index) => context.fillText(line, 180, 518 + index * 19))
  context.fillStyle = '#9b855f'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '1.8px'
  context.fillText('FOR MANUU · WITH CARE', 180, 611)
}

export type ConstellationPoint = { x: number; y: number }

export function drawConstellationWallpaper(
  canvas: HTMLCanvasElement,
  wish: string,
  points: ConstellationPoint[],
  isClosed: boolean,
  name = "Manuu's Little Sky",
  highlightedPoint = points.length - 1,
) {
  const context = contextFor(canvas, HEIGHT)
  drawSky(context)
  context.textAlign = 'center'
  context.fillStyle = '#f5e6c6'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '1.8px'
  context.fillText('A LITTLE SKY, DRAWN BY YOU', 180, 45)
  context.fillStyle = '#fff6df'
  context.font = 'italic 19px Georgia, serif'
  context.letterSpacing = '0px'
  const safeName = name.trim() || "Manuu's Little Sky"
  context.fillText(safeName, 180, 82, 320)
  context.strokeStyle = 'rgba(243, 217, 165, .3)'
  context.lineWidth = .7
  context.beginPath(); context.moveTo(92, 103); context.lineTo(268, 103); context.stroke()

  if (points.length > 1) {
    context.save()
    context.strokeStyle = 'rgba(243, 217, 165, .72)'
    context.lineWidth = 1.2
    context.shadowColor = '#f3d9a5'
    context.shadowBlur = 5
    context.beginPath()
    context.moveTo(points[0].x, points[0].y)
    for (let index = 1; index < points.length; index += 1) context.lineTo(points[index].x, points[index].y)
    if (isClosed) context.closePath()
    context.stroke()
    if (highlightedPoint > 0 && highlightedPoint < points.length) {
      const previous = points[highlightedPoint - 1]
      const active = points[highlightedPoint]
      context.strokeStyle = '#fff4c9'; context.lineWidth = 1.8; context.shadowBlur = 12
      context.beginPath(); context.moveTo(previous.x, previous.y); context.lineTo(active.x, active.y); context.stroke()
    }
    context.restore()
  }

  points.forEach((point, index) => {
    if (index === highlightedPoint) {
      context.save()
      context.strokeStyle = 'rgba(255, 234, 174, .72)'
      context.lineWidth = .8
      context.shadowColor = '#ffe7a6'
      context.shadowBlur = 12
      context.beginPath(); context.arc(point.x, point.y, 10, 0, Math.PI * 2); context.stroke()
      context.restore()
    }
    drawSparkle(context, point.x, point.y, index === highlightedPoint ? 6.2 : index === 0 ? 5 : 3.4, index === highlightedPoint ? '#fff9e7' : '#fff0bd')
  })
  drawWishPanel(context, wish)
  drawPrintFrame(context, '#d6b778', HEIGHT)
}

export function drawMoodMap(canvas: HTMLCanvasElement, selectedMoods: string[]) {
  const context = contextFor(canvas, HEIGHT)
  const selected = [...selectedMoods]
  const colors = (selected.length ? selected : ['quiet']).map(moodColor)
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

  context.save()
  context.globalCompositeOperation = 'screen'
  context.lineCap = 'round'
  for (let band = 0; band < colors.length; band += 1) {
    const color = colors[band] ?? colors[0] ?? '#b7c7cf'
    const y = 130 + band * 112
    const gradient = context.createLinearGradient(0, y, WIDTH, y + 120)
    gradient.addColorStop(0, `${color}00`); gradient.addColorStop(.3, `${color}75`); gradient.addColorStop(.7, `${color}42`); gradient.addColorStop(1, `${color}00`)
    context.globalAlpha = .33; context.strokeStyle = gradient; context.lineWidth = 32 + band * 7
    context.beginPath(); context.moveTo(-24, y + 64); context.bezierCurveTo(78, y - 42, 210, y + 117, 384, y - 18); context.stroke()
    context.globalAlpha = .15; context.lineWidth = 2
    context.beginPath(); context.moveTo(-12, y + 66); context.bezierCurveTo(92, y - 35, 216, y + 112, 370, y - 12); context.stroke()
  }
  context.restore()

  context.strokeStyle = 'rgba(255, 240, 215, .25)'
  context.lineWidth = 1
  for (let index = 0; index < 4; index += 1) {
    context.beginPath()
    context.ellipse(180, 300, 45 + index * 39, 72 + index * 31, -.36, 0, Math.PI * 2)
    context.stroke()
  }
  context.save(); context.strokeStyle = 'rgba(255, 237, 203, .42)'; context.lineWidth = .8
  const moodStars = selected.map((word, index) => ({ word, color: colors[index] ?? colors[0] ?? '#b7c7cf', x: 72 + index * 108, y: 206 + (index % 2) * 64 }))
  if (moodStars.length > 1) {
    context.beginPath(); context.moveTo(moodStars[0].x, moodStars[0].y)
    moodStars.slice(1).forEach((point) => context.lineTo(point.x, point.y)); context.stroke()
  }
  moodStars.forEach((point, index) => {
    const halo = context.createRadialGradient(point.x, point.y, 1, point.x, point.y, 27)
    halo.addColorStop(0, `${point.color}b0`); halo.addColorStop(1, `${point.color}00`)
    context.fillStyle = halo; context.beginPath(); context.arc(point.x, point.y, 27, 0, Math.PI * 2); context.fill()
    context.fillStyle = 'rgba(23, 31, 52, .48)'; roundedRect(context, point.x - 39, point.y + 14, 78, 16, 7); context.fill()
    context.strokeStyle = `${point.color}bb`; context.lineWidth = .8; roundedRect(context, point.x - 39, point.y + 14, 78, 16, 7); context.stroke()
    context.fillStyle = '#fff6df'; context.font = '600 7px Segoe UI, sans-serif'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.letterSpacing = '.3px'
    context.fillText(point.word.toLocaleUpperCase(), point.x, point.y + 22, 70)
    drawSparkle(context, point.x, point.y, index === 0 ? 5 : 3.5, '#fff0cc')
  })
  context.restore()
  for (let index = 0; index < 42; index += 1) {
    drawSparkle(context, 28 + random() * 304, 36 + random() * 390, 1 + random() * 2, '#fff0cc')
  }

  context.fillStyle = '#f6f1e6'
  context.fillRect(0, 462, WIDTH, 178)
  const grain = randomFrom('mood-map-paper-grain')
  for (let index = 0; index < 135; index += 1) {
    context.globalAlpha = .025 + grain() * .05; context.fillStyle = index % 2 ? '#796a52' : '#fffdf6'
    context.fillRect(grain() * WIDTH, 466 + grain() * 168, .35 + grain() * .5, .35 + grain() * .5)
  }
  context.globalAlpha = 1
  context.strokeStyle = 'rgba(151, 125, 86, .58)'; context.lineWidth = .7; context.strokeRect(10, 472, 340, 158)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#987d56'
  context.font = '700 8px Segoe UI, sans-serif'
  context.letterSpacing = '1.9px'
  context.fillText('A LITTLE MOOD MAP', 180, 492)
  drawDivider(context, 510, '#987d56')
  context.fillStyle = '#35434a'
  context.font = 'italic 17px Georgia, serif'
  context.letterSpacing = '0px'
  const label = selected.join('  ·  ') || 'choose a feeling'
  wrapText(context, label, 306).slice(0, 2).forEach((line, index) => {
    context.fillText(line, 180, 543 + index * 23)
  })
  const swatchWidth = Math.min(34, 104 / colors.length)
  const swatchGap = 11
  const startX = 180 - (colors.length * swatchWidth + (colors.length - 1) * swatchGap) / 2
  colors.forEach((color, index) => {
    context.fillStyle = color; context.globalAlpha = .84
    roundedRect(context, startX + index * (swatchWidth + swatchGap), 580, swatchWidth, 3, 2); context.fill()
  })
  context.globalAlpha = 1
  context.fillStyle = '#9b855f'
  context.font = '600 8px Segoe UI, sans-serif'
  context.letterSpacing = '1.8px'
  context.fillText('A SKY THAT FEELS LIKE YOU', 180, 610)
  drawPrintFrame(context, '#987d56', HEIGHT)
}

export function createKeepsakePng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('The browser could not create the keepsake PNG.'))
      }
    }, 'image/png')
  })
}

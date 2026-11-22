export type WallpaperScene = 'night' | 'ocean' | 'room'

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1920
const DESIGN_WIDTH = 360
const DESIGN_HEIGHT = 640

type WallpaperCopy = {
  artLine: string
  greeting: string
}

function drawNightScene(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420)
  sky.addColorStop(0, '#1b2041')
  sky.addColorStop(1, '#596786')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, DESIGN_WIDTH, 420)

  ctx.save()
  ctx.shadowColor = 'rgb(243 217 165 / 55%)'
  ctx.shadowBlur = 30
  ctx.fillStyle = '#f3d9a5'
  ctx.beginPath()
  ctx.arc(270, 120, 35, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = '#fff3d4'
  for (const [x, y, radius] of [
    [42, 94, 1.6],
    [92, 175, 1.1],
    [154, 76, 1.4],
    [213, 208, 1.1],
    [312, 64, 1.3],
    [323, 190, 1.8],
    [54, 255, 1.2],
    [186, 285, 1.5],
  ]) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#444c6b'
  ctx.beginPath()
  ctx.moveTo(0, 340)
  ctx.quadraticCurveTo(95, 292, 190, 344)
  ctx.quadraticCurveTo(275, 300, 360, 342)
  ctx.lineTo(360, 420)
  ctx.lineTo(0, 420)
  ctx.fill()

  ctx.fillStyle = '#35445e'
  ctx.beginPath()
  ctx.moveTo(0, 370)
  ctx.quadraticCurveTo(105, 330, 210, 371)
  ctx.quadraticCurveTo(290, 338, 360, 368)
  ctx.lineTo(360, 420)
  ctx.lineTo(0, 420)
  ctx.fill()
}

function drawOceanScene(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, 390)
  sky.addColorStop(0, '#293858')
  sky.addColorStop(0.65, '#7f9d9f')
  sky.addColorStop(1, '#e3cda9')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, DESIGN_WIDTH, 420)

  ctx.fillStyle = '#f3d8a6'
  ctx.beginPath()
  ctx.arc(275, 150, 33, 0, Math.PI * 2)
  ctx.fill()

  const sea = ctx.createLinearGradient(0, 350, 0, 500)
  sea.addColorStop(0, '#56858a')
  sea.addColorStop(1, '#244d5c')
  ctx.fillStyle = sea
  ctx.fillRect(0, 350, DESIGN_WIDTH, 150)

  ctx.strokeStyle = 'rgb(219 230 215 / 60%)'
  ctx.lineWidth = 2
  for (const [x, y, width] of [
    [22, 385, 88],
    [185, 402, 112],
    [70, 438, 135],
    [230, 465, 92],
    [9, 487, 61],
  ]) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + width / 2, y - 5, x + width, y)
    ctx.stroke()
  }
}

function drawRoomScene(ctx: CanvasRenderingContext2D) {
  const wall = ctx.createLinearGradient(0, 0, 360, 390)
  wall.addColorStop(0, '#e7d0aa')
  wall.addColorStop(0.58, '#c89768')
  wall.addColorStop(1, '#8a604d')
  ctx.fillStyle = wall
  ctx.fillRect(0, 0, DESIGN_WIDTH, 420)

  ctx.fillStyle = '#806452'
  ctx.fillRect(0, 374, DESIGN_WIDTH, 46)

  ctx.save()
  ctx.shadowColor = 'rgb(255 215 145 / 48%)'
  ctx.shadowBlur = 28
  ctx.fillStyle = '#6f5448'
  ctx.beginPath()
  ctx.roundRect(32, 72, 152, 238, 72)
  ctx.fill()
  const window = ctx.createLinearGradient(0, 80, 0, 300)
  window.addColorStop(0, '#3c4964')
  window.addColorStop(1, '#e8c996')
  ctx.fillStyle = window
  ctx.beginPath()
  ctx.roundRect(42, 82, 132, 218, 62)
  ctx.fill()
  ctx.restore()

  ctx.strokeStyle = '#6f5448'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(108, 86)
  ctx.lineTo(108, 300)
  ctx.moveTo(45, 196)
  ctx.lineTo(171, 196)
  ctx.stroke()

  const glow = ctx.createRadialGradient(276, 300, 3, 276, 300, 100)
  glow.addColorStop(0, 'rgb(255 224 166 / 42%)')
  glow.addColorStop(1, 'rgb(255 224 166 / 0%)')
  ctx.fillStyle = glow
  ctx.fillRect(170, 190, 190, 210)

  ctx.fillStyle = '#f1d49b'
  ctx.beginPath()
  ctx.moveTo(230, 250)
  ctx.quadraticCurveTo(276, 214, 322, 250)
  ctx.lineTo(310, 278)
  ctx.lineTo(242, 278)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#765543'
  ctx.fillRect(271, 278, 10, 78)
  ctx.fillRect(225, 353, 102, 9)

  ctx.fillStyle = '#a47a57'
  ctx.fillRect(0, 386, DESIGN_WIDTH, 5)
}

export function drawBirthdayWallpaper(
  canvas: HTMLCanvasElement,
  scene: WallpaperScene,
  copy: WallpaperCopy,
) {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas rendering is not available in this browser.')
  }

  ctx.scale(CANVAS_WIDTH / DESIGN_WIDTH, CANVAS_HEIGHT / DESIGN_HEIGHT)
  if (scene === 'night') drawNightScene(ctx)
  if (scene === 'ocean') drawOceanScene(ctx)
  if (scene === 'room') drawRoomScene(ctx)

  const paper = ctx.createLinearGradient(0, 420, 0, DESIGN_HEIGHT)
  paper.addColorStop(0, '#f7f4ed')
  paper.addColorStop(1, '#eeece4')
  ctx.fillStyle = paper
  ctx.fillRect(0, 420, DESIGN_WIDTH, DESIGN_HEIGHT - 420)

  ctx.strokeStyle = 'rgb(112 123 126 / 36%)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(86, 450)
  ctx.lineTo(274, 450)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#596368'
  ctx.font = '600 10px Segoe UI, sans-serif'
  ctx.letterSpacing = '1.8px'
  ctx.fillText(copy.greeting.toUpperCase(), 180, 485)

  ctx.fillStyle = '#293540'
  ctx.font = '400 40px Georgia, serif'
  ctx.letterSpacing = '0px'
  ctx.fillText('Manuu', 180, 535)

  ctx.fillStyle = '#bd905e'
  ctx.font = '14px Georgia, serif'
  ctx.fillText('✦', 180, 578)

  ctx.fillStyle = '#596368'
  ctx.font = 'italic 16px Georgia, serif'
  ctx.fillText(copy.artLine, 180, 608)
}

export function createWallpaperPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('The browser could not create the wallpaper PNG.'))
      }
    }, 'image/png')
  })
}

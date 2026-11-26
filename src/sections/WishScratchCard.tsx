import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

type WishScratchCardProps = {
  number: number
  wish: string
  unlocked: boolean
  onUnlock: (wishNumber: number) => void
}

function drawCover(canvas: HTMLCanvasElement, card: HTMLElement, number: number) {
  const rect = card.getBoundingClientRect()
  const width = Math.max(1, Math.round(rect.width))
  const height = Math.max(1, Math.round(rect.height))
  const scale = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return
  const w = canvas.width
  const h = canvas.height

  const foil = context.createLinearGradient(0, 0, w, h)
  foil.addColorStop(0, '#b7a27d')
  foil.addColorStop(0.45, '#8d785a')
  foil.addColorStop(1, '#62705f')
  context.fillStyle = foil
  context.fillRect(0, 0, w, h)

  context.save()
  context.globalAlpha = 0.14
  context.strokeStyle = '#fff4dc'
  context.lineWidth = Math.max(1, scale)
  for (let x = -h; x < w; x += 32 * scale) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x + h, h)
    context.stroke()
  }
  context.globalAlpha = 0.34
  context.fillStyle = '#f7e8cb'
  for (let i = 0; i < 26; i += 1) {
    const x = (((i * 97 + number * 37) % 100) / 100) * w
    const y = (((i * 53 + number * 19) % 100) / 100) * h
    context.beginPath()
    context.arc(x, y, (i % 3 + 1) * scale, 0, Math.PI * 2)
    context.fill()
  }
  context.restore()

  const labelSize = Math.max(11, Math.min(14, height / 6))
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = 'rgba(255, 249, 235, 0.92)'
  context.font = `600 ${labelSize * scale}px Georgia, serif`
  context.fillText('SCRATCH TO REVEAL', w / 2, h / 2 - 9 * scale)
  context.fillStyle = 'rgba(255, 249, 235, 0.65)'
  context.font = `500 ${Math.max(9, labelSize - 3) * scale}px system-ui, sans-serif`
  context.fillText(`WISH ${String(number).padStart(2, '0')}`, w / 2, h / 2 + 13 * scale)
}

function scratchedRatio(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context || !canvas.width || !canvas.height) return 0
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
  const step = Math.max(2, Math.round(Math.min(canvas.width, canvas.height) / 60))
  let cleared = 0
  let sampled = 0
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      sampled += 1
      if (data[(y * canvas.width + x) * 4 + 3] < 140) cleared += 1
    }
  }
  return sampled ? cleared / sampled : 0
}

export function WishScratchCard({ number, wish, unlocked, onUnlock }: WishScratchCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const unlocking = useRef(false)

  useEffect(() => {
    if (unlocked) return
    const card = cardRef.current
    const canvas = canvasRef.current
    if (!card || !canvas) return

    const redraw = () => drawCover(canvas, card, number)
    redraw()
    const observer = new ResizeObserver(redraw)
    observer.observe(card)
    return () => observer.disconnect()
  }, [number, unlocked])

  function pointFrom(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function scratch(from: { x: number; y: number }, to: { x: number; y: number }) {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const scale = canvas.width / canvas.getBoundingClientRect().width || 1
    context.save()
    context.globalCompositeOperation = 'destination-out'
    context.lineWidth = 28 * scale
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.stroke()
    context.restore()
  }

  function finishScratch() {
    drawing.current = false
    lastPoint.current = null
    const canvas = canvasRef.current
    if (!canvas || unlocking.current) return
    if (scratchedRatio(canvas) >= 0.3) {
      unlocking.current = true
      onUnlock(number)
    }
  }

  function startScratch(event: ReactPointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    const point = pointFrom(event)
    if (!point) return
    lastPoint.current = point
    scratch(point, { x: point.x + 0.01, y: point.y + 0.01 })
  }

  function moveScratch(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const point = pointFrom(event)
    if (!point) return
    if (lastPoint.current) scratch(lastPoint.current, point)
    lastPoint.current = point
  }

  function revealFromKeyboard(event: ReactKeyboardEvent<HTMLCanvasElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    if (unlocking.current) return
    unlocking.current = true
    onUnlock(number)
  }

  return <div ref={cardRef} className={`wish-scratch${unlocked ? ' is-unlocked' : ''}`}>
    <p className="wish-scratch__text" aria-hidden={!unlocked}>{wish}</p>
    {!unlocked && <canvas
      ref={canvasRef}
      className="wish-scratch__canvas"
      role="button"
      tabIndex={0}
      aria-label={`Wish ${number}: scratch to reveal`}
      onPointerDown={startScratch}
      onPointerMove={moveScratch}
      onPointerUp={finishScratch}
      onPointerCancel={finishScratch}
      onKeyDown={revealFromKeyboard}
    />}
  </div>
}

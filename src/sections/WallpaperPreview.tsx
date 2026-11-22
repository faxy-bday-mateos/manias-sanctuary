import { useEffect, useRef, useState } from 'react'
import { birthdayContent } from '../birthdayContent'
import {
  createWallpaperPng,
  drawBirthdayWallpaper,
  type WallpaperScene,
} from '../wallpaperCanvas'

const wallpaper = birthdayContent.wallpaper

export function WallpaperPreview() {
  const [activeScene, setActiveScene] = useState<WallpaperScene>('night')
  const [status, setStatus] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      drawBirthdayWallpaper(canvas, activeScene, {
        artLine: wallpaper.artLine,
        greeting: birthdayContent.greeting,
      })
      setStatus('')
    } catch (error) {
      console.error('Unable to render birthday wallpaper.', error)
      setStatus(wallpaper.downloadError)
    }
  }, [activeScene])

  async function downloadWallpaper() {
    const canvas = canvasRef.current
    if (!canvas) {
      setStatus(wallpaper.downloadError)
      return
    }

    setIsDownloading(true)
    setStatus(wallpaper.downloadingLabel)

    try {
      const blob = await createWallpaperPng(canvas)
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = wallpaper.fileName
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      setStatus(wallpaper.downloadReady)
    } catch (error) {
      console.error('Unable to download birthday wallpaper.', error)
      setStatus(wallpaper.downloadError)
    } finally {
      setIsDownloading(false)
    }
  }

  const scenes: { kind: WallpaperScene; label: string }[] = [
    { kind: 'night', label: wallpaper.sceneOptions.night },
    { kind: 'ocean', label: wallpaper.sceneOptions.ocean },
    { kind: 'room', label: wallpaper.sceneOptions.room },
  ]

  return (
    <section
      className="section wallpaper"
      id="wallpaper"
      aria-labelledby="wallpaper-title"
    >
      <div className="wallpaper__inner">
        <div className="wallpaper__copy">
          <p className="eyebrow">{wallpaper.kicker}</p>
          <h2 id="wallpaper-title">{wallpaper.title}</h2>
          <p>{wallpaper.description}</p>
          <p className="wallpaper__size">{wallpaper.pixelSize}</p>
          <div
            className="wallpaper__selector"
            role="group"
            aria-label={wallpaper.selectorLabel}
          >
            {scenes.map((scene) => (
              <button
                className="wallpaper__scene-button"
                type="button"
                key={scene.kind}
                aria-pressed={activeScene === scene.kind}
                onClick={() => setActiveScene(scene.kind)}
              >
                {scene.label}
              </button>
            ))}
          </div>
          <button
            className="wallpaper__download"
            type="button"
            onClick={downloadWallpaper}
            disabled={isDownloading}
          >
            {isDownloading
              ? wallpaper.downloadingLabel
              : wallpaper.downloadLabel}
          </button>
          <p className="wallpaper__status" role="status" aria-live="polite">
            {status}
          </p>
        </div>
        <div className={`wallpaper__frame wallpaper__frame--${activeScene}`}>
          <canvas
            ref={canvasRef}
            className="wallpaper__art"
            width={1080}
            height={1920}
            role="img"
            aria-label={`${wallpaper.alt} ${wallpaper.sceneOptions[activeScene]}. ${birthdayContent.greeting}.`}
          />
        </div>
      </div>
    </section>
  )
}

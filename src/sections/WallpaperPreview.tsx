import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { birthdayContent } from '../birthdayContent'
import {
  createWallpaperPng,
  drawBirthdayWallpaper,
  type WallpaperScene,
} from '../wallpaperCanvas'
import {
  canSaveWallpaperImages,
  loadWallpaperImages,
  saveWallpaperImage,
} from '../wallpaperGallery'
import type { SavedWallpaperUpload } from '../firebaseClient'

const wallpaper = birthdayContent.wallpaper

export function WallpaperPreview() {
  const [activeScene, setActiveScene] = useState<WallpaperScene>('night')
  const [status, setStatus] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [history, setHistory] = useState<SavedWallpaperUpload[]>([])
  const [historyStatus, setHistoryStatus] = useState('')
  const [historyLoading, setHistoryLoading] = useState(canSaveWallpaperImages)
  const [isSavingPhoto, setIsSavingPhoto] = useState(false)
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

  useEffect(() => {
    if (!canSaveWallpaperImages()) return
    let active = true
    loadWallpaperImages()
      .then((images) => {
        if (active) setHistory(images)
      })
      .catch((error: unknown) => {
        console.error('Unable to load saved wallpaper photos.', error)
        if (active) setHistoryStatus('Saved photos could not be loaded.')
      })
      .finally(() => {
        if (active) setHistoryLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    setIsSavingPhoto(true)
    setHistoryStatus('Saving your photo…')
    try {
      const saved = await saveWallpaperImage(file)
      setHistory((current) => [saved, ...current].slice(0, 12))
      setHistoryStatus('Photo saved to your history.')
    } catch (error) {
      console.error('Unable to save the wallpaper photo.', error)
      setHistoryStatus(error instanceof Error ? error.message : 'The photo could not be saved.')
    } finally {
      setIsSavingPhoto(false)
    }
  }

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
  const imageSavingEnabled = canSaveWallpaperImages()

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
          {imageSavingEnabled ? (
            <div className="wallpaper__upload">
              <label className="wallpaper__upload-button">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadPhoto}
                  disabled={isSavingPhoto}
                />
                <span aria-hidden="true">＋</span>
                {isSavingPhoto ? 'Saving photo…' : 'Upload a photo'}
              </label>
              <p>Your photo is saved to your history for this browser.</p>
            </div>
          ) : (
            <p className="wallpaper__history-note">Photo saving is not configured for this site.</p>
          )}
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
      {imageSavingEnabled && (
        <section className="wallpaper__history" aria-labelledby="wallpaper-history-title">
          <div className="wallpaper__history-heading">
            <h3 id="wallpaper-history-title">Your uploaded photos</h3>
            <p>
              {historyLoading
                ? 'Loading your photo history…'
                : history.length
                  ? `${history.length} saved photo${history.length === 1 ? '' : 's'}`
                  : 'Uploaded photos will appear here.'}
            </p>
          </div>
          {history.length > 0 && (
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  <img src={item.dataUrl} alt={item.name} loading="lazy" />
                  <span>{item.name}</span>
                  <time dateTime={new Date(item.createdAt).toISOString()}>
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
          {historyStatus && <p className="wallpaper__history-status" role="status" aria-live="polite">{historyStatus}</p>}
        </section>
      )}
    </section>
  )
}

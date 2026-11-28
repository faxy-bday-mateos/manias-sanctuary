import { useEffect, useRef, useState } from 'react'
import {
  createKeepsakePng,
  drawConstellationWallpaper,
  drawMoodMap,
  drawPhotoKeepsake,
  type ConstellationPoint,
  type PhotoStyle,
} from '../homeKeepsakeCanvas'

type KeepsakeMode = 'photo' | 'constellation' | 'mood'

const wishes = [
  'May there be more unhurried afternoons than you expect.',
  'May your curiosity keep opening unexpected doors.',
  'May the next chapter bring more ease than the last one.',
  'May good surprises find you on the most ordinary days.',
  'May you always find a little room for wonder.',
  'May you feel celebrated in all the small ways that matter.',
]

const photoStyles: { id: PhotoStyle; label: string; mark: string }[] = [
  { id: 'film', label: 'Golden hour', mark: '✦' },
  { id: 'moonlight', label: 'Moonlit', mark: '☾' },
  { id: 'garden', label: 'Garden', mark: '❀' },
]

const moods = ['quiet', 'curious', 'bright', 'brave', 'gentle', 'becoming']
const samplePoints: ConstellationPoint[] = [
  { x: 118, y: 205 },
  { x: 161, y: 162 },
  { x: 214, y: 181 },
  { x: 245, y: 236 },
  { x: 194, y: 275 },
  { x: 143, y: 253 },
]

const constellationTemplates: { id: string; label: string; points: ConstellationPoint[]; closed: boolean }[] = [
  { id: 'starpath', label: 'Star path', points: samplePoints, closed: false },
  { id: 'heart', label: 'Heart', points: [{ x: 90, y: 190 }, { x: 110, y: 150 }, { x: 150, y: 155 }, { x: 180, y: 190 }, { x: 215, y: 155 }, { x: 253, y: 165 }, { x: 270, y: 200 }, { x: 235, y: 240 }, { x: 180, y: 290 }, { x: 125, y: 245 }], closed: true },
  { id: 'orbit', label: 'Orbit', points: [{ x: 180, y: 145 }, { x: 226, y: 174 }, { x: 246, y: 220 }, { x: 220, y: 270 }, { x: 180, y: 292 }, { x: 134, y: 264 }, { x: 113, y: 218 }, { x: 138, y: 170 }], closed: true },
]

function chooseWish(current: string) {
  const available = wishes.filter((wish) => wish !== current)
  return available[Math.floor(Math.random() * available.length)]
}

export function HomeKeepsake() {
  const [mode, setMode] = useState<KeepsakeMode>('photo')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoReady, setPhotoReady] = useState(false)
  const [photoWish, setPhotoWish] = useState(wishes[0])
  const [caption, setCaption] = useState('')
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('film')
  const [photoStatus, setPhotoStatus] = useState('')
  const [constellationWish, setConstellationWish] = useState(wishes[1])
  const [constellationName, setConstellationName] = useState("Manuu's Little Sky")
  const [points, setPoints] = useState(samplePoints)
  const [isClosed, setIsClosed] = useState(false)
  const [constellationTemplate, setConstellationTemplate] = useState('starpath')
  const [constellationStatus, setConstellationStatus] = useState('')
  const [selectedMoods, setSelectedMoods] = useState(['quiet', 'curious', 'gentle'])
  const [customMood, setCustomMood] = useState('')
  const [moodStatus, setMoodStatus] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoCanvasRef = useRef<HTMLCanvasElement>(null)
  const constellationCanvasRef = useRef<HTMLCanvasElement>(null)
  const moodCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
  }, [photoUrl])

  useEffect(() => {
    if (!photoUrl || mode !== 'photo') return
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth * image.naturalHeight > 40_000_000) {
        setPhotoReady(false)
        setPhotoStatus('That image is too large to prepare here. Please choose a smaller photo.')
        return
      }
      try {
        const canvas = photoCanvasRef.current
        if (!canvas) throw new Error('The photo preview is unavailable.')
        drawPhotoKeepsake(canvas, image, photoWish, caption, photoStyle)
        setPhotoReady(true)
        setPhotoStatus('')
      } catch (error) {
        console.error('Unable to render the photo keepsake.', error)
        setPhotoReady(false)
        setPhotoStatus('The photo preview could not be created. Please try another image.')
      }
    }
    image.onerror = () => {
      setPhotoReady(false)
      setPhotoStatus('This image could not be opened. Please choose a JPEG, PNG, or WebP photo.')
    }
    image.src = photoUrl
    return () => {
      image.onload = null
      image.onerror = null
    }
  }, [photoUrl, mode, photoWish, caption, photoStyle])

  useEffect(() => {
    if (mode !== 'constellation') return
    const canvas = constellationCanvasRef.current
    if (!canvas) return
    try {
      drawConstellationWallpaper(canvas, constellationWish, points, isClosed, constellationName, points.length - 1)
      setConstellationStatus(`${points.length} stars in your constellation.`)
    } catch (error) {
      console.error('Unable to render the constellation keepsake.', error)
      setConstellationStatus('The constellation preview could not be created.')
    }
  }, [mode, constellationWish, points, isClosed, constellationName])

  useEffect(() => {
    if (mode !== 'mood') return
    const canvas = moodCanvasRef.current
    if (!canvas) return
    try {
      drawMoodMap(canvas, selectedMoods)
      setMoodStatus(
        selectedMoods.length
          ? `${selectedMoods.length} of 3 words chosen: ${selectedMoods.join(', ')}.`
          : 'Choose a word to begin your mood map.',
      )
    } catch (error) {
      console.error('Unable to render the mood map.', error)
      setMoodStatus('The mood map preview could not be created.')
    }
  }, [mode, selectedMoods])

  function choosePhoto(file: File | undefined) {
    if (!file) return
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!acceptedTypes.includes(file.type)) {
      setPhotoStatus('Choose a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoStatus('Please choose an image smaller than 15 MB.')
      return
    }
    setPhotoUrl(URL.createObjectURL(file))
    setPhotoReady(false)
    setPhotoWish(chooseWish(photoWish))
    setPhotoStatus('Preparing your keepsake…')
  }

  function clearPhoto() {
    setPhotoUrl(null)
    setPhotoReady(false)
    setPhotoStatus('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function download(canvas: HTMLCanvasElement | null, fileName: string, report: (message: string) => void) {
    if (!canvas) {
      report('The preview is not ready to download.')
      return
    }
    report('Preparing your PNG…')
    try {
      const blob = await createKeepsakePng(canvas)
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = fileName
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      report('Your PNG download has started.')
    } catch (error) {
      console.error('Unable to download the keepsake.', error)
      report('The PNG could not be created. Please try again.')
    }
  }

  function addStar(clientX: number, clientY: number, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 360
    const y = ((clientY - rect.top) / rect.height) * 640
    if (y >= 425) return
    setPoints((current) => [...current, { x, y }])
    setIsClosed(false)
    setConstellationTemplate('free')
  }

  function addKeyboardStar() {
    const index = points.length
    setPoints((current) => [
      ...current,
      {
        x: 66 + ((index * 53) % 228),
        y: 130 + ((index * 67) % 255),
      },
    ])
    setIsClosed(false)
    setConstellationTemplate('free')
  }

  function toggleMood(mood: string) {
    if (selectedMoods.some((item) => item.toLocaleLowerCase() === mood.toLocaleLowerCase())) {
      setSelectedMoods((current) => current.filter((item) => item !== mood))
      setMoodStatus('')
      return
    }
    if (selectedMoods.length >= 3) {
      setMoodStatus('Choose up to three words. Remove one before adding another.')
      return
    }
    setSelectedMoods((current) => [...current, mood])
    setMoodStatus('')
  }

  function addCustomMood() {
    const word = customMood.trim().replace(/\s+/g, ' ')
    if (!word) return
    if (selectedMoods.some((mood) => mood.toLocaleLowerCase() === word.toLocaleLowerCase())) {
      setMoodStatus('That word is already on the map.')
      return
    }
    if (selectedMoods.length >= 3) {
      setMoodStatus('Remove a word before adding another.')
      return
    }
    setSelectedMoods((current) => [...current, word])
    setCustomMood('')
    setMoodStatus('')
  }

  return (
    <section className="home-keepsake section" id="home-keepsake" aria-labelledby="home-keepsake-title" data-activity-ignore>
      <div className="home-keepsake__inner">
        <header className="home-keepsake__heading">
          <p className="eyebrow">A little something to keep</p>
          <h2 id="home-keepsake-title">Make a keepsake that feels like her.</h2>
          <p>Bring a favorite photo, find a wish, and add a little of your own magic.</p>
        </header>

        <nav className="home-keepsake__modes" aria-label="Choose a keepsake">
          <button type="button" aria-pressed={mode === 'photo'} onClick={() => setMode('photo')}>
            <span>✿</span><strong>Her photo</strong><small>A wish made personal</small>
          </button>
          <button type="button" aria-pressed={mode === 'constellation'} onClick={() => setMode('constellation')}>
            <span>01</span><strong>Her constellation</strong><small>Draw a wish in stars</small>
          </button>
          <button type="button" aria-pressed={mode === 'mood'} onClick={() => setMode('mood')}>
            <span>03</span><strong>Her mood map</strong><small>Three words become a sky</small>
          </button>
        </nav>

        <div className="home-keepsake__workspace">
          <div className="home-keepsake__controls">
            {mode === 'photo' && <>
              <p className="eyebrow">Your photo, her little wish</p>
              <h3>Start with a favorite moment.</h3>
              <p className="home-keepsake__description">Choose a photo. A birthday wish will be placed beneath it, and the finishing touches are yours.</p>
              <label className="home-keepsake__upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    choosePhoto(event.currentTarget.files?.[0])
                    event.currentTarget.value = ''
                  }}
                />
                <span aria-hidden="true">＋</span>
                {photoUrl ? 'Choose a different photo' : 'Choose a photo'}
              </label>
              <p className="home-keepsake__privacy">Your image stays in this browser. It is not uploaded.</p>
              {photoUrl && <>
                <div className="home-keepsake__option">
                  <span className="home-keepsake__label">Give it a little atmosphere</span>
                  <div className="home-keepsake__style-picker" role="group" aria-label="Choose a photo treatment">
                    {photoStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        aria-pressed={photoStyle === style.id}
                        onClick={() => setPhotoStyle(style.id)}
                      >
                        <span aria-hidden="true">{style.mark}</span>{style.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="home-keepsake__caption-label" htmlFor="keepsake-caption">Add a tiny caption (optional)</label>
                <input
                  id="keepsake-caption"
                  className="home-keepsake__caption"
                  type="text"
                  maxLength={34}
                  value={caption}
                  placeholder="A little moment to remember"
                  onChange={(event) => setCaption(event.currentTarget.value)}
                />
                <div className="home-keepsake__actions">
                  <button type="button" className="home-keepsake__button" onClick={() => setPhotoWish(chooseWish(photoWish))}>Another little wish</button>
                  <button
                    type="button"
                    className="home-keepsake__button home-keepsake__button--primary"
                    disabled={!photoReady}
                    onClick={() => void download(photoCanvasRef.current, 'manuu-photo-wish.png', setPhotoStatus)}
                  >
                    Save this photo
                  </button>
                  <button type="button" className="home-keepsake__text-button" onClick={clearPhoto}>Remove photo</button>
                </div>
              </>}
              <p className="home-keepsake__status" role="status" aria-live="polite">{photoStatus}</p>
            </>}

            {mode === 'constellation' && <>
              <p className="eyebrow">01 · A tiny sky, drawn by you</p>
              <h3>Give a wish its own constellation.</h3>
              <p className="home-keepsake__description">Start with a shape, then add stars or make it your own. Your newest star glows as it joins the sky.</p>
              <div className="home-keepsake__option">
                <span className="home-keepsake__label">Choose a starting shape</span>
                <div className="home-keepsake__constellation-picker" role="group" aria-label="Choose a constellation starting shape">
                  {constellationTemplates.map((template) => (
                    <button key={template.id} type="button" aria-pressed={constellationTemplate === template.id} onClick={() => {
                      setConstellationTemplate(template.id)
                      setPoints(template.points.map((point) => ({ ...point })))
                      setIsClosed(template.closed)
                    }}>{template.label}</button>
                  ))}
                  <button type="button" aria-pressed={constellationTemplate === 'free'} onClick={() => { setConstellationTemplate('free'); setPoints([]); setIsClosed(false) }}>Free draw</button>
                </div>
              </div>
              <label className="home-keepsake__caption-label" htmlFor="constellation-name">Name this constellation</label>
              <input id="constellation-name" className="home-keepsake__caption" type="text" maxLength={28} value={constellationName} placeholder="A little sky for Manuu" onChange={(event) => setConstellationName(event.currentTarget.value)} />
              <div className="home-keepsake__actions">
                <button type="button" className="home-keepsake__button" disabled={!points.length} onClick={() => { setPoints((current) => current.slice(0, -1)); setIsClosed(false); setConstellationTemplate('free') }}>Undo star</button>
                <button type="button" className="home-keepsake__button" disabled={points.length < 3} aria-pressed={isClosed} onClick={() => setIsClosed((current) => !current)}>{isClosed ? 'Open the shape' : 'Close the shape'}</button>
                <button type="button" className="home-keepsake__button" onClick={() => {
                  const selected = constellationTemplates.find((template) => template.id === constellationTemplate)
                  setPoints(selected ? selected.points.map((point) => ({ ...point })) : [])
                  setIsClosed(selected?.closed ?? false)
                }}>Start over</button>
              </div>
              <div className="home-keepsake__option">
                <span className="home-keepsake__label">The wish for this sky</span>
                <button type="button" className="home-keepsake__wish" onClick={() => setConstellationWish(chooseWish(constellationWish))}>
                  “{constellationWish}” <span>Another wish ↻</span>
                </button>
              </div>
              <button type="button" className="home-keepsake__button home-keepsake__button--primary" onClick={() => void download(constellationCanvasRef.current, 'manuu-constellation.png', setConstellationStatus)}>Save this sky</button>
              <p id="home-constellation-instructions" className="home-keepsake__status">Tap the sky to add a star. With a keyboard, focus it and press Enter or Space.</p>
              <p className="home-keepsake__status" role="status" aria-live="polite">{constellationStatus}</p>
            </>}

            {mode === 'mood' && <>
              <p className="eyebrow">03 · A small portrait of a feeling</p>
              <h3>Three words become her sky.</h3>
              <p className="home-keepsake__description">Choose up to three words, or add one that feels more like her. Each word becomes a colored point in her sky.</p>
              <div className="home-keepsake__mood-picker" role="group" aria-label="Choose up to three words">
                {[...moods, ...selectedMoods.filter((mood) => !moods.includes(mood))].map((mood) => (
                  <button key={mood} type="button" aria-pressed={selectedMoods.includes(mood)} onClick={() => toggleMood(mood)}>
                    {mood}
                  </button>
                ))}
              </div>
              <label className="home-keepsake__label" htmlFor="custom-mood-word">Add her own word</label>
              <div className="home-keepsake__custom-mood">
                <input id="custom-mood-word" className="home-keepsake__caption" type="text" maxLength={18} value={customMood} placeholder="e.g. resilient" onChange={(event) => setCustomMood(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCustomMood() } }} />
                <button type="button" className="home-keepsake__button" disabled={!customMood.trim()} onClick={addCustomMood}>Add word</button>
              </div>
              <button type="button" className="home-keepsake__button home-keepsake__button--primary" disabled={!selectedMoods.length} onClick={() => void download(moodCanvasRef.current, 'manuu-mood-map.png', setMoodStatus)}>Save this mood map</button>
              <p className="home-keepsake__status" role="status" aria-live="polite">{moodStatus}</p>
            </>}
          </div>

          <div className="home-keepsake__preview">
            {mode === 'photo' && (photoUrl
              ? <div className="home-keepsake__photo-wrap" aria-busy={!photoReady}>
                <canvas
                  ref={photoCanvasRef}
                  className="home-keepsake__canvas home-keepsake__canvas--photo"
                  width={1080}
                  height={1500}
                  hidden={!photoReady}
                  role="img"
                  aria-label={`Photo keepsake with the wish: ${photoWish}`}
                />
                {!photoReady && <span className="home-keepsake__loading">{photoStatus || 'Preparing your photo…'}</span>}
              </div>
              : <div className="home-keepsake__empty-photo">
                <span aria-hidden="true">✿</span>
                <strong>Your favorite moment goes here.</strong>
                <small>Add a photo to meet its birthday wish.</small>
              </div>)}
            {mode === 'constellation' && <>
              <canvas
                ref={constellationCanvasRef}
                className="home-keepsake__canvas home-keepsake__canvas--portrait"
                width={1080}
                height={1920}
                role="button"
                tabIndex={0}
                aria-label={`${constellationName || 'Untitled constellation'}, with ${points.length} stars. Press Enter or Space to add a star.`}
                aria-describedby="home-constellation-instructions"
                onPointerDown={(event) => addStar(event.clientX, event.clientY, event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    addKeyboardStar()
                  }
                }}
              />
              <p className="home-keepsake__preview-caption">Tap or press Enter to add a star · {points.length} placed · newest star glows</p>
            </>}
            {mode === 'mood' && <>
              <canvas
                ref={moodCanvasRef}
                className="home-keepsake__canvas home-keepsake__canvas--portrait"
                width={1080}
                height={1920}
                role="img"
                aria-label={`Mood map for ${selectedMoods.join(', ') || 'no selected words'}`}
              />
              <p className="home-keepsake__preview-caption">A little mood map · 1080 × 1920</p>
            </>}
          </div>
        </div>
        <p className="home-keepsake__footnote">Made in this browser, just for her. Your photo never leaves your device.</p>
      </div>
    </section>
  )
}

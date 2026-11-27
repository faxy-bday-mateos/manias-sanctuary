import { useEffect, useRef, useState } from 'react'
import { openWhenLetters } from '../openWhenLetters'

export function OpenWhenLetters() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showNote, setShowNote] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const activeLetter = activeIndex === null ? null : openWhenLetters[activeIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (activeIndex !== null && !dialog.open) dialog.showModal()
    if (activeIndex === null && dialog.open) dialog.close()
  }, [activeIndex])

  function closeLetter() {
    setActiveIndex(null)
    setShowNote(false)
  }

  return (
    <section className="open-when" aria-labelledby="open-when-title">
      <header className="open-when__heading">
        <p className="eyebrow">A few words to keep nearby</p>
        <h1 id="open-when-title">Open when you need a reminder.</h1>
        <p>Choose the moment that feels familiar. There is no rush to read them all.</p>
      </header>

      <div className="open-when__letters">
        {openWhenLetters.map((letter, index) => (
          <article className="open-when__letter" key={letter.question}>
            <div className="open-when__card">
              <span className="open-when__label">Open when you are…</span>
              <strong>{letter.when}</strong>
              <button
                type="button"
                className="open-when__action"
                aria-label={`Read and cheer: ${letter.question}`}
                onClick={() => {
                  setShowNote(false)
                  setActiveIndex(index)
                }}
              >
                Read &amp; cheer <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="open-when__signoff">You are allowed to take up space in your own story.</p>

      <dialog
        className="open-when__dialog"
        ref={dialogRef}
        aria-labelledby="open-when-dialog-title"
        onClose={closeLetter}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLetter()
        }}
      >
        {activeLetter && (
          <>
            <p className="open-when__dialog-kicker">{showNote ? 'A reminder for you' : 'A little check-in'}</p>
            <h2 id="open-when-dialog-title">{activeLetter.question}</h2>
            {showNote ? (
              <div className="open-when__note">
                <p>{activeLetter.note}</p>
                <span>With care, always.</span>
              </div>
            ) : (
              <>
                <p className="open-when__prompt">
                  Why didn’t you tell me? Anyway, here’s the reminder. Maybe I’m not here at this exact moment, but read this and let me cheer you on from here.
                </p>
                <div className="open-when__dialog-actions">
                  <button type="button" className="open-when__read" onClick={() => setShowNote(true)}>
                    Read &amp; cheer
                  </button>
                  <button type="button" className="open-when__later" onClick={closeLetter}>
                    Maybe later
                  </button>
                </div>
              </>
            )}
            {showNote && (
              <div className="open-when__dialog-actions">
                <button type="button" className="open-when__later" onClick={closeLetter}>
                  Keep this for later
                </button>
              </div>
            )}
          </>
        )}
      </dialog>
    </section>
  )
}

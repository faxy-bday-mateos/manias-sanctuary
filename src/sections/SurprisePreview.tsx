import { useRef, useState } from 'react'
import { birthdayContent } from '../birthdayContent'

export function SurprisePreview() {
  const [openMessageIndex, setOpenMessageIndex] = useState<number | null>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  return (
    <section
      className="section surprise"
      id="surprise"
      aria-labelledby="surprise-title"
    >
      <div className="surprise__inner">
        <div
          className="surprise__art"
          role="group"
          aria-label={birthdayContent.surprise.groupLabel}
        >
          {birthdayContent.surprise.messages.map((surprise, index) => (
            <button
              className={`surprise__trigger surprise__trigger--${surprise.kind}`}
              type="button"
              key={surprise.message}
              ref={(element) => {
                triggerRefs.current[index] = element
              }}
              aria-label={`${surprise.accessibleName} ${index + 1}`}
              aria-controls={
                openMessageIndex !== null ? 'surprise-message' : undefined
              }
              onClick={() => setOpenMessageIndex(index)}
            >
              {surprise.kind === 'butterfly' ? (
                <svg viewBox="0 0 40 36" aria-hidden="true" focusable="false">
                  <path d="M19 18C12 3 2 4 4 14c1 5 7 6 15 5Z" />
                  <path d="M21 18C28 3 38 4 36 14c-1 5-7 6-15 5Z" />
                  <path d="M19 19C10 17 7 23 11 28c3 4 7 1 9-7Z" />
                  <path d="M21 19c9-2 12 4 8 9-3 4-7 1-9-7Z" />
                  <path d="M20 15v13" />
                </svg>
              ) : (
                <svg viewBox="0 0 40 36" aria-hidden="true" focusable="false">
                  <path d="M16 17c-7-8-12-2-7 3l7 2M24 17c7-8 12-2 7 3l-7 2" />
                  <path d="M18 18h4l3 8h-10Z" />
                  <circle cx="20" cy="29" r="3" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="surprise__copy">
          <p className="eyebrow">{birthdayContent.surprise.kicker}</p>
          <h2 id="surprise-title">{birthdayContent.surprise.title}</h2>
          <p className="surprise__hint">{birthdayContent.surprise.hint}</p>
          {openMessageIndex !== null && (
            <div className="surprise__message" id="surprise-message" role="status">
              <p>{birthdayContent.surprise.messages[openMessageIndex].message}</p>
              <button
                type="button"
                className="surprise__close"
                onClick={() => {
                  setOpenMessageIndex(null)
                  triggerRefs.current[openMessageIndex]?.focus()
                }}
              >
                {birthdayContent.surprise.closeLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

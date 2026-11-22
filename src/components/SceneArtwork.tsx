type SceneArtworkProps = {
  kind: 'night' | 'ocean' | 'room'
}

export function SceneArtwork({ kind }: SceneArtworkProps) {
  return (
    <div className={`scene-art scene-art--${kind}`} aria-hidden="true">
      {kind === 'night' && (
        <>
          <span className="scene-art__moon" />
          <span className="scene-art__stars" />
          <span className="scene-art__ridge" />
        </>
      )}
      {kind === 'ocean' && (
        <svg viewBox="0 0 360 180" preserveAspectRatio="none">
          <path d="M0 94c54-21 91 19 145 0s93-15 145 0 49 12 70 3v83H0Z" />
          <path d="M0 122c48-16 91 14 143 0s91-12 145 0 52 10 72 3v55H0Z" />
          <circle cx="275" cy="48" r="17" />
        </svg>
      )}
      {kind === 'room' && (
        <>
          <span className="scene-art__window">
            <span />
          </span>
          <span className="scene-art__lamp" />
          <span className="scene-art__table" />
        </>
      )}
    </div>
  )
}

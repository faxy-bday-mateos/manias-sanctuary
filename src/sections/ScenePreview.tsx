import { useState } from 'react'
import { SceneArtwork } from '../components/SceneArtwork'
import { birthdayContent } from '../birthdayContent'

export function ScenePreview() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const activeScene = birthdayContent.scenes.items[activeSceneIndex]

  return (
    <section className="section scenes" id="scenes" aria-labelledby="scenes-title">
      <div className="section__inner">
        <div className="section__heading">
          <p className="eyebrow">{birthdayContent.scenes.kicker}</p>
          <h2 id="scenes-title">{birthdayContent.scenes.title}</h2>
          <p className="section__intro">{birthdayContent.scenes.intro}</p>
        </div>

        <article className={`scene-preview scene-preview--${activeScene.kind}`}>
          <SceneArtwork kind={activeScene.kind} />
          <div className="scene-preview__copy" aria-live="polite">
            <p className="scene-preview__label">{activeScene.label}</p>
            <h3>{activeScene.title}</h3>
            <p>{activeScene.description}</p>
          </div>
        </article>
        <div
          className="scene-selector"
          role="group"
          aria-label={birthdayContent.scenes.selectorLabel}
        >
          {birthdayContent.scenes.items.map((scene, index) => (
            <button
              className="scene-selector__button"
              type="button"
              key={scene.kind}
              aria-pressed={activeSceneIndex === index}
              onClick={() => setActiveSceneIndex(index)}
            >
              {scene.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

import { birthdayContent } from '../birthdayContent'

export function ClosingWish() {
  return (
    <section className="closing" id="closing" aria-labelledby="closing-title">
      <span className="closing__ornament" aria-hidden="true">✦</span>
      <p className="eyebrow">{birthdayContent.closing.signoff}</p>
      <h2 id="closing-title">{birthdayContent.closing.title}</h2>
      <p className="closing__message">{birthdayContent.closing.message}</p>
    </section>
  )
}

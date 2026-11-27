import { birthdayContent } from '../birthdayContent'

export function BirthdayMessage() {
  const message = birthdayContent.birthdayMessage

  return (
    <section className="birthday-message" aria-labelledby="birthday-message-title">
      <div className="birthday-message__card">
        <span className="birthday-message__seal" aria-hidden="true">✦</span>
        <p className="birthday-message__kicker">{message.kicker}</p>
        <h2 id="birthday-message-title">{message.title}</h2>
        <span className="birthday-message__rule" aria-hidden="true"><i>♡</i></span>
        <p className="birthday-message__copy">{message.paragraph}</p>
        <p className="birthday-message__signoff">{message.signoff}</p>
        <span className="birthday-message__stars" aria-hidden="true">✧　✦　✧</span>
      </div>
    </section>
  )
}

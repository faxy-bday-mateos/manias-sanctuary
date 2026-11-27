import { useEffect, useState } from 'react'
import { birthdayContent } from '../birthdayContent'

type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getBirthdayDate(now: Date) {
  const { month, day } = birthdayContent.countdown
  let year = now.getFullYear()

  if (
    (now.getMonth() === month - 1 && now.getDate() > day) ||
    now.getMonth() > month - 1
  ) {
    year += 1
  }

  return new Date(year, month - 1, day)
}

function getCountdownParts(milliseconds: number): CountdownParts {
  const secondsLeft = Math.max(0, Math.ceil(milliseconds / 1000))
  const days = Math.floor(secondsLeft / 86_400)
  const hours = Math.floor((secondsLeft % 86_400) / 3_600)
  const minutes = Math.floor((secondsLeft % 3_600) / 60)
  const seconds = secondsLeft % 60

  return { days, hours, minutes, seconds }
}

export function isBirthdayToday(now = new Date()) {
  const { month, day } = birthdayContent.countdown
  return now.getMonth() === month - 1 && now.getDate() === day
}

export function BirthdayCountdown({ onComplete }: { onComplete: () => void }) {
  const [targetDate] = useState(() => getBirthdayDate(new Date()))
  const [remaining, setRemaining] = useState(() =>
    getCountdownParts(targetDate.getTime() - Date.now()),
  )

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const updateCountdown = () => {
      const difference = targetDate.getTime() - Date.now()
      if (difference <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        onComplete()
        return
      }

      setRemaining(getCountdownParts(difference))
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [targetDate, onComplete])

  const countdownItems = [
    { key: 'days', value: remaining.days },
    { key: 'hours', value: remaining.hours },
    { key: 'minutes', value: remaining.minutes },
    { key: 'seconds', value: remaining.seconds },
  ] as const
  const dateLabel = targetDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="birthday-countdown" aria-labelledby="countdown-title">
      <div className="countdown-sky" aria-hidden="true">
        <span className="countdown-moon" />
        <span className="countdown-star countdown-star--one">✦</span>
        <span className="countdown-star countdown-star--two">✧</span>
        <span className="countdown-star countdown-star--three">✦</span>
        <span className="countdown-star countdown-star--four">✧</span>
        <svg className="countdown-landscape" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice">
          <path fill="none" stroke="#75f0c2" strokeWidth="28" strokeLinecap="round" opacity=".46" d="M-20 100q190-100 374-35t387-9q206-57 410 1t319-25" />
          <path fill="#354758" d="M0 180 145 94l130 86 158-112 139 99 128-73 154 86 157-115 131 103 154-79 144 98v174H0Z" />
          <path fill="#edf5f5" d="m145 94-40 24 20-4 20-12 19 13 19 4zm288-26-40 25 20-5 20-12 19 13 21 4zm267 26-39 23 20-4 19-12 20 13 22 4zm311-29-40 24 20-4 20-12 19 13 21 4zm285 24-40 24 20-4 20-12 19 13 21 4z" />
          <path fill="#405c65" d="M0 227q200-84 384-10t372 3q220-78 410 0t274-8v160H0Z" />
          <path fill="#4a7478" d="M0 270q200-48 402 0t394 0q260-56 644 0v102H0Z" />
          <path fill="none" stroke="#e1eff0" strokeDasharray="35 48" strokeLinecap="round" strokeWidth="2" opacity=".5" d="M83 300q71-8 142 0m202 25q56-7 112 0m242-39q86-8 172 0m185 39q56-7 112 0" />
          <path fill="#dbe7e7" d="M0 326q213-40 409 5t394-3q232-55 405-7t232-8v47H0Z" />
          <g fill="#263e42">
            <path d="m93 330 48-168 50 168h-28l39 42H82l39-42zm1147 0 48-168 50 168h-28l39 42h-150l39-42z" />
          </g>
          <g fill="#eaf3f3">
            <path d="m129 205 12-43 13 43-9-10-4 4-5-4z" />
            <path d="m1183 205 13-43 12 43-8-10-5 4-5-4z" />
          </g>
          <g className="countdown-cabin">
            <path d="M665 243h110v78H665z" />
            <path d="m651 247 69-54 70 54z" />
            <path d="m651 247 69-54 70 54-18-5-52-37-51 38z" />
            <path d="M707 282h24v39h-24z" />
            <path d="M677 258h18v17h-18zm70 0h18v17h-18z" />
          </g>
        </svg>
      </div>
      <a className="countdown-brand" href="#/" aria-label="For Manuu">
        ✦ <span>for Manuu</span>
      </a>
      <div className="countdown-content">
        <p className="countdown-kicker">{birthdayContent.countdown.kicker}</p>
        <span className="countdown-ornament" aria-hidden="true">✧</span>
        <h1 id="countdown-title">{birthdayContent.countdown.title}</h1>
        <p className="countdown-subtitle">{birthdayContent.countdown.subtitle}</p>
        <time className="countdown-date" dateTime={targetDate.toISOString()}>
          {dateLabel}
        </time>
        <div
          className="countdown-clock"
          role="timer"
          aria-label={`${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds remaining`}
          aria-live="off"
        >
          {countdownItems.map(({ key, value }) => (
            <div className="countdown-unit" key={key}>
              <span>{String(value).padStart(2, '0')}</span>
              <small>{birthdayContent.countdown.labels[key]}</small>
            </div>
          ))}
        </div>
        <p className="countdown-signature">{birthdayContent.countdown.signature}</p>
      </div>
    </section>
  )
}

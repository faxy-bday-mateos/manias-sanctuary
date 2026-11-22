import { useState } from 'react'
import { organGroups } from '../organData'

const wishGroups = [
  { title: 'For the days ahead', icon: '☼', wishes: ['May the year ahead feel like a window opening on a fresh morning.', 'May there be more unhurried afternoons than you expect.', 'May you find a new favorite place, even if it is just a corner of a room.', 'May the plans you are excited about come together gently.', 'May a good surprise find you on a very ordinary day.', 'May you have the energy for what matters and permission to rest from the rest.', 'May the next chapter bring more ease than the last one.', 'May you have many reasons to look forward to tomorrow.', 'May the little things you are hoping for happen one by one.', 'May every season bring something that feels made for you.', 'May your calendar leave room for spontaneous joy.', 'May the road ahead have beautiful places to pause.', 'May you get to try something new just because it sounds fun.', 'May good news arrive when you could use it.', 'May the things you build this year make you proud.', 'May home feel warm wherever you happen to be.', 'May you collect small moments that become favorite memories.', 'May your curiosity keep opening unexpected doors.', 'May you be surprised by how much can go right.', 'May this year be kind to the person you are becoming.'] },
  { title: 'For your quiet moments', icon: '☾', wishes: ['May you find a calm sky when you need one.', 'May a favorite song meet you at exactly the right time.', 'May your tea, coffee, or evening snack always hit the spot.', 'May a cozy room and a soft blanket be easy to find.', 'May you get a little more sleep than you planned on.', 'May rain sound peaceful when you are safe and warm inside.', 'May a walk outside help untangle a busy mind.', 'May you have a place where you never need to pretend.', 'May silence feel comfortable and company feel easy.', 'May your favorite small rituals stay yours.', 'May you catch a beautiful sunset without having to hurry.', 'May you get a day with nowhere urgent to be.', 'May a pet, plant, or passing bird make you smile.', 'May the night sky remind you that there is room for wonder.', 'May you make time to do absolutely nothing sometimes.', 'May your favorite comfort food taste extra good.', 'May a deep breath make a difficult moment feel smaller.', 'May you notice the first lovely thing in every new place.', 'May the world give you a softer landing when you need one.', 'May peace find you in small, ordinary ways.'] },
  { title: 'For your adventures', icon: '✈', wishes: ['May you visit somewhere that stays in your thoughts long after you return.', 'May every journey have at least one unexpectedly perfect view.', 'May you find a new path worth taking the scenic route for.', 'May your next trip be full of little stories to tell.', 'May you always have someone good to share the view with.', 'May a new hobby surprise you by becoming a favorite.', 'May your brave ideas get a chance to become real.', 'May you try something that makes you laugh at yourself.', 'May you find a book, film, or song that feels like a discovery.', 'May plans change in a way that leads somewhere lovely.', 'May you get delightfully lost somewhere safe and beautiful.', 'May every new beginning bring a little more confidence.', 'May your curiosity take you somewhere memorable.', 'May the best part of an adventure be the unexpected part.', 'May you collect moments, not just photographs.', 'May a day out feel longer in the nicest possible way.', 'May you discover a view that makes you stop mid-sentence.', 'May there be more yes days for things you genuinely want.', 'May you get to celebrate every little milestone along the way.', 'May your life keep making space for wonder.'] },
  { title: 'For the person you are', icon: '♡', wishes: ['May you give yourself the same patience you give other people.', 'May you remember that growing slowly still counts as growing.', 'May you feel appreciated without having to ask.', 'May you trust your own timing a little more.', 'May you let yourself be proud before everything is perfect.', 'May you keep the parts of you that make you unmistakably yourself.', 'May you know that resting is part of making progress.', 'May you feel free to change your mind as you learn.', 'May you find people who listen with care.', 'May you be gentle with yourself on the complicated days.', 'May your effort be seen, even when the result takes time.', 'May you keep asking questions and finding your own answers.', 'May you feel at home in your own company.', 'May you never have to shrink to make others comfortable.', 'May you remember that your worth is not a to-do list.', 'May you have courage for the things that matter to you.', 'May you speak to yourself like someone you love.', 'May you feel allowed to take up space and take your time.', 'May you notice how much you already bring to the world.', 'May you always know that simply being you is enough.'] },
  { title: 'For the joy in between', icon: '✿', wishes: ['May laughter sneak into the middle of a busy day.', 'May the perfect snack appear exactly when you want it.', 'May you get a message that makes you grin at your phone.', 'May you find something beautiful on the way to somewhere else.', 'May your next favorite memory begin with “remember when…”', 'May you have a reason to wear something that makes you feel wonderful.', 'May the little celebration become a big happy one.', 'May your favorite people make time for you.', 'May your jokes land and your silly moments be treasured.', 'May you always find one more reason to celebrate.', 'May flowers, clouds, or city lights catch your eye today.', 'May a tiny win turn an average day around.', 'May you receive a compliment you actually believe.', 'May something you thought was lost turn up again.', 'May your birthday sweetness last beyond today.', 'May you always find room for a little play.', 'May every good moment feel like it has nowhere else to be.', 'May you hear your favorite song in an unexpected place.', 'May joy show up in forms you did not think to ask for.', 'And most of all, may you feel celebrated—today and all year long.'] },
]

export function HundredWishes() {
  const [open, setOpen] = useState<number | null>(0)
  const [openedWishes, setOpenedWishes] = useState<number[]>([])
  const wishTotal = wishGroups.reduce((sum, group) => sum + group.wishes.length, 0)
  return <section className="wishes-book">
    <header className="book-cover book-cover--wishes">
      <span className="book-cover__eyebrow">A birthday keepsake <span aria-hidden="true">·</span> 01</span>
      <span className="book-cover__ornament" aria-hidden="true">✧　✦　✧</span>
      <h1>100 Little Wishes</h1>
      <p>One hundred small hopes for the year ahead</p>
      <span className="book-cover__seal">FOR MANUU</span>
    </header>
    <div className="book-progress">
      <div className="book-progress__label"><span>Your wishes</span><strong aria-live="polite">{openedWishes.length} <span>/ {wishTotal}</span></strong></div>
      <progress value={openedWishes.length} max={wishTotal} aria-label={`${openedWishes.length} of ${wishTotal} wishes marked`} />
    </div>
    <div className="wishes-groups">{wishGroups.map((group, groupIndex) => <section className={`wish-group${open === groupIndex ? ' is-open' : ''}`} key={group.title}>
      <button className="wish-group__toggle" type="button" aria-expanded={open === groupIndex} onClick={() => setOpen(open === groupIndex ? null : groupIndex)}><span className="wish-group__icon" aria-hidden="true">{group.icon}</span><span><small>CHAPTER {String(groupIndex + 1).padStart(2, '0')} · WISHES {groupIndex * 20 + 1}–{groupIndex * 20 + 20}</small><strong>{group.title}</strong></span><span className="wish-group__plus" aria-hidden="true">{open === groupIndex ? '−' : '+'}</span></button>
      {open === groupIndex && <ol className="wish-list" start={groupIndex * 20 + 1}>{group.wishes.map((wish, i) => { const wishNumber = groupIndex * 20 + i + 1; return <li key={wish}><span>{String(wishNumber).padStart(2, '0')}</span><button type="button" className={openedWishes.includes(wishNumber) ? 'is-read' : ''} aria-pressed={openedWishes.includes(wishNumber)} onClick={() => setOpenedWishes((old) => old.includes(wishNumber) ? old : [...old, wishNumber])}>{wish}</button><span className="wish-check" aria-hidden="true">{openedWishes.includes(wishNumber) ? '✓' : '＋'}</span></li> })}</ol>}
    </section>)}</div>
    <p className="wishes-endnote">Made of little hopes, with birthday care. <span aria-hidden="true">✦</span></p>
  </section>
}

export function HundredOrgans() {
  const [openGroup, setOpenGroup] = useState<number | null>(0)
  const [readItems, setReadItems] = useState<number[]>([])
  const total = organGroups.reduce((sum, group) => sum + group.items.length, 0)
  return <section className="organs-book">
    <header className="book-cover book-cover--organs">
      <span className="book-cover__eyebrow">A birthday keepsake <span aria-hidden="true">·</span> 02</span>
      <span className="book-cover__ornament" aria-hidden="true">❀　✧　❀</span>
      <h1>100 Organs</h1>
      <p>One Hundred Reasons You Are Worth Knowing</p>
      <span className="book-cover__seal">FOR MANUU</span>
    </header>
    <div className="book-progress">
      <div className="book-progress__label"><span>Pages explored</span><strong aria-live="polite">{readItems.length} <span>/ {total}</span></strong></div>
      <progress value={readItems.length} max={total} aria-label={`${readItems.length} of ${total} tributes opened`} />
    </div>
    <div className="organs-groups">{organGroups.map((group, groupIndex) => <section className={`organ-group${openGroup === groupIndex ? ' is-open' : ''}`} key={group.title}>
      <button className="organ-group__toggle" type="button" aria-expanded={openGroup === groupIndex} onClick={() => setOpenGroup(openGroup === groupIndex ? null : groupIndex)}>
        <span className="organ-group__number">{String(groupIndex + 1).padStart(2, '0')}</span><span className="organ-group__label"><small>CHAPTER {String(groupIndex + 1).padStart(2, '0')} · {String(group.items[0]?.number ?? 0).padStart(2, '0')}–{String(group.items[group.items.length - 1]?.number ?? 0).padStart(2, '0')}</small><strong>{group.title}</strong></span><span className="organ-group__plus" aria-hidden="true">{openGroup === groupIndex ? '−' : '+'}</span>
      </button>
      {openGroup === groupIndex && <ol className="organ-list" start={group.items[0]?.number ?? 1}>{group.items.map((item) => <li key={item.number}>
        <details onToggle={(event) => { if (event.currentTarget.open) setReadItems((old) => old.includes(item.number) ? old : [...old, item.number]) }}>
          <summary><span className="organ-list__number">{String(item.number).padStart(2, '0')}</span><strong>{item.title}</strong><span className="organ-list__chevron" aria-hidden="true">⌄</span></summary>
          <div className="organ-list__note">{item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
        </details>
      </li>)}</ol>}
    </section>)}</div>
    <p className="organs-endnote">A hundred small reminders that you are worth knowing. <span aria-hidden="true">✦</span></p>
  </section>
}

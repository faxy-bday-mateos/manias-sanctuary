export const birthdayContent = {
  pageTitle: 'Happy Birthday, Manuu',
  greeting: 'Happy Birthday, Manuu',
  countdown: {
    month: 11,
    day: 30,
    kicker: 'A little birthday magic is on its way',
    title: 'The celebration begins in…',
    subtitle: 'A few more sleeps until your day arrives.',
    labels: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
    },
    signature: 'Made with care, just for Manuu.',
  },
  welcome: {
    kicker: 'A little corner, just for today',
    subtitle:
      'Today is a chance to celebrate you. I hope it brings a little joy and a moment to feel appreciated.',
    birthdayMessage:
      'Happy birthday, Manuu. Today is for celebrating you: the strong, thoughtful person you are, and all the ways you keep becoming yourself. I’m so grateful I get to call you my friend. Even though we have never met in person, your place in my life is real and important to me. You have faced hard chapters, and I hope you can look at how far you have come with pride, while remembering that you do not have to be strong every moment to deserve kindness. I hope this birthday brings you comfort, laughter, and little surprises that make you feel cared for. May the year ahead be gentler, brighter, and full of new reasons to feel proud. You deserve to feel celebrated today and all year long.',
    balloonNotes: [
      'May today bring you little moments that make you smile.',
      'You deserve to feel celebrated, today and every day.',
      'I hope this year brings you gentle days and bright surprises.',
      'A little reminder: you make this world sweeter just by being in it.',
    ],
  },
  birthdayMessage: {
    kicker: 'A birthday message, just for you',
    title: 'I’m so glad you’re my friend.',
    paragraph:
      'Happy birthday, Manuu. I hope today gives you room to feel celebrated and proud of how far you have come. Even though we have never met in person, your friendship has become important to me. I chose you as my friend because I value who you are: your strength, your heart, and the way your presence matters. You do not have to be perfect or have everything figured out to deserve care and support. I hope the year ahead brings you gentler days, easy laughter, and plenty of reminders that you are worthy of good things. You deserve to feel celebrated today and all year long.',
    signoff: 'With care, and the happiest of birthdays.',
  },
  scenes: {
    kicker: 'A little place to land',
    title: 'Choose a softer kind of quiet.',
    intro: 'Three small scenes, each with its own way of slowing down.',
    selectorLabel: 'Choose a scene',
    items: [
      {
        kind: 'night',
        label: 'Night Sky',
        title: 'Under the night sky',
        description: 'A little stillness beneath the stars.',
      },
      {
        kind: 'ocean',
        label: 'Ocean',
        title: 'Beside the ocean',
        description: 'Slow waves and room to breathe.',
      },
      {
        kind: 'room',
        label: 'Cozy Room',
        title: 'In a cozy room',
        description: 'Warm light on an unhurried evening.',
      },
    ] as const,
  },
  surprise: {
    kicker: 'A small bright thing',
    title: 'A gentle wish for your year.',
    groupLabel: 'Small birthday surprises',
    hint: 'Tap a butterfly or light to find a little wish.',
    closeLabel: 'Close wish',
    messages: [
      {
        kind: 'butterfly',
        accessibleName: 'Open butterfly surprise',
        message: 'May you find a little joy in the ordinary.',
      },
      {
        kind: 'firefly',
        accessibleName: 'Open firefly surprise',
        message: 'May the year ahead bring you room to grow at your own pace.',
      },
      {
        kind: 'butterfly',
        accessibleName: 'Open butterfly surprise',
        message: 'May you feel cared for, today and all year long.',
      },
    ],
  },
  friendship: {
    kicker: 'Why I chose your friendship',
    title: 'I chose you because you matter to me.',
    paragraph:
      'Even though we have never met face-to-face, the friendship we have is real and important to me. I chose you because of the person I have come to know through what you share: someone with strength to be proud of, a heart deserving of care, and a presence that matters simply because it is yours. I wanted to be your friend because I value you as you are. You do not have to prove your worth or have everything figured out to deserve kindness and support. I hope today reminds you how much your friendship means to me, and gives you another reason to feel proud of the person you are.',
    reasons: [
      { symbol: '✦', text: 'Your strength is worth celebrating.' },
      { symbol: '♡', text: 'You deserve care as your full, real self.' },
      { symbol: '✧', text: 'Your place in my life matters.' },
    ],
    closing: 'With care, and happy birthday.',
  },
  closing: {
    title: 'Here’s to you, Manuu.',
    message:
      'May this next trip around the sun be gentle, bright, and entirely your own.',
    signoff: 'Happy birthday.',
  },
}

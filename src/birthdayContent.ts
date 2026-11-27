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
    balloonNotes: [
      'May today bring you little moments that make you smile.',
      'You deserve to feel celebrated, today and every day.',
      'I hope this year brings you gentle days and bright surprises.',
      'A little reminder: you make this world sweeter just by being in it.',
    ],
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
    kicker: 'A note for you',
    title: 'I’m glad I chose you as a friend.',
    paragraph:
      'Our friendship means a lot to me. I value you, and I’m grateful to have you in my life. I hope you feel celebrated today and in the year ahead.',
    closing: 'With care, and happy birthday.',
  },
  closing: {
    title: 'Here’s to you, Manuu.',
    message:
      'May this next trip around the sun be gentle, bright, and entirely your own.',
    signoff: 'Happy birthday.',
  },
}

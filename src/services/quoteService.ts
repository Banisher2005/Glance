export interface Quote {
  text: string;
  author: string;
}

// Curated locally so Glance's quote card never depends on network availability.
const QUOTES: Quote[] = [
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'The details are not the details. They make the design.', author: 'Charles Eames' },
  { text: 'Focus is a matter of deciding what things you\u2019re not going to do.', author: 'John Carmack' },
  { text: 'What we do now echoes into eternity.', author: 'Marcus Aurelius' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'Make time, not excuses.', author: 'Unknown' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Unknown' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'The obstacle is the way.', author: 'Marcus Aurelius' },
  { text: 'Clarity precedes competence.', author: 'Robin Sharma' },
  { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
];

/** Returns the same quote all day, rotating deterministically by day-of-year. */
export function getQuoteOfTheDay(date: Date = new Date()): Quote {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return QUOTES[dayOfYear % QUOTES.length];
}

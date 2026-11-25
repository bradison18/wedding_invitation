/**
 * ALL WEDDING DETAILS LIVE HERE. Taken from the printed invitation card.
 * Only what the card states. Leave phone, whatsapp or hashtag empty to hide them.
 */
export type Bi = { en: string };
const b = (en: string): Bi => ({ en });

export const wedding = {
  groom: {
    name: b('Srinivasa Bharadwaja'), formal: b('Chi. Srinivasa Bharadwaja'),
    parents: b('Mr. Shambuni Venkata Satyanarayana & Mrs. Satya Sri Visalakshi'),
    grand: b('Grandson of Late Sri Shambuni Sambaiah & Smt. Shyamalamba'),
  },
  bride: {
    name: b('Deepika'), formal: b('Chi. La. Sow. Deepika'),
    parents: b('Sri Gattupalle Rajasekhar & Smt. Radha'),
    grand: b('Granddaughter of Sri Gattupalle Devi Prasad Sharma & Smt. Sarada Devi'),
  },
  muhurtham: {
    /** 3:33 am belongs to Saturday 19th by the clock, Friday night by custom. */
    iso: '2026-12-19T03:33:00+05:30',
    date: b('Friday, 18 December 2026'),
    time: b('early hours of Saturday 19th, at 3:33 am'),
    panchangam: b('Revathi Nakshatra, Thula Lagnam'),
  },
  /** The countdown on the site runs to this moment. */
  countdown: { iso: '2026-12-18T19:00:00+05:30', label: b('Friday, 18 December 2026, 7:00 pm') },
  city: b('Vijayawada'),
  venue: {
    name: b('Telugu Film Chamber Hall'),
    address: b('Opp. Sailaja Theatre, Gandhinagar, Vijayawada'),
    map: 'https://www.google.com/maps/search/?api=1&query=Telugu+Film+Chamber+Hall%2C+opp+Sailaja+Theatre%2C+Gandhinagar%2C+Vijayawada',
  },
  contacts: [
    { who: b("Groom's family"), name: b('Shambuni Venkata Satyanarayana & Smt. Satya Sri Visalakshi'), phone: '' },
    { who: b("Bride's family"), name: b('Gattupalle Rajasekhar & Smt. Radha'), phone: '' },
  ],
  /** Digits only with country code, e.g. 919876543210. Empty = guest picks the recipient. */
  whatsapp: '',
  hashtag: '',
};

/** start/end: ISO with offset, or YYYY-MM-DD for an all-day entry. End times are estimates for calendars only. */
export type EventItem = {
  id: string; name: Bi; date: Bi; time: Bi; start: string; end: string;
  venue: Bi; map: string; colors: string[]; weave: 'check' | 'zari' | 'fine'; tone: string;
};
const hall = b('Telugu Film Chamber Hall, Opp. Sailaja Theatre, Gandhinagar, Vijayawada');
export const events: EventItem[] = [
  { id: 'dinner', name: b('Dinner'), date: b('Friday, 18 December 2026'), time: b('7:30 pm onwards'), start: '2026-12-18T19:30:00+05:30', end: '2026-12-18T22:30:00+05:30', venue: hall, map: wedding.venue.map, colors: ['#E0A11B', '#F4E8CF'], weave: 'check', tone: '#2F5D3A' },
  { id: 'pelli', name: b('Wedding Muhurtham'), date: b('Friday, 18 December (early hours of Saturday 19th)'), time: b('3:33 am · Revathi Nakshatra, Thula Lagnam'), start: '2026-12-19T03:33:00+05:30', end: '2026-12-19T06:00:00+05:30', venue: hall, map: wedding.venue.map, colors: ['#9E2B25', '#E0A11B'], weave: 'zari', tone: '#9E2B25' },
  { id: 'reception', name: b('Reception'), date: b('Sunday, 20 December 2026'), time: b(''), start: '2026-12-20', end: '2026-12-21', venue: b('Sri Mourya Convention, JKC College Road, Guntur'), map: 'https://www.google.com/maps/search/?api=1&query=Sri+Mourya+Convention%2C+JKC+College+Road%2C+Guntur', colors: ['#16294A', '#B88A3B'], weave: 'fine', tone: '#16294A' },
];


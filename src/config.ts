const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

/**
 * Venue names and addresses come from the location screenshots.
 * Those screenshots do not include the wedding day or the ceremony time.
 * When you have them, fill the wedding fields below. Example:
 * dateISO: '2026-12-27T10:30:00+05:30'
 * dateDisplay: 'Sunday, 27 December 2026'
 * churchTime: '10:30 AM'
 * receptionTime: '1:00 PM onwards'
 * whatsapp: '919876543210'
 */
export const site = {
  couple: {
    groom: 'Rahul Shaji',
    bride: 'Jovial Rose',
  },
  wedding: {
    dateISO: '',
    dateDisplay: '',
    churchTime: '',
    receptionTime: '',
  },
  church: {
    name: "St. Sebastian's Forane Church",
    malayalamPlace: 'തൊടുപുഴ',
    address: 'Thodupuzha, Kerala 685 584',
    latitude: 9.895138,
    longitude: 76.70833,
  },
  reception: {
    name: 'Jacobs Entertainments',
    detail: 'Convention Center & Health Park',
    malayalamPlace: 'മുവാറ്റുപുഴ',
    address: 'Pandappilly, Muvattupuzha, Kerala 686672',
    latitude: 9.911845,
    longitude: 76.592092,
  },
  photos: {
    stairs: asset('photos/stairs.jpg'),
    portrait: asset('photos/portrait.jpg'),
    walk: asset('photos/walk.jpg'),
    embrace: asset('photos/embrace.jpg'),
  },
  rsvp: {
    email: 'rahulshaji235@gmail.com',
    /** Digits only, with country code, for wa.me */
    whatsapp: '447444406003',
    phoneDisplay: '+44 7444 406003',
    sheetSubmitUrl:
      'https://script.google.com/macros/s/AKfycbwWupcaMAKNImDOj50hss7DoletIX1gJ9Qa89Wc_ujIcfZPgtD79xRQ6arN_ybGwcX4pA/exec',
  },
} as const

export function weddingDate(): Date | null {
  if (!site.wedding.dateISO) return null
  const date = new Date(site.wedding.dateISO)
  return Number.isNaN(date.getTime()) ? null : date
}

export function mapsEmbed(latitude: number, longitude: number) {
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`
}

export function mapsDirections(latitude: number, longitude: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
}

export function weddingIcs(): string | null {
  const date = weddingDate()
  if (!date) return null

  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const timed = site.wedding.dateISO.includes('T')
  const start = timed
    ? date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
    : date.toISOString().slice(0, 10).replaceAll('-', '')
  const endDate = new Date(
    date.getTime() + (timed ? 3 : 24) * 60 * 60 * 1000,
  )
  const end = timed
    ? endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
    : endDate.toISOString().slice(0, 10).replaceAll('-', '')

  const location = `${site.church.name}, ${site.church.address}`
  const description = `Wedding of ${site.couple.groom} and ${site.couple.bride}. Holy Matrimony at ${location}. Reception at ${site.reception.name}, ${site.reception.address}.`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rahul and Jovial//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:rahul-jovial-wedding@rahulinvitesyou',
    `DTSTAMP:${stamp}`,
    timed ? `DTSTART:${start}` : `DTSTART;VALUE=DATE:${start}`,
    timed ? `DTEND:${end}` : `DTEND;VALUE=DATE:${end}`,
    'SUMMARY:Wedding of Rahul Shaji and Jovial Rose',
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

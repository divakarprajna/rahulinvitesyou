import { useState, type FormEvent } from 'react'
import { site } from '../config'

type Attendance = 'yes' | 'no' | ''
type Status = 'idle' | 'submitting' | 'sent' | 'error'

function replyText(input: {
  name: string
  phone: string
  guests: number
  attendance: Attendance
  note: string
}) {
  const coming = input.attendance === 'yes'
  return [
    'RSVP for the wedding of Rahul Shaji & Jovial Rose',
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    coming ? `Guests: ${input.guests}` : 'Guests: 0',
    `Attending: ${coming ? 'Yes, with joy' : 'Sending love from afar'}`,
    input.note ? `Note: ${input.note}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * The live sheet only stores a name and a phone number.
 * Attendance, guest count, and the note ride in the name
 * so they still land in that same spreadsheet.
 */
function sheetName(input: {
  name: string
  guests: number
  attendance: Attendance
  note: string
}) {
  const coming = input.attendance === 'yes'
  const parts = [
    input.name,
    'Rahul & Jovial',
    coming ? `Yes, ${input.guests}` : 'No',
  ]
  if (input.note) parts.push(input.note)
  return parts.join(' · ')
}

export function Rsvp() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState(1)
  const [attendance, setAttendance] = useState<Attendance>('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [sentText, setSentText] = useState('')

  const message =
    sentText ||
    'Hi Rahul, I would like to RSVP for your wedding with Jovial.'
  const whatsappHref = `https://wa.me/${site.rsvp.whatsapp}?text=${encodeURIComponent(message)}`
  const emailHref = `mailto:${site.rsvp.email}?subject=${encodeURIComponent('RSVP for Rahul and Jovial')}&body=${encodeURIComponent(message)}`

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!attendance) return

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      guests,
      attendance,
      note: note.trim(),
    }
    const text = replyText(payload)
    setStatus('submitting')

    try {
      const formData = new FormData()
      formData.append('name', sheetName(payload))
      formData.append('phone', payload.phone)

      await fetch(site.rsvp.sheetSubmitUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })

      setSentText(text)
      setName('')
      setPhone('')
      setGuests(1)
      setAttendance('')
      setNote('')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section rsvp-section" id="rsvp">
      <div className="reply-card">
        <p className="kicker">Kindly reply</p>
        <h2>RSVP</h2>
        <p className="lede dark">
          A place is kept for you. Tell Rahul and Jovial whether you can share
          the day.
        </p>

        <form className="rsvp-form" onSubmit={(event) => void onSubmit(event)}>
          <label>
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              name="name"
              autoComplete="name"
              required
              placeholder="Name"
            />
          </label>
          <label>
            Phone number
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="So they can reach you"
            />
          </label>

          <fieldset>
            <legend>Will you be there?</legend>
            <div className="choice-row">
              <button
                type="button"
                className={attendance === 'yes' ? 'choice on' : 'choice'}
                aria-pressed={attendance === 'yes'}
                onClick={() => setAttendance('yes')}
              >
                With joy, I’ll be there
              </button>
              <button
                type="button"
                className={attendance === 'no' ? 'choice on' : 'choice'}
                aria-pressed={attendance === 'no'}
                onClick={() => setAttendance('no')}
              >
                Sending love from afar
              </button>
            </div>
          </fieldset>

          {attendance === 'yes' && (
            <div className="stepper">
              <span>Guests, including you</span>
              <div>
                <button
                  type="button"
                  onClick={() => setGuests((count) => Math.max(1, count - 1))}
                  aria-label="Fewer guests"
                >
                  −
                </button>
                <strong>{guests}</strong>
                <button
                  type="button"
                  onClick={() => setGuests((count) => Math.min(12, count + 1))}
                  aria-label="More guests"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <label>
            A note, if you wish
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              name="note"
              rows={3}
              placeholder="A blessing, a song request, a dietary note"
            />
          </label>

          <button className="gold-button" type="submit" disabled={!attendance || status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send RSVP'}
          </button>
        </form>

        {status === 'sent' && (
          <p className="rsvp-status" role="status">
            Your RSVP is saved. Thank you.
          </p>
        )}
        {status === 'error' && (
          <p className="rsvp-status rsvp-error" role="status">
            That didn’t save. Please WhatsApp or email Rahul instead.
          </p>
        )}

        <div className="ready-actions">
          <a className="ghost-button" href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp {site.rsvp.phoneDisplay}
          </a>
          <a className="ghost-button" href={emailHref}>
            Email {site.rsvp.email}
          </a>
        </div>
      </div>
    </section>
  )
}

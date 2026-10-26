import { useState, type FormEvent } from 'react'
import { site } from '../config'

type Attendance = 'yes' | 'no' | ''

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
    input.phone ? `Phone: ${input.phone}` : '',
    coming ? `Guests: ${input.guests}` : 'Guests: 0',
    `Attending: ${coming ? 'Yes, with joy' : 'Sending love from afar'}`,
    input.note ? `Note: ${input.note}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function Rsvp() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState(1)
  const [attendance, setAttendance] = useState<Attendance>('')
  const [note, setNote] = useState('')
  const [readyText, setReadyText] = useState('')
  const [copied, setCopied] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!attendance) return

    const text = replyText({ name: name.trim(), phone: phone.trim(), guests, attendance, note: note.trim() })
    setReadyText(text)
    setCopied(false)

    if (site.rsvp.whatsapp) {
      const url = `https://wa.me/${site.rsvp.whatsapp}?text=${encodeURIComponent(text)}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const copyReply = async () => {
    await navigator.clipboard.writeText(readyText)
    setCopied(true)
  }

  const shareReply = async () => {
    if (!navigator.share) {
      await copyReply()
      return
    }
    await navigator.share({
      title: 'RSVP for Rahul & Jovial',
      text: readyText,
    })
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

        <form className="rsvp-form" onSubmit={onSubmit}>
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
              name="tel"
              type="tel"
              autoComplete="tel"
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
              rows={3}
              placeholder="A blessing, a song request, a dietary note"
            />
          </label>

          <button className="gold-button" type="submit" disabled={!attendance}>
            {site.rsvp.whatsapp ? 'Send on WhatsApp' : 'Write my reply'}
          </button>
        </form>

        {readyText && (
          <div className="reply-ready" role="status">
            <p>
              {site.rsvp.whatsapp
                ? 'WhatsApp is opening with your reply.'
                : 'Your reply is ready. Share it with Rahul and Jovial.'}
            </p>
            <pre>{readyText}</pre>
            <div className="ready-actions">
              <button type="button" className="ghost-button" onClick={() => void copyReply()}>
                {copied ? 'Copied' : 'Copy reply'}
              </button>
              <button type="button" className="ghost-button" onClick={() => void shareReply()}>
                Share reply
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

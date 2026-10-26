import { useEffect, useRef, useState } from 'react'
import { Envelope } from './components/Envelope'
import { Invitation } from './components/Invitation'
import { setMuted, startMusic } from './music'

type Phase = 'sealed' | 'opening' | 'open'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('sealed')
  const [muted, setIsMuted] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    document.body.classList.toggle('invite-open', phase !== 'sealed')
  }, [phase])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const openInvitation = () => {
    if (phase !== 'sealed') return
    startMusic()
    setPhase('opening')
    const wait = prefersReducedMotion() ? 0 : 3100
    timer.current = window.setTimeout(() => setPhase('open'), wait)
  }

  return (
    <>
      {phase !== 'sealed' && <Invitation />}
      {phase !== 'open' && (
        <Envelope opening={phase === 'opening'} onOpen={openInvitation} />
      )}
      {phase === 'open' && (
        <button
          type="button"
          className={`music-toggle ${muted ? 'is-muted' : ''}`}
          aria-pressed={muted}
          aria-label={muted ? 'Play music' : 'Mute music'}
          onClick={() => {
            const next = !muted
            setIsMuted(next)
            setMuted(next)
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4 9v6h4l5 4V5L8 9H4zm11.5 3a3.5 3.5 0 0 0-2-3.15v6.3A3.5 3.5 0 0 0 15.5 12z"
            />
            {muted && <path d="M5 5 L19 19" stroke="currentColor" strokeWidth="1.8" />}
          </svg>
        </button>
      )}
    </>
  )
}

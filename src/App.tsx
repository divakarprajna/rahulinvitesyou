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
          className={`music-wave ${muted ? 'is-muted' : ''}`}
          aria-pressed={muted}
          aria-label={muted ? 'Play music' : 'Mute music'}
          onClick={() => {
            const next = !muted
            setIsMuted(next)
            setMuted(next)
          }}
        >
          <span />
          <span />
          <span />
          <span />
          <span />
        </button>
      )}
    </>
  )
}

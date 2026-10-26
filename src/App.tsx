import { useEffect, useRef, useState } from 'react'
import { playChime } from './chime'
import { Envelope } from './components/Envelope'
import { Invitation } from './components/Invitation'

type Phase = 'sealed' | 'opening' | 'open'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('sealed')
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
    playChime()
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
    </>
  )
}

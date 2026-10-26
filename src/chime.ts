/** A short original bell, played when the seal opens. */
export function playChime() {
  const Context = window.AudioContext || window.webkitAudioContext
  if (!Context) return

  const audio = new Context()
  const now = audio.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5]

  notes.forEach((frequency, index) => {
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    const start = now + index * 0.14

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.06, start + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.7)
    oscillator.connect(gain)
    gain.connect(audio.destination)
    oscillator.start(start)
    oscillator.stop(start + 1.8)
  })

  window.setTimeout(() => {
    void audio.close()
  }, 2800)
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

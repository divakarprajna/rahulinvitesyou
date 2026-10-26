/**
 * An original sufi-style wedding loop.
 * A copyrighted recording is not included.
 */
let audio: AudioContext | null = null
let master: GainNode | null = null
let pulse = 0
let step = 0

const scale = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392]
const phrase = [0, 2, 4, 6, 4, 3, 2, 0, 1, 2, 4, 2]

function tone(frequency: number, when: number, length: number, volume: number, type: OscillatorType) {
  if (!audio || !master) return
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(volume, when + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length)
  oscillator.connect(gain)
  gain.connect(master)
  oscillator.start(when)
  oscillator.stop(when + length + 0.05)
}

function tick() {
  if (!audio) return
  const now = audio.currentTime
  const degree = phrase[step % phrase.length] ?? 0
  const note = scale[degree] ?? 220
  tone(note, now, 0.7, 0.045, 'triangle')
  tone(note / 2, now, 0.9, 0.02, 'sine')
  if (step % 4 === 0) {
    tone(880, now, 0.18, 0.03, 'sine')
    tone(1318, now + 0.08, 0.22, 0.02, 'sine')
  }
  step += 1
}

export function startMusic() {
  const Context = window.AudioContext || window.webkitAudioContext
  if (!Context) return
  if (audio) {
    if (audio.state === 'suspended') void audio.resume()
    return
  }

  audio = new Context()
  master = audio.createGain()
  master.gain.value = 0.9
  master.connect(audio.destination)

  const drone = audio.createOscillator()
  const droneGain = audio.createGain()
  drone.type = 'sine'
  drone.frequency.value = 110
  droneGain.gain.value = 0.04
  drone.connect(droneGain)
  droneGain.connect(master)
  drone.start()

  const fifth = audio.createOscillator()
  const fifthGain = audio.createGain()
  fifth.type = 'sine'
  fifth.frequency.value = 164.81
  fifthGain.gain.value = 0.025
  fifth.connect(fifthGain)
  fifthGain.connect(master)
  fifth.start()

  tick()
  pulse = window.setInterval(tick, 620)
}

export function setMuted(muted: boolean) {
  if (!audio || !master) return
  const now = audio.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.08)
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

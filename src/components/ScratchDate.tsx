import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { site } from '../config'

export function ScratchDate() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [clear, setClear] = useState(false)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || clear) return
    const context = canvas.getContext('2d')
    if (!context) return

    const paint = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const foil = context.createLinearGradient(0, 0, rect.width, rect.height)
      foil.addColorStop(0, '#f3e6c4')
      foil.addColorStop(0.45, '#c6a15a')
      foil.addColorStop(1, '#efe0bc')
      context.fillStyle = foil
      context.fillRect(0, 0, rect.width, rect.height)
      context.strokeStyle = 'rgba(90, 58, 20, 0.28)'
      context.lineWidth = 1
      for (let x = 8; x < rect.width; x += 14) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x - 18, rect.height)
        context.stroke()
      }
      context.fillStyle = '#3d2914'
      context.font = '600 12px Manrope, sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText('SCRATCH', rect.width / 2, rect.height / 2)
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [clear])

  const erase = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || clear) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    context.save()
    context.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0)
    context.globalCompositeOperation = 'destination-out'
    context.beginPath()
    context.arc(x, y, 18, 0, Math.PI * 2)
    context.fill()
    context.restore()

    const sample = context.getImageData(0, 0, canvas.width, canvas.height).data
    let gone = 0
    const total = sample.length / 4
    for (let index = 3; index < sample.length; index += 16) {
      if ((sample[index] ?? 255) < 24) gone += 1
    }
    if (gone / (total / 4) > 0.42) setClear(true)
  }

  return (
    <div className={`scratch-card ${clear ? 'clear' : ''}`}>
      <div className="scratch-reveal">
        <strong>{site.wedding.dateDisplay}</strong>
        <span>Church · {site.wedding.churchTime}</span>
        <span>Wedding · {site.wedding.receptionTime}</span>
      </div>
      {!clear && (
        <canvas
          ref={canvasRef}
          className="scratch-foil"
          aria-label="Scratch to see the date and time"
          onPointerDown={(event) => {
            drawing.current = true
            event.currentTarget.setPointerCapture(event.pointerId)
            erase(event)
          }}
          onPointerMove={(event) => {
            if (drawing.current) erase(event)
          }}
          onPointerUp={() => {
            drawing.current = false
          }}
        />
      )}
    </div>
  )
}

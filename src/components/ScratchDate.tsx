import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

export function ScratchCover({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const started = useRef(false)
  const drawing = useRef(false)
  const [clear, setClear] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent || clear) return
    const context = canvas.getContext('2d')
    if (!context) return

    const paint = () => {
      if (started.current) return
      const rect = parent.getBoundingClientRect()
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
      for (let x = 10; x < rect.width; x += 16) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x - 28, rect.height)
        context.stroke()
      }
      context.fillStyle = '#3d2914'
      context.font = '600 13px Manrope, sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText('SCRATCH', rect.width / 2, rect.height / 2)
    }

    paint()
    const observer = new ResizeObserver(paint)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [clear])

  const erase = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || clear) return
    started.current = true
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    context.save()
    context.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0)
    context.globalCompositeOperation = 'destination-out'
    context.beginPath()
    context.arc(x, y, 22, 0, Math.PI * 2)
    context.fill()
    context.restore()

    const sample = context.getImageData(0, 0, canvas.width, canvas.height).data
    let gone = 0
    const total = sample.length / 4
    for (let index = 3; index < sample.length; index += 16) {
      if ((sample[index] ?? 255) < 24) gone += 1
    }
    if (gone / (total / 4) > 0.45) setClear(true)
  }

  return (
    <div className={`scratch-cover ${clear ? 'clear' : ''}`}>
      {children}
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

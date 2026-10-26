import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

export function VelvetCover({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const started = useRef(false)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
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
      const width = rect.width
      const height = rect.height

      const pile = context.createLinearGradient(0, 0, width, height)
      pile.addColorStop(0, '#8a3144')
      pile.addColorStop(0.42, '#5c1c2c')
      pile.addColorStop(1, '#2a0c14')
      context.fillStyle = pile
      context.fillRect(0, 0, width, height)

      const sheen = context.createRadialGradient(
        width * 0.28,
        height * 0.18,
        0,
        width * 0.35,
        height * 0.4,
        Math.max(width, height) * 0.9,
      )
      sheen.addColorStop(0, 'rgba(244, 196, 206, 0.42)')
      sheen.addColorStop(0.38, 'rgba(176, 72, 92, 0.16)')
      sheen.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = sheen
      context.fillRect(0, 0, width, height)

      const shade = context.createRadialGradient(
        width * 0.8,
        height * 0.9,
        0,
        width * 0.7,
        height * 0.8,
        Math.max(width, height) * 0.7,
      )
      shade.addColorStop(0, 'rgba(18, 4, 8, 0.28)')
      shade.addColorStop(1, 'rgba(18, 4, 8, 0)')
      context.fillStyle = shade
      context.fillRect(0, 0, width, height)

      for (let y = 1; y < height; y += 3) {
        for (let x = 1 + ((y / 3) % 2); x < width; x += 3) {
          const n = (x * 13 + y * 7) % 11
          context.fillStyle = n > 5 ? 'rgba(255, 226, 230, 0.07)' : 'rgba(20, 4, 10, 0.13)'
          context.fillRect(x, y, 1, 1)
        }
      }
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
    const radius = Math.max(14, Math.min(rect.width, rect.height) * 0.34)
    const previous = last.current
    const dx = previous ? x - previous.x : 0
    const dy = previous ? y - previous.y : 0
    const steps = previous ? Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4)) : 1

    context.save()
    context.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0)
    context.globalCompositeOperation = 'destination-out'
    for (let step = 1; step <= steps; step += 1) {
      const px = previous ? previous.x + (dx * step) / steps : x
      const py = previous ? previous.y + (dy * step) / steps : y
      const brush = context.createRadialGradient(px, py, 0, px, py, radius)
      brush.addColorStop(0, 'rgba(0, 0, 0, 0.85)')
      brush.addColorStop(0.45, 'rgba(0, 0, 0, 0.4)')
      brush.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = brush
      context.beginPath()
      context.arc(px, py, radius, 0, Math.PI * 2)
      context.fill()
    }
    context.restore()
    last.current = { x, y }

    const sample = context.getImageData(0, 0, canvas.width, canvas.height).data
    let gone = 0
    let checked = 0
    for (let index = 3; index < sample.length; index += 16) {
      checked += 1
      if ((sample[index] ?? 255) < 24) gone += 1
    }
    if (checked > 0 && gone / checked > 0.72) setClear(true)
  }

  return (
    <div className={`velvet-cover ${className} ${clear ? 'clear' : ''}`}>
      {children}
      {!clear && (
        <canvas
          ref={canvasRef}
          className="velvet-foil"
          aria-hidden="true"
          onPointerDown={(event) => {
            drawing.current = true
            last.current = null
            try {
              event.currentTarget.setPointerCapture(event.pointerId)
            } catch {
              /* capture is optional; the wipe still follows the pointer */
            }
            erase(event)
          }}
          onPointerMove={(event) => {
            if (drawing.current) erase(event)
          }}
          onPointerUp={() => {
            drawing.current = false
            last.current = null
          }}
          onPointerCancel={() => {
            drawing.current = false
            last.current = null
          }}
        />
      )}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

export default function CountUp({ end, duration = 900, className }) {
  const [value, setValue] = useState(0)
  const elRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const node = elRef.current
    if (!node) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setValue(end)
      startedRef.current = true
      return
    }

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        setValue(Math.round(end * easeOutCubic(t)))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [end, duration])

  return (
    <span ref={elRef} className={className}>
      {value}
    </span>
  )
}

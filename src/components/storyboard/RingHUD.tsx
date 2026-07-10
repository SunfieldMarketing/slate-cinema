'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SCENES } from './config'

/*
  The segmented progress ring — the connective HUD chrome carried through
  every beat (the direct callback to animejs.com's hero ring). Four arcs in
  the four real phase colors surround the 3D stage; the active phase's arc
  glows while the others sit dim, and all four light together at the
  closing beat. A dot-trail tracks overall scroll progress around the ring
  — it advances and retreats with the visitor's actual scroll position,
  not a free-running animation.

  Driven imperatively (setActive / setProgress) from the orchestrator's
  timeline onUpdate so scroll scrubbing never causes React re-renders.
*/

export interface RingHUDHandle {
  setActive: (state: number | 'intro' | 'closing') => void
  setProgress: (t: number) => void
}

const R = 88
const CX = 100
const CY = 100
const GAP_DEG = 7

function arcPath(startDeg: number, endDeg: number) {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180
  const x1 = CX + R * Math.cos(rad(startDeg))
  const y1 = CY + R * Math.sin(rad(startDeg))
  const x2 = CX + R * Math.cos(rad(endDeg))
  const y2 = CY + R * Math.sin(rad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const RingHUD = forwardRef<RingHUDHandle, { className?: string }>(function RingHUD({ className }, ref) {
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const orbiterRef = useRef<SVGGElement | null>(null)

  useImperativeHandle(
    ref,
    () => ({
      setActive(state) {
        segRefs.current.forEach((seg, i) => {
          if (!seg) return
          const lit = state === 'closing' ? true : state === 'intro' ? false : i === state
          seg.style.opacity = lit ? '1' : '0.16'
          seg.style.filter = lit ? `drop-shadow(0 0 6px ${SCENES[i].color})` : 'none'
        })
      },
      setProgress(t) {
        const el = orbiterRef.current
        if (!el) return
        el.style.transform = `rotate(${t * 360}deg)`
      },
    }),
    []
  )

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {/* Tick marks — the camera-dial texture */}
      <circle
        cx={CX}
        cy={CY}
        r={R - 8}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="4"
        strokeDasharray="1 5.13"
      />
      <circle cx={CX} cy={CY} r={R - 16} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Four phase segments */}
      {SCENES.map((s, i) => (
        <path
          key={s.title}
          ref={(el) => {
            segRefs.current[i] = el
          }}
          d={arcPath(i * 90 + GAP_DEG / 2, (i + 1) * 90 - GAP_DEG / 2)}
          fill="none"
          stroke={s.color}
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ opacity: 0.16, transition: 'opacity 0.5s, filter 0.5s' }}
        />
      ))}

      {/* Dot-trail tracking overall scroll progress around the ring */}
      <g
        ref={orbiterRef}
        style={{ transformOrigin: `${CX}px ${CY}px`, transform: 'rotate(0deg)', transition: 'transform 0.05s linear' }}
      >
        <circle cx={CX} cy={CY - R} r="2.6" fill="#ffffff" opacity="0.9" />
        <circle cx={CX + 9} cy={CY - R + 0.5} r="1.6" fill="#ffffff" opacity="0.45" />
        <circle cx={CX + 17} cy={CY - R + 1.8} r="1.1" fill="#ffffff" opacity="0.22" />
      </g>
    </svg>
  )
})

export default RingHUD

'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import posthog from 'posthog-js'
import type { ScheduleACallPage } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

export default function CustomCalendar({ copy }: { copy?: ScheduleACallPage['calendar'] }) {
  const containerRef = useRef<HTMLElement>(null)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const dates = [14, 15, 16, 17, 18, 19, 20]
  const times = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']

  const eyebrow = copy?.eyebrow || '// Production Meeting'
  const headline = copy?.headline || 'Lock In A Time'
  const sessionLabel = copy?.sessionLabel || 'Strategy Session'
  const durationLabel = copy?.durationLabel || '45 Min Video Call'
  const monthLabel = copy?.monthLabel || 'OCTOBER 2026'
  const selectDateLabel = copy?.selectDateLabel || 'Select Date'
  const selectTimeLabel = copy?.selectTimeLabel || 'Select Time'
  const confirmLabel = copy?.confirmLabel || 'Confirm Time'
  const confirmedLabel = copy?.confirmedLabel || "You're Booked — We'll Be in Touch"

  // Contact fields only appear once a date+time is picked -- reads as a
  // sequential step (pick a slot, then say who you are) instead of dumping
  // every field on screen before there's anything to book.
  const slotPicked = Boolean(selectedDate && selectedTime)
  const contactValid = name.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && phone.trim().length > 0

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        }
      })

      // Title folds down
      tl.fromTo('.cal-title',
        { rotateX: 90, opacity: 0, transformOrigin: 'top center' },
        { rotateX: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )

      // Calendar board flies in from bottom Z
      tl.fromTo('.cal-board',
        { y: 300, z: -500, rotateX: 45, opacity: 0 },
        { y: 0, z: 0, rotateX: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0.2
      )

      // Dates pop up
      tl.fromTo('.cal-date',
        { y: 50, opacity: 0, scale: 0.5 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.5)' },
        0.5
      )

      // Times slide in
      tl.fromTo('.cal-time',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' },
        0.8
      )
    }, containerRef)
    return () => ctx.revert()
  }, { scope: containerRef })

  // 3D hover tilt on the main board
  const handleBoardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(e.currentTarget, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: 'power2.out' })
  }
  
  const handleBoardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <section ref={containerRef} className="relative w-full pt-10 pb-20 md:pt-14 md:pb-24 overflow-hidden" style={{ perspective: '1500px' }}>
      
      {/* Target reticle decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.03]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="0.2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#fff" strokeWidth="0.2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        
        <div className="cal-title text-center mb-16" style={{ transformStyle: 'preserve-3d' }}>
          <span className="font-mono text-[10px] text-[#00AEEF] tracking-[0.4em] uppercase block mb-4">{eyebrow}</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">{headline}</h2>
        </div>

        {/* The Calendar Board */}
        <div
          className="cal-board rounded-2xl p-8 md:p-12"
          onMouseMove={handleBoardMove}
          onMouseLeave={handleBoardLeave}
          style={{
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10" style={{ transform: 'translateZ(20px)' }}>
            <div>
              <h3 className="text-xl font-bold text-white">{sessionLabel}</h3>
              <p className="text-sm text-white/40 mt-1">{durationLabel}</p>
            </div>
            <div className="font-mono text-sm text-[#00AEEF]">{monthLabel}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ transform: 'translateZ(30px)' }}>
            
            {/* Dates */}
            <div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest mb-6 uppercase">{selectDateLabel}</div>
              <div className="grid grid-cols-7 gap-2">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="text-center font-mono text-[10px] text-white/20 mb-2">{day}</div>
                ))}
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date)
                      posthog.capture('calendar_date_selected', { date })
                    }}
                    className={`cal-date aspect-square min-h-9 min-w-9 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                      selectedDate === date 
                        ? 'bg-[#00AEEF] text-white shadow-[0_0_15px_rgba(0,174,239,0.5)] scale-110' 
                        : 'bg-white/[0.03] text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Times */}
            <div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest mb-6 uppercase">{selectTimeLabel}</div>
              <div className="flex flex-col gap-2">
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time)
                      posthog.capture('calendar_time_selected', { time, date: selectedDate })
                    }}
                    disabled={!selectedDate}
                    className={`cal-time w-full py-3 px-4 rounded-lg text-sm font-mono tracking-wider transition-all duration-300 flex items-center justify-between ${
                      !selectedDate ? 'opacity-30 cursor-not-allowed bg-transparent border border-white/5 text-white/20' :
                      selectedTime === time 
                        ? 'bg-[#00AEEF]/20 border border-[#00AEEF]/50 text-[#00AEEF] shadow-[0_0_20px_rgba(0,174,239,0.2)]'
                        : 'bg-white/[0.03] border border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{time}</span>
                    <span className="text-[10px] text-white/30">EST</span>
                  </button>
                ))}
              </div>

              {/* Contact info — only asked for once a slot is actually picked */}
              {slotPicked && !confirmed && (
                <div className="mt-8 flex flex-col gap-2.5">
                  <div className="font-mono text-[10px] text-white/30 tracking-widest mb-1 uppercase">Your Details</div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00AEEF] transition-colors"
                  />
                </div>
              )}

              {/* Confirm Button */}
              <div className="mt-8">
                <button
                  disabled={!slotPicked || !contactValid || confirmed}
                  onClick={() => {
                    if (selectedDate && selectedTime && contactValid) {
                      posthog.capture('call_booking_confirmed', { date: selectedDate, time: selectedTime })
                      // Real destination (Payload form-submissions, visible in
                      // /admin) — fire-and-forget so a hiccup here can never
                      // block the confirmation state below.
                      fetch('/api/booking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          date: `October ${selectedDate}, 2026`,
                          time: `${selectedTime} EST`,
                          name: name.trim(),
                          email: email.trim(),
                          phone: phone.trim(),
                        }),
                      }).catch(() => {})
                      setConfirmed(true)
                    }
                  }}
                  className={`w-full py-4 rounded-lg font-bold tracking-wide uppercase transition-all duration-500 ${
                    confirmed
                      ? 'bg-[#00AEEF]/20 border border-[#00AEEF]/50 text-[#00AEEF] cursor-default'
                      : slotPicked && contactValid
                      ? 'bg-white text-[#030305] hover:bg-[#00AEEF] hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,174,239,0.4)]'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {confirmed ? confirmedLabel : confirmLabel}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import clsx from 'clsx'

export default function CustomCalendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate fake month dates
  const dates = Array.from({ length: 31 }, (_, i) => i + 1)
  const startOffset = 3 // Shift start of month
  const blanks = Array.from({ length: startOffset }, (_, i) => i)

  const times = ['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']

  return (
    <section id="schedule" className="w-full py-32 bg-[#030305] relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#00AEEF]/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left context */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6">Book a Call</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Schedule a Consult
          </h2>
          <p className="text-[#8E96AA] text-lg lg:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Select a time to talk through your campaign goals, timeline, and what we can create for you.
          </p>

          <div className="hidden lg:block space-y-6">
            <h3 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase">What we&apos;ll cover</h3>
            <ul className="space-y-5 text-[#8E96AA]">
              {['Campaign goals', 'Production needs', 'Timeline & Budget', 'Distribution plan'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="w-8 h-[1px] bg-[#00AEEF]/40 group-hover:w-12 group-hover:bg-[#00AEEF] transition-all duration-300" />
                  <span className="group-hover:text-white transition-colors duration-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Custom Calendar UI */}
        <div className="flex-1 w-full max-w-xl">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-[#00AEEF]/30 to-purple-600/30 rounded-2xl blur-md opacity-50" />
            
            <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8" style={{ background: 'rgba(10,11,14,0.85)' }}>
              
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                <div>
                  <h4 className="text-xl font-bold text-white">Select Date & Time</h4>
                  <p className="text-sm text-[#8E96AA]">May 2026</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white transition-colors">
                    ←
                  </button>
                  <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-mono text-white/30">
                    {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {blanks.map(i => <div key={`blank-${i}`} />)}
                    {dates.map(date => {
                      const isSelected = selectedDate === date
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={clsx(
                            "w-full aspect-square rounded flex items-center justify-center text-sm transition-all duration-200",
                            isSelected 
                              ? "bg-[#00AEEF] text-white font-bold" 
                              : "text-[#8E96AA] hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {date}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="w-full md:w-40 flex flex-col gap-2">
                  <div className="text-xs font-mono text-white/30 text-center mb-1">Available Times</div>
                  {times.map((time, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTime(time)}
                      disabled={!selectedDate}
                      className={clsx(
                        "w-full py-3 rounded-lg text-sm transition-all duration-200 border",
                        !selectedDate ? "opacity-30 cursor-not-allowed border-transparent bg-white/5" :
                        selectedTime === time 
                          ? "bg-[#00AEEF]/20 border-[#00AEEF] text-white font-bold" 
                          : "border-white/10 bg-transparent text-[#8E96AA] hover:bg-white/5 hover:border-white/30 hover:text-white"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                  
                  <button 
                    className={clsx(
                      "w-full py-4 mt-4 rounded-xl font-bold tracking-wide transition-all duration-300",
                      selectedDate && selectedTime 
                        ? "bg-white text-black hover:bg-[#00AEEF] hover:text-white shadow-[0_0_20px_rgba(0,174,239,0.3)]"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    )}
                  >
                    Confirm
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

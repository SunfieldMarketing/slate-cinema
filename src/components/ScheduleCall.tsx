'use client'

export default function ScheduleCall() {
  return (
    <section id="schedule" className="w-full py-32 bg-[#030305] relative overflow-hidden border-t border-white/5">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#00AEEF]/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left side context */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-mono tracking-[0.3em] text-[#00AEEF] uppercase mb-6">Book a Call</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Schedule a Production Consult
          </h2>
          <p className="text-[#8E96AA] text-lg lg:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Book a time to talk through your campaign, content goals, timeline, and what Slate Cinema can create for you.
          </p>

          <div className="hidden lg:block space-y-6">
            <h3 className="text-[11px] font-mono tracking-[0.3em] text-white/40 uppercase">What we&apos;ll cover</h3>
            <ul className="space-y-5 text-[#8E96AA]">
              {['Campaign goals', 'Production needs', 'Timeline & Budget', 'Distribution plan'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="w-8 h-[1px] bg-[#00AEEF]/40 group-hover:w-12 group-hover:bg-[#00AEEF] transition-all duration-300" />
                  <span className="group-hover:text-white transition-colors duration-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right side calendar embed */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-[#00AEEF]/15 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(10,11,14,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="text-[10px] font-mono text-white/20 ml-4 tracking-widest">SLATE CINEMA // SCHEDULE</span>
              </div>
              
              {/* Calendar Embed Container */}
              <div className="bg-white w-full" style={{ minHeight: '600px' }}>
                <iframe
                  src="https://calendly.com/slatecinema/consult"
                  style={{ width: '100%', height: '600px', border: 'none' }}
                  title="Schedule a call with Slate Cinema"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

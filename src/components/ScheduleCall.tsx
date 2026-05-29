'use client'

export default function ScheduleCall() {
  return (
    <section className="w-full py-32 bg-[#030305] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Schedule a Production Consult
          </h2>
          <p className="text-[#8E96AA] text-lg lg:text-xl mb-12 max-w-xl mx-auto lg:mx-0">
            Book a time to talk through your campaign, content goals, timeline, and what Slate Cinema can create for you.
          </p>

          <div className="hidden lg:block space-y-6">
            <h3 className="text-sm font-mono tracking-widest text-white/50 uppercase">What we'll cover</h3>
            <ul className="space-y-4 text-[#8E96AA]">
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />Campaign goals</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />Production needs</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />Timeline & Budget</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />Distribution plan</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <div className="relative perspective-[1000px] group">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#00AEEF]/20 to-transparent rounded-xl blur opacity-50"></div>
            
            {/* 3D Desk Surface Frame / Calendar Embed Container */}
            <div className="relative bg-[#0A0B0E] p-2 sm:p-4 rounded-xl border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="bg-white rounded-lg w-full h-[600px] flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for Calendar embed */}
                <div className="text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="font-medium text-gray-500">Calendar Widget Target</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

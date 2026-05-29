'use client'

import dynamic from 'next/dynamic'

const Journey3D = dynamic(() => import("@/components/Journey3D"), { ssr: false })

export default function Home() {
  return (
    <main className="bg-[#030305] text-white selection:bg-[#00AEEF] selection:text-white relative w-full h-screen overflow-hidden">
      <Journey3D />
    </main>
  );
}

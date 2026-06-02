import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { X } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

export interface GalleryItem {
  title: string;
  category: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
  };
  metrics?: { label: string; value: string }[];
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.05, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleRef = (el: HTMLDivElement) => {
      containerRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    // Scroll rotation
    useEffect(() => {
      const handleScroll = () => {
        if (activeIndex !== null) return; // Pause scroll rotation if a card is open

        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 1080; 
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, [activeIndex]);

    // Auto-rotation
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && activeIndex === null) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, autoRotateSpeed, activeIndex]);

    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={handleRef}
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: '2500px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: isScrolling ? 'none' : 'transform 0.1s linear',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.1, 1 - (normalizedAngle / 180));

            const isActive = activeIndex === i;

            return (
              <div
                key={i} 
                onClick={() => setActiveIndex(isActive ? null : i)}
                className={cn(
                  "absolute transition-all duration-700 cursor-pointer",
                  isActive ? "z-50" : "z-10"
                )}
                style={
                  isActive 
                  ? {
                      // Break out of the 3D space to fill the center of the screen
                      transform: `rotateY(${-rotation}deg) translateZ(300px) scale(1.4)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-175px', // half of width
                      marginTop: '-275px', // half of height
                      opacity: 1,
                    }
                  : {
                      transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-140px', // Base size (280px width)
                      marginTop: '-225px', // Base size (450px height)
                      opacity: opacity,
                    }
                }
              >
                {/* 16:9 vertical (approx 280x450) */}
                <div className="relative w-[280px] h-[450px] rounded-3xl shadow-[0_0_50px_rgba(0,174,239,0.1)] overflow-visible group border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-[#00AEEF]/50">
                  
                  {/* Close button if active */}
                  {isActive && (
                    <button 
                      className="absolute -top-4 -right-4 bg-black/80 border border-white/20 rounded-full p-2 text-white z-50 hover:bg-[#00AEEF] transition-colors"
                      onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
                    >
                      <X size={20} />
                    </button>
                  )}

                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ objectPosition: item.photo.pos || 'center' }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-white transition-opacity duration-300">
                      <span className="font-mono text-xs tracking-widest text-[#00AEEF] uppercase mb-2">
                        {item.category}
                      </span>
                      <h2 className="text-3xl font-bold tracking-tight mb-2">{item.title}</h2>
                      
                      {/* Sub-description that only appears when active */}
                      <div className={cn("overflow-hidden transition-all duration-500", isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                         <p className="text-sm text-white/70 leading-relaxed font-light mt-2">
                            A highly curated premium project demonstrating our unwavering standard in {item.category.toLowerCase()}. Execution is everything.
                         </p>
                      </div>
                    </div>
                  </div>

                  {/* External floating metrics display */}
                  {item.metrics && (
                    <div className={cn(
                      "absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-3 transition-all duration-700",
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                    )}>
                      {item.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-black/80 border border-white/10 backdrop-blur-md rounded-xl p-4 w-32 shadow-[0_0_20px_rgba(0,174,239,0.2)]">
                          <span className="block text-xs font-mono text-[#00AEEF] uppercase tracking-wider mb-1">{metric.label}</span>
                          <span className="block text-xl font-bold text-white">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* Global Dark Overlay when a card is active to focus attention */}
        <div 
          className={cn(
            "fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-700 pointer-events-none",
            activeIndex !== null ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };

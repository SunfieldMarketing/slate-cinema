import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { X } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

export interface GalleryItem {
  title: string;
  category: string;
  company?: string;
  typeOfWork?: string;
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
    const [isDragging, setIsDragging] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Drag state
    const dragStartX = useRef(0);
    const dragStartRotation = useRef(0);
    const hasDragged = useRef(false);

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
        if (activeIndex !== null || isDragging) return;  

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
    }, [activeIndex, isDragging]);

    // Auto-rotation
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isDragging && activeIndex === null) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [isScrolling, isDragging, autoRotateSpeed, activeIndex]);

    // Drag handlers
    const handlePointerDown = (e: React.PointerEvent) => {
      if (activeIndex !== null) return;
      dragStartX.current = e.clientX;
      dragStartRotation.current = rotation;
      hasDragged.current = false;
      setIsDragging(true);
      // Removed setPointerCapture to allow clicks to bubble
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (activeIndex !== null || !isDragging) return;
      const deltaX = e.clientX - dragStartX.current;
      if (Math.abs(deltaX) > 5) {
        hasDragged.current = true;
      }
      setRotation(dragStartRotation.current + deltaX * 0.2); 
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      // Removed releasePointerCapture
    };

    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={handleRef}
        className={cn("relative w-full h-full flex items-center justify-center", className, isDragging ? "cursor-grabbing" : "cursor-grab")}
        style={{ perspective: '2500px', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...props}
      >
        <div
          className="relative w-full h-full pointer-events-none"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: (isScrolling || isDragging) ? 'none' : 'transform 0.1s linear',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const isActive = activeIndex === i;
            const opacity = isActive ? 1 : (activeIndex !== null ? 0.02 : Math.max(0.1, 1 - (normalizedAngle / 180)));
            const filterBlur = isActive ? 'none' : (activeIndex !== null ? 'blur(10px)' : 'none');

            return (
              <div
                key={i} 
                onClick={() => {
                  if (!hasDragged.current) {
                    setActiveIndex(isActive ? null : i);
                  }
                }}
                className={cn(
                  "absolute transition-all duration-700 pointer-events-auto",
                  isActive ? "z-50 cursor-default" : "z-10 cursor-pointer"
                )}
                style={
                  isActive 
                  ? {
                      // Break out of the 3D space to fill the center of the screen
                      transform: `rotateY(${-rotation}deg) translateZ(300px) scale(1.6)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-110px', // Base size (220px width)
                      marginTop: '-175px', // Base size (350px height)
                      opacity: 1,
                    }
                  : {
                      transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-110px', 
                      marginTop: '-175px', 
                      opacity: opacity,
                      filter: filterBlur,
                    }
                }
              >
                {/* 16:9 vertical (approx 220x350) */}
                <div className="relative w-[220px] h-[350px] rounded-2xl shadow-[0_0_50px_rgba(0,174,239,0.1)] overflow-visible group border border-white/10 bg-black backdrop-blur-xl transition-all duration-500 hover:border-[#00AEEF]/50">
                  
                  {/* Close button if active */}
                  {isActive && (
                    <button 
                      className="absolute -top-6 -right-6 bg-black border border-white/20 rounded-full p-2 text-white z-[60] hover:bg-[#00AEEF] transition-colors cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
                    >
                      <X size={20} />
                    </button>
                  )}

                  <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#030305]">
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
                        !isActive && "group-hover:scale-110"
                      )}
                      style={{ objectPosition: item.photo.pos || 'center' }}
                    />
                    {/* Dark gradient overlay - Solidified for clearer text reading */}
                    <div className={cn(
                      "absolute inset-0 flex flex-col justify-end p-6 text-white transition-all duration-300",
                      isActive ? "bg-gradient-to-t from-black via-black/70 to-black/20" : "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    )}>
                      <span className="font-mono text-[10px] tracking-widest text-[#00AEEF] uppercase mb-1">
                        {item.category}
                      </span>
                      <h2 className="text-xl font-bold tracking-tight mb-2 drop-shadow-md">{item.title}</h2>
                      
                      {/* Sub-description that only appears when active */}
                      <div className={cn("overflow-hidden transition-all duration-500 flex flex-col gap-2", isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                         {item.company && (
                           <p className="text-xs text-white/80"><strong className="text-white">Company:</strong> {item.company}</p>
                         )}
                         {item.typeOfWork && (
                           <p className="text-xs text-white/80"><strong className="text-white">Type of Work:</strong> {item.typeOfWork}</p>
                         )}
                         <p className="text-[10px] text-white/90 leading-relaxed font-light mt-1 drop-shadow-sm">
                            A highly curated premium project demonstrating our unwavering standard in {item.category.toLowerCase()}. Execution is everything.
                         </p>
                      </div>
                    </div>
                  </div>

                  {/* External floating metrics display */}
                  {item.metrics && (
                    <div className={cn(
                      "absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col gap-3 transition-all duration-700",
                      isActive ? "opacity-100 translate-x-0 delay-300" : "opacity-0 -translate-x-10 pointer-events-none"
                    )}>
                      {item.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-black/90 border border-white/20 backdrop-blur-xl rounded-xl p-3 w-28 shadow-[0_0_20px_rgba(0,174,239,0.2)] transform hover:scale-105 transition-transform">
                          <span className="block text-[9px] font-mono text-[#00AEEF] uppercase tracking-wider mb-1">{metric.label}</span>
                          <span className="block text-lg font-bold text-white">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };

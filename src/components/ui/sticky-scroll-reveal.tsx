"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform, useSpring, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    color?: string;
    content?: React.ReactNode | any;
    /** Click-to-edit field paths (see LivePreviewClickToEdit.tsx) for this
        item's title/description -- optional so callers without a CMS-backed
        source for this content can omit them with no effect; React drops a
        data-* attribute entirely when its value is undefined. */
    titleFieldPath?: string;
    descriptionFieldPath?: string;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);

  // Driven by real page scroll (not an internal overflow container) so this
  // section pins the same way every other scroll-jacked section on the site
  // does, instead of behaving like a nested-scroll widget.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const cardLength = content.length;

  useEffect(() => {
    const measure = () => {
      const textH = textColRef.current?.offsetHeight ?? 0;
      const panelH = panelRef.current?.offsetHeight ?? 0;
      setTrackHeight(Math.max(0, textH - panelH));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [content.length]);

  // The panel drifts down the track as you scroll, roughly tracking whichever
  // option is active, instead of sitting rigidly at a fixed offset the whole
  // time — smoothed so it reads as a natural drift, not a snap.
  const rawY = useTransform(scrollYProgress, [0, 1], [0, trackHeight]);
  const y = useSpring(rawY, { stiffness: 120, damping: 30, mass: 0.5 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const activeColor = content[activeCard]?.color ?? "#00AEEF";

  return (
    <div
      className="relative flex flex-col lg:flex-row justify-center gap-10 lg:gap-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 lg:p-14"
      ref={ref}
    >
      <div className="relative flex items-start px-0 lg:px-4">
        <div className="max-w-xl" ref={textColRef}>
          {content.map((item, index) => (
            <div key={item.title + index} className="my-44 sm:my-56 first:mt-0">
              <motion.h2
                data-cms-field={item.titleFieldPath}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              >
                {item.title}
              </motion.h2>
              <motion.p
                data-cms-field={item.descriptionFieldPath}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="mt-4 max-w-sm text-white/60 font-light leading-relaxed"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-20" />
        </div>
      </div>
      <motion.div
        ref={panelRef}
        style={{ borderColor: `${activeColor}40`, boxShadow: `0 0 60px ${activeColor}1A`, y }}
        className={cn(
          "sticky top-32 hidden h-[26rem] w-full lg:w-[26rem] overflow-hidden rounded-2xl border bg-ink transition-colors duration-500 lg:block shrink-0",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </div>
  );
};

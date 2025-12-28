"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Image from "next/image";

interface HeroSectionProps {
  children: ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
      }}
      className="relative w-full h-screen flex items-center py-16 md:py-24 lg:py-32"
    >
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/vladivostok.avif"
          alt="Vladivostok background"
          fill
          className="object-cover opacity-10"
          priority
          quality={90}
        />
        {/* Gradient overlay - white at top, transparent at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/5 to-transparent" />
      </div>

      {/* Content - Containerized */}
      <div className="containerize relative z-10 w-full">{children}</div>
    </motion.section>
  );
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h1
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
    >
      {children}
    </motion.h1>
  );
}

export function HeroSubtitle({ children }: { children: ReactNode }) {
  return (
    <motion.p
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className="mb-10 text-lg text-muted-foreground md:text-xl"
    >
      {children}
    </motion.p>
  );
}

export function HeroButtons({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className="flex flex-col items-center justify-center gap-4 sm:flex-row"
    >
      {children}
    </motion.div>
  );
}

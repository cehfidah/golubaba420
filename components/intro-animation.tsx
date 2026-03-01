"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Database, Radar, ShieldCheck, Lock, Zap, Eye } from "lucide-react";

type IntroAnimationProps = {
  onComplete: () => void;
};

const TITLE = "GOLU BABA SURVEILLANCE INTELLIGENCE SYSTEM";
const HACKER_EMOJIS = ["🎩", "⚡", "🔐", "👁️"];

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [typedLength, setTypedLength] = useState(0);
  const [stage, setStage] = useState(0);
  const [activeEmoji, setActiveEmoji] = useState(0);
  const [mounted, setMounted] = useState(false);

  const titleText = useMemo(() => TITLE.slice(0, typedLength), [typedLength]);

  // Generate particles with stable random positions
  const particles = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4 + Math.random() * 3,
        yOffset: -100,
        xOffset: Math.random() * 60 - 30,
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const typeTimer = window.setInterval(() => {
      setTypedLength((prev) => {
        if (prev >= TITLE.length) {
          window.clearInterval(typeTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 35);

    const emojiTimer = window.setInterval(() => {
      setActiveEmoji((prev) => (prev + 1) % HACKER_EMOJIS.length);
    }, 400);

    const stageTimers = [
      window.setTimeout(() => setStage(1), 800),
      window.setTimeout(() => setStage(2), 1500),
      window.setTimeout(() => setStage(3), 2200),
      window.setTimeout(() => setStage(4), 3100),
      window.setTimeout(() => setStage(5), 4200),
      window.setTimeout(() => onComplete(), 5200),
    ];

    return () => {
      window.clearInterval(typeTimer);
      window.clearInterval(emojiTimer);
      stageTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gradient-to-br from-background via-background to-primary/5"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-full w-full bg-[repeating-linear-gradient(0deg,hsl(var(--primary)/0.1)_0px,hsl(var(--primary)/0.1)_1px,transparent_1px,transparent_4px),repeating-linear-gradient(90deg,hsl(var(--primary)/0.05)_0px,hsl(var(--primary)/0.05)_1px,transparent_1px,transparent_4px)]" />
        </motion.div>

        {/* Radar rings */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute left-1/2 top-1/2 rounded-full border border-primary/20 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 100 + i * 150,
              height: 100 + i * 150,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating data particles */}
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute h-1 w-1 rounded-full bg-accent"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, particle.yOffset, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center px-4 gap-8">
        {/* Hacker emoji animation */}
        <motion.div
          className="text-7xl md:text-9xl font-bold"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        >
          {HACKER_EMOJIS[activeEmoji]}
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-4xl"
        >
          {/* Header with security badge */}
          <div className="rounded-t-2xl border border-border border-b-0 bg-card/80 backdrop-blur-xl p-4 md:p-6 flex items-center justify-between gap-4">
            <motion.div
              className="flex items-center gap-3"
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="h-3 w-3 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                ⚡ CLASSIFIED INTELLIGENCE MATRIX ⚡
              </span>
            </motion.div>
            <div className="hidden md:flex items-center gap-2 text-primary/60">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-mono">ENCRYPTED</span>
            </div>
          </div>

          {/* System info display */}
          <div className="border border-t-0 border-border bg-card/60 backdrop-blur-xl p-6 md:p-8 rounded-b-2xl space-y-6 shadow-2xl">
            {/* Title with glitch effect */}
            <motion.div className="space-y-3">
              <motion.div
                className="text-2xl md:text-5xl font-black text-foreground tracking-tight leading-snug min-h-[5rem] md:min-h-[7rem] font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  className="relative inline-block"
                  animate={{ textShadow: ["0 0 0px rgb(59, 130, 246)", "0 0 20px rgb(59, 130, 246)", "0 0 0px rgb(59, 130, 246)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {titleText}
                </motion.span>
                <motion.span
                  className="inline-block ml-2 text-primary"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                >
                  ▌
                </motion.span>
              </motion.div>
              <motion.p
                className="text-xs md:text-sm text-muted-foreground tracking-widest uppercase font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                &gt; Initializing highest clearance protocol...
              </motion.p>
            </motion.div>

            {/* System status grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <BootStatusCard
                icon={<Radar className="h-4 w-4" />}
                label="SIGNAL LOCK"
                status={stage >= 1 ? "ENGAGED" : "SCANNING"}
                active={stage >= 1}
              />
              <BootStatusCard
                icon={<Database className="h-4 w-4" />}
                label="DATA CORE"
                status={stage >= 2 ? "MOUNTED" : "SYNC"}
                active={stage >= 2}
              />
              <BootStatusCard
                icon={<ShieldCheck className="h-4 w-4" />}
                label="SECURITY"
                status={stage >= 3 ? "VERIFIED" : "AUTH"}
                active={stage >= 3}
              />
              <BootStatusCard
                icon={<Eye className="h-4 w-4" />}
                label="ACCESS"
                status={stage >= 4 ? "GRANTED" : "PENDING"}
                active={stage >= 4}
              />
            </div>

            {/* Real-time boot log */}
            <motion.div
              className="rounded-lg border border-primary/20 bg-black/20 p-4 space-y-1.5 font-mono text-xs md:text-sm backdrop-blur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BootLogLine done={stage >= 1} delay={0} text="[SYS] Deploying counter-intelligence measures..." />
              <BootLogLine done={stage >= 2} delay={0.7} text="[NET] Establishing secure VPN tunnel..." />
              <BootLogLine done={stage >= 3} delay={1.4} text="[AUTH] Cross-verifying operator credentials..." />
              <BootLogLine done={stage >= 4} delay={2.1} text="[CORE] Linking to global intelligence network..." />
              <BootLogLine done={stage >= 5} delay={2.8} text="[READY] All systems nominal. Console online." />
            </motion.div>

            {/* System readiness bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>» SYSTEM INITIALIZATION PROGRESS</span>
                <span className="text-primary font-semibold">
                  {stage >= 5 ? "100%" : `${Math.min(stage * 20, 100)}%`}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary/40 overflow-hidden border border-primary/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
                  animate={{
                    width: stage >= 5 ? "100%" : `${Math.min(stage * 20, 100)}%`,
                    backgroundPosition: ["0% center", "100% center"],
                  }}
                  transition={{
                    width: { duration: 0.6, ease: "easeInOut" },
                    backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
                  }}
                />
              </div>
            </motion.div>

            {/* Footer with timestamp */}
            <motion.div
              className="pt-4 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span>GOLU BABA INTELLIGENCE DIVISION • HIGHLY CLASSIFIED</span>
              <span>Version 2.0 APEX</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom security info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground font-mono max-w-2xl"
        >
          <p className="mb-1">⚠ BIOMETRIC SCANNING ENABLED • LOCATION TRACKING ACTIVE ⚠</p>
          <p className="text-primary/60">All activity is monitored and recorded by federal agencies.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

type BootStatusCardProps = {
  icon: ReactNode;
  label: string;
  status: string;
  active: boolean;
};

function BootStatusCard({ icon, label, status, active }: BootStatusCardProps) {
  return (
    <motion.div
      className={`rounded-lg border p-3 text-center ${
        active ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5" : "border-border/50 bg-card/30"
      }`}
      animate={{
        opacity: active ? 1 : 0.5,
        scale: active ? 1 : 0.95,
        boxShadow: active ? "0 0 20px rgba(59, 130, 246, 0.2)" : "none",
      }}
      transition={{ duration: 0.4 }}
    >
      <div className={`text-2xl mb-1 ${active ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
      <div className="text-xs tracking-wider uppercase font-mono leading-tight mb-1">
        {label}
      </div>
      <div
        className={`text-sm font-bold tracking-widest ${
          active ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {status}
      </div>
    </motion.div>
  );
}

type BootLogLineProps = {
  text: string;
  done: boolean;
  delay: number;
};

function BootLogLine({ text, done, delay }: BootLogLineProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.p
      className={`transition-colors ${done ? "text-primary" : showText ? "text-muted-foreground" : "text-transparent"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {text}
      {showText && !done && (
        <motion.span
          className="inline-block ml-1 text-accent"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ▌
        </motion.span>
      )}
    </motion.p>
  );
}


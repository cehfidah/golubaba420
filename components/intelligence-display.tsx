"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/typewriter-text";
import { Wifi, MapPin, Smartphone, Code2, Shield, ArrowRight, ArrowLeft, AlertTriangle, Zap } from "lucide-react";

interface IntelligenceDisplayProps {
  onClose?: () => void;
  showNavigationButtons?: boolean;
  isFlow?: boolean;
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf("Firefox") > -1) return "Mozilla Firefox";
  if (ua.indexOf("Chrome") > -1) return "Google Chrome";
  if (ua.indexOf("Safari") > -1) return "Apple Safari";
  if (ua.indexOf("Edge") > -1) return "Microsoft Edge";
  return "Unknown Browser";
}

function getOSInfo(): string {
  const ua = navigator.userAgent;
  if (ua.indexOf("Win") > -1) return "Windows OS";
  if (ua.indexOf("Mac") > -1) return "macOS";
  if (ua.indexOf("Linux") > -1) return "Linux";
  if (ua.indexOf("Android") > -1) return "Android OS";
  if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) return "iOS";
  return "Unknown OS";
}

function generateFingerprint(): string {
  const data = `${navigator.userAgent}${navigator.language}${screen.width}x${screen.height}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return Math.abs(hash).toString(16).substring(0, 16).toUpperCase();
}

export function IntelligenceDisplay({
  onClose,
  showNavigationButtons = false,
  isFlow = false,
}: IntelligenceDisplayProps) {
  const [deviceInfo, setDeviceInfo] = useState({
    ip: "Scanning...",
    country: "Detecting...",
    city: "Locating...",
    browser: "Analyzing...",
    os: "Reading...",
    fingerprint: "Generating...",
    screenRes: "Loading...",
    timezone: "Calibrating...",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchDeviceInfo = async () => {
      try {
        const info = {
          browser: getBrowserInfo(),
          os: getOSInfo(),
          screenRes: `${window.innerWidth}x${window.innerHeight}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          fingerprint: generateFingerprint(),
        };

        try {
          const geoResponse = await fetch("https://ipapi.co/json/", {
            signal: AbortSignal.timeout(3000),
          });
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            setDeviceInfo((prev) => ({
              ...prev,
              ip: geoData.ip || "Unknown",
              country: geoData.country_name || "Unknown",
              city: geoData.city || "Unknown",
              ...info,
            }));
          } else {
            setDeviceInfo((prev) => ({ ...prev, ...info }));
          }
        } catch {
          setDeviceInfo((prev) => ({ ...prev, ...info }));
        }
      } catch (error) {
        console.warn("Failed to fetch device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  if (!mounted) return null;

  const intelRows = [
    {
      icon: Wifi,
      label: "IP Address",
      value: deviceInfo.ip,
      delay: 0,
    },
    {
      icon: MapPin,
      label: "Geo Location",
      value: `${deviceInfo.city}, ${deviceInfo.country}`,
      delay: 200,
    },
    {
      icon: Smartphone,
      label: "Operating System",
      value: deviceInfo.os,
      delay: 400,
    },
    {
      icon: Smartphone,
      label: "Browser",
      value: deviceInfo.browser,
      delay: 600,
    },
    {
      icon: Code2,
      label: "Screen Resolution",
      value: deviceInfo.screenRes,
      delay: 800,
    },
    {
      icon: Code2,
      label: "Timezone",
      value: deviceInfo.timezone,
      delay: 1000,
    },
    {
      icon: Code2,
      label: "Device Fingerprint",
      value: deviceInfo.fingerprint,
      delay: 1200,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.03, 0.1, 0.03] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="h-full w-full bg-[repeating-linear-gradient(0deg,hsl(var(--primary)/0.08)_0px,hsl(var(--primary)/0.08)_1px,transparent_1px,transparent_4px)]" />
        </motion.div>

        {/* Floating threat indicators */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`threat-${i}`}
            className="absolute h-1 w-1 rounded-full bg-destructive/40"
            style={{
              left: `${10 + i * 18}%`,
              top: `${15 + i * 12}%`,
            }}
            animate={{
              y: [0, 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="border-b border-border/50 bg-gradient-to-r from-card/80 to-primary/5 backdrop-blur-xl sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              className="flex items-center gap-3"
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  DEVICE ATTRIBUTION REPORT
                </h1>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  Real-time Security Intelligence
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-destructive/30 bg-destructive/10"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs font-mono text-destructive font-semibold">TRACKING ACTIVE</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 relative z-10">
        {/* Security alert banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-start gap-4 p-4 rounded-lg border border-destructive/40 bg-gradient-to-r from-destructive/10 to-destructive/5 backdrop-blur"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-bold text-destructive mb-1">⚠ CRITICAL SECURITY ALERT</p>
            <p className="text-xs text-destructive/80 font-mono">
              Device biometrics have been captured, logged, and indexed in central surveillance database. 
              This fingerprint can be used to track and identify this system across all connected networks.
            </p>
          </div>
        </motion.div>

        {/* Intel rows grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {intelRows.map((row, index) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: row.delay / 1000, duration: 0.6 }}
                className="group"
              >
                <motion.div
                  className="flex items-start gap-4 p-5 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 hover:border-primary/40 transition-colors backdrop-blur relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.3)",
                    }}
                  />

                  <Icon className="h-6 w-6 text-primary shrink-0 mt-1 relative z-10" />
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-2 font-mono">
                      <TypewriterText text={row.label} speed={60} delay={row.delay} />
                    </div>
                    <div className="text-sm md:text-base font-mono text-foreground break-all font-bold">
                      <TypewriterText
                        text={row.value}
                        speed={30}
                        delay={row.delay + 400}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="mt-8 rounded-lg border border-border/30 bg-card/30 backdrop-blur p-6 font-mono text-xs text-muted-foreground"
        >
          <p className="mb-2 text-foreground font-bold">» SYSTEM NOTICE</p>
          <p>
            Device fingerprint has been successfully captured and indexed in GOLU BABA intelligence network.
            This information will be used for continuous surveillance and cross-reference analysis with all
            federal and international intelligence agencies.
          </p>
        </motion.div>
      </div>

      {/* Footer navigation */}
      {showNavigationButtons && (
        <div className="border-t border-border/50 bg-gradient-to-r from-card/80 to-primary/5 backdrop-blur-xl sticky bottom-0">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center">
            {isFlow && onClose && (
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:border-primary hover:from-primary/20 hover:to-primary/10 transition-all"
              >
                <span>Proceed to Search Console</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
            {!isFlow && (
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Search</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

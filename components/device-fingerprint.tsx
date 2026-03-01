"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smartphone, Wifi, MapPin, Code2, Shield } from "lucide-react";

export function DeviceFingerprint() {
  const [deviceInfo, setDeviceInfo] = useState({
    ip: "Loading...",
    country: "Detecting...",
    city: "Locating...",
    browser: "Scanning...",
    os: "Analyzing...",
    fingerprint: "Generating...",
    screenRes: "Reading...",
    timezone: "Calibrating...",
  });

  useEffect(() => {
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
        console.error("Failed to fetch device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  return (
    <motion.div
      className="rounded-lg border border-primary/30 bg-card/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Device Fingerprint Intel Feed
        </span>
      </div>

      <div className="space-y-2.5 text-xs font-mono">
        <InfoRow icon={<Wifi className="h-3.5 w-3.5" />} label="IP Address" value={deviceInfo.ip} />
        <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Geo Location" value={`${deviceInfo.city}, ${deviceInfo.country}`} />
        <InfoRow icon={<Smartphone className="h-3.5 w-3.5" />} label="Device OS" value={deviceInfo.os} />
        <InfoRow icon={<Smartphone className="h-3.5 w-3.5" />} label="Browser" value={deviceInfo.browser} />
        <InfoRow icon={<Code2 className="h-3.5 w-3.5" />} label="Screen" value={deviceInfo.screenRes} />
        <InfoRow icon={<Code2 className="h-3.5 w-3.5" />} label="Timezone" value={deviceInfo.timezone} />
        <InfoRow
          icon={<Code2 className="h-3.5 w-3.5" />}
          label="Fingerprint"
          value={deviceInfo.fingerprint}
          mono
        />
      </div>

      <div className="mt-3 pt-3 border-t border-primary/20">
        <p className="text-[10px] text-muted-foreground">
          ⚠ Device signature logged and indexed in surveillance database.
        </p>
      </div>
    </motion.div>
  );
}

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
};

function InfoRow({ icon, label, value, mono = false }: InfoRowProps) {
  return (
    <div className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors group">
      <span className="text-primary/60 group-hover:text-primary transition-colors">{icon}</span>
      <span className="min-w-20 text-primary/70">{label}:</span>
      <span className={`text-foreground break-all ${mono ? "font-mono text-[9px]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Chromium")) {
    return "Google Chrome";
  }
  if (ua.includes("Firefox")) {
    return "Mozilla Firefox";
  }
  if (ua.includes("Safari") && !ua.includes("Chrome")) {
    return "Apple Safari";
  }
  if (ua.includes("Edge")) {
    return "Microsoft Edge";
  }
  if (ua.includes("Opera")) {
    return "Opera";
  }
  return "Unknown Browser";
}

function getOSInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows OS";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown OS";
}

function generateFingerprint(): string {
  const ua = navigator.userAgent;
  const screen = `${window.innerWidth}x${window.innerHeight}`;
  const lang = navigator.language;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const combined = `${ua}${screen}${lang}${tz}`;

  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16).padStart(16, "0");
}

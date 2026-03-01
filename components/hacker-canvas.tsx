"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HackerCanvasProps {
  onComplete: () => void;
}

export function HackerCanvas({ onComplete }: HackerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<HTMLCanvasElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const canvasBars = barsRef.current;
    const consoleEl = consoleRef.current;

    if (!canvas || !canvasBars || !consoleEl) return;

    const ctx = canvas.getContext("2d");
    const ctxBars = canvasBars.getContext("2d");

    if (!ctx || !ctxBars) return;

    // Store non-null instances for class access
    const _canvas = canvas;
    const _ctx = ctx;
    const _canvasBars = canvasBars;
    const _ctxBars = ctxBars;

    // Set canvas dimensions
    const updateDimensions = () => {
      _canvas.width = (window.innerWidth / 3) * 2;
      _canvas.height = window.innerHeight / 2.5;
      _canvasBars.width = window.innerWidth / 3;
      _canvasBars.height = _canvas.height;
    };

    updateDimensions();

    // 3D Point class - defined inside useEffect with access to canvas
    class Point {
      x: number;
      y: number;
      z: number;
      xPos: number;
      yPos: number;

      constructor(pos: { x: number; y: number; z: number }) {
        this.x = pos.x - _canvas.width / 2;
        this.y = pos.y - _canvas.height / 2;
        this.z = pos.z;
        this.xPos = 0;
        this.yPos = 0;
        this.map2D();
      }

      rotateZ(angleZ: number) {
        const cosZ = Math.cos(angleZ);
        const sinZ = Math.sin(angleZ);
        const x1 = this.x * cosZ - this.y * sinZ;
        const y1 = this.y * cosZ + this.x * sinZ;
        this.x = x1;
        this.y = y1;
      }

      map2D() {
        const focal = _canvas.width / 2;
        const scaleX = focal / (focal + this.z);
        const scaleY = focal / (focal + this.z);
        this.xPos = _canvas.width / 2 + this.x * scaleX;
        this.yPos = _canvas.height / 2 + this.y * scaleY;
      }
    }

    // 3D Square class - defined inside useEffect with access to canvas and ctx
    class Square {
      width: number;
      height: number;
      points: Point[];
      dist: number;

      constructor(z: number) {
        this.width = _canvas.width / 2;
        this.height = _canvas.height;
        this.points = [
          new Point({
            x: _canvas.width / 2 - this.width,
            y: _canvas.height / 2 - this.height,
            z,
          }),
          new Point({
            x: _canvas.width / 2 + this.width,
            y: _canvas.height / 2 - this.height,
            z,
          }),
          new Point({
            x: _canvas.width / 2 + this.width,
            y: _canvas.height / 2 + this.height,
            z,
          }),
          new Point({
            x: _canvas.width / 2 - this.width,
            y: _canvas.height / 2 + this.height,
            z,
          }),
        ];
        this.dist = 0;
      }

      update() {
        for (const point of this.points) {
          point.rotateZ(0.002);
          point.z -= 4;
          if (point.z < -300) {
            point.z = 2700;
          }
          point.map2D();
        }
      }

      render() {
        _ctx.beginPath();
        _ctx.moveTo(this.points[0].xPos, this.points[0].yPos);
        for (let p = 1; p < this.points.length; p++) {
          _ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
        }
        _ctx.closePath();
        _ctx.stroke();
        this.dist = this.points[this.points.length - 1].z;
      }
    }

    // Initialize squares
    const squares: Square[] = [];
    for (let i = 0; i < 15; i++) {
      squares.push(new Square(-300 + i * 200));
    }

    // Bar values for waveform
    const barVals: Array<{
      val: number;
      freq: number;
      sineVal: number;
    }> = [];

    // Console output data
    const commandStart = [
      "› Initiating GOLU BABA Intelligence Protocol...",
      "› Performing DNS Lookups for",
      "› Analyzing Surveillance Network",
      "› Estimating Geolocation of",
      "› Requesting Authorization From:",
      "› Establishing Encrypted Tunnel to",
      "› Downloading Intelligence Records from",
      "› Compiling Target Data Structures",
      "› Entering Deep Web Portal",
      "› Breaching Security Firewall",
    ];

    const commandParts = [
      "192.168.0.1:8080/classified",
      "https://intel.darknet.onion",
      "Federal Database XK-9",
      "Surveillance Node Alpha-7",
      "Global Intelligence Matrix",
      "Target Profile Database",
      "Encrypted Communication Channel",
    ];

    const commandResponses = [
      "✓ Authorization Granted",
      "✓ Access Verified",
      "✓ Firewall Bypassed",
      "✓ Data Extraction Complete",
      "✓ Encryption Decoded",
      "✓ Target Located",
      "→ Entering Surveillance Mode",
      "→ Syncing Intelligence Feeds",
      "⚠ Waiting for secure response...",
      "⚠ Bypassing security protocols...",
      "⚡ Rapid data transfer initiated",
    ];

    let isProcessing = false;
    let processTime = 0;
    let lastProcess = 0;

    // Render loop for 3D tunnel and bars
    function renderCanvas() {
      // Clear and render 3D tunnel
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
      squares.sort((a, b) => b.dist - a.dist);
      for (const square of squares) {
        square.update();
        square.render();
      }

      // Clear and render bar graph
      _ctxBars.clearRect(0, 0, _canvasBars.width, _canvasBars.height);

      // Top waveform line
      _ctxBars.beginPath();
      const y = _canvasBars.height / 6;
      _ctxBars.moveTo(0, y);
      for (let i = 0; i < _canvasBars.width; i++) {
        const ran = Math.random() * 20 - 10;
        _ctxBars.lineTo(i, y + ran);
      }
      _ctxBars.stroke();

      // Animated bars
      for (let i = 0; i < _canvasBars.width; i += 20) {
        if (!barVals[i]) {
          barVals[i] = {
            val: Math.random() * (_canvasBars.height / 2),
            freq: 0.1,
            sineVal: Math.random() * 100,
          };
        }
        barVals[i].sineVal += barVals[i].freq;
        barVals[i].val +=
          Math.sin((barVals[i].sineVal * Math.PI) / 2) * 5;
        _ctxBars.fillRect(
          i + 5,
          _canvasBars.height,
          15,
          -barVals[i].val
        );
      }

      animationId = requestAnimationFrame(renderCanvas);
    }

    // Console output function
    function addConsoleOutput() {
      if (!consoleEl) return;

      const textEl = document.createElement("p");
      textEl.className = "console-line";

      if (isProcessing) {
        const span = document.createElement("span");
        span.textContent = `[${Math.random().toFixed(8)}] Processing...`;
        textEl.appendChild(span);
        if (Date.now() > lastProcess + processTime) {
          isProcessing = false;
        }
      } else {
        const commandType = Math.floor(Math.random() * 4);
        if (commandType === 3) {
          isProcessing = true;
          processTime = Math.floor(Math.random() * 3000);
          lastProcess = Date.now();
          textEl.textContent = `${
            commandStart[Math.floor(Math.random() * commandStart.length)]
          } ${commandParts[Math.floor(Math.random() * commandParts.length)]}`;
        } else {
          textEl.textContent =
            commandResponses[
              Math.floor(Math.random() * commandResponses.length)
            ];
        }
      }

      consoleEl.appendChild(textEl);
      consoleEl.scrollTop = consoleEl.scrollHeight;

      // Limit console lines
      const lines = consoleEl.querySelectorAll("p");
      if (lines.length > 50) {
        for (let n = 0; n < 10; n++) {
          if (lines[n]) consoleEl.removeChild(lines[n]);
        }
      }

      consoleTimeout = setTimeout(
        addConsoleOutput,
        Math.random() * 150 + 50
      );
    }

    // Set colors
    _ctx.strokeStyle = "#00FF00";
    _ctx.lineWidth = 1;
    _ctxBars.strokeStyle = "#00FF00";
    _ctxBars.fillStyle = "#00FF00";

    // Start animations
    let animationId: number;
    let consoleTimeout: ReturnType<typeof setTimeout>;

    renderCanvas();
    addConsoleOutput();

    // Auto-complete after 8 seconds
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 8000);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(consoleTimeout);
      clearTimeout(completeTimeout);
    };
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top section with 3D tunnel and bars */}
      <div className="relative flex" style={{ height: "40vh" }}>
        <canvas
          ref={canvasRef}
          className="border-b-2 border-[#00FF00]"
          style={{ width: "66.6%", height: "100%" }}
        />
        <canvas
          ref={barsRef}
          className="border-b-2 border-l-2 border-[#00FF00]"
          style={{ width: "33.3%", height: "100%" }}
        />
      </div>

      {/* Console output section */}
      <div
        ref={consoleRef}
        className="flex-1 overflow-auto p-4 font-mono text-[#00FF00] text-xs leading-relaxed"
        style={{
          fontFamily: "'Source Code Pro', monospace",
          textShadow: "0 0 5px #00FF00",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="console-line mb-2 text-sm font-bold"
        >
          ══════════════════════════════════════════════════════
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="console-line mb-2 text-sm font-bold"
        >
          GOLU BABA INTELLIGENCE SYSTEM v2.0
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="console-line mb-4 text-sm font-bold"
        >
          ══════════════════════════════════════════════════════
        </motion.p>
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03) 0px, rgba(0, 255, 0, 0.03) 1px, transparent 1px, transparent 2px)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

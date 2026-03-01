"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TypewriterTextProps = {
  text: string;
  delay?: number;
  speed?: number;
};

export function TypewriterText({ text, delay = 0, speed = 40 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsComplete(true);
          }
        }, speed);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(delayTimer);
    } else {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [text, delay, speed]);

  return (
    <span className="font-mono">
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-2 h-5 bg-primary ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  );
}

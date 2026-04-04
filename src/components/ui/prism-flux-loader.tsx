"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

interface PrismFluxLoaderProps {
  size?: number;
  speed?: number;
}

export const PrismFluxLoader: React.FC<PrismFluxLoaderProps> = ({
  size = 30,
  speed = 5,
}) => {
  const [time, setTime] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = ["Beregner", "Sammensætter", "Analyserer", "Optimerer", "Færdiggør"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.02 * speed);
    }, 16);
    return () => clearInterval(interval);
  }, [speed]);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 600);
    return () => clearInterval(statusInterval);
  }, [statuses.length]);

  const half = size / 2;
  const currentStatus = statuses[statusIndex];

  const rotateX = time * 40;
  const rotateY = time * 60;

  const faceTransforms = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  const faceColors = [
    "hsla(0, 0%, 100%, 0.15)",
    "hsla(0, 0%, 100%, 0.1)",
    "hsla(0, 0%, 100%, 0.2)",
    "hsla(0, 0%, 100%, 0.08)",
    "hsla(0, 0%, 100%, 0.18)",
    "hsla(0, 0%, 100%, 0.12)",
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        style={{
          width: size,
          height: size,
          perspective: 200,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {faceTransforms.map((transform, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                transform,
                backgroundColor: faceColors[i],
                border: "1px solid hsla(0, 0%, 100%, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backfaceVisibility: "hidden",
              }}
            >
              <Plus className="text-hero-foreground/40" size={size * 0.5} />
            </div>
          ))}
        </div>
      </div>

      <span className="text-hero-muted text-sm font-medium tracking-wide">
        {currentStatus}...
      </span>
    </div>
  );
};

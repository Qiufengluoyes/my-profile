"use client";

import { useEffect } from "react";

const STEPS = [0, 20, 40, 60, 80, 100];

const rand = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

const buildKeyframes = (
  name: string,
  basePositions: string[],
  rangeX: number,
  rangeY: number
) => {
  const layerCount = basePositions.length;
  const frames = STEPS.map((step) => {
    const positions =
      step === 0
        ? basePositions
        : Array.from({ length: layerCount }, () => {
            const x = rand(-rangeX, rangeX);
            const y = rand(-rangeY, rangeY);
            return `${x}px ${y}px`;
          });
    return `${step}% { background-position: ${positions.join(", ")}; }`;
  }).join("\n  ");

  return `@keyframes ${name} {\n  ${frames}\n}`;
};

export default function BackgroundMotion() {
  useEffect(() => {
    const styleId = "random-dot-waves";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const css = [
      buildKeyframes(
        "dotWaveBase",
        ["0px 0px", "30px 30px", "12px 12px"],
        180,
        180
      ),
      buildKeyframes("dotWaveFloat", ["0px 0px", "44px 22px"], 200, 200),
      buildKeyframes("dotWaveGlow", ["0px 0px"], 220, 220)
    ].join("\n\n");

    styleEl.textContent = css;

    return () => {
      styleEl?.parentNode?.removeChild(styleEl);
    };
  }, []);

  return null;
}

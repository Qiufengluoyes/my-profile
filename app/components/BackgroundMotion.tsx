"use client";

import { useEffect } from "react";

const STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const EASING = "cubic-bezier(0.42, 0, 0.58, 1)";

const rand = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

const randFloat = (min: number, max: number) =>
  min + Math.random() * (max - min);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const parsePosition = (value: string) => {
  const [x = "0", y = "0"] = value.trim().split(/\s+/);
  return {
    x: Number.parseFloat(x),
    y: Number.parseFloat(y)
  };
};

const parseRgb = (value: string) => {
  const parts = value.trim().split(/\s+/).map((part) => Number(part));
  if (parts.length >= 3 && parts.every((num) => Number.isFinite(num))) {
    return parts.slice(0, 3) as [number, number, number];
  }
  return [255, 255, 255] as [number, number, number];
};

const buildSvgDots = ({
  size,
  count,
  minDistance,
  radiusMin,
  radiusMax,
  color,
  alpha
}: {
  size: number;
  count: number;
  minDistance: number;
  radiusMin: number;
  radiusMax: number;
  color: [number, number, number];
  alpha: number;
}) => {
  const circles: string[] = [];
  const points: Array<{ x: number; y: number; r: number }> = [];
  const maxAttempts = Math.max(60, count * 40);
  let attempts = 0;

  while (points.length < count && attempts < maxAttempts) {
    attempts += 1;
    const cx = randFloat(0, size);
    const cy = randFloat(0, size);
    const r = randFloat(radiusMin, radiusMax);

    let ok = true;
    for (const p of points) {
      const dx = cx - p.x;
      const dy = cy - p.y;
      if (dx * dx + dy * dy < minDistance * minDistance) {
        ok = false;
        break;
      }
    }

    if (ok) {
      points.push({ x: cx, y: cy, r });
    }
  }

  points.forEach((p) => {
    circles.push(
      `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${p.r.toFixed(2)}" />`
    );
  });

  const [r, g, b] = color;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><g fill="rgb(${r}, ${g}, ${b})" fill-opacity="${alpha}">${circles.join("")}</g></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

const buildKeyframes = (
  name: string,
  basePositions: string[],
  rangeX: number,
  rangeY: number
) => {
  const layerCount = basePositions.length;
  const maxDeltaX = rangeX * 0.25;
  const maxDeltaY = rangeY * 0.25;
  const current = basePositions.map(parsePosition);

  const frames = STEPS.map((step) => {
    if (step !== 0) {
      for (let i = 0; i < layerCount; i += 1) {
        current[i] = {
          x: clamp(
            current[i].x + randFloat(-maxDeltaX, maxDeltaX),
            -rangeX,
            rangeX
          ),
          y: clamp(
            current[i].y + randFloat(-maxDeltaY, maxDeltaY),
            -rangeY,
            rangeY
          )
        };
      }
    }

    const positions = current.map(
      (pos) => `${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px`
    );
    const easing = step < 100 ? ` animation-timing-function: ${EASING};` : "";
    return `${step}% { background-position: ${positions.join(", ")};${easing} }`;
  }).join("\n  ");

  return `@keyframes ${name} {\n  ${frames}\n}`;
};

export default function BackgroundMotion() {
  useEffect(() => {
    const layer = document.querySelector(".bg-layer") as HTMLElement | null;
    if (!layer) return;

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

    const applyDots = (isMobile: boolean) => {
      const rootStyles = getComputedStyle(document.documentElement);
      const accent = parseRgb(rootStyles.getPropertyValue("--accent"));
      const accent2 = parseRgb(rootStyles.getPropertyValue("--accent-2"));
      const accent3 = parseRgb(rootStyles.getPropertyValue("--accent-3"));

      const clearVars = () => {
        const vars = [
          "--bg-dots-base-1",
          "--bg-dots-base-2",
          "--bg-dots-base-3",
          "--bg-dots-base-size-1",
          "--bg-dots-base-size-2",
          "--bg-dots-base-size-3",
          "--bg-dots-base-pos-1",
          "--bg-dots-base-pos-2",
          "--bg-dots-base-pos-3",
          "--bg-dots-mid-1",
          "--bg-dots-mid-2",
          "--bg-dots-mid-size-1",
          "--bg-dots-mid-size-2",
          "--bg-dots-mid-pos-1",
          "--bg-dots-mid-pos-2",
          "--bg-dots-glow-1",
          "--bg-dots-glow-size-1",
          "--bg-dots-glow-pos-1"
        ];

        vars.forEach((name) => layer.style.removeProperty(name));
      };

      if (isMobile) {
        clearVars();
        return;
      }

      layer.style.setProperty(
        "--bg-dots-base-1",
        buildSvgDots({
          size: 72,
          count: 1,
          minDistance: 36,
          radiusMin: 0.9,
          radiusMax: 1.3,
          color: accent,
          alpha: 0.18
        })
      );
      layer.style.setProperty(
        "--bg-dots-base-2",
        buildSvgDots({
          size: 150,
          count: 2,
          minDistance: 70,
          radiusMin: 1.1,
          radiusMax: 1.6,
          color: accent2,
          alpha: 0.14
        })
      );
      layer.style.setProperty(
        "--bg-dots-base-3",
        buildSvgDots({
          size: 220,
          count: 3,
          minDistance: 80,
          radiusMin: 1.4,
          radiusMax: 2.1,
          color: accent3,
          alpha: 0.1
        })
      );
      layer.style.setProperty("--bg-dots-base-size-1", "72px 72px");
      layer.style.setProperty("--bg-dots-base-size-2", "150px 150px");
      layer.style.setProperty("--bg-dots-base-size-3", "220px 220px");
      layer.style.setProperty(
        "--bg-dots-base-pos-1",
        `${rand(-72, 72)}px ${rand(-72, 72)}px`
      );
      layer.style.setProperty(
        "--bg-dots-base-pos-2",
        `${rand(-150, 150)}px ${rand(-150, 150)}px`
      );
      layer.style.setProperty(
        "--bg-dots-base-pos-3",
        `${rand(-220, 220)}px ${rand(-220, 220)}px`
      );

      layer.style.setProperty(
        "--bg-dots-mid-1",
        buildSvgDots({
          size: 120,
          count: 2,
          minDistance: 60,
          radiusMin: 1.8,
          radiusMax: 2.5,
          color: accent,
          alpha: 0.34
        })
      );
      layer.style.setProperty(
        "--bg-dots-mid-2",
        buildSvgDots({
          size: 190,
          count: 3,
          minDistance: 70,
          radiusMin: 1.4,
          radiusMax: 2,
          color: accent3,
          alpha: 0.22
        })
      );
      layer.style.setProperty("--bg-dots-mid-size-1", "120px 120px");
      layer.style.setProperty("--bg-dots-mid-size-2", "190px 190px");
      layer.style.setProperty(
        "--bg-dots-mid-pos-1",
        `${rand(-120, 120)}px ${rand(-120, 120)}px`
      );
      layer.style.setProperty(
        "--bg-dots-mid-pos-2",
        `${rand(-190, 190)}px ${rand(-190, 190)}px`
      );

      layer.style.setProperty(
        "--bg-dots-glow-1",
        buildSvgDots({
          size: 240,
          count: 3,
          minDistance: 90,
          radiusMin: 2.4,
          radiusMax: 3.2,
          color: accent2,
          alpha: 0.32
        })
      );
      layer.style.setProperty("--bg-dots-glow-size-1", "240px 240px");
      layer.style.setProperty(
        "--bg-dots-glow-pos-1",
        `${rand(-240, 240)}px ${rand(-240, 240)}px`
      );
    };

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const run = (_event?: MediaQueryListEvent) => applyDots(mobileQuery.matches);

    run();
    type LegacyMediaQueryList = MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    const bind = (
      query: MediaQueryList,
      handler: (event: MediaQueryListEvent) => void
    ) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", handler);
        return;
      }
      const legacy = query as LegacyMediaQueryList;
      if (typeof legacy.addListener === "function") {
        legacy.addListener(handler);
      }
    };

    const unbind = (
      query: MediaQueryList,
      handler: (event: MediaQueryListEvent) => void
    ) => {
      if (typeof query.removeEventListener === "function") {
        query.removeEventListener("change", handler);
        return;
      }
      const legacy = query as LegacyMediaQueryList;
      if (typeof legacy.removeListener === "function") {
        legacy.removeListener(handler);
      }
    };

    bind(mobileQuery, run);
    bind(themeQuery, run);

    return () => {
      styleEl?.parentNode?.removeChild(styleEl);
      unbind(mobileQuery, run);
      unbind(themeQuery, run);
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useMemo, useState } from 'react';
import type { EventThemeConfig } from '@/lib/event-utils';

type HslColor = {
  h: number;
  s: number;
  l: number;
};

type RgbBucket = {
  r: number;
  g: number;
  b: number;
  count: number;
};

const themeCache = new Map<string, EventThemeConfig>();

const THEME_VERSION = 3; // Bumped version to invalidate old cached neon colors

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hueDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function randomFromSeed(seed: string, step: number) {
  const hash = hashString(`${seed}-${step}`);
  return (hash % 10000) / 10000;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: 255 * f(0), g: 255 * f(8), b: 255 * f(4) };
}

function getPerceivedBrightness(h: number, s: number, l: number) {
  const { r, g, b } = hslToRgb(h, s, l);
  // W3C relative luminance approximation - accounts for how the human eye sees green vs blue
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function hslToCss(color: HslColor) {
  return `hsl(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}%)`;
}

function makeVivid(color: HslColor, mode: 'base' | 'deep' | 'accent') {
  // RELATIVE scaling: Preserves the aesthetic mood of the original poster
  if (mode === 'deep') {
    return {
      h: color.h,
      s: clamp(color.s * 1.1, 15, 80), 
      l: clamp(color.l * 0.7, 12, 32), // Darken for background depth
    };
  }

  if (mode === 'accent') {
    return {
      h: color.h,
      // Only force high saturation if it was already somewhat saturated
      s: clamp(color.s > 40 ? color.s * 1.2 : color.s + 15, 35, 90),
      l: clamp(color.l, 35, 65),
    };
  }

  return {
    h: color.h,
    s: clamp(color.s * 1.15, 20, 85), // Allow low saturation (muted teals, classy greys)
    l: clamp(color.l, 25, 75),
  };
}

function getBaseColorScore(bucket: RgbBucket, total: number) {
  const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
  const frequency = bucket.count / Math.max(total, 1);
  
  // Dominant color should usually win
  const frequencyScore = frequency * 400; 
  // Slight preference for colors with *some* life, but not demanding neon
  const saturationScore = hsl.s * 0.4; 
  // Prefer mid-tones so text and elements can contrast against it
  const midLightnessScore = (50 - Math.abs(hsl.l - 50)) * 0.6; 

  return frequencyScore + saturationScore + midLightnessScore;
}

function getAccentScore(bucket: RgbBucket, total: number) {
  const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
  const frequency = bucket.count / Math.max(total, 1);

  if (frequency < 0.01) {
    return -Infinity; // Ignore stray 1-pixel anomalies
  }

  // Accents should be colorful, distinct, and moderately bright
  return hsl.s * 1.2 + (50 - Math.abs(hsl.l - 50)) * 0.5 + frequency * 50;
}

function getTextOnAccent(accent: HslColor) {
  // Uses perceived brightness rather than raw HSL Lightness
  const brightness = getPerceivedBrightness(accent.h, accent.s, accent.l);
  return brightness > 140 ? '#10243f' : '#ffffff';
}

function buildMesh(seed: string) {
  const hX = 10 + randomFromSeed(seed, 1) * 36;
  const hY = 6 + randomFromSeed(seed, 2) * 32;
  const hR = 40 + randomFromSeed(seed, 3) * 18;
  const gX = 62 + randomFromSeed(seed, 4) * 30;
  const gY = 58 + randomFromSeed(seed, 5) * 32;
  const gR = 40 + randomFromSeed(seed, 6) * 20;
  const angle = 118 + randomFromSeed(seed, 7) * 62;

  return {
    highlight: { x: Number(hX.toFixed(2)), y: Number(hY.toFixed(2)), radius: Number(hR.toFixed(2)) },
    glow: { x: Number(gX.toFixed(2)), y: Number(gY.toFixed(2)), radius: Number(gR.toFixed(2)) },
    angle: Number(angle.toFixed(2)),
  };
}

function createGradient(primary: HslColor, secondary: HslColor, deep: HslColor, seed: string) {
  const mesh = buildMesh(seed);

  return {
    mesh,
    gradient: [
      `radial-gradient(circle at ${mesh.highlight.x}% ${mesh.highlight.y}%, ${hslToCss({ ...primary, l: clamp(primary.l + 10, 38, 78) })} 0%, transparent ${mesh.highlight.radius}%)`,
      `radial-gradient(circle at ${mesh.glow.x}% ${mesh.glow.y}%, ${hslToCss({ ...secondary, l: clamp(secondary.l + 7, 34, 74) })} 0%, transparent ${mesh.glow.radius}%)`,
      `linear-gradient(${mesh.angle}deg, ${hslToCss(primary)} 0%, ${hslToCss(secondary)} 52%, ${hslToCss(deep)} 100%)`,
    ].join(', '),
  };
}

function buildTheme(primary: HslColor, secondary: HslColor, deepSource: HslColor, seed: string, source: 'image' | 'fallback'): EventThemeConfig {
  const primaryVivid = makeVivid(primary, 'base');
  const secondaryVivid = makeVivid(secondary, 'base');
  const deep = makeVivid(deepSource, 'deep');
  const { mesh, gradient } = createGradient(primaryVivid, secondaryVivid, deep, seed);

  // Pick the most saturated color to serve as the base for the accent
  const accentSource = secondaryVivid.s > primaryVivid.s ? secondaryVivid : primaryVivid;
  const accent = makeVivid(accentSource, 'accent');
  
  const accentHover = {
    h: accent.h,
    s: clamp(accent.s + 5, 30, 98),
    l: clamp(accent.l - 8, 20, 55),
  };
  
  const heading = {
    h: deep.h,
    s: clamp(deep.s + 10, 20, 92),
    l: clamp(deep.l - 6, 10, 25),
  };

  const brightness = getPerceivedBrightness(primaryVivid.h, primaryVivid.s, primaryVivid.l);
  const isDark = brightness < 110;

  return {
    version: THEME_VERSION,
    gradient,
    accent: hslToCss(accent),
    accentHover: hslToCss(accentHover),
    accentSoft: hslToCss({ ...accent, l: clamp(accent.l + 34, 74, 95), s: clamp(accent.s - 14, 20, 82) }),
    heading: hslToCss(heading),
    textOnAccent: getTextOnAccent(accent),
    isDark,
    mesh,
    generatedAt: `theme:${source}:${seed}`,
    source,
  };
}

export function buildFallbackTheme(seed: string): EventThemeConfig {
  const hash = hashString(seed || 'event');
  const hue = hash % 360;
  const secondaryHue = (hue + 32 + (hash % 17)) % 360;
  const deepHue = (hue + 165) % 360;

  const primary: HslColor = { h: hue, s: 60, l: 45 };
  const secondary: HslColor = { h: secondaryHue, s: 65, l: 50 };
  const deep: HslColor = { h: deepHue, s: 40, l: 25 };

  return buildTheme(primary, secondary, deep, seed, 'fallback');
}

export async function generateEventThemeFromImage(imageUrl: string, seed: string, fallback?: EventThemeConfig) {
  const fallbackTheme = fallback ?? buildFallbackTheme(seed);

  if (typeof window === 'undefined') {
    return fallbackTheme;
  }

  try {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.referrerPolicy = 'no-referrer';

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Unable to load image for theme extraction.'));
      image.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      return fallbackTheme;
    }

    const width = 64;
    const height = 64;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    const { data } = context.getImageData(0, 0, width, height);
    const buckets = new Map<string, RgbBucket>();
    let totalSamples = 0;

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const a = data[i + 3] ?? 0;

      if (a < 140) continue;

      const hsl = rgbToHsl(r, g, b);
      if (hsl.s < 5 || hsl.l < 10 || hsl.l > 95) continue; // Lowered saturation cutoff slightly

      totalSamples += 1;

      const qr = Math.round(r / 24) * 24;
      const qg = Math.round(g / 24) * 24;
      const qb = Math.round(b / 24) * 24;
      const key = `${qr}-${qg}-${qb}`;
      const bucket = buckets.get(key);

      if (bucket) {
        bucket.r += qr;
        bucket.g += qg;
        bucket.b += qb;
        bucket.count += 1;
      } else {
        buckets.set(key, { r: qr, g: qg, b: qb, count: 1 });
      }
    }

    if (buckets.size < 2) {
      return fallbackTheme;
    }

    const ranked = Array.from(buckets.values())
      .filter((bucket) => bucket.count / Math.max(totalSamples, 1) >= 0.004)
      .map((bucket) => {
        const averaged = {
          r: bucket.r / bucket.count,
          g: bucket.g / bucket.count,
          b: bucket.b / bucket.count,
          count: bucket.count,
        };
        return {
          hsl: rgbToHsl(averaged.r, averaged.g, averaged.b),
          baseScore: getBaseColorScore(averaged, totalSamples),
          accentScore: getAccentScore(averaged, totalSamples),
          frequency: averaged.count / Math.max(totalSamples, 1),
        };
      })
      .sort((left, right) => right.baseScore - left.baseScore);

    if (ranked.length < 2) {
      return fallbackTheme;
    }

    const primary = ranked[0]?.hsl ?? rgbToHsl(33, 120, 162);
    const secondary = ranked.find((entry) => entry.frequency >= 0.015 && hueDistance(entry.hsl.h, primary.h) >= 18)?.hsl
      ?? ranked.find((entry) => hueDistance(entry.hsl.h, primary.h) >= 15)?.hsl
      ?? ranked[1]?.hsl
      ?? primary;
      
    const deep = ranked.find((entry) => entry.frequency >= 0.02 && entry.hsl.l < 36)?.hsl
      ?? ranked.find((entry) => entry.hsl.l < 34)?.hsl
      ?? ranked[ranked.length - 1]?.hsl
      ?? secondary;

    const accentCandidate = [...ranked]
      .sort((left, right) => right.accentScore - left.accentScore)
      .find((entry) => entry.frequency >= 0.012)?.hsl
      ?? secondary;

    const mergedSecondary = {
      h: (secondary.h + accentCandidate.h) / 2,
      s: Math.max(secondary.s, accentCandidate.s),
      l: (secondary.l + accentCandidate.l) / 2,
    };

    return buildTheme(primary, mergedSecondary, deep, seed, 'image');
  } catch {
    return fallbackTheme;
  }
}

function isValidStoredTheme(theme?: EventThemeConfig | null): theme is EventThemeConfig {
  return Boolean(
    theme
      && typeof theme.gradient === 'string'
      && theme.gradient.length > 0
      && typeof theme.accent === 'string'
      && typeof theme.heading === 'string',
  );
}

export function useEventTheme(options: {
  imageUrl?: string;
  seed?: string;
  storedTheme?: EventThemeConfig | null;
}) {
  const { imageUrl, seed = 'event', storedTheme } = options;
  const fallbackTheme = useMemo(() => buildFallbackTheme(seed), [seed]);
  const [derivedTheme, setDerivedTheme] = useState<{ imageUrl: string; theme: EventThemeConfig } | null>(null);

  const theme = useMemo(() => {
    if (isValidStoredTheme(storedTheme)) {
      return storedTheme;
    }

    if (!imageUrl) {
      return fallbackTheme;
    }

    const cachedTheme = themeCache.get(imageUrl);
    if (cachedTheme) {
      return cachedTheme;
    }

    if (derivedTheme?.imageUrl === imageUrl) {
      return derivedTheme.theme;
    }

    return fallbackTheme;
  }, [derivedTheme, fallbackTheme, imageUrl, storedTheme]);

  useEffect(() => {
    let isActive = true;

    if (!imageUrl || themeCache.has(imageUrl) || isValidStoredTheme(storedTheme)) {
      return () => {
        isActive = false;
      };
    }

    void generateEventThemeFromImage(imageUrl, seed, fallbackTheme).then((resolvedTheme) => {
      themeCache.set(imageUrl, resolvedTheme);
      if (isActive) {
        setDerivedTheme({ imageUrl, theme: resolvedTheme });
      }
    });

    return () => {
      isActive = false;
    };
  }, [fallbackTheme, imageUrl, seed, storedTheme]);

  return theme;
}
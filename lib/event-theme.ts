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

const THEME_VERSION = 2;

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
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
  }

  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: s * 100,
    l: l * 100,
  };
}

function hslToCss(color: HslColor) {
  return `hsl(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}%)`;
}

function makeVivid(color: HslColor, mode: 'base' | 'deep' | 'accent') {
  if (mode === 'deep') {
    return {
      h: color.h,
      s: clamp(Math.max(color.s + 8, 50), 38, 88),
      l: clamp(color.l - 24, 14, 36),
    };
  }

  if (mode === 'accent') {
    return {
      h: color.h,
      s: clamp(Math.max(color.s + 18, 64), 56, 96),
      l: clamp(color.l, 32, 54),
    };
  }

  return {
    h: color.h,
    s: clamp(Math.max(color.s + 16, 58), 48, 92),
    l: clamp(color.l + 3, 30, 66),
  };
}

function getBaseColorScore(bucket: RgbBucket, total: number) {
  const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
  const frequency = bucket.count / Math.max(total, 1);
  const frequencyScore = frequency * 220;
  const saturationScore = clamp(hsl.s, 0, 100) * 0.25;
  const midLightnessScore = (70 - Math.abs(hsl.l - 52)) * 0.25;
  const warmDistance = Math.min(hueDistance(hsl.h, 38), hueDistance(hsl.h, 350));
  const warmBoost = clamp((75 - warmDistance) / 75, 0, 1) * 4;

  return frequencyScore + saturationScore + midLightnessScore + warmBoost;
}

function getAccentScore(bucket: RgbBucket, total: number) {
  const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
  const frequency = bucket.count / Math.max(total, 1);

  if (frequency < 0.01) {
    return -Infinity;
  }

  return hsl.s * 0.9 + (56 - Math.abs(hsl.l - 46)) * 0.45 + frequency * 80;
}

function getTextOnAccent(accent: HslColor) {
  return accent.l > 56 ? '#10243f' : '#ffffff';
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

  const accentSource = secondaryVivid.s > primaryVivid.s ? secondaryVivid : primaryVivid;
  const accent = makeVivid(accentSource, 'accent');
  const accentHover = {
    h: accent.h,
    s: clamp(accent.s + 2, 56, 98),
    l: clamp(accent.l - 7, 26, 48),
  };
  const heading = {
    h: deep.h,
    s: clamp(deep.s + 10, 44, 92),
    l: clamp(deep.l - 6, 10, 30),
  };

  const averageLightness = (primaryVivid.l + secondaryVivid.l + deep.l) / 3;
  const isDark = averageLightness < 42;

  return {
    version: THEME_VERSION,
    gradient,
    accent: hslToCss(accent),
    accentHover: hslToCss(accentHover),
    accentSoft: hslToCss({ ...accent, l: clamp(accent.l + 34, 74, 92), s: clamp(accent.s - 14, 34, 82) }),
    heading: hslToCss(heading),
    textOnAccent: getTextOnAccent(accent),
    isDark,
    mesh,
    generatedAt: new Date().toISOString(),
    source,
  };
}

export function buildFallbackTheme(seed: string): EventThemeConfig {
  const hash = hashString(seed || 'event');
  const hue = hash % 360;
  const secondaryHue = (hue + 32 + (hash % 17)) % 360;
  const deepHue = (hue + 165) % 360;

  const primary: HslColor = { h: hue, s: 72, l: 42 };
  const secondary: HslColor = { h: secondaryHue, s: 78, l: 48 };
  const deep: HslColor = { h: deepHue, s: 58, l: 28 };

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

      if (a < 140) {
        continue;
      }

      const hsl = rgbToHsl(r, g, b);
      if (hsl.s < 10 || hsl.l < 7 || hsl.l > 95) {
        continue;
      }

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

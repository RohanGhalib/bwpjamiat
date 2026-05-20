import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Jimp } from 'jimp';

const THEME_VERSION = 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function hueDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function randomFromSeed(seed, step) {
  const hash = hashString(`${seed}-${step}`);
  return (hash % 10000) / 10000;
}

function rgbToHsl(r, g, b) {
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

  return { h, s: s * 100, l: l * 100 };
}

function hslToCss(color) {
  return `hsl(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}%)`;
}

function makeVivid(color, mode) {
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

function getBaseColorScore(bucket, total) {
  const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
  const frequency = bucket.count / Math.max(total, 1);
  const frequencyScore = frequency * 220;
  const saturationScore = clamp(hsl.s, 0, 100) * 0.25;
  const midLightnessScore = (70 - Math.abs(hsl.l - 52)) * 0.25;
  const warmDistance = Math.min(hueDistance(hsl.h, 38), hueDistance(hsl.h, 350));
  const warmBoost = clamp((75 - warmDistance) / 75, 0, 1) * 4;

  return frequencyScore + saturationScore + midLightnessScore + warmBoost;
}

function getAccentScore(bucket, total) {
  const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
  const frequency = bucket.count / Math.max(total, 1);

  if (frequency < 0.01) {
    return -Infinity;
  }

  return hsl.s * 0.9 + (56 - Math.abs(hsl.l - 46)) * 0.45 + frequency * 80;
}

function buildMesh(seed) {
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

function getTextOnAccent(accent) {
  return accent.l > 56 ? '#10243f' : '#ffffff';
}

function buildTheme(primary, secondary, deepSource, seed, source) {
  const primaryVivid = makeVivid(primary, 'base');
  const secondaryVivid = makeVivid(secondary, 'base');
  const deep = makeVivid(deepSource, 'deep');

  const mesh = buildMesh(seed);
  const gradient = [
    `radial-gradient(circle at ${mesh.highlight.x}% ${mesh.highlight.y}%, ${hslToCss({ ...primaryVivid, l: clamp(primaryVivid.l + 10, 38, 78) })} 0%, transparent ${mesh.highlight.radius}%)`,
    `radial-gradient(circle at ${mesh.glow.x}% ${mesh.glow.y}%, ${hslToCss({ ...secondaryVivid, l: clamp(secondaryVivid.l + 7, 34, 74) })} 0%, transparent ${mesh.glow.radius}%)`,
    `linear-gradient(${mesh.angle}deg, ${hslToCss(primaryVivid)} 0%, ${hslToCss(secondaryVivid)} 52%, ${hslToCss(deep)} 100%)`,
  ].join(', ');

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

  return {
    version: THEME_VERSION,
    gradient,
    accent: hslToCss(accent),
    accentHover: hslToCss(accentHover),
    accentSoft: hslToCss({ ...accent, l: clamp(accent.l + 34, 74, 92), s: clamp(accent.s - 14, 34, 82) }),
    heading: hslToCss(heading),
    textOnAccent: getTextOnAccent(accent),
    isDark: averageLightness < 42,
    mesh,
    generatedAt: new Date().toISOString(),
    source,
  };
}

function buildFallbackTheme(seed) {
  const hash = hashString(seed || 'event');
  const hue = hash % 360;
  const secondaryHue = (hue + 32 + (hash % 17)) % 360;
  const deepHue = (hue + 165) % 360;

  const primary = { h: hue, s: 72, l: 42 };
  const secondary = { h: secondaryHue, s: 78, l: 48 };
  const deep = { h: deepHue, s: 58, l: 28 };

  return buildTheme(primary, secondary, deep, seed, 'fallback');
}

async function generateEventThemeFromImageInNode(imageUrl, seed) {
  const fallback = buildFallbackTheme(seed);

  if (!imageUrl) {
    return fallback;
  }

  try {
    const image = await Jimp.read(imageUrl);
    image.resize({ w: 64, h: 64 });

    const { data, width, height } = image.bitmap;
    const buckets = new Map();
    let totalSamples = 0;

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const idx = (y * width + x) * 4;
        const r = data[idx] ?? 0;
        const g = data[idx + 1] ?? 0;
        const b = data[idx + 2] ?? 0;
        const a = data[idx + 3] ?? 0;

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
    }

    if (buckets.size < 2) {
      return fallback;
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
      return fallback;
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
  } catch (error) {
    console.warn(`Theme fallback used for image: ${imageUrl}`, error.message || error);
    return fallback;
  }
}

function hasValidTheme(eventTheme) {
  return Boolean(eventTheme && typeof eventTheme.gradient === 'string' && typeof eventTheme.accent === 'string');
}

function resolveFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
  }

  return config;
}

async function run() {
  const dryRun = process.argv.includes('--dry-run');
  const force = process.argv.includes('--force');

  const app = initializeApp(resolveFirebaseConfig());
  const db = getFirestore(app);

  const eventsSnapshot = await getDocs(collection(db, 'events'));
  const events = eventsSnapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() || {}) }));

  console.log(`Found ${events.length} events.`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const event of events) {
    const shouldSkip = !force && hasValidTheme(event.eventTheme);
    if (shouldSkip) {
      skipped += 1;
      console.log(`- Skip ${event.id}: theme already present.`);
      continue;
    }

    const seed = event.id || event.title || event.imageStoragePath || event.imageUrl || 'event';

    try {
      const eventTheme = await generateEventThemeFromImageInNode(event.imageUrl, seed);

      if (dryRun) {
        console.log(`- Dry run ${event.id}: ${eventTheme.source} theme generated.`);
      } else {
        await updateDoc(doc(db, 'events', event.id), {
          eventTheme,
          updatedAt: new Date().toISOString(),
        });
        console.log(`- Updated ${event.id}: ${eventTheme.source} theme saved.`);
      }

      updated += 1;
    } catch (error) {
      failed += 1;
      console.error(`- Failed ${event.id}:`, error.message || error);
    }
  }

  console.log('--- Migration Summary ---');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Dry Run: ${dryRun}`);
}

run().catch((error) => {
  console.error('Migration failed:', error.message || error);
  process.exit(1);
});

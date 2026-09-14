const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

async function createOptimizedHeroBg() {
  const bg = await loadImage('public/uswa/bg.png');
  const mosque = await loadImage('public/uswa/mosque.png');

  // Let's create high-res hero background with mosque overlay
  // bg is 2103 x 2787
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext('2d');

  // 1. Draw BG
  ctx.drawImage(bg, 0, 0);

  // 2. Draw Mosque with overlay
  ctx.globalCompositeOperation = 'overlay';
  // Position mosque at bottom exactly as in poster
  const mosqueScale = bg.width / mosque.width;
  const mosqueDrawH = mosque.height * mosqueScale;
  const mosqueY = bg.height - mosqueDrawH + 60;
  ctx.drawImage(mosque, 0, mosqueY, bg.width, mosqueDrawH);

  // Save to public/uswa/hero-bg.jpg with high quality
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync('public/uswa/hero-bg.jpg', buffer);
  console.log('Saved public/uswa/hero-bg.jpg, size:', buffer.length);
}

createOptimizedHeroBg().catch(console.error);

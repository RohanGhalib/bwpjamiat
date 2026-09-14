const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function renderTest() {
  const bg = await loadImage('public/uswa/bg.png');
  const mosque = await loadImage('public/uswa/mosque.png');
  console.log('BG dimensions:', bg.width, bg.height);
  console.log('Mosque dimensions:', mosque.width, mosque.height);

  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext('2d');

  // 1. draw bg
  ctx.drawImage(bg, 0, 0);

  // 2. draw mosque with overlay
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(mosque, 0, bg.height - mosque.height * (bg.width / mosque.width), bg.width, mosque.height * (bg.width / mosque.width));

  // 3. sample some pixels from mosque area
  ctx.globalCompositeOperation = 'source-over';
  const imgData = ctx.getImageData(Math.floor(bg.width / 2), Math.floor(bg.height * 0.75), 1, 1).data;
  console.log('Pixel on mosque with overlay: R=' + imgData[0] + ', G=' + imgData[1] + ', B=' + imgData[2]);

  // Save to scratch/test-rendered.png
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('scratch/test-rendered.png', buffer);
  console.log('Saved scratch/test-rendered.png');
}

renderTest().catch(console.error);

const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

async function testFullPoster() {
  registerFont('public/fonts/uswa/Swizzer-regular.ttf', { family: 'Swizzer' });
  registerFont('public/fonts/uswa/SwizzerItalic.ttf', { family: 'SwizzerItalic' });

  const bg = await loadImage('public/uswa/bg.png');
  const mosque = await loadImage('public/uswa/mosque.png');
  const logo = await loadImage('public/logo.png');

  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext('2d');

  // 1. Draw BG
  ctx.drawImage(bg, 0, 0);

  // 2. Draw Mosque with overlay
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(mosque, 0, bg.height - mosque.height * (bg.width / mosque.width) + 20, bg.width, mosque.height * (bg.width / mosque.width));

  // 3. Draw Logo with source-over
  ctx.globalCompositeOperation = 'source-over';
  const logoW = 220;
  const logoH = 220;
  ctx.drawImage(logo, (bg.width - logoW) / 2, 180, logoW, logoH);

  // 4. Draw USWA with overlay
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = '#000000';
  ctx.font = '780px Swizzer';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('USWA', bg.width / 2, 850);

  // 5. Draw THE PROPHETIC MINDSET with overlay
  ctx.font = 'italic 185px SwizzerItalic';
  ctx.fillText('THE PROPHETIC MINDSET', bg.width / 2, 1260);

  // 6. Draw description with source-over
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText('A 1-Day Summit on the', bg.width / 2, 1420);
  ctx.fillText('Life & Legacy of', bg.width / 2, 1515);
  ctx.fillText('Prophet Muhammad (SAW)', bg.width / 2, 1610);

  // 7. Draw bottom black bar
  const barH = 200;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, bg.height - barH, bg.width, barH);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = '900 36px sans-serif';
  ctx.fillText('SIGNUP NOW', 80, bg.height - 115);
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText('bwpjamiat.org/uswa', 80, bg.height - 55);

  ctx.textAlign = 'right';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('PUNJAB COLLEGE  |  KIPS COLLEGE', bg.width - 80, bg.height - 90);
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('BAHAWALPUR', bg.width - 80, bg.height - 50);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('scratch/full-poster-test.png', buffer);
  console.log('Saved scratch/full-poster-test.png');
}

testFullPoster().catch(console.error);

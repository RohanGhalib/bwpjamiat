const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

async function testModes() {
  registerFont('public/fonts/uswa/Swizzer-regular.ttf', { family: 'Swizzer' });
  registerFont('public/fonts/uswa/SwizzerItalic.ttf', { family: 'SwizzerItalic' });

  const heroBg = await loadImage('public/uswa/hero-bg.jpg');

  // Test 1: Multiply
  {
    const canvas = createCanvas(heroBg.width, heroBg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(heroBg, 0, 0);

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#051f0b';
    ctx.font = '780px Swizzer';
    ctx.textAlign = 'center';
    ctx.fillText('USWA', canvas.width / 2, 850);

    fs.writeFileSync('scratch/test-multiply.png', canvas.toBuffer('image/png'));
  }

  // Test 2: Overlay with dark green
  {
    const canvas = createCanvas(heroBg.width, heroBg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(heroBg, 0, 0);

    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = '#021206';
    ctx.font = '780px Swizzer';
    ctx.textAlign = 'center';
    ctx.fillText('USWA', canvas.width / 2, 850);

    fs.writeFileSync('scratch/test-dark-overlay.png', canvas.toBuffer('image/png'));
  }

  // Test 3: Overlay with #000000 on top of multiply
  {
    const canvas = createCanvas(heroBg.width, heroBg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(heroBg, 0, 0);

    // draw multiply first with 0.5 opacity
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.font = '780px Swizzer';
    ctx.textAlign = 'center';
    ctx.fillText('USWA', canvas.width / 2, 850);

    // draw overlay
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = '#000000';
    ctx.fillText('USWA', canvas.width / 2, 850);

    fs.writeFileSync('scratch/test-combined.png', canvas.toBuffer('image/png'));
  }

  console.log('Finished testing modes');
}

testModes().catch(console.error);

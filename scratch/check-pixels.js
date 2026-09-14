const { Jimp } = require('jimp');

async function test() {
  const image = await Jimp.read('public/uswa/mosque.png');
  console.log('Mosque dimensions:', image.bitmap.width, image.bitmap.height);
  // sample some pixels
  const p1 = Jimp.intToRGBA(image.getPixelColor(Math.floor(image.bitmap.width / 2), Math.floor(image.bitmap.height / 2)));
  console.log('Middle pixel RGBA:', p1);

  const bg = await Jimp.read('public/uswa/bg.png');
  console.log('BG dimensions:', bg.bitmap.width, bg.bitmap.height);
  const pBg = Jimp.intToRGBA(bg.getPixelColor(Math.floor(bg.bitmap.width / 2), Math.floor(bg.bitmap.height / 2)));
  console.log('BG middle pixel RGBA:', pBg);
}

test().catch(console.error);

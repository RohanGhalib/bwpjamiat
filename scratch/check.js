const fs = require('fs');
console.log('mosque size:', fs.statSync('public/uswa/mosque.png').size);
console.log('bg size:', fs.statSync('public/uswa/bg.png').size);

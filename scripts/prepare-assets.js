const fs = require('fs');
const path = require('path');

const assets = ['icon', 'adaptive-icon'];

for (const name of assets) {
  const source = path.join(__dirname, '..', 'assets', `${name}.png.b64`);
  const target = path.join(__dirname, '..', 'assets', `${name}.png`);
  if (!fs.existsSync(source)) continue;
  fs.writeFileSync(target, Buffer.from(fs.readFileSync(source, 'utf8').trim(), 'base64'));
}

console.log('Dorak app assets are ready.');

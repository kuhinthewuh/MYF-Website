const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inDir = 'c:\\Users\\kusha\\Downloads\\medal';
const outDir = 'c:\\Users\\kusha\\Downloads\\MYF Website\\public\\sequence';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs.readdirSync(inDir).filter(f => f.endsWith('.jpg')).sort();

const numFrames = 120;
for (let i = 0; i < numFrames; i++) {
  const sourceIndex = Math.min(Math.floor((i / numFrames) * files.length), files.length - 1);
  const sourceFile = files[sourceIndex];
  
  const paddedIndex = String(i + 1).padStart(4, '0');
  const outFile = `frame_${paddedIndex}.webp`;
  
  sharp(path.join(inDir, sourceFile))
    .webp({ quality: 80 })
    .toFile(path.join(outDir, outFile))
    .then(() => console.log(`Processed ${outFile}`))
    .catch(err => console.error(`Error on ${outFile}:`, err));
}

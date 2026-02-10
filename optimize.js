/* eslint-disable */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = './public/doors';

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    return;
  }

  files.forEach((file) => {
    // Only process PNG files
    if (path.extname(file).toLowerCase() === '.png') {
      const inputFile = path.join(directory, file);
      const outputFile = path.join(directory, path.parse(file).name + '.jpg');

      sharp(inputFile)
        .resize(512, 512, { fit: 'cover' }) // Resize to mobile-friendly size
        .jpeg({ quality: 60, mozjpeg: true }) // Compress to ~50KB
        .toFile(outputFile)
        .then(() => {
          console.log(`✅ Converted: ${file} -> JPG`);
          // Delete the heavy PNG to save space
          fs.unlinkSync(inputFile);
        })
        .catch(err => {
          console.error(`❌ Error converting ${file}:`, err);
        });
    }
  });
});
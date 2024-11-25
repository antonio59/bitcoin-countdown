import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [16, 32, 180, 192, 512];
const inputSvg = './public/bitcoin-icon.svg';
const outputDir = './public';

async function generateFavicons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `favicon-${size}x${size}.png`);
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      console.log(`Generated ${outputFile}`);
    }

    // Generate apple-touch-icon.png
    await sharp(inputSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    // Copy SVG files
    await fs.copyFile(inputSvg, path.join(outputDir, 'icon.svg'));
    console.log('Copied icon.svg');
    await fs.copyFile(inputSvg, path.join(outputDir, 'mask-icon.svg'));
    console.log('Generated mask-icon.svg');

    console.log('Favicon generation complete!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function generateOgImage() {
  const width = 1200;
  const height = 630;
  const bitcoinLogoSize = 200;

  try {
    // Read the Bitcoin SVG
    const bitcoinSvg = await fs.readFile('./public/bitcoin-icon.svg', 'utf-8');

    // Create a background
    const background = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 242, g: 169, b: 0 },
      }
    }).png().toBuffer();

    // Create an image with the background, Bitcoin logo, and text
    await sharp(background)
      .composite([
        {
          input: Buffer.from(bitcoinSvg),
          top: (height - bitcoinLogoSize) / 2,
          left: (width - bitcoinLogoSize) / 2,
        },
        {
          input: {
            text: {
              text: 'Bitcoin $100k Countdown',
              font: 'sans',
              fontSize: 60,
              align: 'center',
            }
          },
          top: height - 100,
          left: 0,
          width: width,
        }
      ])
      .toFile('./public/og-image.png');

    console.log('OG image generated successfully!');
  } catch (error) {
    console.error('Error generating OG image:', error);
  }
}

generateOgImage();
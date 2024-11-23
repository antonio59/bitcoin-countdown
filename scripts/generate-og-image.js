import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs/promises';

async function generateOgImage() {
  let browser;
  
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #f2a900;
              font-family: system-ui, -apple-system, sans-serif;
              height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .title {
              color: white;
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 30px;
              text-align: center;
            }
            .widget {
              background: white;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
              width: 400px;
            }
            .header {
              background: #f85a05;
              color: white;
              text-align: center;
              padding: 16px;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              margin: -24px -24px 24px -24px;
            }
            .price {
              font-size: 48px;
              font-weight: bold;
              color: #1a1a1a;
              text-align: center;
              margin-bottom: 8px;
            }
            .change {
              color: #dc2626;
              font-size: 14px;
              text-align: center;
              margin-bottom: 24px;
            }
            .progress-label {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
            .progress-text {
              color: #4b5563;
              font-size: 14px;
            }
            .progress-percentage {
              color: #f85a05;
              font-weight: bold;
            }
            .progress-container {
              background: #f3f4f6;
              border-radius: 9999px;
              height: 8px;
              overflow: hidden;
              margin-bottom: 24px;
            }
            .progress-bar {
              background: #f85a05;
              height: 100%;
              width: 98.7%;
            }
            .remaining {
              background: #fff7ed;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 24px;
            }
            .remaining-label {
              color: #4b5563;
              font-size: 14px;
              margin-bottom: 8px;
            }
            .remaining-value {
              color: #f85a05;
              font-size: 32px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="widget">
            <div class="header">Bitcoin to $100k</div>
            <div class="price">$98,656</div>
            <div class="change">↓ $0.00</div>
            <div class="progress-label">
              <span class="progress-text">Progress to $100k</span>
              <span class="progress-percentage">98.7%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar"></div>
            </div>
            <div class="remaining">
              <div class="remaining-label">Remaining to Target</div>
              <div class="remaining-value">$1,344</div>
            </div>
          </div>
        </body>
      </html>
    `;

    await fs.writeFile('temp-og.html', html);

    // Launch browser
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630
    });
    
    // Load the temporary HTML file
    await page.goto(`file://${process.cwd()}/temp-og.html`);
    
    // Take a screenshot
    const screenshot = await page.screenshot();
    
    // Clean up temporary file
    await fs.unlink('temp-og.html');
    
    // Save the screenshot directly as the OG image
    await fs.writeFile('./public/og-image.png', screenshot);
    
    console.log('OG image generated successfully!');
    
  } catch (error) {
    console.error('Error generating OG image:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generateOgImage();

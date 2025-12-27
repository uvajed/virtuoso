const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '../public/icons');

// SVG icon - Music note on green circle (Spotify-style)
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="256" fill="#1DB954"/>
  <path d="M330 150v172c0 38-30 68-68 68s-68-30-68-68c0-38 30-68 68-68 12 0 24 3 34 9V150c0-8 6-14 14-14h6c8 0 14 6 14 14z" fill="#000"/>
  <ellipse cx="262" cy="322" rx="48" ry="38" fill="#000"/>
</svg>
`;

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Created: icon-${size}x${size}.png`);
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);

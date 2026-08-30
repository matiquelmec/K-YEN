const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const brandDir = path.join(__dirname, '..', 'public', 'brand');

async function optimizeImages() {
  console.log('--- 📸 OPTIMIZANDO IMÁGENES CON SHARP ---');

  const imageMap = [
    {
      src: 'Fotografía Editorial de Curaduría.jpeg',
      destBase: 'manifesto-editorial',
      maxWidth: 1400,
    },
    {
      src: 'Brisa & Calipso.jpeg',
      destBase: 'chapter-brisa-calipso',
      maxWidth: 1600,
    },
    {
      src: 'Solsticio Dorado.jpeg',
      destBase: 'chapter-solsticio-dorado',
      maxWidth: 1600,
    },
    {
      src: 'Rosa de Alba.jpeg',
      destBase: 'chapter-rosa-alba',
      maxWidth: 1600,
    },
    {
      src: 'Mockup.jpeg',
      destBase: 'unboxing-packaging',
      maxWidth: 1600,
    }
  ];

  for (const item of imageMap) {
    const inputPath = path.join(brandDir, item.src);
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Archivo no encontrado: ${item.src}`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size / 1024;
    console.log(`\nProcesando ${item.src} (${originalSize.toFixed(1)} KB)...`);

    const image = sharp(inputPath);
    const meta = await image.metadata();

    let pipeline = sharp(inputPath);
    if (meta.width > item.maxWidth) {
      pipeline = pipeline.resize({ width: item.maxWidth, withoutEnlargement: true });
    }

    // 1. Generar WebP (Moderno, ultra-ligero)
    const webpPath = path.join(brandDir, `${item.destBase}.webp`);
    await pipeline
      .clone()
      .webp({ quality: 82, effort: 6 })
      .toFile(webpPath);
    const webpSize = fs.statSync(webpPath).size / 1024;

    // 2. Generar JPG optimizado (Fallback)
    const jpgPath = path.join(brandDir, `${item.destBase}.jpg`);
    await pipeline
      .clone()
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(jpgPath);
    const jpgSize = fs.statSync(jpgPath).size / 1024;

    const savings = ((originalSize - webpSize) / originalSize) * 100;
    console.log(`  ✅ WebP: ${webpSize.toFixed(1)} KB (-${savings.toFixed(1)}%)`);
    console.log(`  ✅ JPG:  ${jpgSize.toFixed(1)} KB`);
  }
}

function optimizeVideos() {
  console.log('\n--- 🎥 OPTIMIZANDO VIDEOS CON FFMPEG ---');

  const videoMap = [
    {
      src: 'HERO SECTION.mp4',
      dest: 'hero-desktop.mp4',
      scale: 'scale=1920:-2',
      crf: '25',
    },
    {
      src: 'Video Loop Vertical Mobile.mp4',
      dest: 'hero-mobile.mp4',
      scale: 'scale=720:-2',
      crf: '26',
    }
  ];

  for (const item of videoMap) {
    const inputPath = path.join(brandDir, item.src);
    const outputPath = path.join(brandDir, item.dest);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Video no encontrado: ${item.src}`);
      continue;
    }

    const origSize = fs.statSync(inputPath).size / (1024 * 1024);
    console.log(`\nComprimiendo ${item.src} (${origSize.toFixed(2)} MB)...`);

    // FFmpeg: H.264, no audio (anulado para loops web limpios y más livianos), faststart para streaming instantáneo
    const cmd = `ffmpeg -y -i "${inputPath}" -an -vf "${item.scale}" -c:v libx264 -crf ${item.crf} -preset slow -pix_fmt yuv420p -movflags +faststart "${outputPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      const newSize = fs.statSync(outputPath).size / (1024 * 1024);
      const savings = ((origSize - newSize) / origSize) * 100;
      console.log(`  ✅ Video Optimizado: ${item.dest} (${newSize.toFixed(2)} MB, -${savings.toFixed(1)}%)`);
    } catch (err) {
      console.error(`❌ Error en video ${item.src}:`, err.message);
    }
  }
}

async function main() {
  await optimizeImages();
  optimizeVideos();
  console.log('\n✨ ¡TODOS LOS ASSETS DE CASA AIRA FUERON OPTIMIZADOS CON ÉXITO!');
}

main().catch(console.error);

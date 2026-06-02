const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = path.join(__dirname, 'public', 'videos', 'hero-camera.mp4');
const outputDir = path.join(__dirname, 'public', 'videos', 'frames');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Clear existing frames
  const files = fs.readdirSync(outputDir);
  for (const file of files) {
    if (file.endsWith('.jpg')) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  }
}

console.log('Extracting frames with ffmpeg...');
// Extract frames at 30fps, quality scale 2 (high quality)
try {
  execSync(`"${ffmpeg}" -i "${videoPath}" -vf fps=30 -qscale:v 2 "${path.join(outputDir, 'frame_%04d.jpg')}"`, { stdio: 'inherit' });
  console.log('Extraction complete!');
} catch (error) {
  console.error('Extraction failed:', error);
}

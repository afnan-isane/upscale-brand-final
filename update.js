const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'app') {
        walkDir(fullPath, callback);
      }
    } else if (/\.(html|js|css|json|xml)$/.test(file)) {
      callback(fullPath);
    }
  });
}

walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  updated = updated.replace(/Upscale Your Brand/g, 'Upscale Brand');
  updated = updated.replace(/Upscale your brand/g, 'Upscale Brand');
  updated = updated.replace(/upscale your brand/g, 'Upscale Brand');
  updated = updated.replace(/Upscale Your brand/g, 'Upscale Brand');

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
console.log('Done updating brand name.');

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'app') {
        walkDir(fullPath, callback);
      }
    } else if (file.endsWith('.html')) {
      callback(fullPath);
    }
  });
}

walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  updated = updated.replace(/\[Email Address\s*—\s*Coming Soon\]/g, 'connect@upscalebrand.in');
  updated = updated.replace(/\[Phone Number\s*—\s*Coming Soon\]/g, '+91 7823802744');
  updated = updated.replace(/\[Business Address\s*—\s*Coming Soon\]/g, 'Mumbai, Maharashtra, India');

  // Fix mailto/tel in footers
  updated = updated.replace(/href="[^"]*contact\.html"[^>]*>connect\@upscalebrand\.in<\/a>/g, 'href="mailto:connect@upscalebrand.in">connect@upscalebrand.in</a>');
  updated = updated.replace(/href="[^"]*contact\.html"[^>]*>\+91 7823802744<\/a>/g, 'href="tel:+917823802744">+91 7823802744</a>');

  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
console.log('Done updating placeholders.');

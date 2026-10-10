const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
                results = results.concat(walk(filePath));
            }
        } else {
            if (/\.(html|js|css|json|xml)$/.test(file)) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk('.');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = content
        .replace(/Upscale Your Brand/g, 'Upscale Brand')
        .replace(/Upscale your brand/g, 'Upscale Brand')
        .replace(/upscale your brand/g, 'Upscale Brand')
        .replace(/Upscale Your brand/g, 'Upscale Brand');
    
    if (content !== updated) {
        fs.writeFileSync(file, updated, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
console.log('Brand name update complete.');

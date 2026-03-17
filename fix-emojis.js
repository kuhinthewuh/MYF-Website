const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'app', 'admin-portal', 'sections');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Fix the broken emoji strings from previous PowerShell script
  content = content.replace(/\? Changes saved and live!/g, "✅ Changes saved and live!");
  content = content.replace(/\? Failed to save changes\./g, "❌ Failed to save changes.");
  content = content.replace(/\? Upload failed\./g, "❌ Upload failed.");
  content = content.replace(/\? Failed to upload image\./g, "❌ Failed to upload image.");
  content = content.replace(/\? Failed to upload PDF\./g, "❌ Failed to upload PDF.");

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed emojis in', file);
  }
}

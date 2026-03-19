import fs from 'fs/promises';
import path from 'path';

const TARGET_DIR = process.cwd();
const EXCLUDE_DIRS = new Set(['node_modules', '.next', '.git', '.cache', 'public']);
const INCLUDE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json', '.md']);

let totalLines = 0;
let totalFiles = 0;
let totalBytesCode = 0;
let totalBytesAll = 0;

async function scan(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) {
        await scan(fullPath);
      }
    } else {
      const stat = await fs.stat(fullPath);
      totalBytesAll += stat.size;
      
      const ext = path.extname(entry.name).toLowerCase();
      if (INCLUDE_EXTS.has(ext)) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          totalLines += content.split('\n').length;
          totalFiles += 1;
          totalBytesCode += stat.size;
        } catch (e) {
          // ignore unreadable files
        }
      }
    }
  }
}

async function main() {
  await scan(TARGET_DIR);
  
  console.log("=== CODEBASE SUMMARY ===");
  console.log(`Source Files counted: ${totalFiles}`);
  console.log(`Total Lines of Code:  ${totalLines.toLocaleString()}`);
  console.log(`Source Code Size:     ${(totalBytesCode / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Repository Footprint: ${(totalBytesAll / (1024 * 1024)).toFixed(2)} MB (excluding node_modules/.next but including assets if present)`);
}

main().catch(console.error);

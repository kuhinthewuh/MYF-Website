import fs from 'fs/promises';
import path from 'path';

const files = [
  'app/donate/page.tsx',
  'app/contact/reach-out/page.tsx',
  'app/competition/request-scholarship/page.tsx',
  'app/competition/judging/page.tsx',
  'app/competition/handbook/page.tsx',
  'app/competition/forms/page.tsx',
  'app/competition/contestant/page.tsx',
  'app/contact/alumni-corner/page.tsx',
  'app/about/history/page.tsx',
  'app/about/board/page.tsx',
  'app/about/at-a-glance/page.tsx',
  'app/service-team/join/page.tsx',
];

async function main() {
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Replace import
      content = content.replace(
        /import\s*{\s*createServerClient\s*}\s*from\s*['"]@supabase\/ssr['"];?/,
        "import { createServerSupabaseClient } from '@/lib/supabase-server';"
      );
      
      // Replace instantiation block
      content = content.replace(
        /const\s+cookieStore\s*=\s*cookies\(\);\s*const\s+supabase\s*=\s*createServerClient\([\s\S]+?\);/,
        "const supabase = await createServerSupabaseClient();"
      );
      
      // Remove import { cookies } from 'next/headers' if cookies() is no longer used
      if (!content.includes('cookies()') && !content.includes('cookieStore')) {
         content = content.replace(
           /import\s*{\s*cookies\s*}\s*from\s*['"]next\/headers['"];?\n/,
           ""
         );
      }
      
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`Updated ${file}`);
    } catch (e) {
      console.error(`Failed on ${file}:`, e.message);
    }
  }
}

main().catch(console.error);

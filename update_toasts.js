const fs = require('fs');
const path = require('path');
const dir = path.join('.', 'app', 'admin-portal', 'sections');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (content.includes('useToast') || !content.includes("alert(")) continue;
  
  let changed = false;

  if (content.includes("import { createClient } from '@/lib/supabase';")) {
    content = content.replace(
      "import { createClient } from '@/lib/supabase';",
      "import { createClient } from '@/lib/supabase';\nimport { useToast, Toast } from '../components/Toast';"
    );
    
    if (content.includes("const supabase = createClient();")) {
      content = content.replace(
        "const supabase = createClient();",
        "const { toast, showToast } = useToast();\n  const supabase = createClient();"
      );
    }
  }

  content = content.replace(/alert\('Saved successfully!'\);/g, "showToast('? Changes saved and live!');");
  content = content.replace(/alert\('Failed to save changes.'\);/g, "showToast('? Failed to save changes.', true);");
  content = content.replace(/alert\('Upload failed.'\);/g, "showToast('? Upload failed.', true);");
  content = content.replace(/alert\('Failed to upload image.'\);/g, "showToast('? Failed to upload image.', true);");
  content = content.replace(/alert\('Failed to upload PDF.'\);/g, "showToast('? Failed to upload PDF.', true);");

  content = content.replace(
    /(<div className="[^"]*animate-in[^"]*">)/g,
    "$1\n      <Toast toast={toast} />"
  );

  fs.writeFileSync(filepath, content);
  console.log('Updated', file);
  changed = true;
}

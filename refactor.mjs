import fs from 'fs';
import path from 'path';

const mapping = {
  'HeroSection': 'hero',
  'EventsSection': 'events',
  'GallerySection': 'gallery',
  'ProgramsSection': 'programs',
  'AboutGlanceSection': 'about-glance',
  'AboutHistorySection': 'about-history',
  'AboutBoardSection': 'about-board',
  'ContestantSection': 'competition-contestant',
  'ContestantFormsSection': 'competition-forms',
  'ContestantHandbookSection': 'competition-handbook',
  'JudgingCriteriaSection': 'competition-judging',
  'RequestScholarshipSection': 'competition-request',
  'ServiceJoinSection': 'service-join',
  'SponsorSection': 'sponsor',
  'DonateSection': 'donate',
  'ContactReachSection': 'contact-reach',
  'ContactAlumniSection': 'contact-alumni',
  'GlobalFooterSection': 'global-footer',
};

const dir = 'c:/Users/kusha/Downloads/MYF Website/app/admin-portal/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const componentName = file.replace('.tsx', '');
  const sectionId = mapping[componentName];
  
  if (!sectionId) continue;
  if (content.includes('useAdminSave')) continue;
  
  if (!content.includes('useEffect')) {
    if (content.includes('import { useState } from')) {
      content = content.replace("import { useState } from", "import { useState, useEffect } from");
    } else if (content.includes('import { useState,')) {
      content = content.replace("import { useState,", "import { useState, useEffect,");
    } else if (content.includes('import React, { useState')) {
      content = content.replace("import React, { useState", "import React, { useState, useEffect");
    } else {
      content = content.replace(/(import .+? from ['"]react['"];)/, "$1\nimport { useEffect } from 'react';");
      if (!content.includes('useEffect } from')) {
         content = "import { useEffect } from 'react';\n" + content;
      }
    }
  }
  
  content = content.replace(/('use client';|use client;)/, `$1\nimport { useAdminSave } from '../components/AdminSaveContext';`);
  
  const regex = new RegExp(`export default function ${componentName}\\([^)]*\\)\\s*\\{`);
  
  if (!content.includes('handleSave')) {
    console.log(`WARNING: ${componentName} has no handleSave`);
    continue;
  }

  const injectCode = `\n  const { registerSaveAction, unregisterSaveAction } = useAdminSave();\n  useEffect(() => {\n    registerSaveAction('${sectionId}', handleSave);\n    return () => unregisterSaveAction('${sectionId}');\n  });\n`;
  content = content.replace(regex, (match) => match + injectCode);
  
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done refactoring!');

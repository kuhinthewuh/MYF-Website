const fs = require('fs');
const path = require('path');

const routes = [
  '/about/at-a-glance',
  '/about/history',
  '/about/board',
  '/competition/contestant',
  '/competition/forms',
  '/competition/handbook',
  '/competition/judging',
  '/competition/request-scholarship',
  '/service-team/join',
  '/sponsor',
  '/contact/reach-out',
  '/contact/alumni-corner',
  '/donate'
];

const basePath = path.join('c:', 'Users', 'kusha', 'Downloads', 'MYF Website', 'app');

routes.forEach(route => {
  const dir = path.join(basePath, route);
  fs.mkdirSync(dir, { recursive: true });
  
  const title = route.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')).join(' - ');

  const content = `export default function Page() {
  return (
    <main className="min-h-screen bg-myf-bg pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[50vh]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-myf-charcoal mb-6">
          ${title}
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-myf-teal via-myf-gold to-myf-coral rounded-full mb-8" />
        <p className="text-xl text-myf-muted max-w-2xl">
          This page is currently under construction. Please check back soon!
        </p>
      </div>
    </main>
  );
}
`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log(`Created: ${route}/page.tsx`);
});

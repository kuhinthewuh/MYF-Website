import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MYF Admin Portal',
  description: 'Private admin dashboard for Manteca Youth Focus directors.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0d1117] text-white min-h-screen">
      {children}
    </div>
  );
}

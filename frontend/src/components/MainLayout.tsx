'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`page-content ${isLanding ? 'page-content--full' : ''}`}>
        {isLanding ? children : <div className="container py-4">{children}</div>}
      </main>
    </>
  );
}

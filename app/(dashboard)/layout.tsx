'use client';



import { ReactNode, useState } from 'react';
import { DashboardSidebar } from './Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: 'var(--product-background)' }}
    >
      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar — hidden on md+ (sidebar is always visible there) */}
        <header
          className="sticky top-0 z-20 md:hidden flex items-center h-14 px-4 border-b"
          style={{
            backgroundColor: 'var(--product-background)',
            borderColor:     'var(--product-muted)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg mr-3 transition-colors"
            style={{ color: 'var(--product-foreground)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '')}
          >
            {/* Hamburger */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-black text-sm" style={{ color: 'var(--product-primary)' }}>
            BoldMind Hub
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
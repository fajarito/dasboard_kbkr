import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'

type DashboardLayoutProps = {
  mobileTitle: string
  children: ReactNode
}

export function DashboardLayout({ mobileTitle, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-navy-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-navy-50/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-2 text-navy-900 shadow-sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <MenuIcon />
          </button>
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              Kemendukbangga
            </p>
            <p className="text-[11px] text-slate-500">{mobileTitle}</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1280px] space-y-5">{children}</div>
        </main>
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

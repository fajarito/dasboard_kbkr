import { Link, useLocation } from 'react-router-dom'
import { navItems } from '../data/overview'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-navy-950/50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-navy-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between px-5 pt-6 pb-5">
          <div>
            <p className="text-[18px] font-extrabold tracking-tight">
              Kemendukbangga
            </p>
            <p className="mt-0.5 text-[12px] font-medium text-slate-400">
              Analytics Dashboard
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-800 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {navItems.map((item) => {
            const active =
              item.to === '/'
                ? location.pathname === '/'
                : 'matchPrefix' in item &&
                    typeof item.matchPrefix === 'string'
                  ? location.pathname.startsWith(item.matchPrefix)
                  : !item.to.includes('#') && location.pathname === item.to

            return (
              <div key={item.id}>
                {'section' in item && item.section ? (
                  <p className="mt-3 mb-1 px-3 text-[10px] font-semibold tracking-[0.14em] text-slate-500">
                    {item.section}
                  </p>
                ) : null}
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                    active
                      ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                      : 'bg-navy-800/70 text-slate-200 hover:bg-navy-700'
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            )
          })}
        </nav>

        <div className="px-4 pb-5">
          <div className="rounded-xl bg-navy-800 px-4 py-3 text-[12px]">
            <span className="font-medium text-slate-400">Data terakhir: </span>
            <span className="font-bold text-white">30 Juni 2026</span>
          </div>
        </div>
      </aside>
    </>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

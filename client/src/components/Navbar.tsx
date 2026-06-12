import React, { useState } from "react";
import { Menu, X, LogOut, Scissors } from "lucide-react";
import { NavigationItem } from "./Sidebar";

// ─── Props ────────────────────────────────────────────────────────────
interface NavbarProps {
  items: NavigationItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

// ─── Component ────────────────────────────────────────────────────────
const Navbar: React.FC<NavbarProps> = ({
  items,
  activePath,
  onNavigate,
  onLogout,
}) => {
  // UI-only state: controls the mobile hamburger drawer
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* ── Top bar (visible on lg: hidden — sidebar takes over on desktop) ── */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0d0d10]/95 backdrop-blur-md border-b border-[#1f1f23]">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c5a880] flex items-center justify-center">
            <Scissors size={15} className="text-[#09090b] rotate-45" />
          </div>
          <span className="text-[#f4f4f5] font-semibold text-sm tracking-wide">BarberSaaS</span>
        </div>

        {/* Hamburger toggle */}
        <button
          id="navbar-hamburger"
          onClick={() => setIsOpen((o) => !o)}
          className="
            w-9 h-9 flex items-center justify-center rounded-lg
            border border-[#2a2a2e] text-[#a1a1aa]
            hover:border-[#c5a880]/50 hover:text-[#c5a880]
            transition-all duration-200
          "
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* ── Mobile slide-down drawer ── */}
      <div
        className={`
          lg:hidden fixed inset-0 z-30 transition-all duration-300
          ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer panel */}
        <nav
          className={`
            absolute top-0 left-0 h-full w-72 max-w-[80vw]
            bg-[#0d0d10] border-r border-[#1f1f23]
            flex flex-col overflow-y-auto
            transition-transform duration-300 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-[#1f1f23]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#c5a880] flex items-center justify-center">
                <Scissors size={13} className="text-[#09090b] rotate-45" />
              </div>
              <span className="text-[#f4f4f5] font-semibold text-sm">BarberSaaS</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#52525b] hover:text-[#f4f4f5] transition-colors"
              aria-label="Kapat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav items */}
          <div className="flex-1 px-3 py-4 space-y-1">
            <p className="px-3 mb-3 text-[10px] tracking-[0.15em] uppercase text-[#3f3f46] font-medium">
              Menü
            </p>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  id={`navbar-nav-${item.path.replace(/\//g, "")}`}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    group w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-left
                    transition-all duration-200
                    ${isActive
                      ? "bg-[#c5a880]/[0.12] text-[#c5a880] font-medium"
                      : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#f4f4f5]"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${isActive ? "text-[#c5a880]" : "text-[#52525b] group-hover:text-[#a1a1aa]"}`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-[#1f1f23] px-3 py-4">
            <button
              id="navbar-logout"
              onClick={onLogout}
              className="
                group w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm
                text-[#52525b] hover:bg-[#ef4444]/[0.08] hover:text-[#ef4444]
                transition-all duration-200
              "
            >
              <LogOut size={17} className="shrink-0" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile bottom navigation bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d0d10]/95 backdrop-blur-md border-t border-[#1f1f23] flex">
        {items.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              id={`bottom-nav-${item.path.replace(/\//g, "")}`}
              onClick={() => onNavigate(item.path)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1 py-3
                transition-all duration-200
                ${isActive ? "text-[#c5a880]" : "text-[#52525b] hover:text-[#a1a1aa]"}
              `}
            >
              <Icon size={20} />
              <span
                className={`text-[10px] tracking-wide font-medium transition-colors duration-200 ${
                  isActive ? "text-[#c5a880]" : "text-[#52525b]"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-t bg-[#c5a880]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;

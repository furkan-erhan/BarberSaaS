import { useState, useEffect } from "react";
import { Scissors, LogOut, Menu, X, Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MainLayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  user?: { name: string; email: string; role?: string };
  navItems?: NavItem[];
}

export default function MainLayout({
  children,
  activePath,
  onNavigate,
  onLogout,
  user,
  navItems = [],
}: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col font-sans selection:bg-[#c5a880]/30 relative overflow-x-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#c5a880]/[0.02] blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#c5a880]/[0.015] blur-[150px] pointer-events-none z-0" />

      {/* ─── Top Navigation Navbar ─── */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-[#2a2a2e]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full relative z-10">
          
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#111113] border border-[#2a2a2e] text-[#a1a1aa] hover:text-white transition-all shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate("/")}>
              <div className="w-9 h-9 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center group-hover:bg-[#c5a880]/20 transition-all duration-300 shadow-md">
                <Scissors className="w-4.5 h-4.5 text-[#c5a880] transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <span className="font-sans text-base font-extrabold text-white tracking-tight">
                Barber<span className="text-[#c5a880]">SaaS</span>
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 group cursor-pointer
                    ${isActive
                      ? "bg-[#c5a880]/10 text-white border-l border-[#c5a880] md:border-l-0 md:border-b-2"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-[#c5a880]" : "text-[#52525b] group-hover:text-[#c5a880]"
                      }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Notification & User Profile dropdown */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-[#111113] border border-[#2a2a2e] text-[#52525b] hover:text-white hover:border-[#c5a880]/30 transition-all relative group cursor-pointer">
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#c5a880] rounded-full animate-pulse" />
            </button>

            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-[#2a2a2e]/50">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-[#a1a1aa] mt-0.5 leading-none">{user.role || "Müşteri"}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a880] to-[#e8d5b5] flex items-center justify-center p-0.5 shadow-md shadow-[#c5a880]/10 shrink-0">
                  <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#c5a880]" />
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-red-300 transition-all shadow-sm cursor-pointer"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Mobile Slide-down Menu ─── */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 z-40 flex flex-col bg-[#09090b]/95 backdrop-blur-xl border-b border-[#2a2a2e]/50 animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="px-6 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-extrabold
                      transition-all duration-300
                      ${isActive
                        ? "bg-[#c5a880]/15 text-white border-l-2 border-[#c5a880]"
                        : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#c5a880]" : "text-[#52525b]"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            {user && (
              <div className="px-6 py-6 border-t border-[#2a2a2e]/50 bg-[#111113]/30">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111113] border border-[#2a2a2e] mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a880]/20 to-[#c5a880]/5 border border-[#c5a880]/30 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#c5a880]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-[#a1a1aa] truncate font-medium">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Page Content Container */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full">
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}


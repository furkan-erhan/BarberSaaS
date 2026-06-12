import React from "react";
import { LogOut, Scissors } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface SidebarUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SidebarProps {
  items: NavigationItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  user?: SidebarUser;
}

// ─── Avatar fallback ──────────────────────────────────────────────────
const AvatarFallback: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="w-9 h-9 rounded-full bg-[#c5a880] flex items-center justify-center shrink-0">
      <span className="text-[#09090b] text-xs font-bold">{initials}</span>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────
const Sidebar: React.FC<SidebarProps> = ({
  items,
  activePath,
  onNavigate,
  onLogout,
  user,
}) => {
  return (
    <aside className="
      hidden lg:flex flex-col
      w-64 shrink-0 h-screen sticky top-0
      bg-[#0d0d10] border-r border-[#1f1f23]
      overflow-y-auto
    ">
      {/* ── Brand ── */}
      <div className="px-6 py-6 flex items-center gap-2.5 border-b border-[#1f1f23]">
        <div className="w-8 h-8 rounded-lg bg-[#c5a880] flex items-center justify-center shrink-0">
          <Scissors size={15} className="text-[#09090b] rotate-45" />
        </div>
        <div>
          <p className="text-[#f4f4f5] font-semibold text-sm leading-none">BarberSaaS</p>
          <p className="text-[#3f3f46] text-[10px] tracking-widest uppercase mt-0.5">Dashboard</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-3 text-[10px] tracking-[0.15em] uppercase text-[#3f3f46] font-medium">
          Menü
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              id={`sidebar-nav-${item.path.replace(/\//g, "")}`}
              onClick={() => onNavigate(item.path)}
              className={`
                group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                transition-all duration-200 text-left
                ${isActive
                  ? "bg-[#c5a880]/[0.12] text-[#c5a880] font-medium"
                  : "text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#f4f4f5]"
                }
              `}
            >
              {/* Active indicator bar */}
              <span
                className={`absolute left-0 w-0.5 h-5 rounded-r bg-[#c5a880] transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />

              <Icon
                size={17}
                className={`shrink-0 transition-colors duration-200 ${
                  isActive ? "text-[#c5a880]" : "text-[#52525b] group-hover:text-[#a1a1aa]"
                }`}
              />
              <span>{item.label}</span>

              {/* Active dot */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c5a880] opacity-70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User profile + logout ── */}
      <div className="border-t border-[#1f1f23] px-3 py-4 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#111113]">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-[#2a2a2e]"
              />
            ) : (
              <AvatarFallback name={user.name} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[#f4f4f5] text-sm font-medium truncate leading-none">{user.name}</p>
              <p className="text-[#3f3f46] text-xs truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        )}

        <button
          id="sidebar-logout"
          onClick={onLogout}
          className="
            group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
            text-[#52525b] hover:bg-[#ef4444]/[0.08] hover:text-[#ef4444]
            transition-all duration-200
          "
        >
          <LogOut size={17} className="shrink-0 transition-colors duration-200 group-hover:text-[#ef4444]" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

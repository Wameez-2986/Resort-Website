"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutGrid, UtensilsCrossed, LogOut } from "lucide-react";

const NAV = [
  { href: "/talav-control-panel/dashboard/orders",     label: "Orders",     icon: ClipboardList },
  { href: "/talav-control-panel/dashboard/categories", label: "Categories", icon: LayoutGrid },
  { href: "/talav-control-panel/dashboard/menu-items", label: "Menu Items", icon: UtensilsCrossed },
];

async function handleLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/talav-control-panel";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">

      {/* ── Desktop sidebar (md+) ─────────────────────────────────────────── */}
      <aside className="hidden md:flex w-56 bg-[#111] border-r border-white/5 flex-col py-6 px-3 gap-2 fixed h-full z-20">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                active ? "bg-accent/15 text-accent" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-montserrat font-medium">{label}</span>
            </Link>
          );
        })}

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-montserrat">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 md:ml-56 min-w-0 p-4 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* ── Mobile bottom nav (< md) ─────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#111] border-t border-white/8 flex items-stretch">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all ${
                active ? "text-accent" : "text-white/35 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-montserrat leading-none">{label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex-none flex flex-col items-center justify-center gap-1 px-4 py-3 text-white/25 hover:text-red-400 transition-all border-l border-white/8"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-montserrat leading-none">Logout</span>
        </button>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, LayoutGrid, UtensilsCrossed, LogOut } from "lucide-react";

const NAV = [
  { href: "/talav-control-panel/dashboard/orders", label: "Orders", icon: ClipboardList },
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
      {/* Sidebar */}
      <aside className="w-20 md:w-56 bg-[#111] border-r border-white/5 flex flex-col py-6 px-3 gap-2 fixed h-full z-20">
        <div className="mb-6 px-2">
          <p className="text-accent text-xs font-montserrat tracking-widest uppercase hidden md:block">
            Control Panel
          </p>
          <h2 className="text-white font-playfair font-bold text-lg mt-1 hidden md:block">
            Talav Resort
          </h2>
        </div>

        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-montserrat font-medium hidden md:block">{label}</span>
            </Link>
          );
        })}

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-montserrat hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 md:ml-56 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

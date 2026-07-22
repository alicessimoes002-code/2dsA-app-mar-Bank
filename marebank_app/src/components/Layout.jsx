import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, PiggyBank, GraduationCap, CreditCard, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Transações", path: "/transacoes", icon: Wallet },
  { label: "Cofres", path: "/cofres", icon: PiggyBank },
  { label: "Cartão", path: "/cartao", icon: CreditCard },
  { label: "Academy", path: "/academy", icon: GraduationCap },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-white border-r border-slate-100 z-30">
        <div className="flex items-center gap-2.5 px-6 h-20">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-200">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-slate-900 leading-none">MaréBank</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">EDUCAÇÃO FINANCEIRA</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
            <p className="text-xs font-medium text-slate-300">Nível Atual</p>
            <p className="text-2xl font-bold mt-1">Nível 3</p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">350 / 500 XP</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-30">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors flex-1",
                  isActive ? "text-sky-600" : "text-slate-400"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-heading font-bold text-base text-slate-900">MaréBank</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

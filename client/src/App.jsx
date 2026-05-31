import { useState, useEffect, useCallback } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";
import { fetchExpenses, deleteExpense } from "./api/expenseApi";

// ─── Category colour map ───────────────────────────────────────────────────────
export const CATEGORY_COLORS = {
  Food:          { bg: "bg-orange-500/20", text: "text-orange-300", dot: "#f97316" },
  Transport:     { bg: "bg-blue-500/20",   text: "text-blue-300",   dot: "#3b82f6" },
  Housing:       { bg: "bg-yellow-500/20", text: "text-yellow-300", dot: "#eab308" },
  Health:        { bg: "bg-emerald-500/20",text: "text-emerald-300",dot: "#10b981" },
  Entertainment: { bg: "bg-pink-500/20",   text: "text-pink-300",   dot: "#ec4899" },
  Shopping:      { bg: "bg-purple-500/20", text: "text-purple-300", dot: "#a855f7" },
  Education:     { bg: "bg-cyan-500/20",   text: "text-cyan-300",   dot: "#06b6d4" },
  Other:         { bg: "bg-slate-500/20",  text: "text-slate-300",  dot: "#94a3b8" },
};

export default function App() {
  const [expenses, setExpenses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scrolled, setScrolled]   = useState(false);

  // ─── Scroll effect for header ────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Fetch all expenses ──────────────────────────────────────────────────────
  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchExpenses();
      setExpenses(data.data);
    } catch (err) {
      setError("Failed to load expenses. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  // ─── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch {
      setError("Failed to delete expense.");
    }
  };

  // ─── Total spend ─────────────────────────────────────────────────────────────
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth  = expenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen font-body relative overflow-x-hidden">
      {/* ── Animated Background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* ── Enhanced Header ─────────────────────────────────────────────── */}
      <header className={`border-b sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'border-white/10 bg-obsidian-900/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
          : 'border-white/5 bg-obsidian-900/80 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                
                {/* Icon container */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
              
              <div>
                <h1 className="font-display font-bold text-2xl bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300">
                  ExpenseIQ
                </h1>
                <p className="text-white/40 text-xs mt-0.5">Smart expense tracking</p>
              </div>
            </div>

            {/* Enhanced Stat Pills */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Total Stat */}
              <div className="group/stat relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-xl blur-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative glass-card px-5 py-3 flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-pulse" />
                  <div>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wide">Total</p>
                    <p className="text-violet-200 font-bold text-lg font-display">
                      ${totalSpend.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Monthly Stat */}
              <div className="group/stat relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-xl blur-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <div className="relative glass-card px-5 py-3 flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 animate-pulse" />
                  <div>
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wide">This Month</p>
                    <p className="text-emerald-200 font-bold text-lg font-display">
                      ${thisMonth.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Enhanced Error Banner ──────────────────────────────────────── */}
        {error && (
          <div className="mb-8 relative overflow-hidden rounded-xl animate-shake">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-red-500/20 animate-pulse" />
            <div className="relative glass-card border-rose-500/40 px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500/30 to-red-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl animate-bounce">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="text-rose-300 font-semibold">{error}</p>
                <p className="text-rose-400/60 text-xs mt-1">Please check your connection and try again</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: Enhanced Add Form ─────────────────────────── */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <ExpenseForm onExpenseAdded={loadExpenses} />
          </div>

          {/* ── Right column: Enhanced Tabs ────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6 animate-slide-in-right">
            {/* Enhanced Tab Bar */}
            <div className="relative">
              <div className="glass-card p-1.5 flex gap-2 w-fit relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5" />
                
                {[
                  { key: "dashboard", label: "Dashboard", icon: "📊", gradient: "from-violet-500 to-purple-500" },
                  { key: "expenses",  label: "Expenses",  icon: "📋", gradient: "from-purple-500 to-fuchsia-500" },
                ].map(({ key, label, icon, gradient }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative px-6 py-3 rounded-xl text-sm font-display font-bold transition-all duration-300 flex items-center gap-3 group/tab overflow-hidden ${
                      activeTab === key
                        ? "text-white"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {/* Active background */}
                    {activeTab === key && (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
                        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} blur-xl opacity-50`} />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/tab:translate-x-[100%] transition-transform duration-700" />
                      </>
                    )}
                    
                    {/* Content */}
                    <span className={`relative text-xl transform transition-transform duration-300 ${
                      activeTab === key ? 'scale-110 rotate-12' : 'group-hover/tab:scale-110'
                    }`}>
                      {icon}
                    </span>
                    <span className="relative">{label}</span>

                    {/* Active indicator */}
                    {activeTab === key && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/50 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Tab Content with Transitions */}
            <div className="relative min-h-[600px]">
              <div className={`transition-all duration-500 ${
                activeTab === "dashboard" 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
              }`}>
                {activeTab === "dashboard" && <Dashboard expenses={expenses} />}
              </div>
              
              <div className={`transition-all duration-500 ${
                activeTab === "expenses" 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
              }`}>
                {activeTab === "expenses" && (
                  <ExpenseList
                    expenses={expenses}
                    loading={loading}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white/40 text-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                💸
              </div>
              <span>ExpenseIQ © 2024 - Track smarter, spend better</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 animate-pulse" />
              <span className="text-white/40 text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
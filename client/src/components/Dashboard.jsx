import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { fetchLast7Days } from "../api/expenseApi";
import { CATEGORY_COLORS } from "../App";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard({ expenses }) {
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);

  // ─── Load 7-day aggregated data ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setChartLoading(true);
        const { data } = await fetchLast7Days();
        const points = data.data;

        setChartData({
          labels: points.map((p) =>
            new Date(p.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
          ),
          datasets: [
            {
              label: "Daily Spending ($)",
              data: points.map((p) => p.total),
              borderColor: "#a78bfa",
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "rgba(167,139,250,0.4)");
                gradient.addColorStop(0.5, "rgba(124,92,252,0.2)");
                gradient.addColorStop(1, "rgba(79,70,229,0.05)");
                return gradient;
              },
              pointBackgroundColor: "#fff",
              pointBorderColor: "#a78bfa",
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 10,
              pointHoverBackgroundColor: "#a78bfa",
              pointHoverBorderColor: "#fff",
              pointHoverBorderWidth: 3,
              borderWidth: 3,
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch {
        setChartData(null);
      } finally {
        setChartLoading(false);
      }
    };
    load();
    setTimeout(() => setStatsVisible(true), 100);
  }, [expenses]);

  // ─── Summary stats ───────────────────────────────────────────────────────────
  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length ? totalAll / expenses.length : 0;
  const maxExpense = expenses.length ? Math.max(...expenses.map((e) => e.amount)) : 0;

  // Category breakdown
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,15,25,0.98)",
        borderColor: "rgba(167,139,250,0.5)",
        borderWidth: 2,
        titleColor: "#e9d5ff",
        bodyColor: "#ffffff",
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { 
          color: "rgba(167,139,250,0.08)",
          drawBorder: false,
        },
        ticks: { 
          color: "rgba(255,255,255,0.5)", 
          font: { family: "'DM Sans'", size: 12, weight: '500' },
          padding: 8,
        },
        border: { display: false },
      },
      y: {
        grid: { 
          color: "rgba(167,139,250,0.08)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.5)",
          font: { family: "'DM Sans'", size: 12, weight: '500' },
          callback: (v) => `$${v}`,
          padding: 8,
        },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  const statCards = [
    { 
      label: "Total Spent", 
      value: `$${totalAll.toFixed(2)}`, 
      icon: "💰", 
      gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      glow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]",
      textGradient: "bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent"
    },
    { 
      label: "Avg Expense", 
      value: `$${avgExpense.toFixed(2)}`, 
      icon: "📊", 
      gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
      glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      textGradient: "bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent"
    },
    { 
      label: "Largest", 
      value: `$${maxExpense.toFixed(2)}`, 
      icon: "🔥", 
      gradient: "from-rose-500/20 via-pink-500/20 to-red-500/20",
      glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]",
      textGradient: "bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent"
    },
    { 
      label: "Top Category", 
      value: topCategory ? topCategory[0] : "—", 
      icon: "🏆", 
      gradient: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
      glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
      textGradient: "bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent"
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stat Cards with stagger animation ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, gradient, glow, textGradient }, idx) => (
          <div
            key={label}
            className={`glass-card p-5 relative overflow-hidden group transition-all duration-500 ${glow} ${
              statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Sparkle effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="text-3xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                {icon}
              </div>
              <p className={`font-display font-bold text-lg mb-1 ${textGradient} group-hover:scale-105 transition-transform duration-300 truncate`}>
                {value}
              </p>
              <p className="text-white/50 text-xs font-medium tracking-wide uppercase">{label}</p>
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-fuchsia-500/50 blur-sm" 
                   style={{ animation: 'spin 3s linear infinite' }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Enhanced Line Chart ──────────────────────────────────────────────── */}
      <div className="glass-card p-8 relative overflow-hidden group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-fuchsia-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                Spending Trend
              </h2>
              <p className="text-white/50 text-sm mt-1 font-medium">Last 7 days of activity</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
              </span>
              <span className="text-sm text-violet-200 font-medium">Live Data</span>
            </div>
          </div>

          {chartLoading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" 
                     style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
            </div>
          ) : chartData ? (
            <div style={{ height: "280px" }} className="animate-fade-in">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-20">📊</div>
                <p className="text-white/40 text-sm">Could not load chart data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Enhanced Category Breakdown ──────────────────────────────────────── */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="glass-card p-8 relative overflow-hidden group">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full" />
              <h3 className="font-display font-bold text-xl bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                Category Breakdown
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, total], idx) => {
                  const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
                  const pct = totalAll ? (total / totalAll) * 100 : 0;
                  
                  return (
                    <div 
                      key={cat}
                      className="group/item hover:scale-[1.02] transition-all duration-300"
                      style={{ 
                        animation: `slideInLeft 0.5s ease-out ${idx * 0.1}s both`
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full shadow-lg transform group-hover/item:scale-125 transition-transform duration-300"
                            style={{ 
                              background: colors.dot,
                              boxShadow: `0 0 15px ${colors.dot}80`
                            }}
                          />
                          <span className={`text-sm font-display font-bold ${colors.text} group-hover/item:tracking-wide transition-all duration-300`}>
                            {cat}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white group-hover/item:scale-110 transition-transform duration-300">
                            ${total.toFixed(2)}
                          </span>
                          <span className="text-xs font-semibold text-white/40 bg-white/5 px-2 py-1 rounded-full min-w-[3rem] text-center">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced progress bar */}
                      <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${colors.dot}, ${colors.dot}dd)`,
                            boxShadow: `0 0 20px ${colors.dot}60`
                          }}
                        >
                          {/* Shimmer effect */}
                          <div 
                            className="absolute inset-0 w-full h-full"
                            style={{
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                              animation: 'shimmer 2s infinite'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
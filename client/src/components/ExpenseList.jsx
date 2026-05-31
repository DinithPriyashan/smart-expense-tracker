import { useState } from "react";
import { CATEGORY_COLORS } from "../App";

function SkeletonRow({ index }) {
  return (
    <div 
      className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-white/5 to-white/3 animate-pulse relative overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-lg w-2/3" />
        <div className="h-3 bg-gradient-to-r from-white/15 to-white/5 rounded-lg w-1/2" />
      </div>
      <div className="h-5 bg-gradient-to-r from-white/20 to-white/10 rounded-lg w-20" />
    </div>
  );
}

export default function ExpenseList({ expenses, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="glass-card p-8 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 animate-pulse" />
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} index={i} />)}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="glass-card p-16 text-center animate-fade-up relative overflow-hidden group">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10">
          <div className="inline-block animate-bounce-slow mb-6">
            <div className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">
              🧾
            </div>
          </div>
          <p className="font-display font-bold text-2xl bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent mb-2">
            No expenses yet
          </p>
          <p className="text-white/50 text-sm">Add your first expense to start tracking your spending</p>
          
          {/* Decorative elements */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 animate-fade-up relative overflow-hidden">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 animate-gradient" />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-fuchsia-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl blur-md opacity-50" />
              <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-2.5 rounded-xl">
                <span className="text-xl">📋</span>
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                All Expenses
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Recent transactions</p>
            </div>
          </div>
          
          {/* Enhanced counter badge */}
          <div className="relative group/badge">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
            <div className="relative glass-card px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                {expenses.length} {expenses.length !== 1 ? "records" : "record"}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced List */}
        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">
          {expenses.map((expense, idx) => {
            const colors = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;
            const dateStr = new Date(expense.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const isDeleting = deletingId === expense._id;
            const isHovered = hoveredId === expense._id;

            return (
              <div
                key={expense._id}
                onMouseEnter={() => setHoveredId(expense._id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative flex items-center gap-5 p-5 rounded-xl transition-all duration-300 ${
                  isDeleting 
                    ? 'opacity-0 scale-95 -translate-x-4' 
                    : 'opacity-100 scale-100 translate-x-0'
                }`}
                style={{ 
                  animationDelay: `${idx * 50}ms`,
                  background: isHovered 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: isHovered 
                    ? '1px solid rgba(255,255,255,0.12)' 
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Glow effect on hover */}
                {isHovered && (
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl -z-10 animate-pulse"
                    style={{ background: `${colors.dot}20` }}
                  />
                )}

                {/* Enhanced Category Icon */}
                <div className="relative group/icon">
                  <div 
                    className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                    style={{ background: colors.dot }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transform group-hover/icon:scale-110 group-hover/icon:rotate-6 transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.dot}40 0%, ${colors.dot}20 100%)`,
                      border: `2px solid ${colors.dot}60`,
                      boxShadow: isHovered ? `0 0 20px ${colors.dot}40` : 'none'
                    }}
                  >
                    <span className="text-2xl">{getCategoryEmoji(expense.category)}</span>
                  </div>
                </div>

                {/* Enhanced Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-base font-semibold truncate mb-1.5 group-hover:text-violet-200 transition-colors duration-200">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative inline-block">
                      <div 
                        className="absolute inset-0 rounded-lg blur-md opacity-50"
                        style={{ background: colors.dot }}
                      />
                      <span 
                        className={`relative category-badge px-3 py-1 text-xs font-bold rounded-lg ${colors.text}`}
                        style={{ background: `${colors.dot}25` }}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <span>📅</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Amount & Delete */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="relative">
                    <span className="font-display font-bold text-white text-lg group-hover:scale-110 inline-block transition-transform duration-300">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Enhanced Delete Button */}
                  <button
                    onClick={() => handleDelete(expense._id)}
                    disabled={isDeleting}
                    className={`relative w-9 h-9 rounded-xl flex items-center justify-center
                               transition-all duration-300 overflow-hidden group/delete
                               ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                               ${isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    title="Delete expense"
                  >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-red-500/20 
                                    group-hover/delete:from-rose-500/30 group-hover/delete:to-red-500/30 
                                    transition-all duration-300" />
                    
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-500 opacity-0 
                                    group-hover/delete:opacity-20 blur-xl transition-opacity duration-300" />
                    
                    {/* Icon */}
                    <span className={`relative text-rose-400 font-bold transition-all duration-300
                                     ${isDeleting ? 'animate-spin' : 'group-hover/delete:scale-125 group-hover/delete:rotate-90'}`}>
                      {isDeleting ? '⟳' : '✕'}
                    </span>
                  </button>
                </div>

                {/* Bottom highlight line */}
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-500"
                  style={{ 
                    width: isHovered ? '100%' : '0%',
                    background: `linear-gradient(90deg, ${colors.dot}, transparent)`
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes gradient {
          0%, 100% { 
            background-position: 0% 50%;
            opacity: 0.5;
          }
          50% { 
            background-position: 100% 50%;
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a78bfa, #7c3aed);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #c4b5fd, #a78bfa);
        }
      `}</style>
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    Food: "🍔",
    Transport: "🚗",
    Housing: "🏠",
    Health: "💊",
    Entertainment: "🎮",
    Shopping: "🛍️",
    Education: "📚",
    Other: "📌",
  };
  return map[category] || "📌";
}
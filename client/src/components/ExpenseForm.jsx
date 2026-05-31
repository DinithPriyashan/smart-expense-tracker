import { useState } from "react";
import { createExpense } from "../api/expenseApi";

const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "from-orange-500 to-red-500" },
  { name: "Transport", icon: "🚗", color: "from-blue-500 to-cyan-500" },
  { name: "Housing", icon: "🏠", color: "from-purple-500 to-pink-500" },
  { name: "Health", icon: "💊", color: "from-green-500 to-emerald-500" },
  { name: "Entertainment", icon: "🎮", color: "from-violet-500 to-purple-500" },
  { name: "Shopping", icon: "🛍️", color: "from-pink-500 to-rose-500" },
  { name: "Education", icon: "📚", color: "from-indigo-500 to-blue-500" },
  { name: "Other", icon: "📌", color: "from-gray-500 to-slate-500" },
];

const INITIAL_FORM = {
  description: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  category: "Food",
};

export default function ExpenseForm({ onExpenseAdded }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date || !form.category) {
      setError("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await createExpense({ ...form, amount: parseFloat(form.amount) });
      setForm(INITIAL_FORM);
      setSuccess(true);
      onExpenseAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.name === form.category) || CATEGORIES[0];

  return (
    <div className="glass-card p-8 animate-fade-up relative overflow-hidden group">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent opacity-50" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8 relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                Add New Expense
              </h2>
              <p className="text-white/50 text-sm mt-0.5">Track every dollar you spend</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-fuchsia-500/50 rounded-full mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Description Field */}
          <div className="relative">
            <label className="block text-xs font-display font-bold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Description
            </label>
            <div className="relative">
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Lunch at restaurant"
                className="glass-input pl-12 transition-all duration-300 focus:pl-14"
                maxLength={100}
              />
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-all duration-300 ${
                focusedField === 'description' ? 'scale-110 rotate-12' : ''
              }`}>
                📝
              </div>
              {focusedField === 'description' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 -z-10 blur-xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Amount Field */}
          <div className="relative">
            <label className="block text-xs font-display font-bold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Amount (USD)
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                onFocus={() => setFocusedField('amount')}
                onBlur={() => setFocusedField(null)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="glass-input pl-14 text-lg font-bold transition-all duration-300"
              />
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                focusedField === 'amount' ? 'scale-125 text-green-400' : 'text-violet-400'
              }`}>
                <span className="text-2xl font-black">$</span>
              </div>
              {focusedField === 'amount' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 -z-10 blur-xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Date Field */}
          <div className="relative">
            <label className="block text-xs font-display font-bold text-white/60 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                onFocus={() => setFocusedField('date')}
                onBlur={() => setFocusedField(null)}
                className="glass-input pl-12 [color-scheme:dark] transition-all duration-300"
              />
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-all duration-300 ${
                focusedField === 'date' ? 'scale-110' : ''
              }`}>
                📅
              </div>
              {focusedField === 'date' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 -z-10 blur-xl animate-pulse" />
              )}
            </div>
          </div>

          {/* Category Selection - Enhanced with Icons */}
          <div className="relative">
            <label className="block text-xs font-display font-bold text-white/60 mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              Category
            </label>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = form.category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, category: cat.name }))}
                    className={`relative p-4 rounded-xl transition-all duration-300 group/cat ${
                      isSelected 
                        ? 'bg-gradient-to-br from-white/15 to-white/5 scale-105 shadow-lg' 
                        : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    {/* Glow effect when selected */}
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 rounded-xl blur-lg -z-10 animate-pulse`} />
                    )}
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className={`text-3xl transition-transform duration-300 ${
                        isSelected ? 'scale-110 animate-bounce' : 'group-hover/cat:scale-110'
                      }`}>
                        {cat.icon}
                      </span>
                      <span className={`text-xs font-bold transition-all duration-300 ${
                        isSelected 
                          ? `bg-gradient-to-r ${cat.color} bg-clip-text text-transparent` 
                          : 'text-white/60 group-hover/cat:text-white/90'
                      }`}>
                        {cat.name}
                      </span>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message with Animation */}
          {error && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/30 p-4 animate-shake">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-red-500/5 animate-pulse" />
              <div className="relative flex items-center gap-3">
                <div className="text-2xl animate-bounce">⚠️</div>
                <p className="text-rose-300 text-sm font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message with Confetti Effect */}
          {success && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 p-4 animate-fade-up">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 animate-pulse" />
              <div className="relative flex items-center gap-3">
                <div className="text-2xl animate-bounce">✨</div>
                <p className="text-emerald-300 text-sm font-semibold">Expense added successfully!</p>
              </div>
              {/* Confetti particles */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-400"
                  style={{
                    top: '50%',
                    left: '50%',
                    animation: `confetti 1s ease-out ${i * 0.1}s forwards`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative mt-2 group/btn overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategory.color} rounded-xl transition-all duration-300 ${
              loading ? 'opacity-70' : 'group-hover/btn:opacity-90'
            }`} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            
            {/* Button content */}
            <div className="relative px-6 py-4 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="relative">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                  <span className="font-display font-bold text-white text-lg">Processing...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl group-hover/btn:scale-110 transition-transform duration-300">
                    {selectedCategory.icon}
                  </span>
                  <span className="font-display font-bold text-white text-lg group-hover/btn:tracking-wider transition-all duration-300">
                    Add Expense
                  </span>
                  <svg 
                    className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </div>

            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${selectedCategory.color} opacity-0 group-hover/btn:opacity-50 blur-xl transition-opacity duration-300 -z-10`} />
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + ${Math.random() * 200 - 100}px),
              calc(-50% - ${Math.random() * 100 + 50}px)
            ) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
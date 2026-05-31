const Expense = require("../models/expenseModel");

// ─── GET /api/expenses ─────────────────────────────────────────────────────────
// Returns all expenses, sorted by date descending
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── POST /api/expenses ────────────────────────────────────────────────────────
// Creates a new expense
const createExpense = async (req, res) => {
  try {
    const { description, amount, date, category } = req.body;
    const expense = await Expense.create({ description, amount, date, category });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── DELETE /api/expenses/:id ──────────────────────────────────────────────────
// Deletes a specific expense by ID
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── GET /api/expenses/last7days ───────────────────────────────────────────────
// Returns aggregated daily totals for the last 7 days (for Chart.js)
const getLast7DaysExpenses = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build a full 7-day array (fill in 0 for missing days)
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toISOString().split("T")[0];
      const found = expenses.find((e) => e._id === label);
      result.push({ date: label, total: found ? found.total : 0 });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getAllExpenses, createExpense, deleteExpense, getLast7DaysExpenses };

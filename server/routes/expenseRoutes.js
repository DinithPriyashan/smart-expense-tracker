const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  createExpense,
  deleteExpense,
  getLast7DaysExpenses,
} = require("../controllers/expenseController");

// ─── Expense Routes ───────────────────────────────────────────────────────────
router.get("/", getAllExpenses);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);
router.get("/last7days", getLast7DaysExpenses);

module.exports = router;

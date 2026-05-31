import axios from "axios";

// Base URL uses Vite proxy in dev; in production, set VITE_API_URL env var
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

export const fetchExpenses = () => API.get("/expenses");
export const createExpense = (data) => API.post("/expenses", data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const fetchLast7Days = () => API.get("/expenses/last7days");

export default API;

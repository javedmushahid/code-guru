const express = require("express");
const {
  isSignedIn,
  isValidToken,
  isSameUserOrAdmin,
} = require("./../middleware/index");
const {
  addExpense,
  getAllExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense"); 
const expenseRoute = express.Router();

expenseRoute.post("/add-expenses/:userId", isSameUserOrAdmin, addExpense);

expenseRoute.get("/expenses/:userId", isSameUserOrAdmin, getAllExpense);

expenseRoute.get(
  "/expenses/:expenseId/:userId",
  isSameUserOrAdmin,
  getSingleExpense
);

expenseRoute.put(
  "/expenses/:expenseId/:userId",
  isSameUserOrAdmin,
  updateExpense
);

expenseRoute.delete(
  "/expenses/:expenseId/:userId",
  isSameUserOrAdmin,
  deleteExpense
);

module.exports = expenseRoute;

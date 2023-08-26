const express = require("express");
const { loggerUtil } = require("../utils/logger");
const {
  OK,
  WRONG_ENTITY,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/statusCode");
const User = require("../models/UserModel");
const Expense = require("../models/expense");

const addExpense = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const expense = new Expense({ ...req.body, user: user._id });
    await expense.save();
    res
      .status(OK)
      .json({ status: OK, message: "Added Expense", data: expense });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const getAllExpense = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const expenses = await Expense.find({ user: user._id });
    res.status(OK).json({ status: OK, message: "Fetched expenses", expenses });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const getSingleExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const expense = await Expense.findOne({ _id: expenseId, user: user._id });
    if (!expense) {
      return res.status(NOT_FOUND).json({ error: "Expense not found" });
    }
    res.status(OK).json({ status: OK, message: "Fetched expense", expense });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: user._id },
      req.body,
      { new: true }
    );
    if (!expense) {
      return res.status(NOT_FOUND).json({ error: "Expense not found" });
    }
    res.status(OK).json({ status: OK, message: "Updated expense", expense });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const user = await User.findOne({userId});

    if (!user) {
      return res.status(UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: user._id,
    });
    if (!expense) {
      return res.status(NOT_FOUND).json({ error: "Expense not found" });
    }
    res.status(OK).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};

const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// @desc    Create a new expense for a trip
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { trip: tripId, title, category, amount, date, notes } = req.body;

    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID is required'
      });
    }

    // Verify trip exists and belongs to current user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to add expenses to this trip'
      });
    }

    const expense = await Expense.create({
      trip: tripId,
      user: req.user._id,
      title,
      category,
      amount,
      date: date || Date.now(),
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
};

// @desc    Get all expenses for a specific trip
// @route   GET /api/expenses/trip/:tripId
// @access  Private
const getExpensesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip exists and belongs to current user
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view expenses for this trip'
      });
    }

    const expenses = await Expense.find({ trip: tripId, user: req.user._id }).sort({ date: -1 });

    // Calculate total expenses and remaining budget
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = trip.budget - totalExpenses;

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
      summary: {
        tripBudget: trip.budget,
        totalExpenses,
        remainingBudget,
        isOverBudget: remainingBudget < 0
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Trip ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Verify user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Expense ID format'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Verify user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Expense ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
};

module.exports = {
  createExpense,
  getExpensesByTrip,
  updateExpense,
  deleteExpense
};

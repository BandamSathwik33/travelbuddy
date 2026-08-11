const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpensesByTrip,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all expense routes
router.use(protect);

router.post('/', createExpense);
router.get('/trip/:tripId', getExpensesByTrip);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;

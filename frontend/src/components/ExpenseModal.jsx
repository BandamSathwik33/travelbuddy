import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Plus, Edit3, Trash2, DollarSign, Calendar, Tag,
  FileText, AlertCircle, CheckCircle2, Plane, Hotel,
  Utensils, Zap, ShoppingBag, Car, HelpCircle, ChevronDown,
  TrendingUp, TrendingDown, Receipt
} from 'lucide-react';
import { expenseApi } from '../api/api';

const CATEGORIES = [
  { value: 'Flight',        label: 'Flight',        icon: Plane,       color: 'text-sky-400',     bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
  { value: 'Accommodation', label: 'Stay',          icon: Hotel,       color: 'text-violet-400',  bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { value: 'Food',          label: 'Food',          icon: Utensils,    color: 'text-amber-400',   bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  { value: 'Activities',   label: 'Activities',    icon: Zap,         color: 'text-emerald-400', bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
  { value: 'Shopping',     label: 'Shopping',      icon: ShoppingBag, color: 'text-pink-400',    bg: 'bg-pink-500/10',   border: 'border-pink-500/20' },
  { value: 'Transport',    label: 'Transport',     icon: Car,         color: 'text-orange-400',  bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { value: 'Other',        label: 'Other',         icon: HelpCircle,  color: 'text-slate-400',   bg: 'bg-slate-500/10',  border: 'border-slate-500/20' }
];

const getCategoryMeta = (value) =>
  CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1];

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

const toInputDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
};

const EMPTY_FORM = {
  title: '', category: 'Other', amount: '', date: new Date().toISOString().split('T')[0], notes: ''
};

export default function ExpenseModal({ isOpen, onClose, trip }) {
  const [expenses, setExpenses]   = useState([]);
  const [summary, setSummary]     = useState({ tripBudget: 0, totalExpenses: 0, remainingBudget: 0, isOverBudget: false });
  const [loading, setLoading]     = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError]         = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchExpenses = useCallback(async () => {
    if (!trip?._id) return;
    setLoading(true);
    setError('');
    try {
      const res = await expenseApi.getExpensesByTrip(trip._id);
      if (res.success) {
        setExpenses(res.data);
        setSummary(res.summary);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [trip?._id]);

  useEffect(() => {
    if (isOpen && trip?._id) {
      fetchExpenses();
      setShowForm(false);
      setEditingExpense(null);
      setFormData(EMPTY_FORM);
      setError('');
      setFormError('');
    }
  }, [isOpen, trip?._id, fetchExpenses]);

  if (!isOpen || !trip) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const openAddForm = () => {
    setEditingExpense(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title:    expense.title,
      category: expense.category,
      amount:   expense.amount,
      date:     toInputDate(expense.date),
      notes:    expense.notes || ''
    });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editingExpense) {
        const res = await expenseApi.updateExpense(editingExpense._id, formData);
        if (res.success) {
          closeForm();
          await fetchExpenses();
        }
      } else {
        const res = await expenseApi.createExpense({ ...formData, trip: trip._id });
        if (res.success) {
          closeForm();
          await fetchExpenses();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.join(', ')
        || err.response?.data?.message
        || 'Failed to save expense';
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseApi.deleteExpense(id);
      setDeleteConfirm(null);
      await fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const budgetPercent = summary.tripBudget > 0
    ? Math.min((summary.totalExpenses / summary.tripBudget) * 100, 100)
    : 0;
  const isOver = summary.isOverBudget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Expense Tracker</h2>
            </div>
            <p className="text-slate-400 text-sm">{trip.name} &bull; {trip.destination}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors ml-4 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Summary Bar */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800/60 shrink-0">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Trip Budget */}
            <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Trip Budget</p>
              <p className="text-lg font-bold text-white">${summary.tripBudget.toLocaleString()}</p>
            </div>
            {/* Spent */}
            <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Spent</p>
              <p className={`text-lg font-bold ${isOver ? 'text-rose-400' : 'text-amber-400'}`}>
                ${summary.totalExpenses.toLocaleString()}
              </p>
            </div>
            {/* Remaining */}
            <div className={`rounded-2xl p-3.5 border ${isOver ? 'bg-rose-950/30 border-rose-800/50' : 'bg-emerald-950/30 border-emerald-800/50'}`}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Remaining</p>
              <div className="flex items-center gap-1">
                {isOver
                  ? <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                  : <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />}
                <p className={`text-lg font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOver ? '-' : ''}${Math.abs(summary.remainingBudget).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : budgetPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-500">{budgetPercent.toFixed(0)}% of budget used</span>
            {isOver && <span className="text-[10px] text-rose-400 font-semibold">⚠ Over Budget!</span>}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Expense Form */}
          {showForm && (
            <div className="p-6 border-b border-slate-800 bg-slate-950/40">
              <h3 className="text-sm font-bold text-white mb-4">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>

              {formError && (
                <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Title & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                    <input
                      type="text" name="title" value={formData.title} onChange={handleChange} required
                      placeholder="e.g. Hotel Booking"
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                    <div className="relative">
                      <select
                        name="category" value={formData.category} onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-indigo-500 transition-colors pr-8"
                      >
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Amount & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Amount ($)</label>
                    <input
                      type="number" name="amount" value={formData.amount} onChange={handleChange}
                      required min="0" step="0.01" placeholder="0.00"
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="date" name="date" value={formData.date} onChange={handleChange} required
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes (optional)</label>
                  <input
                    type="text" name="notes" value={formData.notes} onChange={handleChange}
                    placeholder="Add a short note..."
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit" disabled={formLoading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    {formLoading
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <CheckCircle2 className="w-4 h-4" />}
                    {editingExpense ? 'Update Expense' : 'Save Expense'}
                  </button>
                  <button
                    type="button" onClick={closeForm}
                    className="text-sm text-slate-400 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Expense List */}
          <div className="p-6">
            {/* Top bar with Add button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">
                Expenses
                {expenses.length > 0 && (
                  <span className="ml-2 text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {expenses.length}
                  </span>
                )}
              </h3>
              {!showForm && (
                <button
                  onClick={openAddForm}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Expense
                </button>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-16 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">No expenses yet</p>
                <p className="text-xs text-slate-500">Track your spending by adding expenses above.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {expenses.map((expense) => {
                  const meta = getCategoryMeta(expense.category);
                  const Icon = meta.icon;
                  return (
                    <div
                      key={expense._id}
                      className="flex items-center gap-3 p-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group"
                    >
                      {/* Category Icon */}
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${meta.bg} ${meta.border}`}>
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">{expense.title}</p>
                          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
                            {expense.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{formatDate(expense.date)}
                          </span>
                          {expense.notes && (
                            <span className="text-xs text-slate-500 truncate flex items-center gap-1">
                              <FileText className="w-3 h-3 shrink-0" />
                              {expense.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-base font-bold text-white">${expense.amount.toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditForm(expense)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit expense"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {deleteConfirm === expense._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="text-[10px] font-semibold px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[10px] font-semibold px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(expense._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

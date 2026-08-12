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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-black/5 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-black/5 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-5 h-5 text-wandor-prompt" />
              <h2 className="text-[24px] font-semibold text-black tracking-tight leading-tight">Expense Tracker</h2>
            </div>
            <p className="text-wandor-muted text-[14px]">{trip.name} &bull; {trip.destination}</p>
          </div>
          <button
            onClick={onClose}
            className="text-wandor-muted hover:text-black p-2 rounded-full hover:bg-black/5 transition-colors ml-4 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Summary Bar */}
        <div className="px-8 pt-6 pb-6 border-b border-black/5 shrink-0 bg-black/[0.02]">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {/* Trip Budget */}
            <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
              <p className="text-[11px] text-wandor-muted uppercase tracking-wider font-semibold mb-1">Trip Budget</p>
              <p className="text-[22px] font-bold text-black">${summary.tripBudget.toLocaleString()}</p>
            </div>
            {/* Spent */}
            <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
              <p className="text-[11px] text-wandor-muted uppercase tracking-wider font-semibold mb-1">Spent</p>
              <p className={`text-[22px] font-bold ${isOver ? 'text-red-500' : 'text-amber-600'}`}>
                ${summary.totalExpenses.toLocaleString()}
              </p>
            </div>
            {/* Remaining */}
            <div className={`rounded-2xl p-4 border shadow-sm ${isOver ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className="text-[11px] text-wandor-muted uppercase tracking-wider font-semibold mb-1">Remaining</p>
              <div className="flex items-center gap-1.5">
                {isOver
                  ? <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                  : <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />}
                <p className={`text-[22px] font-bold ${isOver ? 'text-red-500' : 'text-emerald-600'}`}>
                  {isOver ? '-' : ''}${Math.abs(summary.remainingBudget).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : budgetPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[12px] font-medium text-wandor-muted">{budgetPercent.toFixed(0)}% of budget used</span>
            {isOver && <span className="text-[12px] text-red-500 font-semibold">⚠ Over Budget!</span>}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Expense Form */}
          {showForm && (
            <div className="p-8 border-b border-black/5 bg-black/[0.02]">
              <h3 className="text-[18px] font-semibold text-black mb-5">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>

              {formError && (
                <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-wandor-muted uppercase tracking-wider mb-2">Title</label>
                    <input
                      type="text" name="title" value={formData.title} onChange={handleChange} required
                      placeholder="e.g. Hotel Booking"
                      className="w-full px-4 h-12 bg-black/5 border border-transparent rounded-2xl text-black text-[14px] placeholder-black/40 focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-wandor-muted uppercase tracking-wider mb-2">Category</label>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-wandor-muted uppercase tracking-wider mb-2">Amount ($)</label>
                    <input
                      type="number" name="amount" value={formData.amount} onChange={handleChange}
                      required min="0" step="0.01" placeholder="0.00"
                      className="w-full px-4 h-12 bg-black/5 border border-transparent rounded-2xl text-black text-[14px] placeholder-black/40 focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-wandor-muted uppercase tracking-wider mb-2">Date</label>
                    <input
                      type="date" name="date" value={formData.date} onChange={handleChange} required
                      className="w-full px-4 h-12 bg-black/5 border border-transparent rounded-2xl text-black text-[14px] placeholder-black/40 focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-semibold text-wandor-muted uppercase tracking-wider mb-2">Notes (optional)</label>
                  <input
                    type="text" name="notes" value={formData.notes} onChange={handleChange}
                    placeholder="Add a short note..."
                    className="w-full px-4 h-12 bg-black/5 border border-transparent rounded-2xl text-black text-[14px] placeholder-black/40 focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit" disabled={formLoading}
                    className="flex items-center gap-2 bg-wandor-prompt hover:bg-[#7a4827] disabled:opacity-50 text-white text-[13px] font-medium px-5 py-3 rounded-full shadow-md shadow-wandor-prompt/20 transition-all uppercase tracking-[0.04em] active:scale-95"
                  >
                    {formLoading
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <CheckCircle2 className="w-4 h-4" />}
                    {editingExpense ? 'Update Expense' : 'Save Expense'}
                  </button>
                  <button
                    type="button" onClick={closeForm}
                    className="text-[13px] text-wandor-muted font-medium hover:text-black px-5 py-3 rounded-full hover:bg-black/5 transition-colors uppercase tracking-[0.04em]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Expense List */}
          <div className="p-8">
            {/* Top bar with Add button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold text-black">
                Expenses
                {expenses.length > 0 && (
                  <span className="ml-3 text-[12px] font-medium text-black bg-black/5 px-2.5 py-0.5 rounded-full">
                    {expenses.length}
                  </span>
                )}
              </h3>
              {!showForm && (
                <button
                  onClick={openAddForm}
                  className="flex items-center gap-1.5 text-[13px] font-medium bg-black hover:bg-[#333] text-white px-4 py-2 rounded-full transition-all shadow-md shadow-black/10 uppercase tracking-[0.04em] active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Expense
                </button>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-20 bg-gray-100 rounded-[20px] animate-pulse" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-black" />
                </div>
                <p className="text-[16px] font-semibold text-black mb-1">No expenses yet</p>
                <p className="text-[14px] text-wandor-muted">Track your spending by adding expenses above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const meta = getCategoryMeta(expense.category);
                  const Icon = meta.icon;
                  return (
                    <div
                      key={expense._id}
                      className="flex items-center gap-4 p-4 bg-white border border-black/5 rounded-[20px] hover:border-black/10 hover:shadow-sm transition-all group"
                    >
                      {/* Category Icon */}
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border ${meta.bg} ${meta.border}`}>
                        <Icon className={`w-6 h-6 ${meta.color}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-[15px] font-semibold text-black truncate">{expense.title}</p>
                          <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
                            {expense.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[13px] text-wandor-muted flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5" />{formatDate(expense.date)}
                          </span>
                          {expense.notes && (
                            <span className="text-[13px] text-wandor-muted truncate flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              {expense.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-[18px] font-bold text-black">${expense.amount.toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button
                          onClick={() => openEditForm(expense)}
                          className="p-2 text-wandor-muted hover:text-black hover:bg-black/5 rounded-full transition-colors"
                          title="Edit expense"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {deleteConfirm === expense._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="text-[11px] font-semibold px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors uppercase tracking-wider"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-[11px] font-semibold px-3 py-1.5 bg-black/5 hover:bg-black/10 text-black rounded-full transition-colors uppercase tracking-wider"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(expense._id)}
                            className="p-2 text-wandor-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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

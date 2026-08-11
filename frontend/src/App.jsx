import React, { useState, useEffect } from 'react';
import { tripApi, authApi } from './api/api';
import TripCard from './components/TripCard';
import TripFormModal from './components/TripFormModal';
import AuthModal from './components/AuthModal';
import ExpenseModal from './components/ExpenseModal';
import ItineraryModal from './components/ItineraryModal';
import { Compass, Plus, RefreshCw, Globe, DollarSign, Users, AlertCircle, CheckCircle2, LogIn, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authChecking, setAuthChecking] = useState(true);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedTripForExpenses, setSelectedTripForExpenses] = useState(null);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [selectedTripForItinerary, setSelectedTripForItinerary] = useState(null);

  // Check existing token and fetch user on initial mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          handleLogout();
        }
      }
      setAuthChecking(false);
    };

    verifyUser();
  }, []);

  // Fetch Trips whenever user is authenticated
  const fetchTrips = async () => {
    if (!token && !user) return;
    try {
      setLoading(true);
      setError('');
      const response = await tripApi.getAllTrips();
      if (response.success) {
        setTrips(response.data);
      } else {
        setError('Failed to load trips');
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        handleLogout();
      } else {
        setError(err.response?.data?.message || 'Could not connect to Express Backend API');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [user, token]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth Handling (Login / Register)
  const handleAuthSuccess = async (type, payload) => {
    let res;
    if (type === 'login') {
      res = await authApi.login(payload);
    } else {
      res = await authApi.register(payload);
    }

    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(type === 'login' ? `Welcome back, ${res.user.name}!` : `Account created! Welcome, ${res.user.name}!`);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTrips([]);
    showToast('Logged out successfully', 'success');
  };

  // Handle Create or Update Submit
  const handleSaveTrip = async (tripData) => {
    try {
      if (editingTrip) {
        // UPDATE
        const res = await tripApi.updateTrip(editingTrip._id, tripData);
        if (res.success) {
          setTrips((prev) =>
            prev.map((t) => (t._id === editingTrip._id ? res.data : t))
          );
          showToast('Trip updated successfully!');
        }
      } else {
        // CREATE
        const res = await tripApi.createTrip(tripData);
        if (res.success) {
          setTrips((prev) => [res.data, ...prev]);
          showToast('New trip created successfully!');
        }
      }
      setIsModalOpen(false);
      setEditingTrip(null);
    } catch (err) {
      console.error('Error saving trip:', err);
      showToast(err.response?.data?.message || 'Failed to save trip', 'error');
    }
  };

  // Handle Delete
  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      const res = await tripApi.deleteTrip(id);
      if (res.success) {
        setTrips((prev) => prev.filter((t) => t._id !== id));
        showToast('Trip deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting trip:', err);
      showToast(err.response?.data?.message || 'Failed to delete trip', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Please log in or register to create a trip', 'error');
      return;
    }
    setEditingTrip(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleManageExpenses = (trip) => {
    setSelectedTripForExpenses(trip);
    setIsExpenseModalOpen(true);
  };

  const handleViewItinerary = (trip) => {
    setSelectedTripForItinerary(trip);
    setIsItineraryModalOpen(true);
  };

  // Stats calculation
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalTravelers = trips.reduce((sum, t) => sum + (t.travelers || 0), 0);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm animate-pulse">Initializing TripSync AI...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-800'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="glass-panel sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2.5 rounded-2xl border border-indigo-500/30 text-indigo-400">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Trip<span className="text-indigo-400">Sync</span>
                </h1>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  AI Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Collaborative Travel Planner</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={fetchTrips}
                  className="p-2.5 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
                  title="Refresh Trips from API"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Trip
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900 rounded-xl transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
              >
                <LogIn className="w-4 h-4" /> Log In / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* Unauthenticated Landing State */
          <div className="max-w-3xl mx-auto text-center py-12 px-4">
            <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-2xl">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Secure JWT Authentication Enabled
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Log in or register your account to start managing your personal trip itineraries, budget, and travel preferences with MongoDB user persistence.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" /> Get Started / Log In
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Your Trips</p>
                  <h3 className="text-2xl font-bold text-white">{trips.length}</h3>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Planned Budget</p>
                  <h3 className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</h3>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Travelers</p>
                  <h3 className="text-2xl font-bold text-white">{totalTravelers}</h3>
                </div>
              </div>
            </div>

            {/* Section Heading */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Your Planned Trips</h2>
                <p className="text-slate-400 text-sm">Protected REST API &bull; User ID Scoped</p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1 text-sm">{error}</div>
                <button
                  onClick={fetchTrips}
                  className="text-xs underline font-semibold hover:text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton / State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="glass-card rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 bg-slate-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : trips.length === 0 ? (
              /* Empty State */
              <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-slate-800">
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No trips created yet</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Get started by creating your first trip. Enter destination, dates, budget and interests.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  + Create First Trip
                </button>
              </div>
            ) : (
              /* Trip Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTrip}
                    onManageExpenses={handleManageExpenses}
                    onViewItinerary={handleViewItinerary}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Form Modal */}
      <TripFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrip(null);
        }}
        onSubmit={handleSaveTrip}
        initialData={editingTrip}
      />

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setSelectedTripForExpenses(null);
        }}
        trip={selectedTripForExpenses}
      />

      {/* Itinerary Modal */}
      <ItineraryModal
        isOpen={isItineraryModalOpen}
        onClose={() => {
          setIsItineraryModalOpen(false);
          setSelectedTripForItinerary(null);
        }}
        trip={selectedTripForItinerary}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { tripApi, authApi } from './api/api';
import TripCard from './components/TripCard';
import TripFormModal from './components/TripFormModal';
import AuthModal from './components/AuthModal';
import ExpenseModal from './components/ExpenseModal';
import ItineraryModal from './components/ItineraryModal';
import Hero from './components/Hero';
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
    <div className="min-h-screen flex flex-col font-sans text-wandor-text">
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

      {!user ? (
        <Hero onLoginClick={() => setIsAuthModalOpen(true)} />
      ) : (
        <>
          {/* Navigation Header */}
          <header className="pt-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
            <div className="max-w-[1360px] mx-auto h-16 flex items-center justify-between px-6 bg-white/70 backdrop-blur-xl border border-black/5 rounded-full shadow-sm">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[28px] font-display font-medium text-black tracking-tight leading-none">
                      TripSync
                    </h1>
                  </div>
                </div>
              </div>

              {/* Center Links (Hidden on Mobile) */}
              <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8">
                <button className="bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase text-wandor-muted tracking-[0.04em] transition-opacity hover:text-black">
                  Discover
                </button>
                <button className="bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase text-wandor-muted tracking-[0.04em] transition-opacity hover:text-black">
                  My Trips
                </button>
                <button className="bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase text-wandor-muted tracking-[0.04em] transition-opacity hover:text-black">
                  Expenses
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-black/5 bg-black/5">
                  <div className="w-6 h-6 rounded-full bg-wandor-prompt text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <p className="text-xs font-semibold text-black leading-tight pr-2">{user.name}</p>
                </div>

                <button
                  onClick={fetchTrips}
                  className="p-2 text-wandor-muted hover:text-black transition-colors"
                  title="Refresh Trips from API"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 text-wandor-muted hover:text-rose-500 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="bg-black hover:bg-[#333] text-white font-medium text-[13px] uppercase tracking-[0.04em] px-4 py-2.5 rounded-full transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Trip
                </button>
              </div>
            </div>
          </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Authenticated Dashboard */}
        <>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight mb-2">Good morning, {user?.name?.split(' ')[0]}</h2>
              <p className="text-xl text-wandor-muted">Ready to plan your next adventure?</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-[32px] p-6 flex flex-col justify-center border border-black/5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black/5 rounded-full text-black">
                    <Globe className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-wandor-muted font-medium uppercase tracking-widest">Total Trips</p>
                </div>
                <h3 className="text-[40px] font-semibold text-black leading-none">{trips.length}</h3>
              </div>

              <div className="bg-white rounded-[32px] p-6 flex flex-col justify-center border border-black/5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black/5 rounded-full text-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-wandor-muted font-medium uppercase tracking-widest">Total Budget</p>
                </div>
                <h3 className="text-[40px] font-semibold text-black leading-none">${totalBudget.toLocaleString()}</h3>
              </div>

              <div className="bg-white rounded-[32px] p-6 flex flex-col justify-center border border-black/5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-black/5 rounded-full text-black">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-wandor-muted font-medium uppercase tracking-widest">Total Travelers</p>
                </div>
                <h3 className="text-[40px] font-semibold text-black leading-none">{totalTravelers}</h3>
              </div>
            </div>

            {/* Section Heading */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-black tracking-tight">Your Upcoming Adventures</h2>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1 text-sm">{error}</div>
                <button
                  onClick={fetchTrips}
                  className="text-xs font-semibold hover:underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton / State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-[32px] p-6 h-[320px] animate-pulse border border-black/5">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-100 rounded-full w-1/3"></div>
                      <div className="h-8 bg-gray-100 rounded-full w-2/3"></div>
                      <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : trips.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-[40px] p-16 text-center max-w-2xl mx-auto my-12 border border-black/5 shadow-sm">
                <div className="w-20 h-20 bg-black/5 text-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-semibold text-black mb-4">No trips created yet</h3>
                <p className="text-lg text-wandor-muted mb-8 max-w-md mx-auto">
                  Get started by creating your first adventure. Tell our AI where you want to go.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-black hover:bg-[#333] text-white font-medium text-[15px] uppercase tracking-[0.04em] px-8 py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-black/10"
                >
                  Plan My Trip
                </button>
              </div>
            ) : (
              /* Trip Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </main>
      </>
      )}

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

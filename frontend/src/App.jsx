import React, { useState, useEffect } from 'react';
import { tripApi, authApi } from './api/api';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AuthModal from './components/AuthModal';
import TripFormModal from './components/TripFormModal';
import ExpenseModal from './components/ExpenseModal';
import ItineraryModal from './components/ItineraryModal';

// Views
import DashboardView from './components/views/DashboardView';
import MyTripsView from './components/views/MyTripsView';
import DiscoverView from './components/views/DiscoverView';
import ExpensesView from './components/views/ExpensesView';
import TripDetailView from './components/views/TripDetailView';

import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authChecking, setAuthChecking] = useState(true);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // View Routing State
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, my-trips, discover, expenses, trip-detail
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Modal States
  const [isTripFormModalOpen, setIsTripFormModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedTripForExpenses, setSelectedTripForExpenses] = useState(null);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [selectedTripForItinerary, setSelectedTripForItinerary] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTrips([]);
    setCurrentView('dashboard');
    showToast('Logged out successfully', 'success');
  };

  const handleSaveTrip = async (tripData) => {
    try {
      if (editingTrip) {
        const res = await tripApi.updateTrip(editingTrip._id, tripData);
        if (res.success) {
          setTrips((prev) => prev.map((t) => (t._id === editingTrip._id ? res.data : t)));
          if(selectedTrip?._id === editingTrip._id) {
             setSelectedTrip(res.data);
          }
          showToast('Trip updated successfully!');
        }
      } else {
        const res = await tripApi.createTrip(tripData);
        if (res.success) {
          setTrips((prev) => [res.data, ...prev]);
          showToast('New trip created successfully!');
        }
      }
      setIsTripFormModalOpen(false);
      setEditingTrip(null);
    } catch (err) {
      console.error('Error saving trip:', err);
      showToast(err.response?.data?.message || 'Failed to save trip', 'error');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      const res = await tripApi.deleteTrip(id);
      if (res.success) {
        setTrips((prev) => prev.filter((t) => t._id !== id));
        if(selectedTrip?._id === id) {
           setCurrentView('dashboard');
           setSelectedTrip(null);
        }
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
    setIsTripFormModalOpen(true);
  };

  const handleOpenEditModal = (trip) => {
    setEditingTrip(trip);
    setIsTripFormModalOpen(true);
  };

  const handleManageExpenses = (trip) => {
    setSelectedTripForExpenses(trip);
    setIsExpenseModalOpen(true);
  };

  const handleViewItinerary = (trip) => {
    setSelectedTripForItinerary(trip);
    setIsItineraryModalOpen(true);
  };

  const handleNavigateToTrip = (trip) => {
    setSelectedTrip(trip);
    setCurrentView('trip-detail');
  };

  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalTravelers = trips.reduce((sum, t) => sum + (t.travelers || 0), 0);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-charcoal">
        <div className="w-12 h-12 border-4 border-brown/30 border-t-brown rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm font-medium">Initializing TripSync...</p>
      </div>
    );
  }

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            user={user} trips={trips} totalBudget={totalBudget} totalTravelers={totalTravelers} 
            loading={loading} error={error} fetchTrips={fetchTrips} handleOpenCreateModal={handleOpenCreateModal}
            handleOpenEditModal={handleOpenEditModal} handleDeleteTrip={handleDeleteTrip}
            handleManageExpenses={handleManageExpenses} handleViewItinerary={handleViewItinerary}
            onNavigateToTrip={handleNavigateToTrip}
          />
        );
      case 'my-trips':
        return (
          <MyTripsView 
            trips={trips} handleOpenCreateModal={handleOpenCreateModal}
            handleOpenEditModal={handleOpenEditModal} handleDeleteTrip={handleDeleteTrip}
            handleManageExpenses={handleManageExpenses} handleViewItinerary={handleViewItinerary}
            onNavigateToTrip={handleNavigateToTrip}
          />
        );
      case 'discover':
        return <DiscoverView handleOpenCreateModal={handleOpenCreateModal} />;
      case 'expenses':
        return <ExpensesView handleManageExpenses={handleManageExpenses} trips={trips} />;
      case 'trip-detail':
        return (
          <TripDetailView 
            trip={selectedTrip} 
            onBack={() => setCurrentView('dashboard')}
            handleEditTrip={handleOpenEditModal}
            handleDeleteTrip={handleDeleteTrip}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-charcoal">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-float border transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-terracotta/95 text-paper border-brown'
              : 'bg-olive/95 text-paper border-olive/50'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-paper" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-paper" />
          )}
          <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}

      {!user ? (
        <>
          <Navigation 
            user={user} 
            onLogin={() => setIsAuthModalOpen(true)} 
          />
          <Hero onLoginClick={() => setIsAuthModalOpen(true)} />
        </>
      ) : (
        <>
          <Navigation 
            user={user} 
            loading={loading}
            currentView={currentView}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onRefresh={fetchTrips}
            onCreateTrip={handleOpenCreateModal}
          />
          <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8">
            {renderView()}
          </main>
        </>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <TripFormModal
        isOpen={isTripFormModalOpen}
        onClose={() => {
          setIsTripFormModalOpen(false);
          setEditingTrip(null);
        }}
        onSubmit={handleSaveTrip}
        initialData={editingTrip}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setSelectedTripForExpenses(null);
        }}
        trip={selectedTripForExpenses}
      />

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

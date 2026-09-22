import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DepartmentGrid from './components/DepartmentGrid';
import DoctorDirectory from './components/DoctorDirectory';
import EmergencyBanner from './components/EmergencyBanner';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookAppointmentModal from './components/BookAppointmentModal';
import MyAppointmentsModal from './components/MyAppointmentsModal';
import MediBotWidget from './components/Chatbot/MediBotWidget';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Modals & Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [externalChatPrompt, setExternalChatPrompt] = useState(null);

  // 1. Initial Load: Check auth & fetch departments + doctors
  useEffect(() => {
    checkCurrentUser();
    loadDepartments();
    loadDoctors();
  }, []);

  // 2. Fetch appointments when user logs in
  useEffect(() => {
    if (user) {
      loadAppointments();
    } else {
      setAppointments([]);
    }
  }, [user]);

  const checkCurrentUser = async () => {
    const token = localStorage.getItem('medibot_token');
    if (!token) return;
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem('medibot_token');
        setUser(null);
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await api.getDepartments();
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const loadDoctors = async () => {
    try {
      const res = await api.getDoctors();
      if (res.success && res.data) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await api.getMyAppointments();
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medibot_token');
    setUser(null);
    setAppointments([]);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  // Chatbot launcher helpers
  const handleOpenChatWithPrompt = (prompt) => {
    setExternalChatPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleAskBotAboutDept = (dept) => {
    handleOpenChatWithPrompt(`Tell me about the ${dept.name} department and which doctors are available.`);
  };

  const handleAskBotAboutDoctor = (doc) => {
    handleOpenChatWithPrompt(`Can you tell me more about Dr. ${doc.name}'s experience, timings, and consultation fee?`);
  };

  const handleStartBooking = (doc = null) => {
    setSelectedDoctorForBooking(doc || doctors[0] || null);
    setIsBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenMyAppointments={() => setIsAppointmentsModalOpen(true)}
        onLogout={handleLogout}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection
          onOpenChat={() => setIsChatOpen(true)}
          onBookNow={() => {
            const el = document.getElementById('doctors');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <DepartmentGrid
          departments={departments}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={(code) => setSelectedDepartment(code)}
          onAskBotAboutDept={handleAskBotAboutDept}
        />

        <DoctorDirectory
          doctors={doctors}
          departments={departments}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={(code) => setSelectedDepartment(code)}
          onBookDoctor={handleStartBooking}
          onAskBotAboutDoctor={handleAskBotAboutDoctor}
        />

        <EmergencyBanner
          onOpenChat={handleOpenChatWithPrompt}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating MediBot Widget & Chat Window */}
      <MediBotWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        user={user}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onBookDoctor={handleStartBooking}
        externalPrompt={externalChatPrompt}
        onClearExternalPrompt={() => setExternalChatPrompt(null)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        doctor={selectedDoctorForBooking}
        doctors={doctors}
        user={user}
        onRequireLogin={() => {
          setIsBookModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        onBookingSuccess={() => {
          loadAppointments();
        }}
      />

      <MyAppointmentsModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
        appointments={appointments}
        onRefresh={loadAppointments}
        onOpenBook={() => {
          setIsAppointmentsModalOpen(false);
          handleStartBooking();
        }}
      />
    </div>
  );
}

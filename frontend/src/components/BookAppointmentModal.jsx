import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const TIME_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM',
];

export default function BookAppointmentModal({
  isOpen,
  onClose,
  doctor,
  doctors,
  user,
  onRequireLogin,
  onBookingSuccess,
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctor?._id || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  // Active doctor
  const currentDoctor = doctors.find((d) => d._id === (selectedDoctorId || doctor?._id)) || doctor;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }

    if (!selectedDoctorId && !doctor?._id) {
      setError('Please select a doctor');
      return;
    }

    if (!appointmentDate) {
      setError('Please select an appointment date');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.bookAppointment({
        doctorId: selectedDoctorId || doctor._id,
        appointmentDate,
        timeSlot,
        reason: reason || 'General Consultation',
      });

      if (res.success) {
        setSuccessData(res.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onBookingSuccess) onBookingSuccess(res.data);
      } else {
        setError(res.message || 'Failed to schedule appointment');
      }
    } catch (err) {
      setError(err.message || 'Server error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setError('');
    onClose();
  };

  // Min date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Appointment Confirmed!
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Your appointment has been registered in the Hospital Management System.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5 mb-6">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Token Number:</span>
                <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {successData.tokenNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-800">
                  Dr. {successData.doctor?.name} ({successData.doctor?.specialization})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-800">
                  {new Date(successData.appointmentDate).toDateString()} at {successData.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Location:</span>
                <span className="font-bold text-slate-800">
                  {successData.doctor?.roomNumber || 'Main OPD Block'}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Book OPD Consultation
                </h3>
                <p className="text-xs text-slate-500">
                  Select doctor, date, and preferred time slot
                </p>
              </div>
            </div>

            {!user && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                <span>Please log in to your patient account to confirm appointments.</span>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="font-bold text-amber-900 underline ml-2 shrink-0"
                >
                  Log In
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              {/* Doctor Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Specialist Doctor
                </label>
                <select
                  value={selectedDoctorId || doctor?._id || ''}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      Dr. {d.name} — {d.specialization} (${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {currentDoctor && (
                <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="font-bold text-slate-800">OPD Timings:</span>{' '}
                    {currentDoctor.opdTimings}
                  </p>
                  <p>
                    <span className="font-bold text-slate-800">Room:</span>{' '}
                    {currentDoctor.roomNumber} •{' '}
                    <span className="font-bold text-emerald-700">
                      Fee: ${currentDoctor.consultationFee}
                    </span>
                  </p>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                        timeSlot === slot
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason / Symptoms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Visit / Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Follow-up consultation, recurring migraine, routine health check..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm & Schedule Appointment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

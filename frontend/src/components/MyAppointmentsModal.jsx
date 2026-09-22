import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, AlertCircle, CheckCircle2, Ban } from 'lucide-react';
import { api } from '../services/api';

export default function MyAppointmentsModal({
  isOpen,
  onClose,
  appointments,
  onRefresh,
  onOpenBook,
}) {
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    setError('');

    try {
      const res = await api.cancelAppointment(id);
      if (res.success) {
        if (onRefresh) await onRefresh();
      } else {
        setError(res.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      setError(err.message || 'Error cancelling appointment');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">My Appointments</h3>
              <p className="text-xs text-slate-500">
                Track, manage, and review your consultations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Body / List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">No scheduled appointments</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                You do not have any active appointments. You can book an appointment with our specialists anytime.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenBook();
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
              >
                Book An Appointment
              </button>
            </div>
          ) : (
            appointments.map((appt) => {
              const isScheduled = appt.status === 'scheduled';
              const isCancelled = appt.status === 'cancelled';

              return (
                <div
                  key={appt._id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCancelled
                      ? 'bg-slate-50/70 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 shadow-xs hover:border-sky-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {appt.tokenNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          isScheduled
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCancelled
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">
                        {new Date(appt.appointmentDate).toDateString()} at {appt.timeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Dr. {appt.doctor?.name || 'Assigned Specialist'}
                      </p>
                      <p className="text-slate-500">
                        {appt.doctor?.specialization || 'Department Specialist'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">
                        <span className="font-semibold text-slate-700">Department:</span>{' '}
                        {appt.department?.name || 'General OPD'}
                      </p>
                      <p className="text-slate-500">
                        <span className="font-semibold text-slate-700">Reason:</span>{' '}
                        {appt.reason || 'General Consultation'}
                      </p>
                    </div>
                  </div>

                  {isScheduled && (
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleCancel(appt._id)}
                        disabled={cancellingId === appt._id}
                        className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-60"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{cancellingId === appt._id ? 'Cancelling...' : 'Cancel Appointment'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Need immediate assistance? Call +1 (800) 555-0199</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

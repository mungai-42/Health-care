import React, { useState } from 'react';
import { Calendar, Home, Utensils, Plus, Droplet } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  mealPlan: string;
  waterTarget: number;
  waterDrank: number;
}

interface Doctor {
  id: string;
  name: string;
  isActive: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

interface HomeVisit {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  location: string;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Delayed';
}

interface ClinicalManagementProps {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  homeVisits: HomeVisit[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onAddHomeVisit: (visit: Omit<HomeVisit, 'id'>) => void;
  onLogWater: (patientId: string, amount: number) => void;
}

export default function ClinicalManagement({
  patients,
  doctors,
  appointments,
  homeVisits,
  onAddAppointment,
  onAddHomeVisit,
  onLogWater,
}: ClinicalManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'home-visits' | 'meal-plans'>('appointments');
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  // Appointment Form Fields
  const [apptPatient, setApptPatient] = useState('');
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptDate, setApptDate] = useState('2026-07-02');
  const [apptTime, setApptTime] = useState('10:00 AM');

  // Visit Form Fields
  const [visitPatient, setVisitPatient] = useState('');
  const [visitDoctor, setVisitDoctor] = useState('');
  const [visitLocation, setVisitLocation] = useState('');
  const [visitDate, setVisitDate] = useState('2026-07-02');
  const [visitTime, setVisitTime] = useState('02:00 PM');

  // Water Log input
  const [logAmount, setLogAmount] = useState(250);

  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptPatient || !apptDoctor) return;
    onAddAppointment({
      patientName: apptPatient,
      doctorName: apptDoctor,
      date: apptDate,
      time: apptTime,
      status: 'Scheduled',
    });
    setApptPatient('');
    setApptDoctor('');
    setIsApptModalOpen(false);
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitPatient || !visitDoctor || !visitLocation) return;
    onAddHomeVisit({
      patientName: visitPatient,
      doctorName: visitDoctor,
      date: visitDate,
      time: visitTime,
      location: visitLocation,
      status: 'Assigned',
    });
    setVisitPatient('');
    setVisitDoctor('');
    setVisitLocation('');
    setIsVisitModalOpen(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Sub-tab navigation selector */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveSubTab('appointments')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'appointments' ? 'var(--brand-primary)' : 'hsl(210, 10%, 60%)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.25rem',
            borderBottom: activeSubTab === 'appointments' ? '2px solid var(--brand-primary)' : '2px solid transparent',
          }}
        >
          <Calendar size={16} /> Appointments
        </button>

        <button
          onClick={() => setActiveSubTab('home-visits')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'home-visits' ? 'var(--brand-primary)' : 'hsl(210, 10%, 60%)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.25rem',
            borderBottom: activeSubTab === 'home-visits' ? '2px solid var(--brand-primary)' : '2px solid transparent',
          }}
        >
          <Home size={16} /> Home Visits Logistics
        </button>

        <button
          onClick={() => setActiveSubTab('meal-plans')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSubTab === 'meal-plans' ? 'var(--brand-primary)' : 'hsl(210, 10%, 60%)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.25rem',
            borderBottom: activeSubTab === 'meal-plans' ? '2px solid var(--brand-primary)' : '2px solid transparent',
          }}
        >
          <Utensils size={16} /> Nutrition & Hydration
        </button>
      </div>

      {/* APPOINTMENTS VIEW */}
      {activeSubTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Upcoming Appointments Ledger</h3>
            <button onClick={() => setIsApptModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              <Plus size={14} /> Book Appointment
            </button>
          </div>

          <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'hsla(215, 20%, 30%, 0.1)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Patient</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Doctor</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Date / Time</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{a.patientName}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{a.doctorName}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{a.date}</span> at <span style={{ color: 'var(--brand-primary-light)' }}>{a.time}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: 'hsla(145, 63%, 42%, 0.15)',
                          color: 'var(--status-success)',
                          fontWeight: 600,
                        }}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HOME VISITS VIEW */}
      {activeSubTab === 'home-visits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Active Home Visits Logistics</h3>
            <button onClick={() => setIsVisitModalOpen(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
              <Plus size={14} /> Schedule Visit
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            {/* Table list */}
            <div className="glass-card" style={{ padding: 0, overflowX: 'auto', alignSelf: 'start' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'hsla(215, 20%, 30%, 0.1)' }}>
                    <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Patient</th>
                    <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Doctor</th>
                    <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Route Address</th>
                    <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {homeVisits.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <td style={{ padding: '0.75rem 1.25rem', fontWeight: 500 }}>{v.patientName}</td>
                      <td style={{ padding: '0.75rem 1.25rem' }}>{v.doctorName}</td>
                      <td style={{ padding: '0.75rem 1.25rem', color: 'hsl(210, 10%, 75%)' }}>{v.location}</td>
                      <td style={{ padding: '0.75rem 1.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor:
                              v.status === 'Completed'
                                ? 'hsla(145, 63%, 42%, 0.15)'
                                : v.status === 'In Progress'
                                ? 'hsla(200, 95%, 48%, 0.15)'
                                : 'hsla(38, 92%, 50%, 0.15)',
                            color:
                              v.status === 'Completed'
                                ? 'var(--status-success)'
                                : v.status === 'In Progress'
                                ? 'var(--status-info)'
                                : 'var(--status-warning)',
                            fontWeight: 600,
                          }}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GPS Simulation Panel */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Home size={16} color="var(--brand-accent)" /> Route Dispatch Monitor
              </h4>
              <div
                style={{
                  height: '180px',
                  borderRadius: '6px',
                  background: 'radial-gradient(circle, hsla(197, 90%, 48%, 0.15) 10%, var(--bg-dark-base) 80%)',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Visual grid overlay for simulated GPS map */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(hsla(215, 20%, 30%, 0.15) 1px, transparent 1px), linear-gradient(90deg, hsla(215, 20%, 30%, 0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {/* Pulse marker dots representing home locations */}
                <div style={{ position: 'absolute', left: '40%', top: '30%', width: '12px', height: '12px', background: 'var(--brand-primary)', borderRadius: '50%', boxShadow: '0 0 10px 4px hsla(197, 90%, 48%, 0.4)' }} />
                <div style={{ position: 'absolute', right: '30%', bottom: '40%', width: '12px', height: '12px', background: 'var(--brand-accent)', borderRadius: '50%', boxShadow: '0 0 10px 4px hsla(265, 89%, 66%, 0.4)' }} />
                
                <span style={{ fontSize: '0.75rem', zIndex: 5, padding: '0.35rem 0.75rem', background: 'var(--bg-dark-card)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                  Active Dispatches: {homeVisits.filter(v => v.status === 'In Progress').length}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>
                Field dispatch tracking uses real-time mobile coordinates mapping the primary health care provider location to patient coordinates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MEAL PLANS & HYDRATION */}
      {activeSubTab === 'meal-plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Nutrition and Hydration Ledger</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {patients.map((p) => {
              const hydrationPercent = Math.min(Math.round((p.waterDrank / p.waterTarget) * 100), 100);
              
              return (
                <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{p.name}</h4>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'hsla(265, 89%, 66%, 0.1)', color: 'var(--brand-accent)' }}>
                      {p.mealPlan}
                    </span>
                  </div>

                  {/* Water Hydration meter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'hsl(210, 10%, 65%)' }}>
                        <Droplet size={14} color="var(--brand-primary)" /> Hydration Target
                      </span>
                      <span style={{ fontWeight: 600 }}>{p.waterDrank} / {p.waterTarget} mL</span>
                    </div>

                    {/* Progress Bar container */}
                    <div style={{ width: '100%', height: '8px', background: 'hsla(215, 20%, 30%, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${hydrationPercent}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>

                  {/* Interactive Water Logger button */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => onLogWater(p.id, logAmount)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.7rem', borderRadius: '4px', display: 'flex', gap: '0.25rem' }}
                    >
                      <Plus size={10} /> Log +{logAmount}mL
                    </button>
                    <select
                      value={logAmount}
                      onChange={(e) => setLogAmount(parseInt(e.target.value) || 250)}
                      style={{
                        padding: '0.35rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-dark-base)',
                        color: '#fff',
                        fontSize: '0.7rem',
                      }}
                    >
                      <option value={250}>250 mL</option>
                      <option value={500}>500 mL</option>
                      <option value={1000}>1 L</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Creation Modal */}
      {isApptModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Book Clinical Appointment</h3>
            <form onSubmit={handleApptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Select Patient</label>
                <select
                  required
                  value={apptPatient}
                  onChange={(e) => setApptPatient(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Select Practitioner</label>
                <select
                  required
                  value={apptDoctor}
                  onChange={(e) => setApptDoctor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                >
                  <option value="">-- Choose Practitioner --</option>
                  {doctors.filter(d => d.isActive).map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Scheduled Time</label>
                  <input
                    type="text"
                    required
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsApptModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Home Visit Creation Modal */}
      {isVisitModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Schedule Doctor Home Dispatch</h3>
            <form onSubmit={handleVisitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Select Patient</label>
                <select
                  required
                  value={visitPatient}
                  onChange={(e) => setVisitPatient(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Dispatch Practitioner</label>
                <select
                  required
                  value={visitDoctor}
                  onChange={(e) => setVisitDoctor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                >
                  <option value="">-- Choose Practitioner --</option>
                  {doctors.filter(d => d.isActive).map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Dispatch Route Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5th Avenue Building A, Appt 22"
                  value={visitLocation}
                  onChange={(e) => setVisitLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Dispatch Time</label>
                  <input
                    type="text"
                    required
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsVisitModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Dispatch Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

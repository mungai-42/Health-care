import React, { useState } from 'react';
import { Search, UserPlus, FileText, ChevronRight, Activity, Thermometer, Clock, MessageSquarePlus } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    bloodSugar: number;
  };
  alertStatus: 'normal' | 'warning' | 'danger';
  mealPlan: string;
  waterTarget: number;
  waterDrank: number;
  assignedDoctorId?: string;
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'medical' | 'log' | 'appointment' | 'alert';
  }>;
}

interface Doctor {
  id: string;
  name: string;
}

interface PatientManagementProps {
  patients: Patient[];
  doctors: Doctor[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string | null) => void;
  onCreatePatient: (patient: Omit<Patient, 'id' | 'waterDrank' | 'timeline'>) => void;
  onAddTimelineEvent: (patientId: string, event: { title: string; description: string; type: 'log' | 'medical' }) => void;
}

export default function PatientManagement({
  patients,
  doctors,
  selectedPatientId,
  onSelectPatient,
  onCreatePatient,
  onAddTimelineEvent,
}: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Patient creation form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState(72);
  const [sugar, setSugar] = useState(95);
  const [mealPlan, setMealPlan] = useState('Standard Balanced');
  const [waterTarget, setWaterTarget] = useState(2500);
  const [assignedDocId, setAssignedDocId] = useState('');

  // Timeline entry inputs
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');
  const [timelineType, setTimelineType] = useState<'log' | 'medical'>('log');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Evaluate alert status based on vitals guidelines
    let alertStatus: 'normal' | 'warning' | 'danger' = 'normal';
    const systolic = parseInt(bp.split('/')[0]) || 120;
    if (systolic >= 140 || hr > 100 || sugar > 140) {
      alertStatus = 'danger';
    } else if (systolic >= 130 || hr > 85 || sugar > 115) {
      alertStatus = 'warning';
    }

    onCreatePatient({
      name,
      email,
      age,
      gender,
      vitals: {
        bloodPressure: bp,
        heartRate: hr,
        bloodSugar: sugar,
      },
      alertStatus,
      mealPlan,
      waterTarget,
      assignedDoctorId: assignedDocId || undefined,
    });

    // Reset fields
    setName('');
    setEmail('');
    setAge(30);
    setBp('120/80');
    setHr(72);
    setSugar(95);
    setIsCreateModalOpen(false);
  };

  const handleAddTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !timelineTitle || !timelineDesc) return;
    onAddTimelineEvent(selectedPatientId, {
      title: timelineTitle,
      description: timelineDesc,
      type: timelineType,
    });
    setTimelineTitle('');
    setTimelineDesc('');
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const assignedDoctor = doctors.find((d) => d.id === selectedPatient?.assignedDoctorId);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: selectedPatientId ? '1.2fr 1fr' : '1fr', gap: '2rem' }}>
      
      {/* Patient Listing Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', maxWidth: '350px', width: '100%' }}>
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-dark-card)',
                color: '#fff',
                fontSize: '0.875rem',
              }}
            />
            <Search
              size={16}
              color="hsl(210, 10%, 55%)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
            <UserPlus size={16} /> Create Patient
          </button>
        </div>

        {/* Patient Table */}
        <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'hsla(215, 20%, 30%, 0.1)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Patient</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Age / Sex</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Vitals Summary</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Alert Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)', textAlign: 'center' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(210, 10%, 55%)' }}>
                    No patients matched that search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: selectedPatientId === p.id ? 'hsla(197, 90%, 48%, 0.05)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 500, color: '#fff' }}>{p.name}</span>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', marginTop: '0.15rem' }}>{p.email}</p>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{p.age} / {p.gender}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem' }}>
                      <span style={{ color: p.alertStatus === 'danger' ? 'var(--status-danger)' : 'hsl(210, 10%, 85%)' }}>
                        {p.vitals.bloodPressure}
                      </span>
                      <span style={{ color: 'hsl(210, 10%, 60%)' }}> | </span>
                      <span>{p.vitals.heartRate} bpm</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          backgroundColor:
                            p.alertStatus === 'danger'
                              ? 'hsla(354, 76%, 48%, 0.15)'
                              : p.alertStatus === 'warning'
                              ? 'hsla(38, 92%, 50%, 0.15)'
                              : 'hsla(145, 63%, 42%, 0.15)',
                          color:
                            p.alertStatus === 'danger'
                              ? 'var(--status-danger)'
                              : p.alertStatus === 'warning'
                              ? 'var(--status-warning)'
                              : 'var(--status-success)',
                        }}
                      >
                        {p.alertStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button
                        onClick={() => onSelectPatient(selectedPatientId === p.id ? null : p.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-primary)' }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile & Health Timeline Panel */}
      {selectedPatient && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText color="var(--brand-primary)" size={20} /> Patient Health File
            </h3>
            <button
              onClick={() => onSelectPatient(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'hsl(210, 10%, 60%)', fontSize: '0.8rem' }}
            >
              Close
            </button>
          </div>

          {/* Profile overview card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'hsla(215, 20%, 30%, 0.15)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{selectedPatient.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>ID: {selectedPatient.id.substring(0, 8)}...</p>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '10px',
                  background: 'hsla(197, 90%, 48%, 0.1)',
                  color: 'var(--brand-primary-light)',
                  fontWeight: 600,
                }}
              >
                {selectedPatient.gender}, {selectedPatient.age} yrs
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'hsl(210, 10%, 60%)' }}>Assigned Doctor:</span>
                <p style={{ fontWeight: 500, color: '#fff', marginTop: '0.15rem' }}>
                  {assignedDoctor ? assignedDoctor.name : 'Unassigned'}
                </p>
              </div>
              <div>
                <span style={{ color: 'hsl(210, 10%, 60%)' }}>Meal Plan:</span>
                <p style={{ fontWeight: 500, color: '#fff', marginTop: '0.15rem' }}>{selectedPatient.mealPlan}</p>
              </div>
            </div>

            {/* Quick Vitals Dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.5rem', background: 'var(--bg-dark-base)', padding: '0.75rem', borderRadius: '6px' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Activity size={10} color="var(--brand-primary)" /> BP
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginTop: '0.15rem' }}>{selectedPatient.vitals.bloodPressure}</p>
              </div>
              <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Clock size={10} color="var(--brand-accent)" /> Pulse
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginTop: '0.15rem' }}>{selectedPatient.vitals.heartRate} bpm</p>
              </div>
              <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Thermometer size={10} color="var(--status-warning)" /> Glucose
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginTop: '0.15rem' }}>{selectedPatient.vitals.bloodSugar} mg/dL</p>
              </div>
            </div>
          </div>

          {/* Timeline events container */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--brand-accent)" /> Clinical Timeline
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '2px solid var(--border-color)', paddingLeft: '1.25rem', marginLeft: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
              {selectedPatient.timeline.map((evt) => (
                <div key={evt.id} style={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor:
                        evt.type === 'alert'
                          ? 'var(--status-danger)'
                          : evt.type === 'medical'
                          ? 'var(--brand-primary)'
                          : 'var(--brand-accent)',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{evt.title}</span>
                      <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 50%)' }}>{evt.date}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 70%)', marginTop: '0.15rem' }}>{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to append new timeline event */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquarePlus size={16} /> Log Medical Observation
            </h4>
            <form onSubmit={handleAddTimelineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Observation summary (e.g. Consult, Vitals Update)"
                  required
                  value={timelineTitle}
                  onChange={(e) => setTimelineTitle(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                    fontSize: '0.75rem',
                  }}
                />
                <select
                  value={timelineType}
                  onChange={(e) => setTimelineType(e.target.value as any)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                    fontSize: '0.75rem',
                  }}
                >
                  <option value="log">General Log</option>
                  <option value="medical">Medical Update</option>
                </select>
              </div>
              <textarea
                placeholder="Log notes detailing observations, symptoms, prescriptions or comments..."
                rows={2}
                required
                value={timelineDesc}
                onChange={(e) => setTimelineDesc(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-dark-base)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  resize: 'none',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', alignSelf: 'flex-end' }}>
                Post to Timeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Patient Modal */}
      {isCreateModalOpen && (
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
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create Patient Chart</h3>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 30)}
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
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              {/* Initial Vitals */}
              <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px', background: 'hsla(215, 20%, 30%, 0.1)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'hsl(210, 20%, 80%)', marginBottom: '0.75rem' }}>Initial Vitals Assessment</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.25rem' }}>BP (e.g. 120/80)</label>
                    <input
                      type="text"
                      required
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-dark-base)',
                        color: '#fff',
                        fontSize: '0.8rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.25rem' }}>HR (bpm)</label>
                    <input
                      type="number"
                      required
                      value={hr}
                      onChange={(e) => setHr(parseInt(e.target.value) || 72)}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-dark-base)',
                        color: '#fff',
                        fontSize: '0.8rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.25rem' }}>Glucose (mg/dL)</label>
                    <input
                      type="number"
                      required
                      value={sugar}
                      onChange={(e) => setSugar(parseInt(e.target.value) || 95)}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-dark-base)',
                        color: '#fff',
                        fontSize: '0.8rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Assignment settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Assign Doctor</label>
                  <select
                    value={assignedDocId}
                    onChange={(e) => setAssignedDocId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Diet / Meal Plan</label>
                  <select
                    value={mealPlan}
                    onChange={(e) => setMealPlan(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-dark-base)',
                      color: '#fff',
                    }}
                  >
                    <option value="Standard Balanced">Standard Balanced</option>
                    <option value="Low Sodium Cardiovascular">Low Sodium Cardiovascular</option>
                    <option value="Diabetic Management">Diabetic Management</option>
                    <option value="High Protein Strength">High Protein Strength</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Daily Hydration Target (mL)</label>
                <input
                  type="number"
                  required
                  value={waterTarget}
                  onChange={(e) => setWaterTarget(parseInt(e.target.value) || 2500)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Search, FileText, Activity, Thermometer, Clock, MessageSquarePlus, RefreshCw, Apple } from 'lucide-react';

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
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'medical' | 'log' | 'appointment' | 'alert';
  }>;
}

interface DoctorPatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string | null) => void;
  onAddTimelineEvent: (patientId: string, event: { title: string; description: string; type: 'log' | 'medical' }) => void;
  onUpdateMealPlan: (patientId: string, newMealPlan: string) => void;
}

export default function DoctorPatientList({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddTimelineEvent,
  onUpdateMealPlan,
}: DoctorPatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingMealPlan, setIsEditingMealPlan] = useState(false);
  const [mealPlanInput, setMealPlanInput] = useState('');
  
  // Vitals Update Quick Fields
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [hr, setHr] = useState(72);
  const [sugar, setSugar] = useState(95);

  // Visit Note fields
  const [visitNoteTitle, setVisitNoteTitle] = useState('Home Visit Check-up');
  const [visitNoteBody, setVisitNoteBody] = useState('');

  const handleUpdateMealSubmit = (e: React.FormEvent, patientId: string) => {
    e.preventDefault();
    if (!mealPlanInput.trim()) return;
    onUpdateMealPlan(patientId, mealPlanInput);
    setIsEditingMealPlan(false);
  };

  const handleAddVisitSubmit = (e: React.FormEvent, patientId: string) => {
    e.preventDefault();
    if (!visitNoteBody.trim()) return;

    // Concurrently post visit notes
    onAddTimelineEvent(patientId, {
      title: visitNoteTitle,
      description: visitNoteBody,
      type: 'medical',
    });

    // Reset notes
    setVisitNoteBody('');
  };

  const handleUpdateVitalsSubmit = (e: React.FormEvent, p: Patient) => {
    e.preventDefault();
    const newBp = `${systolic}/${diastolic}`;
    onAddTimelineEvent(p.id, {
      title: 'Vitals Inspection Update',
      description: `Observed BP: ${newBp} | HR: ${hr} bpm | Glucose: ${sugar} mg/dL.`,
      type: 'medical',
    });
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: selectedPatientId ? '1.1fr 1.3fr' : '1fr', gap: '2rem' }}>
      
      {/* Patients List Grid Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search my patients..."
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

        {/* Patients Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPatients.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'hsl(210, 10%, 55%)', textAlign: 'center', padding: '3rem' }}>
              No assigned patients found matching that search.
            </p>
          ) : (
            filteredPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPatient(p.id);
                  setMealPlanInput(p.mealPlan);
                  setIsEditingMealPlan(false);
                  const bpParts = p.vitals.bloodPressure.split('/');
                  setSystolic(bpParts[0] || '120');
                  setDiastolic(bpParts[1] || '80');
                  setHr(p.vitals.heartRate);
                  setSugar(p.vitals.bloodSugar);
                }}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  borderLeft: `4px solid ${
                    p.alertStatus === 'danger'
                      ? 'var(--status-danger)'
                      : p.alertStatus === 'warning'
                      ? 'var(--status-warning)'
                      : 'var(--border-color)'
                  }`,
                  backgroundColor: selectedPatientId === p.id ? 'hsla(197, 90%, 48%, 0.06)' : 'var(--bg-dark-card)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>{p.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>{p.age} yrs | {p.gender}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      padding: '0.15rem 0.35rem',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                      background:
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
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'hsl(210, 10%, 75%)' }}>
                  <div>
                    <span style={{ color: 'hsl(210, 10%, 55%)', fontSize: '0.7rem' }}>BP</span>
                    <p style={{ fontWeight: 500 }}>{p.vitals.bloodPressure}</p>
                  </div>
                  <div>
                    <span style={{ color: 'hsl(210, 10%, 55%)', fontSize: '0.7rem' }}>GLUCOSE</span>
                    <p style={{ fontWeight: 500 }}>{p.vitals.bloodSugar} mg/dL</p>
                  </div>
                  <div>
                    <span style={{ color: 'hsl(210, 10%, 55%)', fontSize: '0.7rem' }}>MEAL DIET</span>
                    <p style={{ fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '140px' }}>{p.mealPlan}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Patient Detailed Chart Slide Column */}
      {selectedPatient && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText color="var(--brand-primary)" size={18} /> Clinical Patient File
            </h3>
            <button
              onClick={() => onSelectPatient(null)}
              style={{ border: 'none', background: 'none', color: 'hsl(210, 10%, 60%)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Close Chart
            </button>
          </div>

          {/* Demographic & vitals panel */}
          <div style={{ background: 'hsla(215, 20%, 30%, 0.15)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{selectedPatient.name}</h4>
              <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)' }}>Email: {selectedPatient.email}</span>
            </div>

            {/* Vitals summary grids */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-dark-base)', padding: '0.65rem', borderRadius: '6px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.15rem' }}>
                  <Activity size={10} color="var(--brand-primary)" /> BP
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{selectedPatient.vitals.bloodPressure}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.15rem' }}>
                  <Clock size={10} color="var(--brand-accent)" /> Pulse
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{selectedPatient.vitals.heartRate} bpm</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.15rem' }}>
                  <Thermometer size={10} color="var(--status-warning)" /> Glucose
                </span>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff' }}>{selectedPatient.vitals.bloodSugar} mg/dL</p>
              </div>
            </div>
          </div>

          {/* MEAL PLAN MANAGER */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Apple size={16} color="var(--status-success)" /> Diet & Nutrition Planner
              </h4>
              {!isEditingMealPlan && (
                <button
                  onClick={() => setIsEditingMealPlan(true)}
                  style={{ border: 'none', background: 'none', color: 'var(--brand-primary-light)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Modify
                </button>
              )}
            </div>

            {isEditingMealPlan ? (
              <form onSubmit={(e) => handleUpdateMealSubmit(e, selectedPatient.id)} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  required
                  value={mealPlanInput}
                  onChange={(e) => setMealPlanInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                    fontSize: '0.8rem',
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                  Save
                </button>
                <button type="button" onClick={() => setIsEditingMealPlan(false)} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                  Cancel
                </button>
              </form>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'hsl(210, 10%, 80%)', background: 'hsla(215, 20%, 30%, 0.1)', padding: '0.65rem', borderRadius: '4px', border: '1px dashed var(--border-color)' }}>
                Active Plan: <strong>{selectedPatient.mealPlan}</strong>
              </p>
            )}
          </div>

          {/* VISIT OBSERVATION NOTES LOGGER */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquarePlus size={16} color="var(--brand-accent)" /> Publish Clinical Visit Notes
            </h4>
            <form onSubmit={(e) => handleAddVisitSubmit(e, selectedPatient.id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Visit Purpose (e.g. Home Visit Check-up, Consultation)"
                required
                value={visitNoteTitle}
                onChange={(e) => setVisitNoteTitle(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-dark-base)',
                  color: '#fff',
                  fontSize: '0.75rem',
                }}
              />
              <textarea
                placeholder="Write medical notes detailing vitals, symptoms, observations, changes in prescription..."
                rows={2}
                required
                value={visitNoteBody}
                onChange={(e) => setVisitNoteBody(e.target.value)}
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
                Save Visit Notes
              </button>
            </form>
          </div>

          {/* QUICK VITALS ADJUSTMENTS (Simulates diagnostic check-ins) */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} /> Quick Vitals Inspection Update
            </h4>
            <form onSubmit={(e) => handleUpdateVitalsSubmit(e, selectedPatient)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Sys"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark-base)', color: '#fff', fontSize: '0.75rem', textAlign: 'center' }}
                />
                <span>/</span>
                <input
                  type="text"
                  placeholder="Dia"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark-base)', color: '#fff', fontSize: '0.75rem', textAlign: 'center' }}
                />
              </div>
              <input
                type="number"
                placeholder="Pulse"
                value={hr}
                onChange={(e) => setHr(parseInt(e.target.value) || 72)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark-base)', color: '#fff', fontSize: '0.75rem', textAlign: 'center' }}
              />
              <input
                type="number"
                placeholder="Sugar"
                value={sugar}
                onChange={(e) => setSugar(parseInt(e.target.value) || 95)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark-base)', color: '#fff', fontSize: '0.75rem', textAlign: 'center' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

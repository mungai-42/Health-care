import React, { useState } from 'react';
import { Search, UserPlus, ToggleLeft, ToggleRight, Edit2, Link } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  speciality: string;
  isActive: boolean;
  assignedPatientsCount: number;
}

interface Patient {
  id: string;
  name: string;
}

interface DoctorManagementProps {
  doctors: Doctor[];
  patients: Patient[];
  onCreateDoctor: (doctor: Omit<Doctor, 'id' | 'assignedPatientsCount' | 'isActive'>) => void;
  onUpdateDoctor: (id: string, updates: Partial<Doctor>) => void;
  onAssignDoctor: (doctorId: string, patientId: string) => void;
}

export default function DoctorManagement({
  doctors,
  patients,
  onCreateDoctor,
  onUpdateDoctor,
  onAssignDoctor,
}: DoctorManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Doctor form fields
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docSpeciality, setDocSpeciality] = useState('General Medicine');

  // Assignment form fields
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');

  // Editing state
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docEmail) return;

    if (editingDocId) {
      onUpdateDoctor(editingDocId, { name: docName, email: docEmail, speciality: docSpeciality });
      setEditingDocId(null);
    } else {
      onCreateDoctor({ name: docName, email: docEmail, speciality: docSpeciality });
    }

    setDocName('');
    setDocEmail('');
    setDocSpeciality('General Medicine');
    setIsCreateModalOpen(false);
  };

  const handleEditClick = (doc: Doctor) => {
    setEditingDocId(doc.id);
    setDocName(doc.name);
    setDocEmail(doc.email);
    setDocSpeciality(doc.speciality);
    setIsCreateModalOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedPatientId) return;
    onAssignDoctor(selectedDoctorId, selectedPatientId);
    setIsAssignModalOpen(false);
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.speciality.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Search and Add Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', maxWidth: '350px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
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

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setIsAssignModalOpen(true)} className="btn btn-secondary">
            <Link size={16} /> Assign Patient
          </button>
          <button
            onClick={() => {
              setEditingDocId(null);
              setDocName('');
              setDocEmail('');
              setDocSpeciality('General Medicine');
              setIsCreateModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <UserPlus size={16} /> Add Doctor
          </button>
        </div>
      </div>

      {/* Doctors Grid Table */}
      <div className="glass-card" style={{ padding: 0, overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'hsla(215, 20%, 30%, 0.1)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Doctor Name</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Speciality</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Email</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Patients</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(210, 10%, 55%)' }}>
                  No doctors matching that query were found.
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        color: '#fff',
                      }}
                    >
                      {doc.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{doc.name}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{doc.speciality}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'hsl(210, 10%, 75%)' }}>{doc.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: doc.isActive ? 'hsla(145, 63%, 42%, 0.15)' : 'hsla(354, 76%, 48%, 0.15)',
                        color: doc.isActive ? 'var(--status-success)' : 'var(--status-danger)',
                      }}
                    >
                      {doc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    {doc.assignedPatientsCount}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleEditClick(doc)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'hsl(210, 20%, 75%)' }}
                        title="Edit Doctor Profile"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onUpdateDoctor(doc.id, { isActive: !doc.isActive })}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: doc.isActive ? 'var(--status-success)' : 'hsl(210, 10%, 50%)' }}
                        title={doc.isActive ? 'Deactivate Doctor' : 'Activate Doctor'}
                      >
                        {doc.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Doctor Modal */}
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
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              {editingDocId ? 'Edit Doctor Profile' : 'Register New Doctor'}
            </h3>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
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
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={docEmail}
                  onChange={(e) => setDocEmail(e.target.value)}
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
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Speciality Specialty</label>
                <select
                  value={docSpeciality}
                  onChange={(e) => setDocSpeciality(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Nutrition & Dietetics">Nutrition & Dietetics</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDocId ? 'Save Changes' : 'Register Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Patient Modal */}
      {isAssignModalOpen && (
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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Assign Doctor to Patient</h3>
            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Select Doctor</label>
                <select
                  required
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-dark-base)',
                    color: '#fff',
                  }}
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.filter(d => d.isActive).map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.speciality})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', display: 'block', marginBottom: '0.35rem' }}>Select Patient</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
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
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

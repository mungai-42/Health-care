import { Users, Calendar, Home, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    bloodSugar: number;
  };
  alertStatus: 'normal' | 'warning' | 'danger';
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

interface HomeVisit {
  id: string;
  patientName: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

interface DoctorPortalDashboardProps {
  doctorName: string;
  patients: Patient[];
  appointments: Appointment[];
  homeVisits: HomeVisit[];
  onSelectPatient: (patientId: string) => void;
}

export default function DoctorPortalDashboard({
  doctorName,
  patients,
  appointments,
  homeVisits,
  onSelectPatient,
}: DoctorPortalDashboardProps) {
  const alertsCount = patients.filter((p) => p.alertStatus !== 'normal').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner greeting */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, hsla(197, 90%, 48%, 0.08) 0%, hsla(265, 89%, 66%, 0.03) 100%)',
          border: '1px solid hsla(197, 90%, 48%, 0.2)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.25rem' }}>
          Welcome back, {doctorName}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 65%)' }}>
          Here is the clinical overview of your assigned patients and route dispatches scheduled for today.
        </p>
      </div>

      {/* Top Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {/* Assigned Patients */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              My Patients
            </span>
            <h4 style={{ fontSize: '1.8rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {patients.length}
            </h4>
          </div>
          <div style={{ background: 'hsla(197, 90%, 48%, 0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <Users color="var(--brand-primary)" size={20} />
          </div>
        </div>

        {/* Scheduled Appointments */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              My Appointments
            </span>
            <h4 style={{ fontSize: '1.8rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {appointments.length}
            </h4>
          </div>
          <div style={{ background: 'hsla(200, 95%, 48%, 0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <Calendar color="var(--status-info)" size={20} />
          </div>
        </div>

        {/* Home visits */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visits Scheduled
            </span>
            <h4 style={{ fontSize: '1.8rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {homeVisits.length}
            </h4>
          </div>
          <div style={{ background: 'hsla(265, 89%, 66%, 0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <Home color="var(--brand-accent)" size={20} />
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Patient Alerts
            </span>
            <h4 style={{ fontSize: '1.8rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)', color: alertsCount > 0 ? 'var(--status-danger)' : '#fff' }}>
              {alertsCount}
            </h4>
          </div>
          <div style={{ background: alertsCount > 0 ? 'hsla(354, 76%, 48%, 0.15)' : 'hsla(215, 20%, 30%, 0.15)', padding: '0.6rem', borderRadius: '8px' }}>
            <AlertTriangle color={alertsCount > 0 ? 'var(--status-danger)' : 'hsl(210, 10%, 50%)'} size={20} />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Today's Clinical Schedule */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--brand-primary)" /> My Schedule (Today)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {appointments.length === 0 && homeVisits.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 55%)', textAlign: 'center', padding: '2rem' }}>
                You have no scheduled check-ups or route dispatches today.
              </p>
            ) : (
              <>
                {/* Home visits today */}
                {homeVisits.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      padding: '0.85rem',
                      background: 'hsla(265, 89%, 66%, 0.05)',
                      border: '1px solid hsla(265, 89%, 66%, 0.15)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.6rem', background: 'var(--brand-accent)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '3px', fontWeight: 600 }}>
                          HOME DISPATCH
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{v.patientName}</span>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 65%)', marginTop: '0.2rem' }}>
                        Address: {v.location}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary-light)' }}>{v.time}</span>
                  </div>
                ))}

                {/* Clinic Appointments today */}
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: '0.85rem',
                      background: 'hsla(197, 90%, 48%, 0.05)',
                      border: '1px solid hsla(197, 90%, 48%, 0.15)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.6rem', background: 'var(--brand-primary)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '3px', fontWeight: 600 }}>
                          CLINIC VISIT
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{a.patientName}</span>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 65%)', marginTop: '0.2rem' }}>
                        Status: <span style={{ color: 'var(--status-success)', fontWeight: 500 }}>{a.status}</span>
                      </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-primary-light)' }}>{a.time}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right Side: Active Warnings Alert Room */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--status-danger)" /> My Patients Vitals Alerts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {patients.filter((p) => p.alertStatus !== 'normal').length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 55%)', textAlign: 'center', padding: '2rem' }}>
                All assigned patients are currently stable.
              </p>
            ) : (
              patients
                .filter((p) => p.alertStatus !== 'normal')
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '0.85rem',
                      background: 'hsla(215, 20%, 30%, 0.1)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{p.name}</h4>
                      <span style={{ fontSize: '0.7rem', color: p.alertStatus === 'danger' ? 'var(--status-danger)' : 'var(--status-warning)' }}>
                        BP: {p.vitals.bloodPressure} | Glucose: {p.vitals.bloodSugar} mg/dL
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectPatient(p.id)}
                      style={{ border: 'none', background: 'none', color: 'var(--brand-primary)', cursor: 'pointer' }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

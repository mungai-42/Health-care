import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';

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

interface DoctorCalendarProps {
  appointments: Appointment[];
  homeVisits: HomeVisit[];
}

export default function DoctorCalendar({ appointments, homeVisits }: DoctorCalendarProps) {
  // Combine list for easier calendar rendering
  const scheduleItems = [
    ...appointments.map((a) => ({
      id: a.id,
      patient: a.patientName,
      time: a.time,
      date: a.date,
      type: 'Clinic Consultation',
      location: 'Main Clinic, Suite 102',
      status: a.status,
      color: 'var(--brand-primary)',
    })),
    ...homeVisits.map((v) => ({
      id: v.id,
      patient: v.patientName,
      time: v.time,
      date: v.date,
      type: 'Home Visit Dispatch',
      location: v.location,
      status: v.status,
      color: 'var(--brand-accent)',
    })),
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Calendar Planner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={18} color="var(--brand-primary)" /> Clinical Schedule & Agenda
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 65%)' }}>
          Timezone: Local (GMT+3)
        </span>
      </div>

      {/* Grid of calendar slots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {scheduleItems.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'hsl(210, 10%, 55%)' }}>
            No clinical schedules registered on your planner.
          </div>
        ) : (
          scheduleItems.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                borderTop: `4px solid ${item.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: item.color }}>
                  {item.type}
                </span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    padding: '0.15rem 0.35rem',
                    borderRadius: '3px',
                    background: 'hsla(215, 20%, 30%, 0.15)',
                    color: 'hsl(210, 20%, 85%)',
                  }}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="hsl(210, 10%, 60%)" /> {item.patient}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} color="var(--brand-primary-light)" /> {item.date} at {item.time}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'hsl(210, 10%, 75%)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.4rem',
                }}
              >
                <MapPin size={14} color="var(--brand-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item.location}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

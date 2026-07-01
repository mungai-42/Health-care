import { Users, UserCheck, Home, Calendar, AlertTriangle, CheckCircle, Flame, Droplet } from 'lucide-react';

interface DashboardOverviewProps {
  stats: {
    totalPatients: number;
    totalDoctors: number;
    homeVisitsToday: number;
    upcomingAppointments: number;
  };
  patientsNeedingAttention: any[];
  recentLogs: any[];
  appointments: any[];
  homeVisits: any[];
  onSelectTab: (tab: string) => void;
  onSelectPatient: (patientId: string) => void;
}

export default function DashboardOverview({
  stats,
  patientsNeedingAttention,
  recentLogs,
  appointments,
  homeVisits,
  onSelectTab,
  onSelectPatient,
}: DashboardOverviewProps) {
  // Compute Meal Plan adherence stats
  const totalMealPlans = 15;
  const compliantMealPlans = 12;
  const mealAdherenceRate = Math.round((compliantMealPlans / totalMealPlans) * 100);

  // Compute Water compliance stats
  const avgWaterCompliance = 78; // 78% average compliance

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Cards Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Total Patients */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Patients
            </span>
            <h4 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {stats.totalPatients}
            </h4>
          </div>
          <div style={{ background: 'hsla(197, 90%, 48%, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
            <Users color="var(--brand-primary)" size={24} />
          </div>
        </div>

        {/* Total Doctors */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Doctors
            </span>
            <h4 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {stats.totalDoctors}
            </h4>
          </div>
          <div style={{ background: 'hsla(145, 63%, 42%, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
            <UserCheck color="var(--status-success)" size={24} />
          </div>
        </div>

        {/* Home Visits Today */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Home Visits Today
            </span>
            <h4 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {stats.homeVisitsToday}
            </h4>
          </div>
          <div style={{ background: 'hsla(265, 89%, 66%, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
            <Home color="var(--brand-accent)" size={24} />
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Appointments
            </span>
            <h4 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              {stats.upcomingAppointments}
            </h4>
          </div>
          <div style={{ background: 'hsla(200, 95%, 48%, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
            <Calendar color="var(--status-info)" size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1.8fr))',
          gap: '2rem',
        }}
      >
        {/* Left Hand: Clinical Alerts & Trackers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Patients Needing Attention */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle color="var(--status-danger)" size={20} />
                <h3 style={{ fontSize: '1.1rem' }}>Patients Needing Attention</h3>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'hsla(354, 76%, 48%, 0.15)',
                  color: 'var(--status-danger)',
                  fontWeight: 600,
                }}
              >
                {patientsNeedingAttention.length} Alerts Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {patientsNeedingAttention.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(210, 10%, 50%)', fontSize: '0.85rem' }}>
                  <CheckCircle size={32} color="var(--status-success)" style={{ marginBottom: '0.5rem' }} />
                  <p>All patient vitals are within normal ranges.</p>
                </div>
              ) : (
                patientsNeedingAttention.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'hsla(215, 20%, 30%, 0.15)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${p.alertStatus === 'danger' ? 'var(--status-danger)' : 'var(--status-warning)'}`,
                    }}
                  >
                    <div>
                      <h4
                        onClick={() => onSelectPatient(p.id)}
                        style={{ fontSize: '0.9rem', cursor: 'pointer', color: '#fff', textDecoration: 'underline' }}
                        title="Click to view full health timeline"
                      >
                        {p.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)', marginTop: '0.2rem' }}>
                        BP: <span style={{ color: p.alertStatus === 'danger' ? 'var(--status-danger)' : '#fff' }}>{p.vitals.bloodPressure}</span> | 
                        HR: <span>{p.vitals.heartRate} bpm</span> | 
                        Sugar: <span>{p.vitals.bloodSugar} mg/dL</span>
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectPatient(p.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', borderRadius: '4px' }}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Adherence and Clinical Trackers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {/* Meal Plan Progress */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame color="var(--brand-accent)" size={20} />
                <h3 style={{ fontSize: '0.95rem' }}>Meal Adherence</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '1rem 0' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Custom CSS Circular Chart */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `conic-gradient(var(--brand-accent) ${mealAdherenceRate}%, hsla(215, 20%, 30%, 0.2) ${mealAdherenceRate}% 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '66px',
                        height: '66px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-dark-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{mealAdherenceRate}%</span>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', marginTop: '0.8rem', textAlign: 'center' }}>
                  {compliantMealPlans} of {totalMealPlans} compliant patients
                </span>
              </div>
            </div>

            {/* Water Compliance Progress */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplet color="var(--brand-primary)" size={20} />
                <h3 style={{ fontSize: '0.95rem' }}>Water Adherence</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '1rem 0' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `conic-gradient(var(--brand-primary) ${avgWaterCompliance}%, hsla(215, 20%, 30%, 0.2) ${avgWaterCompliance}% 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '66px',
                        height: '66px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-dark-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{avgWaterCompliance}%</span>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', marginTop: '0.8rem', textAlign: 'center' }}>
                  Average hydration target achieved today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Schedule & Audit Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Today's Schedule (Appointments & Home Visits Combined) */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar color="var(--brand-primary)" size={20} />
              Today's Schedule & Home Visits
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.length === 0 && homeVisits.length === 0 ? (
                <p style={{ color: 'hsl(210, 10%, 50%)', fontSize: '0.8rem', padding: '1.5rem', textAlign: 'center' }}>
                  No scheduled medical activities today.
                </p>
              ) : (
                <>
                  {/* Home Visits Today */}
                  {homeVisits.slice(0, 3).map((v) => (
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
                          <span style={{ fontSize: '0.65rem', background: 'var(--brand-accent)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 600 }}>
                            HOME VISIT
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'hsl(210, 20%, 90%)', fontWeight: 500 }}>
                            {v.patientName}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', marginTop: '0.2rem' }}>
                          Doctor: {v.doctorName} | Loc: {v.location}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary-light)' }}>
                        {v.time}
                      </span>
                    </div>
                  ))}

                  {/* Regular Appointments */}
                  {appointments.slice(0, 3).map((a) => (
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
                          <span style={{ fontSize: '0.65rem', background: 'var(--brand-primary)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 600 }}>
                            CLINIC
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'hsl(210, 20%, 90%)', fontWeight: 500 }}>
                            {a.patientName}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)', marginTop: '0.2rem' }}>
                          Doctor: {a.doctorName} | Status: <span style={{ color: 'var(--status-success)' }}>{a.status}</span>
                        </p>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary-light)' }}>
                        {a.time}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Recent Audit Logs (Quick View) */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users color="var(--brand-primary)" size={20} />
                Recent System Log
              </h3>
              <span
                onClick={() => onSelectTab('audit-logs')}
                style={{ fontSize: '0.75rem', color: 'var(--brand-primary-light)', cursor: 'pointer' }}
              >
                View All
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    padding: '0.65rem 0.85rem',
                    background: 'hsla(215, 20%, 30%, 0.1)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'hsl(210, 20%, 85%)' }}>{log.action}</span>
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        padding: '0.1rem 0.3rem',
                        borderRadius: '3px',
                        background:
                          log.level === 'ERROR'
                            ? 'hsla(354, 76%, 48%, 0.15)'
                            : log.level === 'WARNING'
                            ? 'hsla(38, 92%, 50%, 0.15)'
                            : 'hsla(145, 63%, 42%, 0.15)',
                        color:
                          log.level === 'ERROR'
                            ? 'var(--status-danger)'
                            : log.level === 'WARNING'
                            ? 'var(--status-warning)'
                            : 'var(--status-success)',
                      }}
                    >
                      {log.level}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(210, 10%, 55%)', fontSize: '0.7rem' }}>
                    <span>By: {log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

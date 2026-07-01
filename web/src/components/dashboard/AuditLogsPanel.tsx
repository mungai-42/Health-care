import { useState } from 'react';
import { Search, Shield, Filter, AlertOctagon, Info, AlertTriangle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  ipAddress: string;
}

interface AuditLogsPanelProps {
  logs: AuditLog[];
}

export default function AuditLogsPanel({ logs }: AuditLogsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR'>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search and Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '350px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search logs by action, user or IP..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--brand-primary)" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            style={{
              padding: '0.55rem 1.5rem 0.55rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-dark-card)',
              color: '#fff',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">Show All Levels</option>
            <option value="INFO">Info Only</option>
            <option value="WARNING">Warnings Only</option>
            <option value="ERROR">Errors Only</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'hsla(215, 20%, 30%, 0.1)' }}>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)', width: '80px' }}>Level</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)', width: '150px' }}>Timestamp</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)' }}>Performed Action</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)', width: '150px' }}>User</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'hsl(210, 10%, 60%)', width: '120px' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(210, 10%, 55%)' }}>
                  No security logs found matching current parameters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isError = log.level === 'ERROR';
                const isWarning = log.level === 'WARNING';
                
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: isError
                            ? 'hsla(354, 76%, 48%, 0.15)'
                            : isWarning
                            ? 'hsla(38, 92%, 50%, 0.15)'
                            : 'hsla(145, 63%, 42%, 0.15)',
                          color: isError
                            ? 'var(--status-danger)'
                            : isWarning
                            ? 'var(--status-warning)'
                            : 'var(--status-success)',
                        }}
                      >
                        {isError ? (
                          <AlertOctagon size={10} />
                        ) : isWarning ? (
                          <AlertTriangle size={10} />
                        ) : (
                          <Info size={10} />
                        )}
                        {log.level}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'hsl(210, 10%, 75%)' }}>{log.timestamp}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Shield size={14} color="hsl(210, 10%, 50%)" />
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>{log.user}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'hsl(210, 10%, 65%)' }}>{log.ipAddress}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

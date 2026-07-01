import { BarChart3, TrendingUp, HelpCircle, Activity } from 'lucide-react';

export default function AnalyticsPanel() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Analytics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'hsla(197, 90%, 48%, 0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <TrendingUp size={20} color="var(--brand-primary)" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)' }}>Monthly Patient Growth</span>
            <h4 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '0.15rem' }}>+24%</h4>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'hsla(145, 63%, 42%, 0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <Activity size={20} color="var(--status-success)" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)' }}>Avg Diet Compliance</span>
            <h4 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '0.15rem' }}>84.3%</h4>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'hsla(265, 89%, 66%, 0.1)', padding: '0.6rem', borderRadius: '8px' }}>
            <BarChart3 size={20} color="var(--brand-accent)" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)' }}>Dispatch Adherence</span>
            <h4 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '0.15rem' }}>96.8%</h4>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* SVG Line Chart: Weekly Adherence Trends */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={16} color="var(--brand-primary)" /> Adherence Rates (Weekly Trend)
            </h3>
            <HelpCircle size={14} color="hsl(210, 10%, 55%)" />
          </div>

          <div style={{ flex: 1, padding: '1rem 0' }}>
            {/* Inline SVG Chart */}
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="hsla(215, 20%, 30%, 0.15)" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="hsla(215, 20%, 30%, 0.15)" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="hsla(215, 20%, 30%, 0.15)" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="hsla(215, 20%, 30%, 0.3)" />

              {/* Y Axis Labels */}
              <text x="15" y="24" fill="hsl(210, 10%, 50%)" fontSize="9">100%</text>
              <text x="15" y="74" fill="hsl(210, 10%, 50%)" fontSize="9">75%</text>
              <text x="15" y="124" fill="hsl(210, 10%, 50%)" fontSize="9">50%</text>
              <text x="15" y="174" fill="hsl(210, 10%, 50%)" fontSize="9">25%</text>

              {/* Area Path */}
              <path
                d="M 40 120 Q 113 90 186 60 T 332 50 T 480 30 L 480 170 L 40 170 Z"
                fill="url(#chartGradient)"
              />

              {/* Line Path */}
              <path
                d="M 40 120 Q 113 90 186 60 T 332 50 T 480 30"
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth="2.5"
              />

              {/* Points */}
              <circle cx="40" cy="120" r="4.5" fill="var(--bg-dark-card)" stroke="var(--brand-primary)" strokeWidth="2" />
              <circle cx="150" cy="74" r="4.5" fill="var(--bg-dark-card)" stroke="var(--brand-primary)" strokeWidth="2" />
              <circle cx="260" cy="53" r="4.5" fill="var(--bg-dark-card)" stroke="var(--brand-primary)" strokeWidth="2" />
              <circle cx="370" cy="48" r="4.5" fill="var(--bg-dark-card)" stroke="var(--brand-primary)" strokeWidth="2" />
              <circle cx="480" cy="30" r="4.5" fill="var(--bg-dark-card)" stroke="var(--brand-primary)" strokeWidth="2" />

              {/* X Axis Labels */}
              <text x="40" y="192" fill="hsl(210, 10%, 50%)" fontSize="9" textAnchor="middle">Mon</text>
              <text x="150" y="192" fill="hsl(210, 10%, 50%)" fontSize="9" textAnchor="middle">Wed</text>
              <text x="260" y="192" fill="hsl(210, 10%, 50%)" fontSize="9" textAnchor="middle">Fri</text>
              <text x="370" y="192" fill="hsl(210, 10%, 50%)" fontSize="9" textAnchor="middle">Sat</text>
              <text x="480" y="192" fill="hsl(210, 10%, 50%)" fontSize="9" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

        {/* SVG Bar Chart: Appointments by Specialty */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BarChart3 size={16} color="var(--brand-accent)" /> Appointments by Specialty
            </h3>
            <HelpCircle size={14} color="hsl(210, 10%, 55%)" />
          </div>

          <div style={{ flex: 1, padding: '1rem 0' }}>
            {/* Inline SVG Bar Chart */}
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {/* Gridlines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="hsla(215, 20%, 30%, 0.15)" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="hsla(215, 20%, 30%, 0.15)" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="hsla(215, 20%, 30%, 0.15)" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="hsla(215, 20%, 30%, 0.3)" />

              {/* Y Axis Labels */}
              <text x="20" y="24" fill="hsl(210, 10%, 50%)" fontSize="9">40</text>
              <text x="20" y="74" fill="hsl(210, 10%, 50%)" fontSize="9">30</text>
              <text x="20" y="124" fill="hsl(210, 10%, 50%)" fontSize="9">20</text>
              <text x="20" y="174" fill="hsl(210, 10%, 50%)" fontSize="9">10</text>

              {/* Bar 1 (General Med) - Height 130 */}
              <rect x="70" y="40" width="36" height="130" rx="3" fill="var(--brand-accent)" style={{ transition: 'height 0.3s' }} />
              
              {/* Bar 2 (Cardiology) - Height 90 */}
              <rect x="175" y="80" width="36" height="90" rx="3" fill="var(--brand-primary)" style={{ transition: 'height 0.3s' }} />

              {/* Bar 3 (Nutrition) - Height 150 */}
              <rect x="280" y="20" width="36" height="150" rx="3" fill="var(--brand-accent)" style={{ opacity: 0.85, transition: 'height 0.3s' }} />

              {/* Bar 4 (Pediatrics) - Height 60 */}
              <rect x="385" y="110" width="36" height="60" rx="3" fill="var(--brand-primary)" style={{ opacity: 0.85, transition: 'height 0.3s' }} />

              {/* X Axis Labels */}
              <text x="88" y="190" fill="hsl(210, 10%, 50%)" fontSize="8.5" textAnchor="middle">General</text>
              <text x="193" y="190" fill="hsl(210, 10%, 50%)" fontSize="8.5" textAnchor="middle">Cardio</text>
              <text x="298" y="190" fill="hsl(210, 10%, 50%)" fontSize="8.5" textAnchor="middle">Dietetics</text>
              <text x="403" y="190" fill="hsl(210, 10%, 50%)" fontSize="8.5" textAnchor="middle">Pediatric</text>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

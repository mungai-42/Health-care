import { useState } from 'react';
import { Stethoscope, Shield, Activity, ArrowRight, Mail, Phone, MapPin, X, Info, HelpCircle, Sparkles } from 'lucide-react';

interface LoginPortalProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (signUpData: any) => void;
}

export default function LoginPortal({ onLogin, onSignUp }: LoginPortalProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [signUpRole, setSignUpRole] = useState<'PATIENT' | 'ORG_DOCTOR'>('PATIENT');

  // Registration states
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;
    onLogin(emailInput.trim(), passwordInput.trim());
    setShowLoginModal(false);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpFirstName || !signUpPassword) return;

    onSignUp({
      email: signUpEmail.trim(),
      password: signUpPassword,
      firstName: signUpFirstName.trim(),
      lastName: signUpLastName.trim(),
      role: signUpRole,
    });
    setShowSignUpModal(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(circle at top right, hsla(197, 90%, 48%, 0.1) 0%, var(--bg-dark-base) 60%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      
      {/* Animated Heartbeat Background */}
      <style>{`
        @keyframes drawPulse {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
        .nav-link {
          color: hsl(210, 10%, 75%);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--brand-primary);
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ecg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsla(197, 90%, 48%, 0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecg-grid)" />
          <path
            d="M 0,350 L 150,350 L 170,320 L 190,420 L 210,220 L 230,370 L 250,350 L 500,350 L 520,320 L 540,420 L 560,220 L 580,370 L 600,350 L 850,350 L 870,320 L 890,420 L 910,220 L 930,370 L 950,350 L 1200,350 L 1220,320 L 1240,420 L 1260,220 L 1280,370 L 1300,350 L 2000,350"
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              strokeDasharray: '2000',
              strokeDashoffset: '2000',
              animation: 'drawPulse 20s linear infinite',
            }}
          />
        </svg>
      </div>

      {/* Navigation Header Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(7, 10, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          height: '70px',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stethoscope size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Afya Flow</span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#contact" className="nav-link">Contact</a>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-color)' }} />
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fff',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setShowSignUpModal(true)}
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: 'var(--brand-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem 1rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Register
          </button>
        </nav>
      </header>

      {/* Main Sections Body */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>

        {/* 1. Hero Section */}
        <section
          style={{
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '4rem 2rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'hsla(197, 90%, 48%, 0.1)',
              border: '1px solid hsla(197, 90%, 48%, 0.25)',
              borderRadius: '20px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              color: 'var(--brand-primary-light)',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={12} /> HIPAA-COMPLIANT CLINICAL ECOSYSTEM
          </div>
          <h2 style={{ fontSize: '3.2rem', fontWeight: 800, maxWidth: '800px', lineHeight: '1.15', letterSpacing: '-0.03em' }}>
            Empowering Healthcare Teams. <br />
            <span style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Connecting Care.
            </span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'hsl(210, 10%, 65%)', maxWidth: '600px', marginTop: '1.25rem', lineHeight: '1.5' }}>
            Afya Flow integrates electronic medical charts, daily medication adherence trackers, AI-driven diet prescription engineering, and automated invoicing.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.25rem' }}>
            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--brand-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              Launch Portal Console <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('about');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Learn More
            </button>
          </div>
        </section>

        {/* 2. Platform Stats overview */}
        <section
          style={{
            backgroundColor: 'var(--bg-dark-surface)',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            padding: '2.5rem 2rem',
          }}
        >
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>4,800+</h4>
              <span style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 60%)' }}>Active Patients</span>
            </div>
            <div>
              <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-accent)' }}>120+</h4>
              <span style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 60%)' }}>Clinical Practitioners</span>
            </div>
            <div>
              <h4 style={{ fontSize: '2rem', fontWeight: 800, color: '#00E676' }}>98.2%</h4>
              <span style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 60%)' }}>Medication Compliance</span>
            </div>
            <div>
              <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>$24k+</h4>
              <span style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 60%)' }}>Invoiced Monthly</span>
            </div>
          </div>
        </section>

        {/* 3. About Us Section */}
        <section id="about" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                <Info size={14} /> ABOUT US
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: '1.25' }}>
                Transforming Patient Management for Modern Clinical Teams
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(210, 10%, 65%)', lineHeight: '1.5' }}>
                Afya Flow was founded by clinical practitioners who saw the need for integrated, HIPAA-compliant patient management. We bridge the gap between doctor directives and daily patient adherence in diet, water, and prescription medicine schedules.
              </p>
            </div>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '3px solid var(--brand-accent)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Our Core Mission</h4>
              <p style={{ fontSize: '0.85rem', color: 'hsl(210, 10%, 75%)', lineHeight: '1.5' }}>
                To design clean, elegant systems that empower owner doctors to scale operations, enable clinical practitioners to monitor cases efficiently, and support patients in achieving compliance.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Services Section */}
        <section id="services" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-dark-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Activity size={14} /> CLINICAL SERVICES
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Complete Platform Capabilities</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: '#6366F1', alignSelf: 'flex-start' }}>
                  <Shield size={18} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Electronic Medical Charts (EHR)</h4>
                <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', lineHeight: '1.4' }}>
                  Secure record-keeping with strict role-based access. Doctors only read charts assigned to them.
                </p>
              </div>

              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(13,148,136,0.1)', color: 'var(--brand-primary)', alignSelf: 'flex-start' }}>
                  <Sparkles size={18} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>AI Prescriptions Assistant</h4>
                <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', lineHeight: '1.4' }}>
                  AI-driven meal and diet generators with built-in medical refusals to protect patient safety.
                </p>
              </div>

              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(236,72,153,0.1)', color: '#EC4899', alignSelf: 'flex-start' }}>
                  <Activity size={18} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Reminders Scheduler Daemon</h4>
                <p style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 60%)', lineHeight: '1.4' }}>
                  Background engine matching schedules (water targets, meds checks, home visits) and dispatching push notifications.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Contact Us Section */}
        <section id="contact" style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ color: 'var(--brand-accent)', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HelpCircle size={14} /> GET IN TOUCH
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Contact Patient Support</h3>
              <p style={{ fontSize: '0.9rem', color: 'hsl(210, 10%, 65%)', lineHeight: '1.5' }}>
                Have questions about your organization subscription, hospital account activation, or app API keys? Our support team is available 24/7.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(210, 10%, 75%)' }}>
                  <Mail size={16} color="var(--brand-primary)" /> support@afyaflow.com
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(210, 10%, 75%)' }}>
                  <Phone size={16} color="var(--brand-primary)" /> +254 700 123 456
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(210, 10%, 75%)' }}>
                  <MapPin size={16} color="var(--brand-primary)" /> Medical District Plaza, Suite 44B
                </span>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Send Support Ticket</h4>
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent. Support will contact you shortly.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <textarea
                  placeholder="How can we help you?"
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(210, 10%, 45%)' }}>
        &copy; 2026 Afya Flow Holdings. Authorized clinical usage only. All activities audited under Winston logging ledgers.
      </footer>

      {/* ====================================================== */}
      {/* DIALOG OVERLAYS                                        */}
      {/* ====================================================== */}

      {/* 1. Unified Login Modal */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(7, 10, 15, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 500,
          }}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              borderTop: '4px solid var(--brand-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1.25rem', border: 'none', background: 'transparent', color: 'hsl(210, 10%, 65%)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Sign In to Afya Flow</h3>



            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Enter Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. admin@afyaflow.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Enter Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="e.g. admin123"
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                Launch Console
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Unified Sign Up Modal */}
      {showSignUpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(7, 10, 15, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 500,
          }}
        >
          <div
            className="glass-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              borderTop: '4px solid var(--brand-accent)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowSignUpModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1.25rem', border: 'none', background: 'transparent', color: 'hsl(210, 10%, 65%)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Create Afya Flow Account</h3>

            <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Register Role Profile</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setSignUpRole('PATIENT')}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      fontSize: '0.75rem',
                      backgroundColor: signUpRole === 'PATIENT' ? 'var(--brand-accent)' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Self-Register Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpRole('ORG_DOCTOR')}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      fontSize: '0.75rem',
                      backgroundColor: signUpRole === 'ORG_DOCTOR' ? 'var(--brand-accent)' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Practitioner Doctor
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>First Name</label>
                <input
                  type="text"
                  value={signUpFirstName}
                  onChange={(e) => setSignUpFirstName(e.target.value)}
                  placeholder="e.g. John"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Last Name</label>
                <input
                  type="text"
                  value={signUpLastName}
                  onChange={(e) => setSignUpLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Email Address</label>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="e.g. john.smith@gmail.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Create Password</label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 8 characters (1 letter & 1 number)"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  backgroundColor: 'var(--brand-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import { useState } from 'react';
import { Heart, Activity, Thermometer, Compass, Droplet, Check, AlertTriangle, Sparkles, Send, CreditCard, FileText } from 'lucide-react';

interface PatientDashboardProps {
  patientData: {
    name: string;
    email: string;
    vitals: {
      bloodPressure: string;
      heartRate: number;
      bloodSugar: number;
    };
    mealPlan: string;
    waterTarget: number;
    waterDrank: number;
  };
  onLogWater: (amount: number) => void;
}

export default function PatientDashboard({ patientData, onLogWater }: PatientDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'trackers' | 'ai-chat' | 'billing'>('trackers');

  // Medication list mock states
  const [meds, setMeds] = useState([
    { name: 'Amlodipine 5mg (Blood Pressure)', time: '08:00 AM', taken: false },
    { name: 'Atorvastatin 20mg (Cholesterol)', time: '09:00 PM', taken: false },
    { name: 'Aspirin 81mg (Cardio protection)', time: '08:00 AM', taken: true },
  ]);

  // AI Chat mock states
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your educational healthcare assistant. You can ask me about medication side effects, hydration guidelines, or dietary choices.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Billing states
  const [invoices, setInvoices] = useState([
    { id: 'inv-pat-1', date: '2026-06-22', amount: 25.0, status: 'PAID', method: 'M-Pesa' },
    { id: 'inv-pat-2', date: '2026-05-22', amount: 25.0, status: 'PAID', method: 'Card' },
  ]);
  const [selectedMethod, setSelectedMethod] = useState<'MPESA' | 'CARD' | 'BANK'>('MPESA');
  const [phone, setPhone] = useState('0712345678');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleMed = (idx: number) => {
    setMeds((prev) =>
      prev.map((med, i) => (i === idx ? { ...med, taken: !med.taken } : med)),
    );
  };

  const handlePayMembership = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setInvoices([
        {
          id: `inv-pat-${Date.now().toString().substring(8)}`,
          date: new Date().toISOString().split('T')[0],
          amount: 25.0,
          status: 'PAID',
          method: selectedMethod === 'MPESA' ? 'M-Pesa' : selectedMethod === 'CARD' ? 'Card' : 'Bank Transfer',
        },
        ...invoices,
      ]);
      alert('Membership payment authorized successfully. Care plan renewed!');
    }, 2000);
  };

  const handleSendPrompt = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setChatMessages((prev) => [...prev, { role: 'user', text }]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const query = text.toLowerCase();
      let reply = '';

      // Refusal triggers
      const diagnosisKeywords = [
        'diagnose',
        'fever',
        'chest pain',
        'prescribe',
        'treatment for',
        'cure for',
        'what disease',
        'sick',
        'stomach ache',
        'headache',
      ];

      if (diagnosisKeywords.some((k) => query.includes(k))) {
        reply =
          'As an educational assistant, I am not authorized to evaluate symptoms, diagnose conditions, or recommend medication prescriptions. Please contact your organization doctor or schedule an appointment immediately.';
      } else if (query.includes('side effect') || query.includes('pill') || query.includes('medication')) {
        reply =
          'Common side effects of your cardiovascular medication (e.g. Amlodipine) include mild ankle swelling, fatigue, and headaches. Statins can cause transient muscle aches. Discuss any persistent symptoms with your doctor.';
      } else if (query.includes('hydrate') || query.includes('water') || query.includes('hydration')) {
        reply =
          'Drinking 2.5L to 3.0L of water daily reduces myocardial strain, assists kidney filtration of drug residues, and helps maintain healthy blood volume.';
      } else if (query.includes('eat') || query.includes('diet') || query.includes('meal') || query.includes('nutrition')) {
        reply =
          'Focus on a low-sodium, heart-healthy diet. Emphasize raw leafy greens, lean protein sources (like chicken or fish), and limit sodium values to under 1500mg daily.';
      } else {
        reply =
          'Educational Insight:\n- Maintain active hydration logs.\n- Do not skip medication schedules.\n- Consult your clinical team before changing dosage values.';
      }

      setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const waterRatio = patientData.waterDrank / patientData.waterTarget;
  const completedMedsCount = meds.filter((m) => m.taken).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Tab Navigation header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Welcome Back, Patient</h3>
          <p style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 60%)', marginTop: '0.2rem' }}>
            Interactive EHR record portal & lifestyle coordinator.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('trackers')}
            style={{
              padding: '0.4rem 0.85rem',
              backgroundColor: activeSubTab === 'trackers' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Health Trackers
          </button>
          <button
            onClick={() => setActiveSubTab('ai-chat')}
            style={{
              padding: '0.4rem 0.85rem',
              backgroundColor: activeSubTab === 'ai-chat' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={12} /> AI assistant
          </button>
          <button
            onClick={() => setActiveSubTab('billing')}
            style={{
              padding: '0.4rem 0.85rem',
              backgroundColor: activeSubTab === 'billing' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <CreditCard size={12} /> Membership & Billing
          </button>
        </div>
      </div>

      {activeSubTab === 'trackers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Vitals Grid Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                <Heart size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Blood Pressure</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{patientData.vitals.bloodPressure}</h4>
              </div>
            </div>
            
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.1)', color: '#F97316' }}>
                <Activity size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Heart Pulse</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{patientData.vitals.heartRate} bpm</h4>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
                <Thermometer size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Blood Sugar</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{patientData.vitals.bloodSugar} mg/dL</h4>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Water and Meds trackers card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Hydration targets progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Droplet size={14} color="var(--brand-primary-light)" /> Water Hydration
                  </span>
                  <span style={{ color: 'var(--brand-primary-light)' }}>
                    {patientData.waterDrank} / {patientData.waterTarget} mL
                  </span>
                </div>
                <div style={{ position: 'relative', height: '8px', background: 'hsla(215, 20%, 30%, 0.25)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ width: `${Math.min(waterRatio * 100, 100)}%`, height: '100%', background: 'var(--brand-primary)', transition: 'width 0.3s' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    onClick={() => onLogWater(250)}
                    style={{ padding: '0.35rem 0.65rem', backgroundColor: 'var(--brand-primary)', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    +250 mL
                  </button>
                  <button
                    onClick={() => onLogWater(500)}
                    style={{ padding: '0.35rem 0.65rem', backgroundColor: 'transparent', border: '1px solid var(--brand-primary)', borderRadius: '4px', color: 'var(--brand-primary)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    +500 mL
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  <span>Medication Prescriptions Checklist</span>
                  <span style={{ color: 'hsl(210, 10%, 60%)', fontSize: '0.75rem' }}>
                    {completedMedsCount} / {meds.length} Taken
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
                  {meds.map((med, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleMed(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem',
                        background: 'hsla(215, 20%, 30%, 0.1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '0.8rem', color: med.taken ? 'hsl(210, 10%, 55%)' : '#fff', textDecoration: med.taken ? 'line-through' : 'none' }}>
                          {med.name}
                        </p>
                        <span style={{ fontSize: '0.65rem', color: 'hsl(210, 10%, 55%)' }}>Time: {med.time}</span>
                      </div>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          background: med.taken ? 'var(--brand-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {med.taken && <Check size={12} color="#fff" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Diet nutrition details card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Compass size={18} color="var(--brand-accent)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Active Medical Diet Plan</h4>
              </div>
              <div style={{ background: 'hsla(215, 20%, 30%, 0.1)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Diet Type: Low Sodium Cardiovascular
                </p>
                <div style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 75%)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  {patientData.mealPlan}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeSubTab === 'ai-chat' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '400px' }}>
          
          {/* Disclaimer Header bar */}
          <div
            style={{
              backgroundColor: 'hsla(35, 100%, 50%, 0.08)',
              borderBottom: '1px solid var(--border-color)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.75rem',
              color: 'hsl(35, 100%, 75%)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              Disclaimer: AI assistant handles educational healthcare inquiries only. Chat responses must never diagnose symptoms or modify prescription dosages.
            </span>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {chatMessages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '0.75rem',
                    background: isUser ? 'var(--brand-primary)' : 'hsla(215, 20%, 30%, 0.15)',
                    border: isUser ? 'none' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#fff',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.4',
                  }}
                >
                  {msg.text}
                </div>
              );
            })}

            {isTyping && (
              <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 55%)', fontStyle: 'italic' }}>
                AI assistant typing...
              </span>
            )}
          </div>

          {/* Input control footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about cardiovascular side effects, healthy fiber, water..."
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            />
            <button
              onClick={handleSendPrompt}
              style={{
                padding: '0.5rem',
                backgroundColor: 'var(--brand-primary)',
                border: 'none',
                borderRadius: '50%',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

      {activeSubTab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Subscription status header cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            
            {/* Plan Info */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--brand-primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Membership Tier
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', marginTop: '0.2rem' }}>
                    Premium Patient Care
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                    background: 'rgba(0, 200, 83, 0.15)',
                    color: '#00E676',
                  }}
                >
                  Active
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Amount Due</span>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '0.1rem' }}>$25.00 / month</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Renewal Date</span>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '0.1rem' }}>22 Jul 2026</p>
                </div>
              </div>
            </div>

            {/* Gateway choices */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Renew Membership Subscription</h4>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedMethod('MPESA')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    fontSize: '0.7rem',
                    backgroundColor: selectedMethod === 'MPESA' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  M-Pesa
                </button>
                <button
                  onClick={() => setSelectedMethod('CARD')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    fontSize: '0.7rem',
                    backgroundColor: selectedMethod === 'CARD' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Card
                </button>
                <button
                  onClick={() => setSelectedMethod('BANK')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    fontSize: '0.7rem',
                    backgroundColor: selectedMethod === 'BANK' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Bank Wire
                </button>
              </div>

              <form onSubmit={handlePayMembership} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                {selectedMethod === 'MPESA' && (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="M-Pesa Phone Number"
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.75rem',
                      outline: 'none',
                    }}
                  />
                )}
                
                {selectedMethod === 'CARD' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Cardholder Name"
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.75rem',
                        outline: 'none',
                      }}
                    />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (Visa/MC)"
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.6rem',
                        backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.75rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                {selectedMethod === 'BANK' && (
                  <div style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 65%)', background: 'hsla(215, 20%, 10%, 0.5)', padding: '0.5rem', borderRadius: '4px' }}>
                    <strong>Bank:</strong> Afya Flow Holding Bank<br />
                    <strong>Account:</strong> 1022-9908-1122<br />
                    <strong>Ref:</strong> PAT-SER-88
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    backgroundColor: 'var(--brand-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    marginTop: '0.25rem',
                  }}
                >
                  {isProcessing ? 'Processing Transaction...' : 'Authorize Renewal ($25.00)'}
                </button>
              </form>

            </div>

          </div>

          {/* Historical receipts grid */}
          <div className="glass-card" style={{ padding: 0 }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="var(--brand-primary)" /> Membership Invoice Receipts Ledger
              </h4>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'hsl(210, 10%, 55%)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Receipt ID</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Date Issued</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Plan Description</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Route</th>
                  <th style={{ padding: '0.75rem 1.25rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'hsl(210, 10%, 80%)' }}>
                    <td style={{ padding: '0.75rem 1.25rem', fontFamily: 'monospace' }}>{inv.id}</td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>{inv.date}</td>
                    <td style={{ padding: '0.75rem 1.25rem', color: '#fff', fontWeight: 600 }}>Patient Premium Membership</td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>${inv.amount.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>{inv.method}</td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.35rem', borderRadius: '3px', background: 'rgba(0, 200, 83, 0.15)', color: '#00E676', fontWeight: 'bold' }}>
                        PAID
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}

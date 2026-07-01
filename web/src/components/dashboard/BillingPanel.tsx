import { useState } from 'react';
import { CreditCard, ShieldAlert, AlertTriangle, Landmark, Plus } from 'lucide-react';

interface Invoice {
  id: string;
  recipientName: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'VOID';
  method: 'MPESA' | 'CARD' | 'BANK_TRANSFER';
  dueDate: string;
  paidAt?: string;
}

interface Subscription {
  orgName: string;
  planName: string;
  status: 'ACTIVE' | 'TRIAL' | 'GRACE_PERIOD' | 'EXPIRED';
  amount: number;
  startDate: string;
  endDate: string;
  gracePeriodEndsAt?: string;
}

export default function BillingPanel() {
  const [subscription, setSubscription] = useState<Subscription>({
    orgName: 'Afya Care Hospital',
    planName: 'Enterprise Premium Plan',
    status: 'ACTIVE',
    amount: 249.0,
    startDate: '2026-06-01',
    endDate: '2026-07-01',
  });

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-1',
      recipientName: 'Sarah Jenkins (Patient)',
      amount: 25.0,
      status: 'UNPAID',
      method: 'MPESA',
      dueDate: '2026-07-08',
    },
    {
      id: 'inv-2',
      recipientName: 'John Doe (Patient)',
      amount: 50.0,
      status: 'PAID',
      method: 'CARD',
      dueDate: '2026-06-29',
      paidAt: '2026-06-29',
    },
    {
      id: 'inv-3',
      recipientName: 'Michael Miller (Patient)',
      amount: 15.0,
      status: 'OVERDUE',
      method: 'MPESA',
      dueDate: '2026-06-21',
    },
  ]);

  // Form states for creating invoice
  const [newRecipient, setNewRecipient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newMethod, setNewMethod] = useState<'MPESA' | 'CARD' | 'BANK_TRANSFER'>('MPESA');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newAmount) return;

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      recipientName: newRecipient,
      amount: parseFloat(newAmount),
      status: 'UNPAID',
      method: newMethod,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setInvoices([invoice, ...invoices]);
    setNewRecipient('');
    setNewAmount('');
  };

  const handlePayInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: 'PAID',
              paidAt: new Date().toISOString().split('T')[0],
            }
          : inv,
      ),
    );
  };

  const triggerGracePeriod = () => {
    setSubscription({
      ...subscription,
      status: 'GRACE_PERIOD',
      gracePeriodEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Section: Subscription stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Subscription Plan details */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--brand-primary-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                Subscription Tier
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginTop: '0.2rem' }}>
                {subscription.planName}
              </h4>
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                background: subscription.status === 'ACTIVE'
                  ? 'rgba(0, 200, 83, 0.15)'
                  : 'rgba(255, 171, 0, 0.15)',
                color: subscription.status === 'ACTIVE' ? '#00E676' : '#FFD600',
              }}
            >
              {subscription.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Recurring Price</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '0.1rem' }}>
                ${subscription.amount} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'hsl(210, 10%, 55%)' }}>/ month</span>
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'hsl(210, 10%, 60%)' }}>Renewal Date</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '0.1rem' }}>
                {subscription.endDate}
              </p>
            </div>
          </div>

          {subscription.status === 'GRACE_PERIOD' && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                backgroundColor: 'rgba(215, 38, 38, 0.1)',
                border: '1px solid rgba(215, 38, 38, 0.25)',
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'hsl(355, 100%, 75%)',
                marginTop: '0.5rem',
              }}
            >
              <AlertTriangle size={16} />
              <span>Grace Period ends on: <strong>{subscription.gracePeriodEndsAt}</strong>. Lockout pending.</span>
            </div>
          )}

          {subscription.status === 'ACTIVE' && (
            <button
              onClick={triggerGracePeriod}
              style={{
                alignSelf: 'flex-start',
                fontSize: '0.7rem',
                backgroundColor: 'rgba(255,171,0,0.1)',
                color: '#FFD600',
                border: '1px solid rgba(255,171,0,0.25)',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Simulate Expired Grace Period
            </button>
          )}
        </div>

        {/* Integration Gateways Stats */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Supported Payment Gateways</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.5rem', background: 'hsla(215, 20%, 30%, 0.1)', borderRadius: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Landmark size={14} color="var(--brand-primary-light)" /> M-Pesa STK Push
              </span>
              <span style={{ color: 'var(--brand-primary-light)', fontWeight: 600 }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.5rem', background: 'hsla(215, 20%, 30%, 0.1)', borderRadius: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard size={14} color="var(--brand-accent)" /> Card Authorization (Visa/MC)
              </span>
              <span style={{ color: 'var(--brand-primary-light)', fontWeight: 600 }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.5rem', background: 'hsla(215, 20%, 30%, 0.1)', borderRadius: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={14} color="var(--brand-primary)" /> Bank Transfer Wire
              </span>
              <span style={{ color: 'var(--brand-primary-light)', fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Invoice list & creation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Invoices List table */}
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Invoice Generation & Ledger</h4>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'hsl(210, 10%, 55%)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Invoice ID</th>
                <th style={{ padding: '1rem' }}>Recipient Name</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Due Date</th>
                <th style={{ padding: '1rem' }}>Method</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'hsl(210, 10%, 80%)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{inv.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{inv.recipientName}</td>
                  <td style={{ padding: '1rem' }}>${inv.amount.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{inv.dueDate}</td>
                  <td style={{ padding: '1rem' }}>{inv.method}</td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '0.15rem 0.35rem',
                        borderRadius: '3px',
                        background: inv.status === 'PAID'
                          ? 'rgba(0, 200, 83, 0.15)'
                          : inv.status === 'OVERDUE'
                          ? 'rgba(215, 38, 38, 0.15)'
                          : 'rgba(255, 171, 0, 0.15)',
                        color: inv.status === 'PAID' ? '#00E676' : inv.status === 'OVERDUE' ? '#FF5252' : '#FFD600',
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => handlePayInvoice(inv.id)}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        Simulate Payment Clear
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Generation Form */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} color="var(--brand-primary)" /> Generate Invoice
          </h4>

          <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Recipient Name</label>
              <input
                type="text"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="e.g. John Smith"
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
              <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Amount ($)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="e.g. 50.00"
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
              <label style={{ fontSize: '0.75rem', color: 'hsl(210, 10%, 65%)' }}>Primary Payment Route</label>
              <select
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-dark-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none',
                  marginTop: '0.25rem',
                }}
              >
                <option value="MPESA">M-Pesa</option>
                <option value="CARD">Card Authorization</option>
                <option value="BANK_TRANSFER">Bank Wire</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.6rem',
                backgroundColor: 'var(--brand-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Generate & Dispatch
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

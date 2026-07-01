import { useState } from 'react';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  mealPlan: string;
}

interface DoctorAiMealDraftProps {
  patients: Patient[];
  onAssignMealPlan: (patientId: string, mealPlan: string) => void;
}

export default function DoctorAiMealDraft({ patients, onAssignMealPlan }: DoctorAiMealDraftProps) {
  const [patientCondition, setPatientCondition] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleGenerateDraft = async () => {
    if (!patientCondition.trim()) return;
    setIsGenerating(true);
    setStatusMessage('');

    // Simulate backend call to AI Meal Plan Draft Generator
    setTimeout(() => {
      const condition = patientCondition.toLowerCase();
      let draft = '';

      if (condition.includes('pressure') || condition.includes('hypertension') || condition.includes('sodium')) {
        draft =
          'DRAFT LOW-SODIUM DIET PLAN:\n' +
          '- Breakfast: Oatmeal with raw berries and a handful of unsalted almonds.\n' +
          '- Lunch: Grilled chicken breast over mixed spinach salad with olive oil dressing.\n' +
          '- Dinner: Baked salmon with roasted asparagus and brown rice.\n' +
          '- Fluid target: 2500mL daily.';
      } else if (condition.includes('diabetic') || condition.includes('sugar') || condition.includes('glucose')) {
        draft =
          'DRAFT GLYCEMIC CONTROL DIET PLAN:\n' +
          '- Breakfast: Scrambled egg whites with avocado and spinach.\n' +
          '- Lunch: Quinoa salad with grilled tofu, cucumber, and light lemon dressing.\n' +
          '- Dinner: Steamed cod fillet with broccoli and sautéed cauliflower rice.\n' +
          '- Fluid target: 3000mL daily.';
      } else {
        draft =
          'DRAFT STANDARD BALANCED DIET PLAN:\n' +
          '- Breakfast: Greek yogurt with fresh fruit slices and honey.\n' +
          '- Lunch: Turkey wrap with whole wheat tortilla, lettuce, and sliced tomatoes.\n' +
          '- Dinner: Grilled chicken breast with sweet potatoes and steam-sautéed beans.\n' +
          '- Fluid target: 2800mL daily.';
      }

      setGeneratedDraft(draft);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAssignPlan = () => {
    if (!selectedPatientId || !generatedDraft.trim()) return;
    onAssignMealPlan(selectedPatientId, generatedDraft);
    setStatusMessage('Meal plan reviewed, finalized and assigned successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--brand-primary)" /> Clinical AI Diet Assistant
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'hsl(210, 10%, 65%)', marginTop: '0.2rem' }}>
          Enter a patient's clinical condition tags to draft custom nutrition plans.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Input Form */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(210, 10%, 80%)' }}>
              Patient Condition Details
            </label>
            <textarea
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              placeholder="e.g. Hypertension, cardiovascular concerns, needs low sodium target under 1500mg daily"
              style={{
                width: '100%',
                height: '100px',
                backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#fff',
                padding: '0.75rem',
                fontSize: '0.85rem',
                outline: 'none',
                marginTop: '0.5rem',
                resize: 'none',
              }}
            />
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating || !patientCondition.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--brand-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              opacity: isGenerating || !patientCondition.trim() ? 0.6 : 1,
            }}
          >
            {isGenerating ? 'Generating Draft Plan...' : 'Generate Draft Plan'}
          </button>

          <div
            style={{
              backgroundColor: 'hsla(35, 100%, 50%, 0.1)',
              border: '1px solid hsla(35, 100%, 50%, 0.2)',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '0.7rem',
              color: 'hsl(35, 100%, 75%)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              Disclaimer: AI meal generation is for draft documentation purposes only. Doctors are legally required to review, verify, and edit drafts before clinical assignment.
            </span>
          </div>
        </div>

        {/* Right Side: Draft Editor & Assignment */}
        {generatedDraft && (
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(210, 10%, 80%)' }}>
                Draft Review & Editor (Modify Plan Details Below)
              </label>
              <textarea
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: 'hsla(215, 20%, 10%, 0.5)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                  marginTop: '0.5rem',
                  lineHeight: '1.4',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(210, 10%, 80%)' }}>
                Select Target Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{
                  padding: '0.6rem',
                  backgroundColor: 'var(--bg-dark-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <option value="">-- Choose Patient Record --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Active: {p.mealPlan.substring(0, 20)}...)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignPlan}
              disabled={!selectedPatientId || !generatedDraft.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: 'var(--brand-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                opacity: !selectedPatientId ? 0.6 : 1,
              }}
            >
              <Check size={16} /> Finalize & Assign Meal Plan
            </button>

            {statusMessage && (
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--brand-primary-light)', fontWeight: 600 }}>
                {statusMessage}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

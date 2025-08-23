import { useState } from 'react';
import { Modal } from './components/Modal';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';
import { RHFForm } from './components/Forms/RHFForm';
import { SubmissionCard } from './components/SubmissionCard/SubmissionCard';
import { useAppSelector } from './store/hooks';

type Mode = 'uncontrolled' | 'rhf' | null;

function App() {
  const [mode, setMode] = useState<Mode>(null);
  const submissions = useAppSelector((st) => st.forms.submissions);

  return (
    <>
      <h1>Form app</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setMode('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => setMode('rhf')}>Open RHF Form</button>
      </div>

      {submissions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>
          No submissions yet — fill any form to see tiles here.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          }}
        >
          {submissions.map((s) => (
            <SubmissionCard
              key={s.id}
              id={s.id}
              source={s.source}
              data={s.data}
              isNew={s.isNew}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={mode !== null}
        onClose={() => setMode(null)}
        title={mode === 'rhf' ? 'React Hook Form' : 'Uncontrolled Form'}
      >
        {mode === 'rhf' && <RHFForm onSuccess={() => setMode(null)} />}
        {mode === 'uncontrolled' && (
          <UncontrolledForm onSuccess={() => setMode(null)} />
        )}
      </Modal>
    </>
  );
}

export default App;

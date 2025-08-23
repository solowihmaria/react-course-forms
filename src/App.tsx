import { useState } from 'react';
import { Modal } from './components/Modal';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';

type Mode = 'uncontrolled' | 'rhf' | null;

function App() {
  const [mode, setMode] = useState<Mode>(null);

  return (
    <>
      <h1>Vite + React</h1>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setMode('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => setMode('rhf')}>Open RHF Form</button>
      </div>

      <Modal
        isOpen={mode !== null}
        onClose={() => setMode(null)}
        title={mode === 'rhf' ? 'React Hook Form' : 'Uncontrolled Form'}
      >
        {mode === 'rhf' && (
          <p>RHF placeholder — здесь позже будет форма на RHF.</p>
        )}

        {mode === 'uncontrolled' && (
          <UncontrolledForm onSuccess={() => setMode(null)} />
        )}
      </Modal>
    </>
  );
}

export default App;

import { useState } from 'react';
import { Modal } from './components/Modal';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';
import { RHFForm } from './components/Forms/RHFForm';
import { useAppSelector } from './store/hooks';
import { SubmissionsList } from './components/SubmissionsList/SubmissionsList';
import s from './App.module.scss';

type Mode = 'uncontrolled' | 'rhf' | null;

function App() {
  const [mode, setMode] = useState<Mode>(null);
  const submissions = useAppSelector((st) => st.forms.submissions);

  return (
    <div className={s.app}>
      <h1 className={s.title}>Form app</h1>

      <div className={s.toolbar}>
        <button
          className={s.btnSecondary}
          onClick={() => setMode('uncontrolled')}
        >
          Open Uncontrolled Form
        </button>
        <button className={s.btn} onClick={() => setMode('rhf')}>
          Open RHF Form
        </button>
      </div>

      <div className={s.listWrap}>
        <SubmissionsList items={submissions} />
      </div>

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
    </div>
  );
}

export default App;

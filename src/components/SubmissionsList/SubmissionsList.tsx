import type { Submission } from '../../store/slices/formsSlice';
import { SubmissionCard } from '../SubmissionCard';
import s from './SubmissionsList.module.scss';

type Props = {
  items: Submission[];
};

export function SubmissionsList({ items }: Props) {
  if (!items.length) {
    return (
      <div className={s.empty}>
        <p className={s.emptyText}>
          No submissions yet — fill any form to see tiles here.
        </p>
      </div>
    );
  }

  return (
    <div className={s.grid}>
      {items.map((s) => (
        <SubmissionCard
          key={s.id}
          id={s.id}
          source={s.source}
          data={s.data}
          isNew={s.isNew}
        />
      ))}
    </div>
  );
}

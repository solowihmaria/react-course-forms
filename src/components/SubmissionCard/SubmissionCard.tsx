import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { clearNewFlag } from '../../store/slices/formsSlice';
import type { UserFormData } from '../Forms/types';
import s from './SubmissionCard.module.scss';

type Props = {
  id: string;
  source: 'uncontrolled' | 'rhf';
  data: UserFormData;
  isNew: boolean;
};

export function SubmissionCard({ id, source, data, isNew }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => dispatch(clearNewFlag(id)), 3000);
    return () => clearTimeout(t);
  }, [isNew, id, dispatch]);

  return (
    <article className={`${s.card} ${isNew ? s.new : ''}`}>
      <header className={s.header}>
        <h3 className={s.title}>{data.name}</h3>
        <span
          className={`${s.badge} ${source === 'rhf' ? s.badgeRHF : s.badgeUnc}`}
        >
          {source}
        </span>
      </header>

      <div className={s.body}>
        {data.pictureBase64 && (
          <img
            className={s.avatar}
            src={data.pictureBase64}
            alt={`${data.name}'s picture`}
          />
        )}

        <dl className={s.info}>
          <div>
            <dt>Email:</dt>
            <dd>{data.email}</dd>
          </div>
          <div>
            <dt>Age:</dt>
            <dd>{data.age}</dd>
          </div>
          <div>
            <dt>Gender:</dt>
            <dd>{data.gender}</dd>
          </div>
          <div>
            <dt>Country:</dt>
            <dd>{data.country}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

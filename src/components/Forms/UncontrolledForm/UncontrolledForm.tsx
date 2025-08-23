import { useState } from 'react';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addSubmission } from '../../../store/slices/formsSlice';
import { formSchema } from '../validation';
import { fileToBase64 } from '../../../utils/fileToBase64';
import {
  getPasswordScore,
  getPasswordLabel,
} from '../../../utils/passwordStrength';
import type { UserFormData, Gender } from '../types';
import s from '../Form.module.scss';

type Props = {
  onSuccess: () => void;
};

type Errors = Record<string, string | undefined>;

function isGender(v: unknown): v is Gender {
  return v === 'male' || v === 'female' || v === 'other';
}

export function UncontrolledForm({ onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((st) => st.countries.list);
  const [errors, setErrors] = useState<Errors>({});
  const [passwordPreview, setPasswordPreview] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const file =
        (form.elements.namedItem('picture') as HTMLInputElement)?.files?.[0] ??
        null;
      const pictureBase64 = file ? await fileToBase64(file) : null;

      const genderEntry = fd.get('gender');
      const gender: Gender = isGender(genderEntry) ? genderEntry : 'other';

      const data: UserFormData = {
        name: String(fd.get('name') ?? ''),
        age: Number(fd.get('age') ?? ''),
        email: String(fd.get('email') ?? ''),
        password: String(fd.get('password') ?? ''),
        confirmPassword: String(fd.get('confirmPassword') ?? ''),
        gender,
        acceptTC: fd.get('acceptTC') === 'on',
        country: String(fd.get('country') ?? ''),
        pictureBase64,
      };

      await formSchema.validate(data, { abortEarly: false });

      dispatch(addSubmission({ source: 'uncontrolled', data }));
      onSuccess();
      form.reset();
      setPasswordPreview('');
    } catch (err: unknown) {
      const next: Errors = {};

      if (err instanceof Yup.ValidationError) {
        if (err.inner.length) {
          err.inner.forEach((ve) => {
            if (ve.path && !next[ve.path]) next[ve.path] = ve.message;
          });
        } else if (err.path) {
          next[err.path] = err.message;
        }
      } else if (err instanceof Error) {
        next.pictureBase64 = err.message;
      }

      setErrors(next);
    }
  }

  const score = getPasswordScore(passwordPreview);
  const label = getPasswordLabel(score);
  const bars = [0, 1, 2, 3];

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <div className={s.row}>
        <label className={s.label} htmlFor="name">
          Name
        </label>
        <input
          className={s.input}
          id="name"
          name="name"
          type="text"
          placeholder="John"
        />
        <div className={s.error} aria-live="polite">
          {errors.name}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="age">
          Age
        </label>
        <input
          className={s.input}
          id="age"
          name="age"
          type="number"
          min={0}
          placeholder="18"
        />
        <div className={s.error} aria-live="polite">
          {errors.age}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="email">
          Email
        </label>
        <input
          className={s.input}
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
        />
        <div className={s.error} aria-live="polite">
          {errors.email}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="password">
          Password
        </label>
        <input
          className={s.input}
          id="password"
          name="password"
          type="password"
          onChange={(e) => setPasswordPreview(e.target.value)}
          placeholder="********"
        />

        <div className={s.strength}>
          <div className={s.bars}>
            {bars.map((i) => (
              <span
                key={i}
                className={`${s.bar} ${score > i ? s.barActive : ''}`}
              />
            ))}
          </div>
          <span className={s.help}>{label}</span>
        </div>
        <div className={s.error} aria-live="polite">
          {errors.password}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          className={s.input}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="********"
        />
        <div className={s.error} aria-live="polite">
          {errors.confirmPassword}
        </div>
      </div>

      <div className={s.row}>
        <span className={s.label}>Gender</span>
        <div className={s.checkboxRow}>
          <label>
            <input type="radio" name="gender" value="male" /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" /> Female
          </label>
          <label>
            <input type="radio" name="gender" value="other" /> Other
          </label>
        </div>
        <div className={s.error} aria-live="polite">
          {errors.gender}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.checkboxRow}>
          <input id="acceptTC" name="acceptTC" type="checkbox" />
          <span>I accept Terms & Conditions</span>
        </label>
        <div className={s.error} aria-live="polite">
          {errors.acceptTC}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="country">
          Country
        </label>
        <input
          id="country"
          className={s.input}
          name="country"
          list="countries-list"
          placeholder="Start typing a country…"
        />
        <datalist id="countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <div className={s.error} aria-live="polite">
          {errors.country}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="picture">
          Picture (PNG/JPEG, ≤2MB)
        </label>
        <input
          id="picture"
          name="picture"
          type="file"
          accept="image/png,image/jpeg"
        />
        <div className={s.error} aria-live="polite">
          {errors.pictureBase64}
        </div>
      </div>

      <div className={s.actions}>
        <button
          type="button"
          className={s.btnSecondary}
          onClick={() => onSuccess()}
        >
          Cancel
        </button>
        <button type="submit" className={s.btn}>
          Submit
        </button>
      </div>
    </form>
  );
}

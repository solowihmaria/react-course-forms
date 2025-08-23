import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addSubmission } from '../../../store/slices/formsSlice';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema } from '../validation';
import { fileToBase64 } from '../../../utils/fileToBase64';
import {
  getPasswordLabel,
  getPasswordScore,
} from '../../../utils/passwordStrength';
import type { UserFormData } from '../types';
import s from '../Form.module.scss';

type Props = { onSuccess: () => void };

export function RHFForm({ onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((st) => st.countries.list);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
  } = useForm<UserFormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'other',
      acceptTC: false,
      country: '',
      pictureBase64: null,
    },
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setValue('pictureBase64', null, { shouldValidate: true });
      clearErrors('pictureBase64');
      return;
    }
    try {
      const b64 = await fileToBase64(f);
      setValue('pictureBase64', b64, { shouldValidate: true });
      clearErrors('pictureBase64');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid file';
      setValue('pictureBase64', null, { shouldValidate: true });
      setError('pictureBase64', { type: 'manual', message: msg });
    }
  };

  const onSubmit: SubmitHandler<UserFormData> = (data) => {
    dispatch(addSubmission({ source: 'rhf', data }));
    onSuccess();
    reset();
  };

  const password = watch('password') ?? '';
  const score = getPasswordScore(password);
  const label = getPasswordLabel(score);
  const bars = [0, 1, 2, 3];

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={s.row}>
        <label className={s.label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className={s.input}
          {...register('name')}
          placeholder="John"
        />
        <div className={s.error} aria-live="polite">
          {errors.name?.message}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="age">
          Age
        </label>
        <input
          id="age"
          className={s.input}
          type="number"
          min={0}
          {...register('age', { valueAsNumber: true })}
          placeholder="18"
        />
        <div className={s.error} aria-live="polite">
          {errors.age?.message}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className={s.input}
          type="email"
          {...register('email')}
          placeholder="john@example.com"
        />
        <div className={s.error} aria-live="polite">
          {errors.email?.message}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className={s.input}
          type="password"
          {...register('password')}
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
          {errors.password?.message}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          className={s.input}
          type="password"
          {...register('confirmPassword')}
          placeholder="********"
        />
        <div className={s.error} aria-live="polite">
          {errors.confirmPassword?.message}
        </div>
      </div>

      <div className={s.row}>
        <span className={s.label}>Gender</span>
        <div className={s.checkboxRow}>
          <label>
            <input
              type="radio"
              value="male"
              {...register('gender', { required: true })}
            />{' '}
            Male
          </label>
          <label>
            <input
              type="radio"
              value="female"
              {...register('gender', { required: true })}
            />{' '}
            Female
          </label>
          <label>
            <input
              type="radio"
              value="other"
              {...register('gender', { required: true })}
            />{' '}
            Other
          </label>
        </div>
        <div className={s.error} aria-live="polite">
          {errors.gender?.message}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.checkboxRow} htmlFor="acceptTC">
          <input id="acceptTC" type="checkbox" {...register('acceptTC')} />
          <span>I accept Terms & Conditions</span>
        </label>
        <div className={s.error} aria-live="polite">
          {errors.acceptTC?.message}
        </div>
      </div>

      {/* country (пока select; позже  autocomplete) */}
      <div className={s.row}>
        <label className={s.label} htmlFor="country">
          Country
        </label>
        <select
          id="country"
          className={s.select}
          defaultValue=""
          {...register('country')}
        >
          <option value="" disabled>
            Select country…
          </option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className={s.error} aria-live="polite">
          {errors.country?.message}
        </div>
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="picture">
          Picture (PNG/JPEG, ≤2MB)
        </label>
        <input
          id="picture"
          type="file"
          accept="image/png,image/jpeg"
          onChange={onFileChange}
        />
        <div className={s.error} aria-live="polite">
          {errors.pictureBase64?.message}
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
        <button
          type="submit"
          className={s.btn}
          disabled={!isValid || isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

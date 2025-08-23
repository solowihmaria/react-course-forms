import * as Yup from 'yup';
import type { UserFormData, Gender } from './types';

// Keep both Latin & Cyrillic uppercase for first letter
export const nameFirstUpper = /^[A-ZА-Я][A-Za-zА-Яа-я' -]*$/;
export const passwordStrengthRe =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).+$/;

export const formSchema: Yup.ObjectSchema<UserFormData> = Yup.object({
  name: Yup.string()
    .matches(nameFirstUpper, 'First letter must be uppercase')
    .required('Enter your name'),
  age: Yup.number()
    .typeError('Age must be a number')
    .integer('Age must be an integer')
    .min(0, 'Age cannot be negative')
    .required('Enter your age'),
  email: Yup.string().email('Invalid email').required('Enter your email'),
  password: Yup.string()
    .matches(
      passwordStrengthRe,
      'Weak password: require at least one digit, uppercase, lowercase, and special character'
    )
    .min(8, 'At least 8 characters')
    .required('Enter your password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
  gender: Yup.mixed<Gender>()
    .oneOf(['male', 'female', 'other'], 'Select gender')
    .required('Select gender'),
  acceptTC: Yup.boolean()
    .oneOf([true], 'You must accept the Terms & Conditions')
    .defined(),
  country: Yup.string().required('Select a country'),

  pictureBase64: Yup.string().nullable().defined(),
}).required();

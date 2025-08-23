import * as Yup from 'yup';

export const nameFirstUpper = /^[A-ZА-Я][A-Za-zА-Яа-я' -]*$/;

export const passwordStrengthRe =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).+$/;

export const formSchema = Yup.object({
  name: Yup.string()
    .matches(nameFirstUpper, 'Первая буква должна быть заглавной')
    .required('Введите имя'),
  age: Yup.number()
    .typeError('Возраст должен быть числом')
    .integer('Возраст должен быть целым')
    .min(0, 'Возраст не может быть отрицательным')
    .required('Введите возраст'),
  email: Yup.string().email('Некорректный email').required('Введите email'),
  password: Yup.string()
    .matches(
      passwordStrengthRe,
      'Пароль слабый: нужны цифра, заглавная, строчная и спецсимвол'
    )
    .min(8, 'Минимум 8 символов')
    .required('Введите пароль'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли не совпадают')
    .required('Повторите пароль'),
  gender: Yup.mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'], 'Выберите пол')
    .required('Выберите пол'),
  acceptTC: Yup.boolean().oneOf([true], 'Необходимо согласие с условиями'),
  country: Yup.string().required('Выберите страну'),

  pictureBase64: Yup.string().nullable(),
});

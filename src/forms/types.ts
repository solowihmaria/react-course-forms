export type Gender = 'male' | 'female' | 'other';

export type UserFormData = {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  acceptTC: boolean;
  pictureBase64: string | null;
  country: string;
};

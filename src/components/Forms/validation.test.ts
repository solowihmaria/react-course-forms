import { describe, it, expect } from 'vitest';
import { formSchema } from './validation';
import type { UserFormData } from './types';

const valid: UserFormData = {
  name: 'John',
  age: 22,
  email: 'john@example.com',
  password: 'Aa1@aaaa',
  confirmPassword: 'Aa1@aaaa',
  gender: 'male',
  acceptTC: true,
  country: 'Germany',
  pictureBase64: null,
};

describe('formSchema (Yup)', () => {
  it('passes on valid data', async () => {
    await expect(
      formSchema.validate(valid, { abortEarly: false })
    ).resolves.toBeTruthy();
  });

  it('fails on invalid name (lowercase first)', async () => {
    const bad = { ...valid, name: 'john' };
    await expect(
      formSchema.validate(bad, { abortEarly: false })
    ).rejects.toThrow(/first letter must be uppercase/i);
  });

  it('fails on negative age', async () => {
    const bad = { ...valid, age: -1 };
    await expect(
      formSchema.validate(bad, { abortEarly: false })
    ).rejects.toThrow(/cannot be negative/i);
  });

  it('fails on invalid email', async () => {
    const bad = { ...valid, email: 'nope' };
    await expect(
      formSchema.validate(bad, { abortEarly: false })
    ).rejects.toThrow(/invalid email/i);
  });

  it('fails when passwords do not match', async () => {
    const bad = { ...valid, confirmPassword: 'different' };
    await expect(
      formSchema.validate(bad, { abortEarly: false })
    ).rejects.toThrow(/passwords do not match/i);
  });

  it('fails when T&C not accepted', async () => {
    const bad = { ...valid, acceptTC: false };
    await expect(
      formSchema.validate(bad, { abortEarly: false })
    ).rejects.toThrow(/must accept/i);
  });

  it('fails when country is empty', async () => {
    const bad = { ...valid, country: '' };
    await expect(
      formSchema.validate(bad, { abortEarly: false })
    ).rejects.toThrow(/select a country/i);
  });
});

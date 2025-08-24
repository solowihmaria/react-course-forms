import { describe, it, expect } from 'vitest';
import { fileToBase64 } from './fileToBase64';

describe('fileToBase64', () => {
  it('converts allowed file to data URL', async () => {
    const file = new File(['hello'], 'a.png', { type: 'image/png' });
    const b64 = await fileToBase64(file, 1024);
    expect(b64).toMatch(/^data:image\/png;base64,/);
  });

  it('rejects disallowed mime types', async () => {
    const file = new File(['x'], 'a.gif', { type: 'image/gif' });
    await expect(fileToBase64(file)).rejects.toThrow(/only png or jpeg/i);
  });

  it('rejects when file is larger than limit', async () => {
    const file = new File(['hello'], 'a.png', { type: 'image/png' });
    await expect(fileToBase64(file, 1)).rejects.toThrow(/too large/i);
  });
});

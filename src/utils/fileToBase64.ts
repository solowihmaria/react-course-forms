const ALLOWED = ['image/png', 'image/jpeg'];

export async function fileToBase64(file: File, maxBytes = 2 * 1024 * 1024) {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('Only PNG or JPEG are allowed');
  }
  if (file.size > maxBytes) {
    throw new Error('File is too large (max 2MB)');
  }
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return base64;
}

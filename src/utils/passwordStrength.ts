export function getPasswordScore(p: string): number {
  let s = 0;
  if (/\d/.test(p)) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

export function getPasswordLabel(
  score: number
): 'weak' | 'ok' | 'good' | 'strong' | 'empty' {
  if (score <= 0) return 'empty';
  if (score === 1) return 'weak';
  if (score === 2) return 'ok';
  if (score === 3) return 'good';
  return 'strong';
}

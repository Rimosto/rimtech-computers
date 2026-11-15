export function formatKsh(amount) {
  if (amount === null || amount === undefined) return 'Ask for price';
  return `KSh ${Number(amount).toLocaleString('en-KE')}`;
}
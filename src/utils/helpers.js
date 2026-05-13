export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(s) {
  if (!s) return '';
  return new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysUntil(d) {
  return Math.max(0, Math.ceil((d - new Date()) / 86400000));
}

export const STATUS_CLS = {
  Wishlist: 'badge-gray',
  Applied: 'badge-blue',
  OA: 'badge-purple',
  Interview: 'badge-yellow',
  Offer: 'badge-green',
  Rejected: 'badge-red',
};

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

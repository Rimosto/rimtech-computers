// The last order is kept only for this browser tab, so the confirmation page can show it.
const KEY = 'rimtech-last-order-v1';

export function saveLastOrder(order) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Storage unavailable. The confirmation page will show a fallback message.
  }
}

export function loadLastOrder() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLastOrder() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}

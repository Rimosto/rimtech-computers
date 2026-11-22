import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContext';
import { products } from '../data/products';
import { buildLines, canAddToCart, maxQuantity, summarise } from '../utils/cart';

const STORAGE_KEY = 'rimtech-cart-v1';

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && Number.isInteger(i.id) && Number.isInteger(i.quantity) && i.quantity > 0)
      .map((i) => ({ id: i.id, quantity: i.quantity }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage is unavailable (private mode or full). The cart still works for this visit.
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    if (!canAddToCart(product)) return;
    const max = maxQuantity(product);
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(i.quantity + qty, max) } : i
        );
      }
      return [...current, { id: product.id, quantity: Math.min(qty, max) }];
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const clamped = Math.min(Math.max(quantity, 0), maxQuantity(product));
    setItems((current) =>
      clamped === 0
        ? current.filter((i) => i.id !== id)
        : current.map((i) => (i.id === id ? { ...i, quantity: clamped } : i))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const lines = buildLines(items, products);
    return { lines, ...summarise(lines), addItem, setQuantity, removeItem, clear };
  }, [items, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

import { useEffect, useState } from 'react';
import Button from '../common/Button';
import { useCart } from '../../hooks/useCart';
import { maxQuantity } from '../../utils/cart';

export default function AddToCartButton({ product, size, block = false }) {
  const { lines, addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = lines.find((l) => l.product.id === product.id)?.quantity ?? 0;
  const atMax = inCart >= maxQuantity(product);

  useEffect(() => {
    if (!justAdded) return undefined;
    const timer = setTimeout(() => setJustAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  function handleClick() {
    addItem(product, 1);
    setJustAdded(true);
  }

  let label = 'Add to cart';
  if (atMax) label = 'Maximum in cart';
  else if (justAdded) label = 'Added to cart';
  else if (inCart > 0) label = `Add another (${inCart} in cart)`;

  return (
    <Button
      type="button"
      size={size}
      block={block}
      onClick={handleClick}
      disabled={atMax}
      aria-live="polite"
    >
      {label}
    </Button>
  );
}

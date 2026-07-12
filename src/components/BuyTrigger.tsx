'use client';
import { CHECKOUT_ENABLED, type ProductId } from '@/lib/constants';

// Opens the ReportUnlock buy modal for a product from inline locked sections.
// When checkout is disabled it shows a "Coming soon" button instead.
export default function BuyTrigger({
  product,
  children,
  className,
  style,
}: {
  product: ProductId;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!CHECKOUT_ENABLED) {
    return (
      <button type="button" className={className} style={{ ...style, opacity: 0.7, cursor: 'not-allowed' }} disabled>
        Coming soon
      </button>
    );
  }
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new CustomEvent('open-buy-modal', { detail: { product } }))}
    >
      {children}
    </button>
  );
}

import type { Order } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: Order;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diffHr / 24)} day${Math.floor(diffHr / 24) !== 1 ? 's' : ''} ago`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface CustomizationChip {
  label: string;
}

function buildChips(order: Order): CustomizationChip[] {
  const chips: CustomizationChip[] = [];

  if (order.style === 'aerocano') {
    chips.push({ label: 'Aerocano ☁' });
  }
  if (order.syrup !== 'none') {
    chips.push({ label: capitalize(order.syrup) });
  }
  if (order.sweetness !== 'none') {
    const labelMap: Record<string, string> = {
      light: 'Light sweet',
      default: 'Default sweet',
      extra: 'Extra sweet',
    };
    chips.push({ label: labelMap[order.sweetness] ?? capitalize(order.sweetness) });
  }
  if (order.milk !== 'none') {
    chips.push({ label: `${capitalize(order.milk)} milk` });
  }
  if (order.caffeine !== 'full-caf') {
    const labelMap: Record<string, string> = {
      decaf: 'Decaf',
      'half-caf': 'Half-caf',
      'full-caf': 'Full caf',
    };
    chips.push({ label: labelMap[order.caffeine] ?? order.caffeine });
  }

  return chips;
}

export default function OrderCard({ order }: OrderCardProps) {
  const isDone = order.status === 'done';
  const drinkName = order.drink_name ?? order.drink_id;
  const tempLabel = order.temp === 'hot' ? '☕ Hot' : '🧊 Iced';
  const chips = buildChips(order);

  return (
    <div
      className={`
        bg-milk rounded-2xl border border-cream p-4 shadow-sm shadow-latte/10
        transition-opacity duration-300
        ${isDone ? 'opacity-60' : 'opacity-100'}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-espresso font-bold text-lg leading-tight">
            {order.customer_name}
          </p>
          <p className="text-roast text-sm font-medium mt-0.5">
            {tempLabel} {drinkName}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-cream text-coffee border border-cream"
            >
              {chip.label}
            </span>
          ))}
        </div>
      )}

      {order.special_notes && (
        <p className="mt-2 text-sm text-roast/80 italic">
          &ldquo;{order.special_notes}&rdquo;
        </p>
      )}

      <p className="mt-2 text-xs text-latte">{relativeTime(order.created_at)}</p>
    </div>
  );
}

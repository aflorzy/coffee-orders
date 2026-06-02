import type { Order, OrderStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';

const STATUS_CYCLE: Record<OrderStatus, OrderStatus> = {
  pending: 'in-progress',
  'in-progress': 'done',
  done: 'pending',
};

interface OrderCardProps {
  order: Order;
  onStatusChange?: (id: string, status: OrderStatus) => void;
  onDelete?: (id: string) => void;
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

export default function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
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
        <div className="min-w-0">
          <p className="text-espresso font-bold text-lg leading-tight">
            {order.customer_name}
          </p>
          <p className="text-roast text-sm font-medium mt-0.5">
            {tempLabel} {drinkName}
          </p>
        </div>
        {onStatusChange ? (
          <button
            onClick={() => onStatusChange(order.id, STATUS_CYCLE[order.status])}
            aria-label={`Mark as ${STATUS_CYCLE[order.status]}`}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-caramel/40 rounded-full"
            title={`Mark as ${STATUS_CYCLE[order.status]}`}
          >
            <StatusBadge status={order.status} />
          </button>
        ) : (
          <StatusBadge status={order.status} />
        )}
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

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-latte">{relativeTime(order.created_at)}</p>
        {onDelete && (
          <button
            onClick={() => window.confirm('Delete this order?') && onDelete(order.id)}
            aria-label="Delete order"
            className="text-roast/30 hover:text-red-400 transition-colors -m-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Delete order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

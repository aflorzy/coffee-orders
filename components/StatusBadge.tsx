import type { OrderStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-caramel/15 text-coffee ring-1 ring-inset ring-caramel/30',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200',
  },
  done: {
    label: 'Done ✓',
    className: 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-200',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

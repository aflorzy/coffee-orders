'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import OrderCard from '@/components/OrderCard';

function timeAgoShort(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

function sortOrders(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    const aIsDone = a.status === 'done' ? 1 : 0;
    const bIsDone = b.status === 'done' ? 1 : 0;
    if (aIsDone !== bIsDone) return aIsDone - bIsDone;
    // Most recent first within each group
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: Order[] = await res.json();
      setOrders(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load orders.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 15_000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Tick every 10s so relative timestamps stay fresh
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => clearInterval(interval);
  }, []);

  const sorted = sortOrders(orders);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-espresso">Orders Board</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-latte">
              Updated {timeAgoShort(lastUpdated)}
            </span>
          )}
          <button
            onClick={fetchOrders}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cream text-coffee hover:bg-latte/20 hover:text-espresso transition-colors border border-cream"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-milk rounded-2xl border border-cream p-4 h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-roast/60 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-5 py-2.5 rounded-full bg-espresso text-foam text-sm font-semibold hover:bg-coffee transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && sorted.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">☕</div>
          <p className="text-xl font-bold text-espresso mb-2">No orders yet</p>
          <p className="text-roast/60 mb-6">Be the first! ☕</p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-full bg-espresso text-foam font-semibold hover:bg-coffee transition-colors"
          >
            Place an order
          </a>
        </div>
      )}

      {/* Orders grid */}
      {!loading && !error && sorted.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sorted.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

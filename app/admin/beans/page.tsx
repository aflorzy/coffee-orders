'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Bean, RoastLevel } from '@/lib/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BeanFormData = {
  name: string;
  brand: string;
  origin: string;
  roast_level: RoastLevel;
  tasting_notes: string;
  picture_url: string;
};

const EMPTY_FORM: BeanFormData = {
  name: '',
  brand: '',
  origin: '',
  roast_level: 'medium',
  tasting_notes: '',
  picture_url: '',
};

const ROAST_LEVELS: { value: RoastLevel; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'medium-dark', label: 'Medium Dark' },
  { value: 'dark', label: 'Dark' },
];

const ROAST_BADGE_COLORS: Record<RoastLevel, string> = {
  light: 'bg-cream text-coffee',
  medium: 'bg-latte text-espresso',
  'medium-dark': 'bg-caramel text-foam',
  dark: 'bg-coffee text-cream',
};

// ---------------------------------------------------------------------------
// Bean card
// ---------------------------------------------------------------------------

function BeanCard({
  bean,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  bean: Bean;
  onEdit: (bean: Bean) => void;
  onDelete: (id: string) => void;
  onToggleActive: (bean: Bean) => void;
}) {
  const roastLevel = bean.roast_level ?? 'medium';
  const badgeClass = ROAST_BADGE_COLORS[roastLevel] ?? 'bg-cream text-coffee';

  return (
    <div className="rounded-xl border-2 border-cream bg-milk p-4 shadow-sm flex flex-col gap-3">
      {bean.picture_url && (
        <div className="relative w-full h-36 rounded-lg overflow-hidden bg-cream">
          <Image
            src={bean.picture_url}
            alt={bean.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-espresso truncate">{bean.name}</h3>
          {bean.brand && (
            <p className="text-xs text-latte mt-0.5 truncate">{bean.brand}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
          {ROAST_LEVELS.find((r) => r.value === bean.roast_level)?.label ?? bean.roast_level}
        </span>
      </div>

      {bean.origin && (
        <p className="text-xs text-coffee">
          <span className="font-medium">Origin:</span> {bean.origin}
        </p>
      )}

      {bean.tasting_notes && (
        <p className="text-xs text-espresso italic leading-relaxed line-clamp-3">
          {bean.tasting_notes}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-cream gap-2">
        <button
          onClick={() => onToggleActive(bean)}
          className={`text-xs font-medium rounded-full px-3 py-1 transition-colors ${
            bean.is_active
              ? 'bg-cream text-coffee hover:bg-latte hover:text-foam'
              : 'bg-latte text-foam hover:bg-coffee'
          }`}
        >
          {bean.is_active ? 'Active' : 'Inactive'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(bean)}
            className="text-xs font-medium text-coffee hover:text-espresso bg-cream hover:bg-latte rounded-lg px-3 py-1 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(bean.id)}
            className="text-xs font-medium text-foam bg-latte hover:bg-coffee rounded-lg px-3 py-1 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bean form
// ---------------------------------------------------------------------------

function BeanForm({
  initial,
  editingId,
  onSubmit,
  onCancel,
}: {
  initial: BeanFormData;
  editingId: string | null;
  onSubmit: (data: BeanFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BeanFormData>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function set(field: keyof BeanFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border-2 border-caramel bg-milk p-5 shadow-sm space-y-4"
    >
      <h3 className="font-semibold text-espresso text-lg">
        {editingId ? 'Edit Bean' : 'Add New Bean'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-latte uppercase tracking-wide">
            Name <span className="text-caramel">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-latte uppercase tracking-wide">Brand</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
            className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-latte uppercase tracking-wide">Origin</label>
          <input
            type="text"
            value={form.origin}
            onChange={(e) => set('origin', e.target.value)}
            placeholder="e.g. Ethiopia, Yirgacheffe"
            className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-latte uppercase tracking-wide">
            Roast Level
          </label>
          <select
            value={form.roast_level}
            onChange={(e) => set('roast_level', e.target.value)}
            className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
          >
            {ROAST_LEVELS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-latte uppercase tracking-wide">
            Picture URL
          </label>
          <input
            type="text"
            value={form.picture_url}
            onChange={(e) => set('picture_url', e.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-medium text-latte uppercase tracking-wide">
            Tasting Notes
          </label>
          <textarea
            value={form.tasting_notes}
            onChange={(e) => set('tasting_notes', e.target.value)}
            rows={3}
            placeholder="Chocolate, caramel, citrus..."
            className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-cream text-coffee hover:bg-cream transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-coffee text-cream hover:bg-espresso transition-colors"
        >
          {editingId ? 'Save Changes' : 'Add Bean'}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BeansPage() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBean, setEditingBean] = useState<Bean | null>(null);
  const [formInitial, setFormInitial] = useState<BeanFormData>(EMPTY_FORM);

  const fetchBeans = useCallback(async () => {
    const res = await fetch('/api/beans');
    const data: Bean[] = await res.json();
    setBeans(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBeans();
  }, [fetchBeans]);

  function handleEditClick(bean: Bean) {
    setEditingBean(bean);
    setFormInitial({
      name: bean.name,
      brand: bean.brand ?? '',
      origin: bean.origin ?? '',
      roast_level: bean.roast_level ?? 'medium',
      tasting_notes: bean.tasting_notes ?? '',
      picture_url: bean.picture_url ?? '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAddClick() {
    setEditingBean(null);
    setFormInitial(EMPTY_FORM);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingBean(null);
    setFormInitial(EMPTY_FORM);
  }

  async function handleSubmit(data: BeanFormData) {
    const payload = {
      name: data.name,
      brand: data.brand || null,
      origin: data.origin || null,
      roast_level: data.roast_level || null,
      tasting_notes: data.tasting_notes || null,
      picture_url: data.picture_url || null,
    };

    if (editingBean) {
      await fetch(`/api/beans/${editingBean.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/beans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    handleCancel();
    fetchBeans();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/beans/${id}`, { method: 'DELETE' });
    fetchBeans();
  }

  async function handleToggleActive(bean: Bean) {
    await fetch(`/api/beans/${bean.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: bean.is_active === 1 ? 0 : 1 }),
    });
    fetchBeans();
  }

  return (
    <div className="min-h-screen bg-foam">
      {/* Nav header */}
      <header className="bg-espresso text-cream px-6 py-4 flex items-center justify-between shadow-md">
        <Link
          href="/admin"
          className="text-sm font-medium text-latte hover:text-cream transition-colors"
        >
          &larr; Back to admin
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Bean Management</h1>
        <div className="w-24" />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Form area */}
        {showForm && (
          <BeanForm
            initial={formInitial}
            editingId={editingBean?.id ?? null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Add bean button */}
        {!showForm && (
          <div className="flex justify-end">
            <button
              onClick={handleAddClick}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-caramel text-foam hover:bg-coffee transition-colors shadow-sm"
            >
              + Add Bean
            </button>
          </div>
        )}

        {/* Bean grid */}
        {loading ? (
          <p className="text-latte text-sm">Loading beans...</p>
        ) : beans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-latte text-sm">No beans yet. Add your first bean above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beans.map((bean) => (
              <BeanCard
                key={bean.id}
                bean={bean}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

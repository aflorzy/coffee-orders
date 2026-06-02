'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Drink, SyrupOption, Temp, Syrup, Sweetness, Milk, Caffeine } from '@/lib/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DrinkDefaults = Pick<
  Drink,
  | 'default_temp'
  | 'default_syrup'
  | 'default_sweetness'
  | 'default_milk'
  | 'default_caffeine'
>;

type DraftMap = Record<string, DrinkDefaults>;
type DirtyMap = Record<string, boolean>;

// ---------------------------------------------------------------------------
// Option data
// ---------------------------------------------------------------------------

const TEMP_OPTIONS: { value: Temp; label: string }[] = [
  { value: 'hot', label: 'Hot' },
  { value: 'iced', label: 'Iced' },
];

const SYRUP_OPTIONS: { value: Syrup; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'almond', label: 'Almond' },
];

const SWEETNESS_OPTIONS: { value: Sweetness; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'default', label: 'Default' },
  { value: 'extra', label: 'Extra' },
];

const MILK_OPTIONS: { value: Milk; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'whole', label: 'Whole' },
  { value: 'oat', label: 'Oat' },
];

const CAFFEINE_OPTIONS: { value: Caffeine; label: string }[] = [
  { value: 'decaf', label: 'Decaf' },
  { value: 'half-caf', label: 'Half-Caf' },
  { value: 'full-caf', label: 'Full-Caf' },
];

// ---------------------------------------------------------------------------
// Drink card
// ---------------------------------------------------------------------------

function DrinkCard({
  drink,
  draft,
  isDirty,
  onChange,
  onSave,
}: {
  drink: Drink;
  draft: DrinkDefaults;
  isDirty: boolean;
  onChange: (field: keyof DrinkDefaults, value: string) => void;
  onSave: () => void;
}) {
  return (
    <div
      className={`rounded-xl border-2 p-5 bg-milk shadow-sm transition-colors ${
        isDirty ? 'border-caramel' : 'border-cream'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-coffee">{drink.name}</h3>
        {isDirty && (
          <span className="text-xs font-medium text-caramel bg-cream rounded-full px-2 py-0.5">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SelectField
          label="Temperature"
          value={draft.default_temp}
          options={TEMP_OPTIONS}
          onChange={(v) => onChange('default_temp', v)}
        />
        <SelectField
          label="Syrup"
          value={draft.default_syrup}
          options={SYRUP_OPTIONS}
          onChange={(v) => onChange('default_syrup', v)}
        />
        <SelectField
          label="Sweetness"
          value={draft.default_sweetness}
          options={SWEETNESS_OPTIONS}
          onChange={(v) => onChange('default_sweetness', v)}
        />
        <SelectField
          label="Milk"
          value={draft.default_milk}
          options={MILK_OPTIONS}
          onChange={(v) => onChange('default_milk', v)}
        />
        <SelectField
          label="Caffeine"
          value={draft.default_caffeine}
          options={CAFFEINE_OPTIONS}
          onChange={(v) => onChange('default_caffeine', v)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onSave}
          disabled={!isDirty}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-coffee text-cream hover:bg-espresso disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-latte uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Syrups section
// ---------------------------------------------------------------------------

function SyrupsSection() {
  const [syrups, setSyrups] = useState<SyrupOption[]>([]);
  const [newSyrupName, setNewSyrupName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSyrups = useCallback(async () => {
    const res = await fetch('/api/syrups');
    const data: SyrupOption[] = await res.json();
    setSyrups(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSyrups();
  }, [fetchSyrups]);

  async function handleToggle(syrup: SyrupOption) {
    await fetch(`/api/syrups/${syrup.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: syrup.is_active === 1 ? 0 : 1 }),
    });
    fetchSyrups();
  }

  async function handleAddSyrup() {
    const name = newSyrupName.trim();
    if (!name) return;
    await fetch('/api/syrups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setNewSyrupName('');
    fetchSyrups();
  }

  if (loading) {
    return <p className="text-latte text-sm">Loading syrups...</p>;
  }

  return (
    <div className="space-y-3">
      {syrups.map((syrup) => (
        <div
          key={syrup.id}
          className="flex items-center justify-between rounded-lg border border-cream bg-milk px-4 py-3"
        >
          <span
            className={`text-sm font-medium ${
              syrup.is_active ? 'text-espresso' : 'text-latte line-through'
            }`}
          >
            {syrup.name}
          </span>
          <button
            onClick={() => handleToggle(syrup)}
            className={`text-xs font-medium rounded-full px-3 py-1 transition-colors ${
              syrup.is_active
                ? 'bg-cream text-coffee hover:bg-latte hover:text-foam'
                : 'bg-latte text-foam hover:bg-coffee'
            }`}
          >
            {syrup.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="New syrup name"
          value={newSyrupName}
          onChange={(e) => setNewSyrupName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSyrup()}
          className="flex-1 rounded-lg border border-cream bg-foam text-espresso text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caramel"
        />
        <button
          onClick={handleAddSyrup}
          disabled={!newSyrupName.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-caramel text-foam hover:bg-coffee disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add Syrup
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [drafts, setDrafts] = useState<DraftMap>({});
  const [dirty, setDirty] = useState<DirtyMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/drinks')
      .then((r) => r.json())
      .then((data: Drink[]) => {
        setDrinks(data);
        const initial: DraftMap = {};
        data.forEach((d) => {
          initial[d.id] = {
            default_temp: d.default_temp,
            default_syrup: d.default_syrup,
            default_sweetness: d.default_sweetness,
            default_milk: d.default_milk,
            default_caffeine: d.default_caffeine,
          };
        });
        setDrafts(initial);
        setLoading(false);
      });
  }, []);

  function handleChange(drinkId: string, field: keyof DrinkDefaults, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [drinkId]: { ...prev[drinkId], [field]: value },
    }));
    setDirty((prev) => ({ ...prev, [drinkId]: true }));
  }

  async function handleSave(drinkId: string) {
    await fetch(`/api/drinks/${drinkId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drafts[drinkId]),
    });
    setDirty((prev) => ({ ...prev, [drinkId]: false }));
  }

  return (
    <div className="min-h-screen bg-foam">
      {/* Nav header */}
      <header className="bg-espresso text-cream px-6 py-4 flex items-center justify-between shadow-md">
        <Link
          href="/orders"
          className="text-sm font-medium text-latte hover:text-cream transition-colors"
        >
          &larr; Back to orders
        </Link>
        <h1 className="text-lg font-bold tracking-wide">Admin Config</h1>
        <Link
          href="/admin/beans"
          className="text-sm font-medium text-latte hover:text-cream transition-colors"
        >
          Beans &rarr;
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {/* Drinks section */}
        <section>
          <h2 className="text-xl font-bold text-espresso mb-5 pb-2 border-b-2 border-cream">
            Drink Defaults
          </h2>
          {loading ? (
            <p className="text-latte text-sm">Loading drinks...</p>
          ) : (
            <div className="space-y-4">
              {drinks.map((drink) => (
                <DrinkCard
                  key={drink.id}
                  drink={drink}
                  draft={drafts[drink.id]}
                  isDirty={!!dirty[drink.id]}
                  onChange={(field, value) => handleChange(drink.id, field, value)}
                  onSave={() => handleSave(drink.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Syrups section */}
        <section>
          <h2 className="text-xl font-bold text-espresso mb-5 pb-2 border-b-2 border-cream">
            Syrup Options
          </h2>
          <SyrupsSection />
        </section>
      </main>
    </div>
  );
}

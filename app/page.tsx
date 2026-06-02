'use client';

import { useState, useEffect, useRef } from 'react';
import DrinkCard from '@/components/DrinkCard';
import PillToggle from '@/components/PillToggle';
import type {
  Drink,
  Temp,
  Syrup,
  Sweetness,
  Milk,
  Caffeine,
  DrinkStyle,
  OrderFormData,
} from '@/lib/types';

// Fallback defaults if API fails
const FALLBACK_DRINKS: Drink[] = [
  {
    id: 'latte',
    name: 'Latte',
    is_active: 1,
    default_temp: 'iced',
    default_syrup: 'vanilla',
    default_sweetness: 'light',
    default_milk: 'oat',
    default_caffeine: 'full-caf',
  },
  {
    id: 'americano',
    name: 'Americano',
    is_active: 1,
    default_temp: 'hot',
    default_syrup: 'none',
    default_sweetness: 'none',
    default_milk: 'none',
    default_caffeine: 'full-caf',
  },
];

const DRINK_DESCRIPTIONS: Record<string, string> = {
  latte: 'Espresso + steamed milk',
  americano: 'Espresso + water',
};

const AEROCANO_TOOLTIP =
  'Steamed americano — espresso is poured over ice and water in a frothing jug, then steamed until the ice melts. Silky texture, bold coffee flavor, served warm (not hot).';

const TEMP_OPTIONS = [
  { value: 'hot', label: '☕ Hot' },
  { value: 'iced', label: '🧊 Iced' },
];

const SYRUP_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'almond', label: 'Almond' },
];

const SWEETNESS_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'default', label: 'Default' },
  { value: 'extra', label: 'Extra' },
];

const MILK_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'whole', label: 'Whole' },
  { value: 'oat', label: 'Oat' },
];

const CAFFEINE_OPTIONS = [
  { value: 'decaf', label: 'Decaf' },
  { value: 'half-caf', label: 'Half-caf' },
  { value: 'full-caf', label: 'Full caf' },
];

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function OrderPage() {
  const [drinks, setDrinks] = useState<Drink[]>(FALLBACK_DRINKS);
  const [name, setName] = useState('');
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null);
  const [temp, setTemp] = useState<Temp>('hot');
  const [syrup, setSyrup] = useState<Syrup>('none');
  const [sweetness, setSweetness] = useState<Sweetness>('none');
  const [milk, setMilk] = useState<Milk>('none');
  const [caffeine, setCaffeine] = useState<Caffeine>('full-caf');
  const [style, setStyle] = useState<DrinkStyle>('regular');
  const [notes, setNotes] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [aerocanoTipOpen, setAerocanoTipOpen] = useState(false);
  const aerocanoTipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aerocanoTipOpen) return;
    function handleOutside(e: PointerEvent) {
      if (aerocanoTipRef.current && !aerocanoTipRef.current.contains(e.target as Node)) {
        setAerocanoTipOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [aerocanoTipOpen]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    fetch('/api/drinks')
      .then((res) => res.json())
      .then((data: Drink[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDrinks(data);
        }
      })
      .catch(() => {
        // Silently fall back to hardcoded defaults
      });
  }, []);

  function handleDrinkSelect(drink: Drink) {
    setSelectedDrinkId(drink.id);
    setTemp(drink.default_temp);
    setSyrup(drink.default_syrup);
    setSweetness(drink.default_sweetness);
    setMilk(drink.default_milk);
    setCaffeine(drink.default_caffeine);
    setStyle('regular');
    setAerocanoTipOpen(false);
  }

  function resetForm() {
    setName('');
    setSelectedDrinkId(null);
    setTemp('hot');
    setSyrup('none');
    setSweetness('none');
    setMilk('none');
    setCaffeine('full-caf');
    setStyle('regular');
    setNotes('');
    setSubmitState('idle');
    setErrorMessage('');
    setAerocanoTipOpen(false);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDrinkId || !name.trim()) return;

    setSubmitState('loading');
    setErrorMessage('');

    const payload: OrderFormData = {
      customer_name: name.trim(),
      drink_id: selectedDrinkId,
      temp,
      syrup,
      sweetness,
      milk,
      caffeine,
      style: selectedDrinkId === 'americano' ? style : 'regular',
      special_notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      setSubmitState('success');
    } catch (err) {
      setSubmitState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Try again.'
      );
    }
  }

  const canSubmit = name.trim().length > 0 && selectedDrinkId !== null;
  const drinkSelected = selectedDrinkId !== null;

  if (submitState === 'success') {
    const drinkName =
      drinks.find((d) => d.id === selectedDrinkId)?.name ?? selectedDrinkId;
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">☕</div>
        <h2 className="text-2xl font-bold text-espresso mb-2">
          Order placed, {name}!
        </h2>
        <p className="text-roast mb-2">
          Your{' '}
          <span className="font-semibold">
            {temp === 'iced' ? '🧊 Iced' : '☕ Hot'} {drinkName}
          </span>{' '}
          is on its way.
        </p>
        <p className="text-roast/60 text-sm mb-8">
          Check the{' '}
          <a href="/orders" className="text-latte underline">
            orders board
          </a>{' '}
          to see your order status.
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-3 rounded-full bg-espresso text-foam font-semibold hover:bg-coffee transition-colors"
        >
          Place another order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Name */}
        <section>
          <label
            htmlFor="customer-name"
            className="block text-espresso font-bold text-xl mb-3"
          >
            What&apos;s your name?
          </label>
          <input
            ref={nameInputRef}
            id="customer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="given-name"
            className="w-full px-4 py-3 rounded-xl border-2 border-cream bg-milk text-espresso placeholder-latte/50 text-lg font-medium focus:outline-none focus:border-latte transition-colors"
          />
        </section>

        {/* Drink selector */}
        <section>
          <p className="text-espresso font-bold text-xl mb-3">Pick your drink</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {drinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                name={drink.name}
                description={
                  DRINK_DESCRIPTIONS[drink.id.toLowerCase()] ??
                  DRINK_DESCRIPTIONS[drink.name.toLowerCase()] ??
                  ''
                }
                isSelected={selectedDrinkId === drink.id}
                onClick={() => handleDrinkSelect(drink)}
              />
            ))}
          </div>
        </section>

        {/* Temperature + mods — revealed after drink selected */}
        {drinkSelected && (
          <>
            {/* Temperature */}
            <section>
              <p className="text-espresso font-semibold text-base mb-2">
                Temperature
              </p>
              <div className="flex gap-2">
                {TEMP_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={temp === opt.value}
                    onClick={() => setTemp(opt.value as Temp)}
                    className={`
                      px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-150
                      ${
                        temp === opt.value
                          ? 'bg-espresso text-foam border-espresso scale-105 shadow-md shadow-espresso/20'
                          : 'bg-cream text-coffee border-cream hover:border-latte/40'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Aerocano style toggle — Americano only */}
            {selectedDrinkId === 'americano' && (
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-roast text-sm font-semibold uppercase tracking-wide">
                    Style
                  </p>
                  <div ref={aerocanoTipRef} className="group relative">
                    <button
                      type="button"
                      aria-label="What is Aerocano?"
                      aria-expanded={aerocanoTipOpen}
                      onClick={() => setAerocanoTipOpen((v) => !v)}
                      className="p-2 -m-2 w-4 h-4 rounded-full bg-cream text-coffee text-xs font-bold flex items-center justify-center cursor-help select-none border border-latte/30"
                    >
                      ?
                    </button>
                    <div className={`absolute bottom-full left-0 mb-2 w-64 bg-espresso text-foam text-xs rounded-xl px-3 py-2.5 z-20 shadow-lg leading-relaxed pointer-events-none ${aerocanoTipOpen ? 'block' : 'hidden'}`}>
                      {AEROCANO_TOOLTIP}
                      <div className="absolute top-full left-2 border-4 border-transparent border-t-espresso" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['regular', 'aerocano'] as DrinkStyle[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={style === s}
                      onClick={() => setStyle(s)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150
                        ${style === s
                          ? 'bg-espresso text-foam border-espresso scale-105 shadow-md shadow-espresso/20'
                          : 'bg-cream text-coffee border-cream hover:border-latte/40'
                        }
                      `}
                    >
                      {s === 'regular' ? 'Regular' : 'Aerocano ☁'}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Modifications */}
            <section className="flex flex-col gap-4">
              <p className="text-espresso font-bold text-xl">Customize</p>

              <div>
                <p className="text-roast text-sm font-semibold mb-2 uppercase tracking-wide">
                  Caffeine
                </p>
                <PillToggle
                  options={CAFFEINE_OPTIONS}
                  value={caffeine}
                  onChange={(v) => setCaffeine(v as Caffeine)}
                />
              </div>

              <div>
                <p className="text-roast text-sm font-semibold mb-2 uppercase tracking-wide">
                  Sweetness
                </p>
                <PillToggle
                  options={SWEETNESS_OPTIONS}
                  value={sweetness}
                  onChange={(v) => setSweetness(v as Sweetness)}
                />
              </div>

              <div>
                <p className="text-roast text-sm font-semibold mb-2 uppercase tracking-wide">
                  Syrup
                </p>
                <PillToggle
                  options={SYRUP_OPTIONS}
                  value={syrup}
                  onChange={(v) => setSyrup(v as Syrup)}
                />
              </div>

              <div>
                <p className="text-roast text-sm font-semibold mb-2 uppercase tracking-wide">
                  Milk
                </p>
                <PillToggle
                  options={MILK_OPTIONS}
                  value={milk}
                  onChange={(v) => setMilk(v as Milk)}
                />
              </div>
            </section>

            {/* Special notes */}
            <section>
              <label
                htmlFor="special-notes"
                className="block text-roast text-sm font-semibold mb-2 uppercase tracking-wide"
              >
                Special notes
              </label>
              <textarea
                id="special-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any extra notes?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-cream bg-milk text-espresso placeholder-latte/50 text-sm resize-none focus:outline-none focus:border-latte transition-colors"
              />
            </section>
          </>
        )}

        {/* Error */}
        {submitState === 'error' && (
          <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {errorMessage}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || submitState === 'loading'}
          className={`
            w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200
            ${
              canSubmit && submitState !== 'loading'
                ? 'bg-espresso text-foam hover:bg-coffee active:scale-[0.98] shadow-md shadow-espresso/20'
                : 'bg-cream text-latte cursor-not-allowed'
            }
          `}
        >
          {submitState === 'loading' ? 'Placing order...' : 'Place Order →'}
        </button>
      </form>
    </div>
  );
}

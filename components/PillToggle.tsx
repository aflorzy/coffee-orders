'use client';

interface PillOption {
  value: string;
  label: string;
}

interface PillToggleProps {
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PillToggle({
  options,
  value,
  onChange,
  className = '',
}: PillToggleProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150
              ${
                isSelected
                  ? 'bg-latte text-espresso font-semibold border-latte shadow-sm scale-105'
                  : 'bg-cream text-coffee border-cream hover:bg-cream/80 hover:border-latte/40'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

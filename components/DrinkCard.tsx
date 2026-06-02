'use client';

interface DrinkCardProps {
  name: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function DrinkCard({
  name,
  description,
  isSelected,
  onClick,
}: DrinkCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`
        w-full rounded-2xl p-5 text-left border-2 transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? 'bg-espresso text-foam border-espresso scale-[1.03] shadow-lg shadow-espresso/20'
            : 'bg-milk text-espresso border-cream hover:border-latte hover:shadow-md hover:shadow-latte/20 hover:scale-[1.01]'
        }
      `}
    >
      <div
        className={`text-xl font-bold mb-1 ${isSelected ? 'text-foam' : 'text-espresso'}`}
      >
        {name}
      </div>
      <div
        className={`text-sm ${isSelected ? 'text-cream/80' : 'text-roast/70'}`}
      >
        {description}
      </div>
    </button>
  );
}

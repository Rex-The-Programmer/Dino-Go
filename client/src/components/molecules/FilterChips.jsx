const DEITS = [
    {value: 'all', lavel: 'ALL'},
    {value: 'carnivore', lavel: 'Carnivore'},
    {value: 'herbivore', lavel: 'Herbivore'},
    {value: 'omnivore', lavel: 'Omnivore'},
];

export default function FilterChips({ value, onChange }) {
    return (
        <div className="filter-chips" role="group" aria-label="Filter by diet">
            {DEITS.map((diet) => (
                <button
                    key={diet.value}
                    type = "button"
                    className={`filter-chip ${value === diet.value ? 'is-active' : ''}`}
                    onClick={() => onChange(diet.value)}
                    aria-pressed={value === diet.value}
                > 
                    {diet.label}
                </button>
            ))}
        </div>
    );
}
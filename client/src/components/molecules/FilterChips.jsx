import Button from '../atoms/Button';
import styles from './FilterChips.module.css';

const OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'carnivore', label: 'Carnivore' },
    { value: 'herbivore', label: 'Herbivore' },
    { value: 'omnivore', label: 'Omnivore' },
];

export default function FilterChips({ value, onChange }) {
    return (
        <div className={styles.chips} role="group" aria-label="Filter by diet">
            {OPTIONS.map((opt) => (
                <Button
                    key={opt.value}
                    variant="chip"
                    active={value === opt.value}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </Button>
            ))}
        </div>
    );
}
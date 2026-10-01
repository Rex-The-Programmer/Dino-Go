import Button from "../atoms/Button";
import styles from "./FilterChips.module.css";

const DEFAULT_OPTIONS = [
    { value: "all", label: "All" },
    { value: "carnivore", label: "Carnivore" },
    { value: "herbivore", label: "Herbivore" },
    { value: "omnivore", label: "Omnivore" },
];

// value: current filter, onChange(newValue)
export default function FilterChips({ value, onChange, options = DEFAULT_OPTIONS }) {
    return (
        <div className={styles.chips} role="group" aria-label="Filter by diet">
        {options.map((option) => (
            <Button
            key={option.value}
            variant="chip"
            active={value === option.value}
            onClick={() => onChange(option.value)}
            >
            {option.label}
            </Button>
        ))}
        </div>
    );
}

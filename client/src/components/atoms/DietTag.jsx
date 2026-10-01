import styles from "./DietTag.module.css";

const LABELS = {
    carnivore: "Carnivore",
    herbivore: "Herbivore",
    omnivore: "Omnivore",
};

    export default function DietTag({ diet }) {
    const key = String(diet).toLowerCase();
    return (
        <span className={`${styles.tag} ${styles[key] ?? ""}`}>
        {LABELS[key] ?? diet}
        </span>
    );
}

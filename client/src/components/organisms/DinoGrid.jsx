import DinoCard from "../molecules/DinoCard";
import styles from "./DinoGrid.module.css";

export default function DinoGrid({
    dinos,
    favoriteIds = new Set(),
    onToggleFavorite,
    emptyMessage = "No dinosaurs match your search.",
    }) {
    if (dinos.length === 0) {
        return <p className={styles.empty}>{emptyMessage}</p>;
    }

    return (
        <ul className={styles.grid}>
        {dinos.map((dino) => (
            <li key={dino.id} className={styles.item}>
            <DinoCard
                dino={dino}
                isFavorite={favoriteIds.has(dino.id)}
                onToggleFavorite={onToggleFavorite}
            />
            </li>
        ))}
        </ul>
    );
}
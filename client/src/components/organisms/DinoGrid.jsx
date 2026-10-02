import DinoCard from '../molecules/DinoCard';
import styles from './DinoGrid.module.css';

export default function DinoGrid({
    dinos,
    favoriteIds,
    onToggleFavorite,
    emptyTitle = 'No dinos match your search.',
    emptyHint = 'Try a different name, or clear the diet filter.',
}) {
    if (dinos.length === 0) {
        return (
            <div className={styles.empty}>
                <p>{emptyTitle}</p>
                <span>{emptyHint}</span>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {dinos.map((dino) => (
                <DinoCard
                    key={dino.id}
                    dino={dino}
                    isFavorite={favoriteIds.has(dino.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
}
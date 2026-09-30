import DinoCard from '../molecules/DinoCard';
import styles from './DinoGrid.module.css';

export default function DinoGrid({ dinos, favoriteIds, onToggleFavorite }) {
    if (dinos.length === 0) {
        return (
            <div className="dino-grid__empty">
                <p>No dinos match your search.</p>
                <span>Try a different name, or clear the diet filter.</span>
            </div>
        );
    }

    return (
        <div className="dino-grid">
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
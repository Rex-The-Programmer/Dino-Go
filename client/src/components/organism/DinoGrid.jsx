import DinoCard from '../molecules/DinoCard';

export default function DinoGrid({ dinos, favoriteIds, onToggleFavorite }) {
    if (dinos.length === 0) {
        return (
            <div className='dino-grid__empty'>
                <p>No dinos match your search.</p>
                <span>Try a different nae, or clear the diet filter.</span>
            </div>
        );
    }

    return (
        <div className="dino-grid">
            {dinos.map((dino) => (
                <DinoCard
                    key = {dino.id}
                    dino = {dino}
                    isFavorite= {favoriteIds.includes(dino.id)}
                    onToggleFavorite= {onToggleFavorite}
                />
            ))}
        </div>
    );
}
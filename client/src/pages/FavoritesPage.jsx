import DinoGrid from '../components/organisms/DinoGrid';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage({ dinos, favoriteIds, toggleFavorite }) {
    const favoritedDinos = dinos.filter((dino) => favoriteIds.has(dino.id));

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>Your Favorites</h1>
                <p className={styles.heroSubtitle}>
                    Dinos you've starred, so you can jump back to the ones you're planning to tame.
                </p>
            </header>

            <div className={styles.resultsHeading}>
                <h2>{favoritedDinos.length} saved</h2>
            </div>

            <DinoGrid
                dinos={favoritedDinos}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                emptyTitle="No favorites yet"
                emptyHint="Star a dino from the list to save it here"
            />
        </div>
    );
}
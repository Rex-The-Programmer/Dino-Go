import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarIcon from '../components/atoms/StarIcon';
import DietTag from '../components/atoms/DietTag';
import { fetchDinoById } from '../api/dinos';
import styles from './DinoDetailPage.module.css';
import TamingCalculator from "../components/organisms/TamingCalculator";

export default function DinoDetailPage({ favoriteIds, toggleFavorite }) {
    const { id } = useParams();
    const [dino, setDino] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchDinoById(id)
            .then((data) => {
                if (!cancelled) setDino(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return <p className={styles.status}>Loading...</p>;
    }

    if (error) {
        return (
            <div className={styles.status}>
                <p>Couldn't load this dino: {error}</p>
                <Link to="/">← Back to list</Link>
            </div>
        );
    }

    const isFavorite = favoriteIds.has(dino.id);

    return (
        <div className={styles.page}>
            <Link to="/" className={styles.backLink}>
                ← Back to list
            </Link>

            <div className={styles.hero}>
                <img
                    className={styles.image}
                    src={dino.image_url}
                    alt={dino.name}
                />

                <div className={styles.heroBody}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.name}>{dino.name}</h1>

                        <StarIcon
                            filled={isFavorite}
                            onClick={() => toggleFavorite(dino.id)}
                            aria-label={`Favorite ${dino.name}`}
                        />
                    </div>

                    <DietTag diet={dino.diet} />

                    {dino.description && (
                        <p className={styles.description}>
                            {dino.description}
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.panels}>
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>Taming Method</h2>

                    <dl className={styles.factList}>
                        <dt>Method</dt>
                        <dd>{dino.taming_method}</dd>

                        <dt>Knockout weapon</dt>
                        <dd>{dino.knockout_weapon}</dd>

                        <dt>Preferred food</dt>
                        <dd>{dino.preferred_food}</dd>

                        <dt>Torpor drain</dt>
                        <dd>{dino.torpor_drain}</dd>

                        {dino.spawn_location && (
                            <>
                                <dt>Where to find it</dt>
                                <dd>{dino.spawn_location}</dd>
                            </>
                        )}
                    </dl>
                </section>

                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>Base Stats</h2>

                    <dl className={styles.factList}>
                        <dt>Health</dt>
                        <dd>{dino.base_health}</dd>

                        <dt>Stamina</dt>
                        <dd>{dino.base_stamina}</dd>

                        <dt>Melee damage</dt>
                        <dd>{dino.base_melee_damage}%</dd>
                    </dl>
                </section>
            </div>

            <TamingCalculator
                dino={dino}
                foods={dino.foods}
            />
        </div>
    );
}

import { Link } from 'react-router-dom';
import { KIBBLE_RECIPES, KIBBLE_CRAFTING_STATION, KIBBLE_COOK_TIME } from '../data/kibbleRecipes';
import styles from './KibbleRecipesPage.module.css';

export default function KibbleRecipesPage({ dinos }) {
    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>Kibble Recipes</h1>
                <p className={styles.heroSubtitle}>
                    All six kibble tiers, what they're made from, and which of your
                    dinos actually want them.
                </p>
                <p className={styles.craftingNote}>
                    Crafted in a {KIBBLE_CRAFTING_STATION} · {KIBBLE_COOK_TIME} per batch
                </p>
            </header>

            <div className={styles.recipeList}>
                {KIBBLE_RECIPES.map((recipe) => {
                    const tierLabel = `${recipe.tier} Kibble`;
                    const usedBy = dinos.filter((dino) => dino.preferred_food === tierLabel);

                    return (
                        <section key={recipe.tier} className={styles.recipeCard}>
                            <div className={styles.recipeHeader}>
                                <h2 className={styles.recipeTitle}>{tierLabel}</h2>
                                <span className={styles.eggSize}>{recipe.eggSize}</span>
                            </div>

                            <ul className={styles.ingredientList}>
                                {recipe.ingredients.map((ingredient) => (
                                    <li key={ingredient}>{ingredient}</li>
                                ))}
                            </ul>

                            <div className={styles.usedBy}>
                                <span className={styles.usedByLabel}>
                                    {usedBy.length > 0
                                        ? `Preferred by ${usedBy.length} dino${usedBy.length === 1 ? '' : 's'} in your list:`
                                        : 'None of your 18 dinos prefer this tier.'}
                                </span>
                                {usedBy.length > 0 && (
                                    <div className={styles.dinoLinks}>
                                        {usedBy.map((dino) => (
                                            <Link
                                                key={dino.id}
                                                to={`/dino/${dino.id}`}
                                                className={styles.dinoLink}
                                            >
                                                {dino.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
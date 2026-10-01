import { Link } from "react-router-dom";
import DietTag from "../atoms/DietTag";
import StarIcon from "../atoms/StarIcon";
import styles from "./DinoCard.module.css";

export default function DinoCard({ dino, isFavorite = false, onToggleFavorite }) {
    return (
        <article className={styles.card}>
        <img
            className={styles.image}
            src={dino.image}
            alt={dino.name}
            loading="lazy"
        />
        <div className={styles.body}>
            <div className={styles.titleRow}>
            <h3 className={styles.name}>
                {/* ::after on this link makes the whole card clickable */}
                <Link to={`/dino/${dino.id}`} className={styles.nameLink}>
                {dino.name}
                </Link>
            </h3>
            <StarIcon
                filled={isFavorite}
                onClick={() => onToggleFavorite(dino.id)}
                aria-label={`Favorite ${dino.name}`}
            />
            </div>
            <DietTag diet={dino.diet} />
        </div>
        </article>
    );
}

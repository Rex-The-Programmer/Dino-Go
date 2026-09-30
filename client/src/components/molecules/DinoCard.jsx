import { Link } from 'react-router-dom';
import DietTag from '../atoms/DietTag';
import StarIcon from '../atoms/StarIcon';
import styles from './DinoCard.module.css';

export default function DinoCard({ dino, isFavorite, onToggleFavorite }) {
    return (
        <Link to={`/dino/${dino.id}`} className="dino-card">
            <div className='dino-card__image-wrap'>
                <img src={dino.image_url} alt={dino.name} className="dino-card__image"/>
                <button type="button" className={`dino-card__star ${isFavorite ? 'is-favorite' : ''}`} onClick={(e) => {
                    e.preventDefault(); // don't trigger the card's navigation
                    onToggleFavorite(dino.id);
                    }}
                    aria-label={isFavorite ? `Remove ${dino.name} from favorites` : `Add ${dino.name} to favorites`}
                    aria-pressed={isFavorite}
                >
                    {isFavorite ? '★' : '☆'}
                </button>
            </div>
            <div className="dino-card__body">
                <h3 className="dino-card__name">{dino.name}</h3>
                <DietTag diet={dino.diet} />
            </div>
        </Link>
    )
}
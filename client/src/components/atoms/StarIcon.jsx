import styles from "./StarIcon.module.css";

export default function StarIcon({ filled = false, onClick, "aria-label": ariaLabel }) {
    return (
        <button
        type="button"
        className={`${styles.star} ${filled ? styles.filled : ""}`}
        aria-pressed={filled}
        aria-label={ariaLabel}
        onClick={onClick}
        >
        {filled ? "★" : "☆"}
        </button>
    );
}

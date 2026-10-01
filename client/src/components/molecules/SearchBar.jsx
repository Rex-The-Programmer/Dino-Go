import Input from "../atoms/Input";
import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange }) {
    return (
        <div className={styles.search}>
        <label htmlFor="dino-search" className="visually-hidden">
            Search dinosaurs
        </label>
        <Input
            id="dino-search"
            value={value}
            onChange={onChange}
            placeholder="Search dinosaurs…"
        />
        </div>
    );
}

import styles from './Input.module.css';

export default function Input({ id, value, onChange, placeholder }) {
    return (
        <input
        id={id}
        type="search"
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />
    );
}
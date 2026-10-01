import styles from "./Input.module.css";

export default function Input({ id, value, onChange, placeholder, ...rest }) {
    return (
        <input
        id={id}
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
        />
    );
}

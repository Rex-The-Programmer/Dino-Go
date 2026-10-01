import styles from "./Button.module.css";

export default function Button({
    variant = "primary", 
    active = false,
    onClick,
    children,
    type = "button",
    ...rest
    }) {
    const className = [styles.button, styles[variant], active && styles.active]
        .filter(Boolean)
        .join(" ");

    return (
        <button
        type={type}
        className={className}
        aria-pressed={variant === "chip" ? active : undefined}
        onClick={onClick}
        {...rest}
        >
        {children}
        </button>
    );
}

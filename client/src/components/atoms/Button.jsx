import styles from './Button.module.css';

export default function Button({
    children,
    variant = 'default',
    active = false,
    onClick,
    type = 'button',
    ...props
}) {
    const className = [
        styles.button,
        styles[variant],
        active ? styles.active : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
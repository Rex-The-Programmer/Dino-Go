export default function DietTag({ diet }) {
    return <span className= {`diet-tag diet-tag--${diet}`}>{diet}</span>
}
import Input from '../atoms/Input';

export default function SearchBar({ value, onChange }) {
    return (
        <div>
            <label htmlFor="dino-search" className="visually-hidden">
            Search dinosaurs
            </label>
            <Input
            id="dino-search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search dinosaurs…"
            />
        </div>
    );
}
import FilterChips from '../components/molecules/FilterChips';

export default function DinoListPage() {
    return (
        <div>
            <h1>Dino List Page Test</h1>

            <FilterChips
                value="all"
                onChange={() => {}}
            />
        </div>
    );
}
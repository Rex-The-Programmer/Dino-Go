import { useState, useMemo } from 'react';
import SearchBar from '../components/molecules/SearchBar';
import FilterChips from '../components/molecules/FilterChips';
import DinoGrid from '../components/organisms/DinoGrid';
import styles from './DinoListPage.module.css';

// ASSUMPTION: FilterChips hardcodes these internally rather than taking an
// `options` prop. If it actually expects options passed in, move this array
// into a prop on the <FilterChips /> element below instead.
const DIET_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'carnivore', label: 'Carnivore' },
    { value: 'herbivore', label: 'Herbivore' },
    { value: 'omnivore', label: 'Omnivore' },
];

export default function DinoListPage({ dinos, favoriteIds, toggleFavorite }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dietFilter, setDietFilter] = useState('all');

    const filteredDinos = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return dinos.filter((dino) => {
            const matchesSearch = !term || dino.name.toLowerCase().includes(term);
            const matchesDiet = dietFilter === 'all' || dino.diet === dietFilter;
            return matchesSearch && matchesDiet;
        });
    }, [dinos, searchTerm, dietFilter]);

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>Look up any tame before you head out</h1>
                <p className={styles.heroSubtitle}>
                    Search, filter by diet, and check the taming method, food, and weapon for every dino.
                </p>
            </header>

            <div className={styles.controls}>
                {/* ASSUMPTION: onChange receives the raw string value, not an
                    event — matching FilterChips' confirmed convention. If
                    SearchBar actually calls onChange(e) with the event, change
                    this to onChange={(e) => setSearchTerm(e.target.value)}. */}
                <SearchBar value={searchTerm} onChange={setSearchTerm} />

                <FilterChips
                    value={dietFilter}
                    onChange={setDietFilter}
                    options={DIET_OPTIONS}
                />
            </div>

            <div className={styles.resultsHeading}>
                <h2>{filteredDinos.length} dinosaur{filteredDinos.length === 1 ? '' : 's'}</h2>
            </div>

            <DinoGrid
                dinos={filteredDinos}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
}
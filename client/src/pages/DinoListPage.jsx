import { useState, useMemo } from 'react';
import SearchBar from '../components/molecules/SearchBar';
import FilterChips from '../components/molecules/FilterChips';
import DinoGrid from '../components/organisms/DinoGrid';
import styles from './DinoListPage.module.css';

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
        <main className={styles.page}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Look up any tame before you head out</h1>
                <p className={styles.lead}>
                    Search, filter by diet, and check the taming method, food, and weapon for every dino.
                </p>
            </section>

            <div className={styles.controls}>
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FilterChips
                    value={dietFilter}
                    onChange={setDietFilter}
                    options={DIET_OPTIONS}
                />
            </div>

            <section className={styles.results}>
                <p className={styles.count}>
                    {filteredDinos.length} dinosaur{filteredDinos.length === 1 ? '' : 's'}
                </p>
                <DinoGrid
                    dinos={filteredDinos}
                    favoriteIds={favoriteIds}
                    onToggleFavorite={toggleFavorite}
                />
            </section>
        </main>
    );
}
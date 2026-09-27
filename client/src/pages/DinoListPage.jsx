import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/molecules/SearchBar';
import FilterChips from '../components/molecules/FilterChips';
import DinoGrid from '../components/organisms/DinoGrid';
import { fetchDinos } from '../api/dinos';
import './DinoListPage.css';

export default function DinoListPage({ favoriteIds, onToggleFavorite }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dietFilter, setDietFilter] = useState('all');
    const [dinos, setDinos] = useState([]);
    const [status, setStatus] = useState('loading'); 
    const [error, setError] = useState(null);

    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');

        fetchDinos({ search: debouncedSearch, diet: dietFilter })
        .then((data) => {
            if (cancelled) return;
            setDinos(data);
            setStatus('ready');
        })
        .catch((err) => {
            if (cancelled) return;
            setError(err.message);
            setStatus('error');
        });

        return () => {
        cancelled = true;
        };
    }, [debouncedSearch, dietFilter]);

    const resultLabel = useMemo(() => {
        if (status !== 'ready') return '';
        return `${dinos.length} dinosaur${dinos.length === 1 ? '' : 's'}`;
    }, [dinos, status]);

    return (
        <main className="dino-list-page">
        <section className="dino-list-page__hero">
            <h1>Look up any tame before you head out</h1>
            <p>Search, filter by diet, and check the taming method, food, and weapon for every dino.</p>
        </section>

        <section className="dino-list-page__controls">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterChips value={dietFilter} onChange={setDietFilter} />
        </section>

        {status === 'ready' && <p className="dino-list-page__count">{resultLabel}</p>}

        {status === 'loading' && <p className="dino-list-page__status">Loading dinos…</p>}

        {status === 'error' && (
            <p className="dino-list-page__status dino-list-page__status--error">
            Couldn't load dinos: {error}. Check that the server is running on the
            expected port and try again.
            </p>
        )}

        {status === 'ready' && (
            <DinoGrid dinos={dinos} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />
        )}
        </main>
    );
}

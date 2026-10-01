import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/organisms/Header';
import DinoListPage from './pages/DinoListPage';
import { fetchDinos } from './api/dinos';
import { fetchFavorites, addFavorite, removeFavorite } from './api/favorites';

export default function App() {
    const [dinos, setDinos] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadInitialData() {
            try {
                const [dinoList, favoriteList] = await Promise.all([
                    fetchDinos(),
                    fetchFavorites(),
                ]);

                if (cancelled) return;

                setDinos(dinoList);
                setFavoriteIds(new Set(favoriteList.map((dino) => dino.id)));
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadInitialData();

        return () => {
            cancelled = true;
        };
    }, []);

    const toggleFavorite = useCallback(async (dinoId) => {
        const wasFavorited = favoriteIds.has(dinoId);

        // Optimistic update — flip the star immediately so it feels instant,
        // then roll back only if the request actually fails.
        setFavoriteIds((prev) => {
            const next = new Set(prev);
            wasFavorited ? next.delete(dinoId) : next.add(dinoId);
            return next;
        });

        try {
            if (wasFavorited) {
                await removeFavorite(dinoId);
            } else {
                await addFavorite(dinoId);
            }
        } catch (err) {
            console.error('Failed to toggle favorite', err);
            // Roll back so the UI doesn't lie about what's actually saved.
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                wasFavorited ? next.add(dinoId) : next.delete(dinoId);
                return next;
            });
        }
    }, [favoriteIds]);

    if (loading) {
        return <p>Loading dinos...</p>;
    }

    if (error) {
        return <p>Something went wrong: {error}</p>;
    }

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <DinoListPage
                            dinos={dinos}
                            favoriteIds={favoriteIds}
                            toggleFavorite={toggleFavorite}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
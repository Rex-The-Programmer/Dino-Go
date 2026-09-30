import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DinoListPage from './pages/DinoListPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <h1>Dino-Go Test</h1>
                            <DinoListPage
                                dinos={[]}
                                favoriteIds={new Set()}
                                toggleFavorite={() => {}}
                            />
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
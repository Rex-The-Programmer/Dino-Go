import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DinoListPage from './pages/DinoListPage';
import './index.css';

function App() {
  const [favoriteIds, setFavoriteIds] = useState([]);

  function toggleFavorite(id) {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<DinoListPage favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
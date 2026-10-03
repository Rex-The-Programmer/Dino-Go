const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.status === 204 ? null : res.json();
    }

    export function fetchFavorites() {
    return request("/favorites");
}

export function addFavorite(dinoId) {
    return request(`/favorites/${dinoId}`, {
        method: "POST",
        body: JSON.stringify({ dinoId }),
    });
}

export function removeFavorite(dinoId) {
    return request(`/favorites/${dinoId}`, { method: "DELETE" });
}
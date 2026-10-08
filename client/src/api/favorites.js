const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, '');

async function parseJsonResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error(
            'The API returned a non-JSON response. Set VITE_API_URL to the deployed Express API URL.'
        );
    }
    return response.json();
}

async function request(path, options) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return res.status === 204 ? null : parseJsonResponse(res);
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
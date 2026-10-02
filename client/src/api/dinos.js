const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchDinoById(id) {
    const res = await fetch(`${API_BASE}/api/dinos/${id}`);

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with status ${res.status}`);
    }

    return res.json();
}

export async function fetchDinos({ search = '', diet = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) {
        params.set('search', search.trim());
    }
    if (diet !== 'all') {
        params.set('diet', diet);
    }

    const query = params.toString();
    const res = await fetch(`${API_BASE}/api/dinos${query ? `?${query}` : ''}`);

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with status ${res.status}`);
    }

    return res.json();
}
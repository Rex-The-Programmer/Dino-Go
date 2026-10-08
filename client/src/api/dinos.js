const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

async function parseJsonResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error(
            'The API returned a non-JSON response. Set VITE_API_URL to the deployed Express API URL.'
        );
    }
    return response.json();
}

export async function fetchDinos({ search = '', diet = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search.trim() !== '') params.set('search', search.trim());
    if (diet && diet !== 'all') params.set('diet', diet);

    const query = params.toString();
    const res = await fetch(`${API_BASE}/dinos${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch dinos');
    return parseJsonResponse(res);
}

export async function fetchDinoById(id) {
    const res = await fetch(`${API_BASE}/dinos/${id}`);
    if (res.status === 404) throw new Error('Dino not found');
    if (!res.ok) throw new Error('Failed to fetch dino');
    return parseJsonResponse(res);
}
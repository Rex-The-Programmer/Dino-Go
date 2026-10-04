const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchDinos({ search = '', diet = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search.trim() !== '') params.set('search', search.trim());
    if (diet && diet !== 'all') params.set('diet', diet);

    const query = params.toString();
    const res = await fetch(`${API_BASE}/dinos${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch dinos');
    return res.json();
}

export async function fetchDinoById(id) {
    const res = await fetch(`${API_BASE}/api/dinos/${id}`);
    if (res.status === 404) throw new Error('Dino not found');
    if (!res.ok) throw new Error('Failed to fetch dino');
    return res.json();
}
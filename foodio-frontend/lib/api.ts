const BASE_URL = 'http://localhost:2424';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
    },
    MENU: {
        GET_ALL: `${BASE_URL}/menu`,
        CREATE: `${BASE_URL}/menu`,
        UPDATE: (id: number) => `${BASE_URL}/menu/${id}`,
        DELETE: (id: number) => `${BASE_URL}/menu/${id}`,
    },
    ORDERS: {
        GET_MY: `${BASE_URL}/orders`, // In real app, might need user id or token
        CREATE: `${BASE_URL}/orders`,
        UPDATE_STATUS: (id: number) => `${BASE_URL}/orders/${id}/status`,
    }
};

export const getImageUrl = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
};

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

const getHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    login: async (password: string) => {
        const res = await fetch(`${API_BASE}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (!res.ok || !data.token) {
            throw new Error(data.error || 'Invalid password');
        }

        localStorage.setItem('admin_token', data.token);
        return { success: true };
    },
    logout: () => {
        localStorage.removeItem('admin_token');
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    },
    getPosts: async () => {
        const res = await fetch(`${API_BASE}/posts`);
        return res.json();
    },
    getPost: async (id: string | number) => {
        const res = await fetch(`${API_BASE}/posts/${id}`);
        return res.json();
    },
    getProjects: async () => {
        const res = await fetch(`${API_BASE}/projects`);
        return res.json();
    },
    getFriends: async () => {
        const res = await fetch(`${API_BASE}/friends`);
        return res.json();
    },
    getMessages: async () => {
        const res = await fetch(`${API_BASE}/messages`);
        return res.json();
    },
    postMessage: async (name: string, content: string) => {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, content })
        });
        return res.json();
    },
    getSongs: async () => {
        const res = await fetch(`${API_BASE}/songs`);
        return res.json();
    },
    postPost: async (post: { title: string, excerpt: string, content: string, category: string, date: string }) => {
        const res = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(post)
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    },
    updatePost: async (id: string | number, post: { title: string, excerpt: string, content: string, category: string }) => {
        const res = await fetch(`${API_BASE}/posts/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(post)
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    },
    deletePost: async (id: string | number) => {
        const res = await fetch(`${API_BASE}/posts/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    },
    deleteMessage: async (id: number) => {
        const res = await fetch(`${API_BASE}/messages/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    },
    applyFriendLink: async (data: { name: string, url: string, description: string, avatar: string }) => {
        const res = await fetch(`${API_BASE}/friends/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    getPendingFriendLinks: async () => {
        const res = await fetch(`${API_BASE}/friends/pending`, {
            headers: getHeaders()
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    },
    approveFriendLink: async (id: number) => {
        const res = await fetch(`${API_BASE}/friends/${id}/approve`, {
            method: 'PUT',
            headers: getHeaders()
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    },
    deleteFriendLink: async (id: number) => {
        const res = await fetch(`${API_BASE}/friends/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
    }
};

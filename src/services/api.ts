const API_BASE = 'http://localhost:3001/api';

export const api = {
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        return res.json();
    }
};

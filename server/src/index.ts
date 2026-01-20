import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Blog Posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) }
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { title, excerpt, content, date, category } = req.body;
        const post = await prisma.post.create({
            data: { title, excerpt, content: content || "", date, category }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const transformed = projects.map((p: any) => ({
            ...p,
            tags: p.tags.split(',')
        }));
        res.json(transformed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, tags, github, link, color } = req.body;
        const project = await prisma.project.create({
            data: {
                title,
                description,
                tags: Array.isArray(tags) ? tags.join(',') : tags,
                github,
                link,
                color
            }
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Friends
app.get('/api/friends', async (req, res) => {
    try {
        const friends = await prisma.friend.findMany();
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});

app.post('/api/friends', async (req, res) => {
    try {
        const { name, url, description, avatar } = req.body;
        const friend = await prisma.friend.create({
            data: { name, url, description, avatar }
        });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create friend link' });
    }
});

// Message Board
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { name, content } = req.body;
        const message = await prisma.message.create({
            data: {
                name,
                content,
                date: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' ago'
            }
        });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post message' });
    }
});

// Music Player
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await prisma.song.findMany();
        const transformed = songs.map((s: any) => ({
            ...s,
            lyrics: JSON.parse(s.lyrics)
        }));
        res.json(transformed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
});

app.post('/api/songs', async (req, res) => {
    try {
        const { title, artist, url, lyrics } = req.body;
        const song = await prisma.song.create({
            data: {
                title,
                artist,
                url,
                lyrics: typeof lyrics === 'string' ? lyrics : JSON.stringify(lyrics)
            }
        });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add song' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

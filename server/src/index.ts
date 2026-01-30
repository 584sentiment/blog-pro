import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules 中获取 __dirname 的方式
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 server/.env 文件
dotenv.config({ path: path.join(__dirname, '../.env') });

// 辅助函数：安全地解析 id 参数
const parseIdParam = (id: string | string[]): number => {
    const idStr = typeof id === 'string' ? id : id[0];
    return parseInt(idStr);
};

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'secret-salt-123';

// Prisma Client setup for Prisma 7
let prisma: PrismaClient;

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'; // 暂时使用本地数据库，Turso 缺少 approved 列
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log('Initializing Prisma with URL:', dbUrl.replace(/:[^:@/]+@/, ':***@')); // Mask auth in logs

try {
    const adapter = new PrismaLibSql({
        url: dbUrl,
        authToken: authToken,
    });
    // @ts-ignore
    prisma = new PrismaClient({ adapter });
} catch (err) {
    console.error('Failed to initialize Prisma adapter:', err);
}

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Auth Middleware (Verifies JWT)
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Token is usually sent as "Bearer <token>" or just "<token>"
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Auth Verification (Login -> Returns JWT)
app.post('/api/auth/verify', async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const isMatched = adminPassword.startsWith('$2')
        ? await bcrypt.compare(password, adminPassword)
        : password === adminPassword;

    if (isMatched) {
        // Sign a token that expires in 24 hours
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
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
            where: { id: parseIdParam(id) }
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
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

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, category } = req.body;
        const post = await prisma.post.update({
            where: { id: parseIdParam(id) },
            data: { title, excerpt, content, category }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({
            where: { id: parseIdParam(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
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

app.post('/api/projects', authMiddleware, async (req, res) => {
    try {
        const { title, description, tags, github, link, color } = req.body;
        const project = await prisma.project.create({
            data: {
                title,
                description,
                tags: Array.isArray(tags) ? tags.join(',') : (typeof tags === 'string' ? tags : ''),
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
        // Only return approved friend links for public display
        const friends = await prisma.friend.findMany({
            where: { approved: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});

// Get pending friend link applications (admin only)
app.get('/api/friends/pending', authMiddleware, async (req, res) => {
    try {
        const pending = await prisma.friend.findMany({
            where: { approved: false },
            orderBy: { createdAt: 'desc' }
        });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending applications' });
    }
});

// Public endpoint for friend link applications
app.post('/api/friends/apply', async (req, res) => {
    try {
        const { name, url, description, avatar } = req.body;
        const friend = await prisma.friend.create({
            data: { name, url, description, avatar, approved: false }
        });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// Admin endpoint to create approved friend link
app.post('/api/friends', authMiddleware, async (req, res) => {
    try {
        const { name, url, description, avatar } = req.body;
        const friend = await prisma.friend.create({
            data: { name, url, description, avatar, approved: true }
        });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create friend link' });
    }
});

// Approve friend link application
app.put('/api/friends/:id/approve', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const friend = await prisma.friend.update({
            where: { id: parseIdParam(id) },
            data: { approved: true }
        });
        res.json(friend);
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve friend link' });
    }
});

// Delete friend link
app.delete('/api/friends/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.friend.delete({
            where: { id: parseIdParam(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete friend link' });
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

// Delete message (admin only)
app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.message.delete({
            where: { id: parseIdParam(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
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

app.post('/api/songs', authMiddleware, async (req, res) => {
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

// Only listen locally, Vercel will use the exported app
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;

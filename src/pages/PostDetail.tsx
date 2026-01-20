import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.getPost(id)
                .then(data => {
                    setPost(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '10rem 10%', textAlign: 'center' }}>
                <h2 className="text-gradient" style={{ fontSize: '2rem' }}>Loading Story...</h2>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ padding: '10rem 10%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Post not found</h2>
                <button
                    onClick={() => navigate('/')}
                    style={backButtonStyle}
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '8rem 10% 4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '800px', margin: '0 auto' }}
            >
                <button
                    onClick={() => navigate('/')}
                    style={{ ...backButtonStyle, marginBottom: '3rem' }}
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <header style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--accent-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            padding: '0.4rem 1rem',
                            background: 'rgba(0, 220, 130, 0.1)',
                            borderRadius: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Tag size={14} /> {post.category}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <Calendar size={16} />
                            {post.date}
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem',
                        lineHeight: '1.2',
                        marginBottom: '2rem',
                        fontWeight: 800
                    }}>
                        {post.title}
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        fontStyle: 'italic',
                        borderLeft: '4px solid var(--accent-primary)',
                        paddingLeft: '1.5rem'
                    }}>
                        {post.excerpt}
                    </p>
                </header>

                <article
                    className="post-content ProseMirror"
                    style={{
                        fontSize: '1.15rem',
                        lineHeight: '1.8',
                        color: 'var(--text-primary)'
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <footer style={{
                    marginTop: '6rem',
                    paddingTop: '3rem',
                    borderTop: '1px solid var(--glass-border)',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={backButtonStyle}
                    >
                        <ArrowLeft size={20} /> Back to Home
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};

const backButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid var(--glass-border)',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    transition: 'all 0.2s ease'
};

export default PostDetail;

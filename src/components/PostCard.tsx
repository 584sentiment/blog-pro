import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, excerpt, date, category }) => {
    const navigate = useNavigate();
    return (
        <motion.article
            onClick={() => navigate(`/post/${id}`)}
            whileHover={{ y: -10 }}
            className="glass"
            style={{
                padding: '2rem',
                borderRadius: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.2rem'
            }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '0.3rem 0.8rem',
                    background: 'rgba(0, 220, 130, 0.1)',
                    borderRadius: '50px'
                }}>{category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    {date}
                </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.4' }}>{title}</h3>

            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                marginBottom: '2rem',
                lineHeight: '1.6',
                flex: 1
            }}>
                {excerpt}
            </p>

            <motion.div
                whileHover={{ x: 5 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)'
                }}
            >
                Read Article <ArrowRight size={16} />
            </motion.div>
        </motion.article>
    );
};

export default PostCard;

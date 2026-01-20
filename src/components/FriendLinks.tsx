import React from 'react';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';

import { api } from '../services/api';

const FriendLinks: React.FC = () => {
    const [friends, setFriends] = React.useState<any[]>([]);

    React.useEffect(() => {
        api.getFriends().then(setFriends);
    }, []);
    return (
        <section id="links" style={{ background: 'var(--bg-primary)' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>Corner of <span className="text-gradient">Friends</span></h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
                    Interesting souls and creative spaces I've discovered along the way.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {friends.map((friend, index) => (
                    <motion.a
                        key={friend.name}
                        href={friend.url}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            border: '1px solid rgba(0,0,0,0.03)',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 700
                        }}>
                            {friend.avatar}
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{friend.name}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{friend.description}</p>
                        </div>
                        <Link2 size={16} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                    </motion.a>
                ))}
            </div>
        </section>
    );
};

export default FriendLinks;

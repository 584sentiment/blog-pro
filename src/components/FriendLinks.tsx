import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Send } from 'lucide-react';

import { api } from '../services/api';
import { toast } from 'sonner';

const FriendLinks: React.FC = () => {
    const [friends, setFriends] = React.useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        avatar: ''
    });

    React.useEffect(() => {
        api.getFriends().then(setFriends);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.url || !formData.description || !formData.avatar) {
            toast.error('请填写所有字段');
            return;
        }
        toast.promise(api.applyFriendLink(formData), {
            loading: '正在提交申请...',
            success: () => {
                setFormData({ name: '', url: '', description: '', avatar: '' });
                return '申请已提交！等待审核通过后将显示在友链列表中';
            },
            error: '提交失败，请稍后重试'
        });
    };
    return (
        <section id="links" style={{ background: 'var(--bg-primary)' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>友人 <span className="text-gradient">角</span></h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
                    一路上发现的有趣灵魂和创意空间。
                </p>
            </div>

            {/* Application Form */}
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '3rem',
                maxWidth: '600px',
                margin: '0 auto 3rem'
            }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', textAlign: 'center' }}>
                    申请友链
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
                    填写以下信息申请加入友链，审核通过后将显示在列表中
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <input
                        type="text"
                        placeholder="网站名称"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <input
                        type="url"
                        placeholder="网站链接 (https://...)"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="网站描述"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="头像 (emoji 或文字，如：🌟 或 A)"
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            padding: '1rem',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            fontSize: '1rem'
                        }}
                    >
                        提交申请 <Send size={18} />
                    </motion.button>
                </form>
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

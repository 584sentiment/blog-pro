import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare } from 'lucide-react';

import { api } from '../services/api';

const MessageBoard: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        api.getMessages().then(setMessages);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !msg) return;
        const result = await api.postMessage(name, msg);
        setMessages([result, ...messages]);
        setName("");
        setMsg("");
    };

    return (
        <section id="messages" style={{ background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Message <span className="text-gradient">Board</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Leave a mark, say hello, or share a thought.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
                    {/* Form */}
                    <div style={{
                        background: 'white',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-md)',
                        alignSelf: 'start'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <MessageSquare size={20} className="text-accent-primary" />
                            Write something
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 3rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <textarea
                                placeholder="Your message..."
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    resize: 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
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
                                    gap: '0.8rem'
                                }}
                            >
                                Send Message <Send size={18} />
                            </motion.button>
                        </form>
                    </div>

                    {/* Messages List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{
                                        background: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{message.name}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{message.date}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        {message.content}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MessageBoard;

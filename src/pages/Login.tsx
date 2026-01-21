import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.login(password);
            toast.success('登录成功！欢迎回来');
            navigate('/admin');
        } catch (err) {
            toast.error('密码错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'fixed linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={{
                    padding: '3rem',
                    borderRadius: '32px',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}
            >
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--accent-primary)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'white',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                    <Lock size={32} />
                </div>

                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Login</h1>
                <p style={{ color: 'var(--text-primary)', opacity: 0.6, marginBottom: '2rem' }}>
                    Please enter your password to continue
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            marginBottom: '0.6rem'
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            style={{
                                width: '100%',
                                padding: '0 1.2rem',
                                height: '50px',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.5)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            transition: 'all 0.2s ease',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <LogIn size={20} />
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;

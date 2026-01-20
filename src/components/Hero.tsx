import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Palette } from 'lucide-react';
import heroImage from '../assets/hero.png';

const Hero: React.FC = () => {
    return (
        <section id="home" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '6rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorations */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(0,220,130,0.1) 0%, transparent 70%)',
                    zIndex: -1
                }}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1200px'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 220, 130, 0.1)',
                            color: 'var(--accent-primary)',
                            borderRadius: '50px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem'
                        }}
                    >
                        <Sparkles size={14} />
                        Welcome to my creative space
                    </motion.div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        marginBottom: '1.5rem',
                        lineHeight: '1.1'
                    }}>
                        Designing <span className="text-gradient">Digital</span> <br />
                        Experiences
                    </h1>

                    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}>
                        I'm a multidisciplinary designer and developer focused on building beautiful,
                        functional, and user-centric products. Let's create something extraordinary together.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '1rem 2rem',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                boxShadow: '0 10px 20px rgba(0, 220, 130, 0.2)'
                            }}
                        >
                            View Projects <ArrowRight size={18} />
                        </motion.button>

                        <a href="#blog" style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            borderBottom: '2px solid transparent',
                            paddingBottom: '2px'
                        }} className="hover:border-accent-primary">
                            Read Blog
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ position: 'relative', width: '100%' }}
                >
                    <div style={{
                        position: 'relative',
                        zIndex: 2,
                        borderRadius: '30px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <img
                            src={heroImage}
                            alt="Creative Workspace"
                            style={{
                                width: '100%',
                                display: 'block',
                                transition: 'transform 0.5s ease'
                            }}
                        />
                    </div>

                    {/* Floating icons */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '15px',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 3
                        }}
                    >
                        <Rocket color="var(--accent-secondary)" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '-30px',
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '15px',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 3
                        }}
                    >
                        <Palette color="var(--accent-tertiary)" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

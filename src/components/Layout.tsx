import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Blog', href: '#blog' },
    { name: 'Projects', href: '#projects' },
    { name: 'Links', href: '#links' },
    { name: 'Messages', href: '#messages' },
  ];

  return (
    <div className="layout">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          padding: isScrolled ? '1rem 5%' : '1.5rem 5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="serif text-gradient"
          style={{ fontSize: '1.8rem', fontWeight: 700, cursor: 'pointer' }}
        >
          FreshBlog
        </motion.div>

        {/* Desktop Nav */}
        <ul className="desktop-nav" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {navLinks.map((link, i) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <a href={link.href} style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                opacity: 0.8,
                letterSpacing: '0.5px'
              }} className="hover:opacity-100">
                {link.name}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" style={{ display: 'none' }}>
          {/* To be implemented if needed, but keeping it simple for now */}
        </div>
      </nav>

      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>

      <footer style={{
        padding: '6rem 10%',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)',
        marginTop: '0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '4rem',
          marginBottom: '4rem'
        }}>
          <div>
            <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>FreshBlog</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              A space for creativity, code, and curious thoughts.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {navLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Social</h4>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Github size={20} /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Mail size={20} /></a>
            </div>
          </div>
        </div>
        <div style={{
          paddingTop: '3rem',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            © 2026 FreshBlog. Created with <Heart size={14} style={{ color: 'var(--accent-secondary)', display: 'inline' }} /> by Antigravity.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

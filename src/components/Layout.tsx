import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', href: '/' },
    { name: '博客', href: '/#blog' },
    { name: '项目', href: '/#projects' },
    { name: '留言', href: '/#messages' },
    { name: '管理', href: '/admin' },
  ];

  return (
    <div className="layout">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass' : 'bg-transparent'}`}
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          padding: '0 5%',
          height: isScrolled ? '70px' : '90px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="serif text-gradient"
          style={{ fontSize: '1.8rem', fontWeight: 700, cursor: 'pointer', zIndex: 1001 }}
        >
          <Link to="/">FreshBlog</Link>
        </motion.div>

        {/* Desktop Nav */}
        <ul className="desktop-nav" style={{
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          {navLinks.map((link, i) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="desktop-only"
            >
              <Link to={link.href} style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                opacity: 0.8,
                letterSpacing: '0.5px'
              }} className="hover:opacity-100">
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <div
          className="mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ cursor: 'pointer', zIndex: 1001, color: 'var(--text-primary)' }}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            height: '100vh',
            background: 'var(--bg-primary)',
            zIndex: 1000,
            padding: '8rem 10% 4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}
            >
              <motion.span
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: isMenuOpen ? 0 : 20, opacity: isMenuOpen ? 1 : 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'block' }}
              >
                {link.name}
              </motion.span>
            </Link>
          ))}
        </motion.div>
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
            <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>清新博客</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              一个充满创意、代码和奇思妙想的空间。
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>链接</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>社交</h4>
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
            © 2026 清新博客. 由 Antigravity 用 <Heart size={14} style={{ color: 'var(--accent-secondary)', display: 'inline' }} /> 制作.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>隐私政策</a>
            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>服务条款</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

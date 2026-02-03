import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Calendar, ArrowLeft, Tag, Save, List } from 'lucide-react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const contentRef = useRef<HTMLDivElement>(null);

    // 提取标题 - 使用 useLayoutEffect 在每次渲染后都重新设置
    useLayoutEffect(() => {
        if (post?.content && contentRef.current) {
            const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            console.log('useLayoutEffect: Extracting headings, found:', headingElements.length);

            if (headingElements.length === 0) {
                console.log('No headings found in content');
                setHeadings([]);
                return;
            }

            const extractedHeadings: Heading[] = [];

            headingElements.forEach((heading, index) => {
                const headingElement = heading as HTMLElement;

                // 每次重新设置 ID 和样式
                headingElement.id = `heading-${index}`;
                headingElement.style.scrollMarginTop = '100px';

                extractedHeadings.push({
                    id: `heading-${index}`,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName.charAt(1))
                });
            });

            console.log('Extracted headings:', extractedHeadings.length);
            setHeadings(extractedHeadings);
        }
    }, [post]); // 只依赖 post，不依赖 post.content

    // 监听滚动，高亮当前标题
    useEffect(() => {
        if (headings.length === 0) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150; // 偏移量

            // 找到当前可见的标题
            let currentHeading = headings[0]?.id || '';
            for (const heading of headings) {
                const element = document.getElementById(heading.id);
                if (element && element.offsetTop <= scrollPosition) {
                    currentHeading = heading.id;
                }
            }

            setActiveHeading(currentHeading);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // 初始化

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings]);

    // 获取文章数据
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

    // 点击标题跳转
    const scrollToHeading = (id: string) => {
        console.log('Clicking heading:', id);

        // 先尝试通过 ID 查找
        let element = document.getElementById(id);

        // 如果没找到，通过 contentRef 重新查找并设置 ID
        if (!element && contentRef.current) {
            console.log('ID not found, refreshing heading IDs...');

            const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            console.log('Found', headingElements.length, 'headings in contentRef');

            // 重新设置所有 ID
            headingElements.forEach((heading, index) => {
                const headingElement = heading as HTMLElement;
                headingElement.id = `heading-${index}`;
                headingElement.style.scrollMarginTop = '100px';
            });

            // 再次尝试获取目标元素
            element = document.getElementById(id);
            console.log('After refresh, getElementById result:', element);
        }

        if (element) {
            console.log('Scrolling to element:', element.tagName, element.textContent?.substring(0, 30));
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.error('Heading element not found:', id);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '10rem 10%', textAlign: 'center' }}>
                <h2 className="text-gradient" style={{ fontSize: '2rem' }}>故事载入中...</h2>
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
        <div style={{ position: 'relative' }}>
            {/* 固定目录导航 */}
            {headings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="toc-container"
                    style={{
                        position: 'fixed',
                        right: '2rem',
                        top: '50%',
                        marginTop: '-150px', // 假设目录最大高度约300px
                        width: '220px',
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '1rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        border: '1px solid var(--glass-border)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        paddingBottom: '0.8rem',
                        borderBottom: '1px solid var(--glass-border)',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                    }}>
                        <List size={16} />
                        目录
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {headings.map((heading) => (
                            <li key={heading.id} style={{ marginBottom: '0.5rem', listStyle: 'none' }}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Button clicked, heading ID:', heading.id);
                                        scrollToHeading(heading.id);
                                    }}
                                    className="toc-item"
                                    style={{
                                        ...tocItemStyle,
                                        paddingLeft: `${(heading.level - 1) * 0.8}rem`,
                                        fontWeight: activeHeading === heading.id ? 600 : 400,
                                        color: activeHeading === heading.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        borderLeft: activeHeading === heading.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                        pointerEvents: 'auto',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    {heading.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            <div style={{ padding: '50px 5% 4rem', maxWidth: '900px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button
                        onClick={() => navigate('/')}
                        style={{ ...backButtonStyle, marginBottom: '2rem' }}
                    >
                        <ArrowLeft size={18} /> 返回
                    </button>

                    <header style={{ marginBottom: '3rem' }}>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'var(--accent-primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(0, 220, 130, 0.1)',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                            }}>
                                <Tag size={12} /> {post.category}
                            </span>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem'
                            }}>
                                <Calendar size={14} />
                                {post.date}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <h1 style={{
                                fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
                                lineHeight: '1.1',
                                marginBottom: '1.5rem',
                                fontWeight: 800,
                                flex: 1
                            }}>
                                {post.title}
                            </h1>
                            {api.isAuthenticated() && (
                                <button
                                    onClick={() => navigate(`/admin?edit=${post.id}`)}
                                    style={{
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Save size={16} /> 编辑
                                </button>
                            )}
                        </div>

                        <p style={{
                            fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            fontStyle: 'italic',
                            borderLeft: '4px solid var(--accent-primary)',
                            paddingLeft: '1.2rem'
                        }}>
                            {post.excerpt}
                        </p>
                    </header>

                    <article
                        ref={contentRef}
                        className="post-content ProseMirror"
                        style={{
                            fontSize: 'clamp(1rem, 4vw, 1.15rem)',
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
                            <ArrowLeft size={20} /> 返回首页
                        </button>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
};

const tocItemStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '0.5rem 0.8rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
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

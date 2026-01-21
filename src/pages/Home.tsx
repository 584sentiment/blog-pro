import React from 'react';
import Hero from '../components/Hero';
import PostCard from '../components/PostCard';
import ProjectPreview from '../components/ProjectPreview';
import FriendLinks from '../components/FriendLinks';
import MessageBoard from '../components/MessageBoard';
import { motion } from 'framer-motion';
import ClickEffect from '../components/ClickEffect';
import MusicPlayer from '../components/MusicPlayer';
import { api } from '../services/api';

const Home: React.FC = () => {
    const [posts, setPosts] = React.useState<any[]>([]);

    React.useEffect(() => {
        api.getPosts().then(data => {
            setPosts(data);
        });
    }, []);

    return (
        <>
            <Hero />

            {/* About Section */}
            <section id="about" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        height: 'clamp(300px, 50vh, 500px)',
                        background: 'var(--bg-secondary)',
                        borderRadius: '40px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(4rem, 15vw, 8rem)',
                        fontWeight: 800,
                        opacity: 0.05,
                        color: 'var(--text-primary)'
                    }}>
                        HELLO
                    </div>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--accent-primary)', borderRadius: '50%', marginBottom: '1.5rem' }}></div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>开发者 & 追梦人</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>扎根数字世界，打造更有意义的体验。</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1.5rem' }}><span className="text-gradient">像素</span>背后的故事</h2>
                    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                        我是一个自学成才的创作者，热衷于将技术与艺术融合。
                        我的旅程源于对事物工作原理的好奇，后来演变成职业，
                        去构建人们的感受。
                    </p>
                    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                        在不写代码的时候，你会发现我在用相机探索城市，或者沉浸在
                        科幻小说的世界里。我相信每一个数字产品都应该讲述一个故事。
                    </p>
                </motion.div>
            </section>

            {/* Blog Section */}
            <section id="blog">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '3rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', margin: 0 }}>最新 <span className="text-gradient">见解</span></h2>
                        <a href="#" style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>查看全部 →</a>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>关于设计、技术以及介于两者之间的一切。 </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id || post.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PostCard {...post} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <ProjectPreview />
            <FriendLinks />
            <MessageBoard />
            <ClickEffect />
            <MusicPlayer />
        </>
    );
};

export default Home;

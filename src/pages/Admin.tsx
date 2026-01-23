import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Save, LogOut, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="toolbar" style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.8rem',
            borderBottom: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.5)',
            flexWrap: 'wrap'
        }}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'active' : ''}
                style={buttonStyle(editor.isActive('bold'))}
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'active' : ''}
                style={buttonStyle(editor.isActive('italic'))}
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
                style={buttonStyle(editor.isActive('heading', { level: 1 }))}
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
                style={buttonStyle(editor.isActive('heading', { level: 2 }))}
            >
                <Heading2 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'active' : ''}
                style={buttonStyle(editor.isActive('bulletList'))}
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'active' : ''}
                style={buttonStyle(editor.isActive('orderedList'))}
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'active' : ''}
                style={buttonStyle(editor.isActive('blockquote'))}
            >
                <Quote size={18} />
            </button>
        </div>
    );
};

const buttonStyle = (active: boolean) => ({
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    background: active ? 'var(--accent-primary)' : 'transparent',
    color: active ? 'white' : 'var(--text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
});

const Admin: React.FC = () => {
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('Development');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'friends'>('posts');
    const [pendingFriends, setPendingFriends] = useState<any[]>([]);
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: '开始书写你的故事...',
            }),
        ],
        content: '',
    });

    useEffect(() => {
        if (editId && editor) {
            setLoading(true);
            api.getPost(editId).then(data => {
                setTitle(data.title);
                setExcerpt(data.excerpt);
                setCategory(data.category);
                editor.commands.setContent(data.content);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                toast.error('加载文章失败');
                setLoading(false);
            });
        }
    }, [editId, editor]);

    useEffect(() => {
        if (activeTab === 'friends') {
            api.getPendingFriendLinks().then(setPendingFriends).catch(err => {
                console.error(err);
                toast.error('加载友链申请失败');
            });
        }
    }, [activeTab]);

    const handleSave = async () => {
        if (!title || !editor) return;

        setSubmitLoading(true);
        try {
            if (editId) {
                await api.updatePost(editId, {
                    title,
                    excerpt,
                    category,
                    content: editor.getHTML()
                });
                toast.success('文章更新成功！');
                navigate(`/post/${editId}`);
            } else {
                await api.postPost({
                    title,
                    excerpt,
                    category,
                    content: editor.getHTML(),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                });
                toast.success('文章发布成功！');
                setTitle('');
                setExcerpt('');
                editor.commands.setContent('');
            }
        } catch (error) {
            console.error(error);
            toast.error('保存失败');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editId || !window.confirm('确定要删除这篇文章吗？')) return;

        setSubmitLoading(true);
        try {
            await api.deletePost(editId);
            toast.success('文章已删除');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('删除失败');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleApproveFriend = async (id: number) => {
        try {
            await api.approveFriendLink(id);
            toast.success('友链已批准');
            setPendingFriends(pendingFriends.filter(f => f.id !== id));
        } catch (error) {
            console.error(error);
            toast.error('批准失败');
        }
    };

    const handleDeleteFriend = async (id: number) => {
        if (!window.confirm('确定要删除这个友链申请吗？')) return;
        try {
            await api.deleteFriendLink(id);
            toast.success('友链已删除');
            setPendingFriends(pendingFriends.filter(f => f.id !== id));
        } catch (error) {
            console.error(error);
            toast.error('删除失败');
        }
    };

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={{ padding: '10rem 10%', textAlign: 'center' }}>
                <h2 className="text-gradient" style={{ fontSize: '2rem' }}>加载中...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: 'clamp(6rem, 15vh, 8rem) 5% 4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{
                    padding: 'clamp(1.5rem, 5vw, 3rem)',
                    borderRadius: '32px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', margin: 0 }}>
                        管理 <span className="text-gradient">面板</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.5)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}
                    >
                        <LogOut size={18} />
                        退出登录
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--glass-border)' }}>
                    <button
                        onClick={() => setActiveTab('posts')}
                        style={{
                            padding: '1rem 1.5rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'posts' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                            color: activeTab === 'posts' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginBottom: '-2px'
                        }}
                    >
                        文章管理
                    </button>
                    <button
                        onClick={() => setActiveTab('friends')}
                        style={{
                            padding: '1rem 1.5rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'friends' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                            color: activeTab === 'friends' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginBottom: '-2px'
                        }}
                    >
                        友链管理 {pendingFriends.length > 0 && `(${pendingFriends.length})`}
                    </button>
                </div>

                {activeTab === 'posts' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                                {editId ? '编辑文章' : '创建新文章'}
                            </h2>
                            {editId && (
                                <button
                                    onClick={handleDelete}
                                    disabled={submitLoading}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '12px',
                                        border: '1px solid #ff444433',
                                        background: 'rgba(255, 68, 68, 0.1)',
                                        color: '#ff4444',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}
                                >
                                    <Trash2 size={18} />
                                    删除
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={labelStyle}>标题</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="文章标题"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                <div>
                                    <label style={labelStyle}>分类</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option>Development</option>
                                        <option>Design</option>
                                        <option>Sustainability</option>
                                        <option>Tech</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Excerpt</label>
                                <textarea
                                    value={excerpt}
                                    onChange={e => setExcerpt(e.target.value)}
                                    placeholder="A brief summary of your post..."
                                    style={{ ...inputStyle, minHeight: '80px', paddingTop: '12px' }}
                                />
                            </div>
                        </div>

                        <div style={{
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: 'white',
                            marginBottom: '2rem'
                        }}>
                            <MenuBar editor={editor} />
                            <div style={{ padding: '1.5rem', minHeight: '400px', cursor: 'text' }}>
                                <EditorContent editor={editor} />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={submitLoading}
                            style={{
                                background: 'var(--accent-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2.5rem',
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                transition: 'all 0.2s ease',
                                opacity: submitLoading ? 0.7 : 1
                            }}
                        >
                            <Save size={20} />
                            {submitLoading ? 'Saving...' : (editId ? 'Update Post' : 'Publish Post')}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            待审核友链申请 {pendingFriends.length > 0 && `(${pendingFriends.length})`}
                        </h2>
                        {pendingFriends.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '16px',
                                color: 'var(--text-secondary)'
                            }}>
                                暂无待审核的友链申请
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {pendingFriends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        style={{
                                            padding: '1.5rem',
                                            background: 'white',
                                            borderRadius: '16px',
                                            border: '1px solid var(--glass-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.5rem'
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
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{friend.name}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                                                {friend.description}
                                            </p>
                                            <a
                                                href={friend.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textDecoration: 'none' }}
                                            >
                                                {friend.url}
                                            </a>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <button
                                                onClick={() => handleApproveFriend(friend.id)}
                                                style={{
                                                    padding: '0.6rem 1.2rem',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: 'var(--accent-primary)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                批准
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFriend(friend.id)}
                                                style={{
                                                    padding: '0.6rem 1.2rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #ff444433',
                                                    background: 'rgba(255, 68, 68, 0.1)',
                                                    color: '#ff4444',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                删除
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.6rem',
    color: 'var(--text-primary)',
    opacity: 0.8
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0 1.2rem',
    height: '50px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.5)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    color: 'var(--text-primary)'
};

export default Admin;

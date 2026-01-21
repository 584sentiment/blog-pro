import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Save, LogOut, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
                alert('加载文章失败');
                setLoading(false);
            });
        }
    }, [editId, editor]);

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
                alert('文章更新成功！');
                navigate(`/post/${editId}`);
            } else {
                await api.postPost({
                    title,
                    excerpt,
                    category,
                    content: editor.getHTML(),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                });
                alert('文章发布成功！');
                setTitle('');
                setExcerpt('');
                editor.commands.setContent('');
            }
        } catch (error) {
            console.error(error);
            alert('保存失败');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editId || !window.confirm('确定要删除这篇文章吗？')) return;

        setSubmitLoading(true);
        try {
            await api.deletePost(editId);
            alert('文章已删除');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('删除失败');
        } finally {
            setSubmitLoading(false);
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
                        {editId ? '编辑' : '创建新'} <span className="text-gradient">文章</span>
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
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

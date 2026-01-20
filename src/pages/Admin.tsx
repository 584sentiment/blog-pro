import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Save } from 'lucide-react';

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

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Start writing your story...</p>',
    });

    const handlePublish = async () => {
        if (!title || !editor) return;

        setLoading(true);
        try {
            await api.postPost({
                title,
                excerpt,
                category,
                content: editor.getHTML(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            });
            alert('Post published successfully!');
            setTitle('');
            setExcerpt('');
            editor.commands.setContent('<p>Start writing your story...</p>');
        } catch (error) {
            console.error(error);
            alert('Failed to publish post');
        } finally {
            setLoading(false);
        }
    };

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
                <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '2rem' }}>Create New <span className="text-gradient">Post</span></h1>

                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Post Title"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        <div>
                            <label style={labelStyle}>Category</label>
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
                    onClick={handlePublish}
                    disabled={loading}
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
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <Save size={20} />
                    {loading ? 'Publishing...' : 'Publish Post'}
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

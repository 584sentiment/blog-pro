import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Save, LogOut, Trash2, Link as LinkIcon, Undo, Redo,
    Code, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
    Highlighter, Minus
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { common, createLowlight } from 'lowlight';
import { marked } from 'marked';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('输入链接地址:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('输入图片地址:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
    };

    const setHighlight = () => {
        editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run();
    };

    return (
        <div className="toolbar" style={{
            display: 'flex',
            gap: '0.5rem',
            border: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            background: 'transparent',
            flexWrap: 'nowrap',
            alignItems: 'center',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,0,0,0.2) transparent'
        }}>
            {/* 撤销/重做 */}
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                style={buttonStyle(false)}
                title="撤销"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                style={buttonStyle(false)}
                title="重做"
            >
                <Redo size={18} />
            </button>

            {/* 标题 */}
            <div style={dividerStyle} />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
                style={buttonStyle(editor.isActive('heading', { level: 1 }))}
                title="一级标题"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
                style={buttonStyle(editor.isActive('heading', { level: 2 }))}
                title="二级标题"
            >
                <Heading2 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
                style={buttonStyle(editor.isActive('heading', { level: 3 }))}
                title="三级标题"
            >
                <Heading3 size={18} />
            </button>

            {/* 文本格式 */}
            <div style={dividerStyle} />
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'active' : ''}
                style={buttonStyle(editor.isActive('bold'))}
                title="加粗"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'active' : ''}
                style={buttonStyle(editor.isActive('italic'))}
                title="斜体"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'active' : ''}
                style={buttonStyle(editor.isActive('underline'))}
                title="下划线"
            >
                <UnderlineIcon size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'active' : ''}
                style={buttonStyle(editor.isActive('strike'))}
                title="删除线"
            >
                <Strikethrough size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'active' : ''}
                style={buttonStyle(editor.isActive('code'))}
                title="行内代码"
            >
                <Code size={18} />
            </button>

            {/* 颜色和高亮 */}
            <div style={dividerStyle} />
            <button
                className="color-btn"
                onClick={() => setColor('#ef4444')}
                style={{
                    ...colorButtonStyle,
                    background: '#ef4444',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
                title="红色"
            />
            <button
                className="color-btn"
                onClick={() => setColor('#3b82f6')}
                style={{
                    ...colorButtonStyle,
                    background: '#3b82f6',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
                title="蓝色"
            />
            <button
                className="color-btn"
                onClick={() => setColor('#22c55e')}
                style={{
                    ...colorButtonStyle,
                    background: '#22c55e',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
                title="绿色"
            />
            <button
                className="color-btn"
                onClick={() => setColor('#eab308')}
                style={{
                    ...colorButtonStyle,
                    background: '#eab308',
                    border: '1px solid rgba(0,0,0,0.15)'
                }}
                title="黄色"
            />
            <button
                className="color-btn"
                onClick={() => setColor('#000000')}
                style={{
                    ...colorButtonStyle,
                    background: '#000000',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                }}
                title="黑色"
            />
            <button
                onClick={setHighlight}
                className={editor.isActive('highlight') ? 'active' : ''}
                style={buttonStyle(editor.isActive('highlight'))}
                title="高亮"
            >
                <Highlighter size={18} />
            </button>

            {/* 对齐 */}
            <div style={dividerStyle} />
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
                style={buttonStyle(editor.isActive({ textAlign: 'left' }))}
                title="左对齐"
            >
                <AlignLeft size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
                style={buttonStyle(editor.isActive({ textAlign: 'center' }))}
                title="居中对齐"
            >
                <AlignCenter size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
                style={buttonStyle(editor.isActive({ textAlign: 'right' }))}
                title="右对齐"
            >
                <AlignRight size={18} />
            </button>

            {/* 列表 */}
            <div style={dividerStyle} />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'active' : ''}
                style={buttonStyle(editor.isActive('bulletList'))}
                title="无序列表"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'active' : ''}
                style={buttonStyle(editor.isActive('orderedList'))}
                title="有序列表"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                className={editor.isActive('taskList') ? 'active' : ''}
                style={buttonStyle(editor.isActive('taskList'))}
                title="任务列表"
            >
                <List size={18} style={{ textDecoration: 'line-through' }} />
            </button>

            {/* 其他元素 */}
            <div style={dividerStyle} />
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'active' : ''}
                style={buttonStyle(editor.isActive('blockquote'))}
                title="引用"
            >
                <Quote size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'active' : ''}
                style={buttonStyle(editor.isActive('codeBlock'))}
                title="代码块"
            >
                <Code size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                style={buttonStyle(false)}
                title="分割线"
            >
                <Minus size={18} />
            </button>

            {/* 链接和图片 */}
            <div style={dividerStyle} />
            <button
                onClick={addLink}
                className={editor.isActive('link') ? 'active' : ''}
                style={buttonStyle(editor.isActive('link'))}
                title="插入链接"
            >
                <LinkIcon size={18} />
            </button>
            <button
                onClick={addImage}
                style={buttonStyle(false)}
                title="插入图片"
            >
                <ImageIcon size={18} />
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
    transition: 'all 0.2s ease',
    ':hover': {
        background: 'rgba(0,0,0,0.05)'
    }
});

const colorButtonStyle: React.CSSProperties = {
    minWidth: '24px',
    minHeight: '24px',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid rgba(0,0,0,0.2)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box' as 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease'
};

const dividerStyle = {
    width: '1px',
    height: '20px',
    background: 'rgba(0,0,0,0.1)',
    flexShrink: 0
};

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

    const lowlight = createLowlight(common);

    // 配置 marked 选项
    marked.setOptions({
        breaks: true, // 支持单个换行符转换为 <br>
        gfm: true, // 支持 GitHub Flavored Markdown
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // 禁用默认代码块，使用 CodeBlockLowlight
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto',
                },
            }),
            HorizontalRule,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Placeholder.configure({
                placeholder: '开始书写你的故事...',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none',
            },
        },
    });

    // 添加 markdown 粘贴处理
    useEffect(() => {
        if (!editor) return;

        const handlePaste = (event: Event) => {
            const clipboardEvent = event as ClipboardEvent;
            const clipboardData = clipboardEvent.clipboardData;
            if (!clipboardData) return;

            // 获取纯文本内容和 HTML 内容
            const text = clipboardData.getData('text/plain');
            const html = clipboardData.getData('text/html');

            // 如果有 HTML 内容（从网页或编辑器复制），使用默认粘贴行为
            if (html && html.trim().length > 0) {
                return;
            }

            // 如果没有文本内容，使用默认行为
            if (!text || text.trim().length === 0) {
                return;
            }

            // 简化的 markdown 检测 - 只要包含任何常见 markdown 符号就尝试转换
            const hasMarkdownSymbols = /[#*`\[\]~>_-]/.test(text);

            if (hasMarkdownSymbols) {
                // 阻止默认粘贴行为
                event.preventDefault();

                // 使用 setTimeout 确保在当前事件循环之外执行
                setTimeout(() => {
                    try {
                        // 使用 marked 将 markdown 转换为 HTML
                        const convertedHtml = marked.parse(text) as string;

                        // 使用 TipTap 的 insertContent 命令插入 HTML
                        editor.commands.insertContent(convertedHtml, {
                            parseOptions: {
                                preserveWhitespace: 'full',
                            },
                        });
                    } catch (error) {
                        console.error('Markdown parsing error:', error);
                        // 如果解析失败，插入纯文本
                        editor.commands.insertContent(text);
                    }
                }, 0);
            }
            // 如果不是 markdown，让默认粘贴行为处理
        };

        // 获取编辑器 DOM 元素
        const editorElement = document.querySelector('.ProseMirror');
        if (editorElement) {
            editorElement.addEventListener('paste', handlePaste as EventListener);
        }

        return () => {
            if (editorElement) {
                editorElement.removeEventListener('paste', handlePaste as EventListener);
            }
        };
    }, [editor]);

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
        <div style={{ padding: '50px 5% 4rem' }}>
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
                            background: 'rgba(255,255,255,0.8)',
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

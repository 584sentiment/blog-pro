import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';

const projects = [
    {
        title: "EcoTracker",
        description: "A mobile application for tracking and reducing personal carbon footprint through gamification.",
        tags: ["React Native", "Firebase", "D3.js"],
        github: "#",
        link: "#",
        color: "var(--accent-primary)"
    },
    {
        title: "Nova UI",
        description: "A minimalist design system and component library built for rapid prototyping and accessibility.",
        tags: ["TypeScript", "Tailwind", "Storybook"],
        github: "#",
        link: "#",
        color: "var(--accent-tertiary)"
    },
    {
        title: "Zenith Engine",
        description: "A lightweight 2D game engine optimized for performance and ease of use in web browsers.",
        tags: ["WebGL", "Rust", "Wasm"],
        github: "#",
        link: "#",
        color: "var(--accent-secondary)"
    }
];

const ProjectPreview: React.FC = () => {
    return (
        <section id="projects" style={{ background: 'var(--bg-secondary)' }}>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Selected <span className="text-gradient">Projects</span></h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    A collection of projects where I explore the boundaries of design and technology.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem'
            }}>
                {projects.map((project, index) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            height: '200px',
                            background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Code size={48} style={{ color: project.color, opacity: 0.5 }} />
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{project.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                {project.description}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
                                {project.tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: '0.75rem',
                                        padding: '0.3rem 0.8rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '50px',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1.2rem', marginTop: 'auto' }}>
                                <a href={project.github} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="hover:text-primary">
                                    <Github size={18} /> Code
                                </a>
                                <a href={project.link} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="hover:text-primary">
                                    <ExternalLink size={18} /> Demo
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProjectPreview;

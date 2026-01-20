import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, List, Volume2 } from 'lucide-react';
import { api } from '../services/api';

interface Song {
    id: number;
    title: string;
    artist: string;
    url: string;
    lyrics: { time: number; text: string }[];
}

const MusicPlayer: React.FC = () => {
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.getSongs().then(setPlaylist);
    }, []);

    useEffect(() => {
        if (playlist.length > 0 && isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentIdx, playlist]);

    if (playlist.length === 0) return null;

    const currentSong = playlist[currentIdx];

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && audioRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const nextSong = () => {
        setCurrentIdx((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Find current lyric
    const currentLyric = currentSong?.lyrics
        ? [...currentSong.lyrics].reverse().find(l => currentTime >= l.time)?.text || ""
        : "";

    return (
        <>
            <audio
                ref={audioRef}
                src={currentSong.url}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={nextSong}
            />

            {/* Global Lyrics Display at Bottom */}
            <AnimatePresence>
                {isPlaying && currentLyric && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        style={{
                            position: 'fixed',
                            bottom: '1.5rem',
                            transform: 'translateX(-50%)',
                            zIndex: 2000,
                            pointerEvents: 'none',
                            textAlign: 'center',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <div className="glass" style={{
                            padding: '0.6rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'var(--accent-primary)',
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0, 220, 130, 0.2)',
                            maxWidth: '80%'
                        }}>
                            {currentLyric}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsMenuOpen(false);
                }}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 1001,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    padding: '1rem', // Bubble area
                }}
            >
                {/* Main Player Panel (Shows on Hover) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            className="glass"
                            style={{
                                padding: '1.2rem',
                                borderRadius: '24px',
                                width: '280px',
                                boxShadow: 'var(--shadow-lg)',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                marginBottom: '0.5rem'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <motion.div
                                    animate={isPlaying ? { rotate: 360 } : {}}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                    <Music size={20} />
                                </motion.div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {currentSong.title}
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                        {currentSong.artist}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: isMenuOpen ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            {/* Clickable Progress Bar */}
                            <div style={{ marginBottom: '0.5rem' }}>
                                <div
                                    ref={progressRef}
                                    onClick={handleProgressClick}
                                    style={{
                                        width: '100%',
                                        height: '6px',
                                        background: '#eee',
                                        borderRadius: '3px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <motion.div
                                        style={{
                                            height: '100%',
                                            background: 'var(--accent-primary)',
                                            width: `${(currentTime / duration) * 100 || 0}%`
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginTop: '0.4rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                                    <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                                    <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Playlist Menu (Inside Panel) */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{
                                            marginTop: '0.8rem',
                                            maxHeight: '150px',
                                            overflowY: 'auto',
                                            borderTop: '1px solid rgba(0,0,0,0.05)',
                                            paddingTop: '0.5rem'
                                        }}
                                    >
                                        {playlist.map((s, i) => (
                                            <div
                                                key={s.id}
                                                onClick={() => { setCurrentIdx(i); setIsPlaying(true); }}
                                                style={{
                                                    padding: '0.4rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    background: currentIdx === i ? 'rgba(0, 220, 130, 0.05)' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.6rem',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentIdx === i ? 'var(--accent-primary)' : '#ddd' }} />
                                                <div style={{ flex: 1, fontWeight: currentIdx === i ? 600 : 400, color: currentIdx === i ? 'var(--accent-primary)' : 'inherit' }}>{s.title}</div>
                                                {currentIdx === i && isPlaying && <Volume2 size={12} color="var(--accent-primary)" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Toggle Button (The "Trigger") */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="glass"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none',
                        background: isPlaying ? 'var(--accent-primary)' : 'white',
                        color: isPlaying ? 'white' : 'var(--text-primary)',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative',
                    }}
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}

                    {isPlaying && (
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '2px solid var(--accent-primary)',
                            }}
                        />
                    )}
                </motion.button>
            </motion.div>
        </>
    );
};

export default MusicPlayer;

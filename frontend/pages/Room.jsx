import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { getNotes, updateNote } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Users, Save, Trash2, Share2, Clock, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './Room.module.css';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket, connected, roomUsers, joinRoom, leaveRoom } = useSocket();
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUsersList, setShowUsersList] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);
  const username = sessionStorage.getItem('username') || 'Anonymous';

  // Join room on component mount
  useEffect(() => {
    if (connected && socket) {
      joinRoom(roomId, username);
      
      // Fetch initial note content
      fetchNoteContent();

      // Listen for note updates
      socket.on('note-updated', (updatedContent) => {
        setNoteContent(updatedContent);
      });

      // Clean up on component unmount
      return () => {
        leaveRoom(roomId);
        socket.off('note-updated');
      };
    }
  }, [connected, socket, roomId]);

  const fetchNoteContent = async () => {
    try {
      setIsLoading(true);
      const notes = await getNotes(roomId);
      if (notes && notes.length > 0) {
        setNoteContent(notes[0].content);
      }
    } catch (error) {
      toast.error('Failed to load note content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteChange = (e) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    
    // Emit content change to other users
    if (socket) {
      socket.emit('update-note', { roomId, content: newContent });
    }
    
    // Debounce saving to the database
    debounceSaveNote(newContent);
  };

  // Enhanced debounce implementation for saving notes with visual feedback
  const debounceSaveNote = (() => {
    let timeout;
    return (content) => {
      clearTimeout(timeout);
      setIsSaving(true);
      timeout = setTimeout(() => {
        updateNote(roomId, content)
          .then(() => {
            setLastSaved(new Date());
          })
          .catch(() => {
            toast.error('Failed to save note content');
          })
          .finally(() => {
            setIsSaving(false);
          });
      }, 1000);
    };
  })();

  const copyRoomLink = () => {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink);
    toast.success('Room link copied to clipboard');
  };

  const goHome = () => {
    navigate('/');
  };

  const focusEditor = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = now - lastSaved;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    return lastSaved.toLocaleTimeString();
  };
  
  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.header}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button 
          className={styles.backButton} 
          onClick={goHome}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </motion.button>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={styles.titleDot}></span>
          Room: <span className={styles.roomIdHighlight}>{roomId}</span>
        </motion.h1>
        
        <div className={styles.actions}>
          <motion.div className={styles.saveStatus}>
            {isSaving ? (
              <span className={styles.saving}><Zap size={14} /> Saving...</span>
            ) : lastSaved ? (
              <span className={styles.saved}><Clock size={14} /> {formatLastSaved()}</span>
            ) : null}
          </motion.div>
          
          <motion.button 
            className={styles.iconButton} 
            onClick={copyRoomLink} 
            title="Copy room link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={18} />
          </motion.button>
          
          <motion.button 
            className={`${styles.iconButton} ${showUsersList ? styles.activeButton : ''}`}
            onClick={() => setShowUsersList(!showUsersList)}
            title="Show users"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={18} />
            <span className={styles.userCount}>{roomUsers.length}</span>
          </motion.button>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showUsersList && (
          <motion.div 
            className={styles.usersPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>
              <Users size={16} />
              Connected Users
            </h3>
            <ul className={styles.usersList}>
              {roomUsers.map((user, index) => (
                <motion.li 
                  key={index} 
                  className={styles.userItem}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={styles.userAvatar}>
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user}</span>
                  {user === username && <span className={styles.youBadge}>You</span>}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className={styles.editorContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={focusEditor}
      >
        {isLoading ? (
          <motion.div 
            className={styles.loading}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className={styles.loadingSpinner}></div>
            <span>Loading collaborative workspace...</span>
          </motion.div>
        ) : (
          <>
            <div className={styles.editorHeader}>
              <span className={styles.editorTitle}>Collaborative Document</span>
              <div className={styles.editorControls}>
                <div className={`${styles.connectionStatus} ${connected ? styles.connected : styles.disconnected}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              className={styles.editor}
              value={noteContent}
              onChange={handleNoteChange}
              placeholder="Start typing your collaborative note here..."
            />
          </>
        )}
      </motion.div>
      
      <motion.div 
        className={styles.footer}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className={styles.footerInfo}>
          <div className={styles.roomInfo}>
            <span className={styles.infoLabel}>Room ID:</span> 
            <span className={styles.infoValue}>{roomId}</span>
            <button 
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                toast.success('Room ID copied');
              }}
            >
              <Copy size={14} />
            </button>
          </div>
          <div className={styles.onlineUsers}>
            <span className={styles.infoLabel}>Online:</span>
            <span className={styles.infoValue}>{roomUsers.length} user{roomUsers.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className={styles.collaboration}>
          <div className={styles.dot}></div>
          Real-time collaboration powered by Socket.io
        </div>
      </motion.div>
    </div>
  );
};

export default Room;
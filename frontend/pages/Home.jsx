import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import styles from './Home.module.css';
import { motion } from 'framer-motion';
import { Sparkles, Users, Copy, ArrowRight } from 'lucide-react';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Random subtle background patterns
    document.body.classList.add(styles.bodyBackground);
    return () => document.body.classList.remove(styles.bodyBackground);
  }, []);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId) return;
    
    // Store username in session storage
    sessionStorage.setItem('username', username || 'Anonymous');
    
    // Navigate to the room
    navigate(`/room/${roomId}`);
  };

  const handleCreateRoom = () => {
    // Generate a new room ID
    const newRoomId = nanoid(10);
    setRoomId(newRoomId);
  };
  
  const copyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.cardHeader}>
          <Sparkles className={styles.sparkleIcon} />
          <h1 className={styles.title}>Collaborative Notes</h1>
          <p className={styles.subtitle}>Create or join a room to start working together</p>
        </div>

        <form onSubmit={handleJoinRoom} className={styles.form}>
          <div className={styles.formContent}>
            <div className={styles.inputWrapper}>
              <div className={styles.inputGroup}>
                <label htmlFor="username">
                  <Users size={18} />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name (optional)"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="roomId">
                  <span>Room ID</span>
                  {roomId && (
                    <motion.button 
                      type="button" 
                      className={styles.copyButton}
                      onClick={copyRoomId}
                      whileTap={{ scale: 0.95 }}
                      title="Copy room ID"
                    >
                      <Copy size={16} />
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  )}
                </label>
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID or create a new one"
                  required
                />
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <motion.button 
                type="button" 
                onClick={handleCreateRoom}
                className={styles.createButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Room
              </motion.button>
              <motion.button 
                type="submit" 
                className={styles.joinButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Room
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </form>

        <div className={styles.cardFooter}>
          <div className={styles.decoration}></div>
          <p>Share the room ID with others to collaborate in real-time</p>
        </div>
      </motion.div>
      
      <div className={styles.bgShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>
    </div>
  );
};

export default Home;
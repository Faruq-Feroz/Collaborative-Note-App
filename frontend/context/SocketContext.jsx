import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  
  useEffect(() => {
    // Create socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    });

    // Set up event listeners
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to socket server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from socket server');
    });

    newSocket.on('user-joined', (username) => {
      toast.info(`${username} joined the room`);
    });

    newSocket.on('user-left', (username) => {
      toast.info(`${username} left the room`);
    });

    newSocket.on('room-users', (users) => {
      setRoomUsers(users);
    });

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join a room
  const joinRoom = (roomId, username) => {
    if (socket) {
      socket.emit('join-room', { roomId, username });
    }
  };

  // Leave the current room
  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', { roomId });
    }
  };

  const value = {
    socket,
    connected,
    roomUsers,
    joinRoom,
    leaveRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
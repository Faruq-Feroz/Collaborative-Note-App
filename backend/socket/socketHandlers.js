const Note = require('../models/Note');

// Store active users in rooms
const rooms = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle joining a room
    socket.on('join-room', async ({ roomId, username }) => {
      if (!roomId) return;
      
      // Join the socket room
      socket.join(roomId);
      
      // Add user to room
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }
      rooms.get(roomId).set(socket.id, username || 'Anonymous');
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', username || 'Anonymous');
      
      // Send updated list of users to everyone in the room
      const usersInRoom = Array.from(rooms.get(roomId).values());
      io.to(roomId).emit('room-users', usersInRoom);
      
      // Store room info in socket for cleanup
      socket.roomId = roomId;
      socket.username = username || 'Anonymous';
      
      console.log(`${username || 'Anonymous'} joined room: ${roomId}`);
      
      // Get the latest note content and send it to the user
      try {
        const notes = await Note.find({ roomId }).sort({ updatedAt: -1 }).limit(1);
        if (notes.length > 0) {
          socket.emit('note-updated', notes[0].content);
        }
      } catch (error) {
        console.error('Error fetching note for new user:', error);
      }
    });
    
    // Handle leaving a room
    socket.on('leave-room', ({ roomId }) => {
      handleRoomLeave(socket, roomId);
    });
    
    // Handle note updates
    socket.on('update-note', async ({ roomId, content }) => {
      if (!roomId) return;
      
      // Broadcast the update to all clients in the room except the sender
      socket.to(roomId).emit('note-updated', content);
      
      // Save the updated content to the database
      try {
        // Find the most recent note for this room
        let note = await Note.findOne({ roomId }).sort({ updatedAt: -1 });
        
        // If no note exists, create a new one
        if (!note) {
          note = new Note({ roomId, content });
        } else {
          note.content = content;
        }
        
        await note.save();
      } catch (error) {
        console.error('Error saving note update:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Clean up any rooms the user was in
      if (socket.roomId) {
        handleRoomLeave(socket, socket.roomId);
      }
    });
  });
  
  // Helper function to handle a user leaving a room
  function handleRoomLeave(socket, roomId) {
    if (!roomId || !rooms.has(roomId)) return;
    
    // Remove user from room
    const username = rooms.get(roomId).get(socket.id) || 'Anonymous';
    rooms.get(roomId).delete(socket.id);
    
    // If room is empty, delete it
    if (rooms.get(roomId).size === 0) {
      rooms.delete(roomId);
    } else {
      // Notify others that user left
      socket.to(roomId).emit('user-left', username);
      
      // Send updated list of users
      const usersInRoom = Array.from(rooms.get(roomId).values());
      io.to(roomId).emit('room-users', usersInRoom);
    }
    
    // Leave the socket room
    socket.leave(roomId);
    console.log(`${username} left room: ${roomId}`);
  }
};
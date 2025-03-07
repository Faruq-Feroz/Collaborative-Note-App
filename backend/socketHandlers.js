// socketHandlers.js
const Note = require('./models/Note');

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Join a room
    socket.on('join-room', async ({ roomId, username }) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { username, id: socket.id });
      
      // Store username in socket
      socket.username = username;
      socket.roomId = roomId;
      
      // Get all users in the room
      const sockets = await io.in(roomId).fetchSockets();
      const users = sockets.map(s => ({ id: s.id, username: s.username }));
      
      // Send users list back to the client
      io.to(roomId).emit('users-in-room', users);
      
      // Get existing note for this room
      try {
        let note = await Note.findOne({ roomId });
        if (note) {
          socket.emit('load-note', note);
        } else {
          note = await Note.create({
            title: 'Untitled Note',
            content: 'Start typing here...',
            roomId
          });
          socket.emit('load-note', note);
        }
      } catch (error) {
        console.error('Error loading note:', error);
      }
    });
    
    // Handle note updates
    socket.on('update-note', async (data) => {
      try {
        const { roomId, title, content } = data;
        
        // Update in database
        await Note.findOneAndUpdate(
          { roomId },
          { title, content, lastUpdated: Date.now() },
          { upsert: true, new: true }
        );
        
        // Broadcast to other clients in the room
        socket.to(roomId).emit('note-updated', { title, content });
      } catch (error) {
        console.error('Error updating note:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      if (socket.roomId) {
        socket.to(socket.roomId).emit('user-left', { id: socket.id, username: socket.username });
      }
    });
  });
};

module.exports = socketHandlers;
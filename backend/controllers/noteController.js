const Note = require('../models/Note');

// Get all notes for a specific room
exports.getNotesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
   
    let notes = await Note.find({ roomId }).sort({ updatedAt: -1 });
   
    // If no note exists for this room, create a new one
    if (notes.length === 0) {
      const newNote = new Note({ roomId, content: '' });
      await newNote.save();
      notes = [newNote];
    }
   
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { roomId, content = '' } = req.body;
   
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }
   
    const note = new Note({ roomId, content });
    await note.save();
   
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Update a note by MongoDB ID - Modified to handle string IDs
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content } = req.body;
   
    if (!content && content !== '') {
      return res.status(400).json({ message: 'Content is required' });
    }
   
    // Changed from findById to findOne to avoid ObjectId conversion issues
    const note = await Note.findOne({ _id: noteId });
   
    if (!note) {
      // Fallback to finding by roomId if _id search fails
      const noteByRoom = await Note.findOne({ roomId: noteId }).sort({ updatedAt: -1 });
      
      if (!noteByRoom) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      noteByRoom.content = content;
      await noteByRoom.save();
      return res.status(200).json(noteByRoom);
    }
   
    note.content = content;
    await note.save();
   
    res.status(200).json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

// Update a note by room ID
exports.updateNoteByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
   
    if (!content && content !== '') {
      return res.status(400).json({ message: 'Content is required' });
    }
   
    // Find the newest note for this room
    let note = await Note.findOne({ roomId }).sort({ updatedAt: -1 });
   
    // If no note exists, create a new one
    if (!note) {
      note = new Note({ roomId, content });
    } else {
      note.content = content;
    }
   
    await note.save();
   
    res.status(200).json(note);
  } catch (error) {
    console.error('Error updating note by room:', error);
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};
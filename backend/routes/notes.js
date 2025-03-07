const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Get all notes for a specific room
router.get('/:roomId', noteController.getNotesByRoom);

// Create a new note
router.post('/', noteController.createNote);

// Update a note by ID (MongoDB _id)
router.put('/id/:noteId', noteController.updateNote);

// Update a note by room ID - this is the main route that should be used when updating by roomId
router.put('/room/:roomId', noteController.updateNoteByRoom);

// Add a fallback route to handle current frontend calls that use roomId in place of noteId
router.put('/:noteId', noteController.updateNote);

module.exports = router;
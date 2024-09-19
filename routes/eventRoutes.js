const express = require('express');
const { createEvent, getEvents,rsvpEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createEvent);
router.get('/', getEvents);
router.post('/:id/rsvp', authMiddleware, rsvpEvent);
router.put('/:id', authMiddleware, upload.single('image'), updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;

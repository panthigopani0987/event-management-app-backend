const Event = require('../models/eventModel');
const path = require('path');
const fs = require('fs');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, maxAttendees } = req.body;
        const image = req.file ? req.file.path.replace('\\', '/') : null;
        const event = new Event({ title, description, date, location, maxAttendees,attendees: [], image, creator: req.user.id });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// RSVP to Event
exports.rsvpEvent = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
  
      // Ensure attendees is initialized
      if (!event.attendees) {
        event.attendees = [];
      }
  
      if (event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
  
      // Check if user is already an attendee
      if (event.attendees.includes(userId)) {
        return res.status(400).json({ message: 'User already RSVPed' });
      }
  
      event.attendees.push(userId);
      await event.save();
      res.json({ message: 'RSVP successful' });
    } catch (err) {
        console.log(err);
        
      res.status(400).json({ error: err.message });
    }
  };
  

exports.updateEvent = async (req, res) => {
    try {
        const image = req.file ? req.file.path.replace('\\', '/') : null;
        const event = await Event.findByIdAndUpdate(req.params.id, { ...req.body, image }, { new: true });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event.image) {
            fs.unlinkSync(path.join(__dirname, '../', event.image));
        }
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

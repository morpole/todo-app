const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Create a new task
router.post('/', async (req, res) => {
    try {
        const task = new Task({
            description: req.body.description
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update part of  a task
router.patch('/:id', async (req, res) => {
    try {
        // Update only the specified fields
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

// routes.js
import express from 'express';
// import TextEntry from './model_textEntry';
const router = express.Router();
import mongoose from 'mongoose';
// Define schema for the task
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,  // trims any whitespace from the title
    },
    category: {
      type: String,
      enum: ['completed', 'inComplete', 'ToDo', 'Doing', 'overView', 'underReview'], // predefined categories
      default: 'inComplete', // default value
    },
    count: {
      type: Number,
      required: true,
      default: 0, // default value for count
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
  }
);

// Create and export the model based on the schema
const Task = mongoose.model('Task', taskSchema);

router.get('/', (req, res) => {
  res.send('Hello from the routes!');
});

// Create (POST) - Create a new text entry
router.post('/api/v1/card', async (req, res) => {
  try {
    const card = req.body;
    
    // Create a new entry and save it to the database
    const newEntry =await Task.create(card);
    // await newEntry.save();

    res.status(201).json({ message: 'Text entry created successfully', newEntry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create text entry', error: err.message });
  }
});

// Read (GET) - Get all tasks
router.get('/api/v1/card', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error: err.message });
  }
});

// Read (GET) - Get a specific task by ID
router.get('/api/v1/card/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve task', error: err.message });
  }
});

// Update (PUT) - Update a task by ID
router.put('/api/v1/card/:id', async (req, res) => {
  try {
    const { title, category, count } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, category, count },
      { new: true }  // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', updatedTask });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// Delete (DELETE) - Delete a task by ID
router.delete('/api/v1/card/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

export default router;

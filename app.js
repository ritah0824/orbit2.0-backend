const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

mongoose.set('strictQuery', false);

// Use environment variable for MongoDB - Railway will provide this
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/time_db';

console.log('🚀 Starting Orbit Pomodoro API...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected successfully');
}).catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

const taskSchema = new mongoose.Schema({
    name: String,
    num: Number,
    finish: Number
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: '🪐 Orbit Pomodoro API is running!', 
        timestamp: new Date()
    });
});

app.get('/getTasks', async (req, res) => {
    try {
        let tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/addTask', async (req, res) => {
    try {
        const task = new Task({
            name: req.query.name,
            num: parseInt(req.query.num) || 1,
            finish: 0
        });
        await task.save();
        let tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/updateTask', async (req, res) => {
    try {
        const task = await Task.findById(req.query.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        task.finish = parseInt(req.query.finish);
        await task.save();
        let tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/deleteTask', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.query.id);
        let tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/deleteAll', async (req, res) => {
    try {
        await Task.deleteMany({});
        let tasks = await Task.find();
        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error deleting all tasks:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Listen on all interfaces for Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

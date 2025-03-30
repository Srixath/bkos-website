const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// File to store subscriptions
const SUBSCRIBERS_FILE = 'subscribers.json';

// Ensure subscribers file exists
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]));
}

// Get all subscribers
app.get('/api/subscribers', (req, res) => {
    try {
        const subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE));
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read subscribers' });
    }
});

// Add new subscriber
app.post('/api/subscribe', (req, res) => {
    try {
        const { email } = req.body;
        const subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE));
        
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
            res.json({ success: true, message: 'Subscribed successfully' });
        } else {
            res.json({ success: true, message: 'Already subscribed' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add subscriber' });
    }
});

// Remove subscriber
app.delete('/api/subscribers/:email', (req, res) => {
    try {
        const { email } = req.params;
        const subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE));
        const updatedSubscribers = subscribers.filter(sub => sub !== email);
        
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(updatedSubscribers, null, 2));
        res.json({ success: true, message: 'Subscriber removed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove subscriber' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 
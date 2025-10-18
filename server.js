// Budget API using MongoDB + Mongoose

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/', express.static('public'));

// --- 1️⃣ Connect to MongoDB ---
mongoose.connect('mongodb://localhost:27017/personal_budget', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// --- 2️⃣ Define Schema + Model ---
const budgetSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Title is required"], 
        trim: true, 
        unique: true 
    },
    value: { 
        type: Number, 
        required: [true, "Value is required"], 
        min: [1, "Value must be positive"] 
    },
    color: { 
        type: String, 
        required: [true, "Color is required"], 
        match: [/^#[0-9A-Fa-f]{6}$/, "Color must be a valid 6-digit hex code"] 
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

// --- 3️⃣ GET endpoint (fetch data for charts) ---
app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find({});
        res.json({ myBudget: budgetData });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// --- 4️⃣ POST endpoint (add new data with validation + error handling) ---
app.post('/budget', async (req, res) => {
    try {
        const { title, value, color } = req.body;

        // Basic pre-validation
        if (!title || !value || !color) {
            return res.status(400).json({ error: "All fields (title, value, color) are required" });
        }
        if (isNaN(value) || value <= 0) {
            return res.status(400).json({ error: "Value must be a positive number" });
        }
        if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
            return res.status(400).json({ error: "Color must be a valid 6-digit hex code (e.g. #FF5733)" });
        }

        const newBudget = new Budget({ title, value, color });
        await newBudget.save();
        res.status(201).json({ message: '✅ New budget item added', data: newBudget });

    } catch (err) {
        // Duplicate title error
        if (err.code === 11000) {
            return res.status(409).json({ error: "A budget item with this title already exists" });
        }

        // Mongoose validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ error: "Validation failed", details: errors });
        }

        res.status(500).json({ error: "Unexpected server error", details: err.message });
    }
});

// --- 5️⃣ Start server ---
app.listen(port, () => {
    console.log(`✅ API served at http://localhost:${port}`);
});

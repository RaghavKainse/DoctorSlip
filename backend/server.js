const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Test = require('./models/Test');
const Slip = require('./models/Slip');
const Report = require('./models/Report');

const app = express();

const origin = process.env.NODE_ENV === 'production' 
  ? 'https://doctorslip-frontend-7igmpp2ak-raghavkainses-projects.vercel.app' 
  : '*';

app.use(cors({
  origin: origin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Root route for health check
app.get('/', (req, res) => {
  res.send('Sai Diagnostic API is running...');
});


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic-slip';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Seed default tests if empty
async function seedDatabase() {
  try {
    const count = await Test.countDocuments();
    if (count === 0) {
      const defaultTests = [
        { name: 'Clinical Biochemistry', price: 500, category: 'Biochemistry' },
        { name: 'Haematology', price: 300, category: 'General' },
        { name: 'Microbiology', price: 450, category: 'Microbiology' },
        { name: 'Lipid Profile', price: 600, category: 'Profiles' },
        { name: 'Liver Profile', price: 700, category: 'Profiles' },
        { name: 'Kidney Profile', price: 650, category: 'Profiles' },
        { name: 'Elisa for IH FSH Prolactin', price: 1200, category: 'Specialized' },
        { name: 'Thyroid', price: 400, category: 'General' },
        { name: 'Aids', price: 500, category: 'General' },
        { name: 'Hepatitis', price: 600, category: 'Genreal' },
        { name: 'Complete Blood Count (CBC)', price: 300, category: 'General' },
        { name: 'Fasting Blood Sugar (FBS)', price: 100, category: 'General' },
      ];
      await Test.insertMany(defaultTests);
      console.log('Database seeded with default tests.');
    }
  } catch (error) {
    console.error('Seed error:', error);
  }
}

// Routes
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await Test.find().sort({ name: 1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tests', async (req, res) => {
  try {
    const test = new Test(req.body);
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/tests/:id', async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/slips', async (req, res) => {
  try {
    const slip = new Slip(req.body);
    await slip.save();
    res.status(201).json(slip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/slips', async (req, res) => {
  try {
    const slips = await Slip.find().sort({ createdAt: -1 });
    res.json(slips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/slips/:id', async (req, res) => {
  try {
    const slip = await Slip.findById(req.params.id);
    if (!slip) return res.status(404).json({ error: 'Slip not found' });
    res.json(slip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tests/:id', async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTest) return res.status(404).json({ error: 'Test not found' });
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tests/:id/parameters', async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      { $push: { parameters: req.body } },
      { new: true }
    );
    if (!updatedTest) return res.status(404).json({ error: 'Test not found' });
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/slips/:id', async (req, res) => {
  try {
    await Slip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

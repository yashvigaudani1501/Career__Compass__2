const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const companyRoutes = require('./routes/companyRoutes'); 
const userRoutes = require('./routes/userRoutes'); // NEW: Imported User Routes

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/company', companyRoutes); 
app.use('/api/user', userRoutes); // NEW: Connected User Routes (Fixes Cannot POST)

app.get('/', (req, res) => {
    res.send('ATS Tracker API is running...');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
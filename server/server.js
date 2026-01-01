const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const goalRoutes = require('./routes/goal.routes');
const decisionRoutes = require('./routes/decision.routes');
const projectRoutes = require('./routes/project.routes');
const scenarioRoutes = require('./routes/scenario.routes');
const contactRoutes = require('./routes/contact.routes');
const auditLogRoutes = require('./routes/audit.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/audit', auditLogRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Personal Strategic OS API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

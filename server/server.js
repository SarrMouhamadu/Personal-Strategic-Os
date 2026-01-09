const express = require('express');
const cors = require('cors');
const path = require('path');
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
const analyticsRoutes = require('./routes/analytics.routes');
const knowledgeRoutes = require('./routes/knowledge.routes');
const opportunityRoutes = require('./routes/opportunity.routes');
const financeRoutes = require('./routes/finance.routes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const errorHandler = require('./middleware/error.middleware');
const sequelize = require('./config/db.config');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database with Retry Logic
const initDb = async (retries = 5) => {
    while (retries > 0) {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            await db.sequelize.sync({ alter: true });
            console.log('Database synchronized');
            return;
        } catch (err) {
            console.error(`Unable to connect to the database (Retries left: ${retries - 1}):`, err.message);
            retries -= 1;
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    console.error('CRITICAL: Could not connect to database after multiple attempts. Exiting...');
    process.exit(1);
};

initDb();

// Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Rate limiting - DISABLED in development to avoid blocking during testing
// In production, uncomment and configure appropriately
/*
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);
*/
console.log('[Server] Rate limiting DISABLED for development');

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/finance', financeRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Personal Strategic OS API is running' });
});

// Error Handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

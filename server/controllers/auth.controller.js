const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../models');
const User = db.users;

// Validation Schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const { email, password, firstName, lastName } = req.body;
        const name = `${firstName} ${lastName}`;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log(`[Auth Register] User already exists: ${email}`);
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = crypto.randomUUID();
        console.log(`[Auth Register] Creating user: ${userId}`);
        const newUser = await User.create({
            id: userId,
            email,
            password: hashedPassword,
            name,
            role: 'PRIVATE'
        });

        // Auto-create Profile for the user
        console.log(`[Auth Register] Creating profile for: ${userId}`);
        await db.profiles.create({
            id: crypto.randomUUID(),
            userId: userId,
            fullName: name,
            tagline: '',
            bio: '',
            roles: [],
            skills: []
        });

        console.log(`[Auth Register] Success: ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(`[Auth Register] Error: ${error.message}`, error);
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const { email, password } = req.body;
        console.log(`[Auth] Login attempt for: ${email}`);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`[Auth] User not found: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[Auth] Password mismatch for: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(`[Auth] Password verified for: ${email}`);

        // Generate JWT
        if (!process.env.JWT_SECRET) {
            console.error('[Critical] JWT_SECRET is not defined!');
            throw new Error('Server configuration error');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`[Auth] Token generated for: ${email}`);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

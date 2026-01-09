const db = require('../models');
const Expense = db.expenses;
const crypto = require('crypto');
const Joi = require('joi');
const { Op } = require('sequelize');

exports.createExpense = async (req, res, next) => {
    try {
        const schema = Joi.object({
            description: Joi.string().required(),
            amount: Joi.number().required(),
            category: Joi.string().valid('FIXED', 'VARIABLE', 'EXCEPTIONAL'),
            frequency: Joi.string().valid('MONTHLY', 'QUARTERLY', 'ANNUAL', 'PUNCTUAL'),
            isPlanned: Joi.boolean(),
            date: Joi.date(),
            receiptUrl: Joi.string().allow('')
        });

        const { error, value } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const expense = await Expense.create({
            ...value,
            id: crypto.randomUUID(),
            userId: req.user.id
        });

        res.status(201).json(expense);
    } catch (error) {
        next(error);
    }
};

exports.getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json(expenses);
    } catch (error) {
        next(error);
    }
};

exports.getStrategicSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const expenses = await Expense.findAll({ where: { userId } });

        // Totals
        const totalReal = expenses.filter(e => !e.isPlanned).reduce((acc, e) => acc + parseFloat(e.amount), 0);
        const totalPlanned = expenses.filter(e => e.isPlanned).reduce((acc, e) => acc + parseFloat(e.amount), 0);

        // Category breakdown (Real only)
        const categories = expenses.filter(e => !e.isPlanned).reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
            return acc;
        }, {});

        // Monthly trends (Last 6 months)
        const months = {};
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            months[key] = { total: 0, planned: 0 };
        }

        expenses.forEach(e => {
            const d = new Date(e.date);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            if (months[key]) {
                if (e.isPlanned) months[key].planned += parseFloat(e.amount);
                else months[key].total += parseFloat(e.amount);
            }
        });

        // Optimization suggestions
        const optimization = [];
        if (categories['EXCEPTIONAL'] > (totalReal * 0.2)) {
            optimization.push("Les dépenses exceptionnelles dépassent 20% du budget. Envisagez de les lisser ou de les anticiper.");
        }
        if (categories['VARIABLE'] > categories['FIXED']) {
            optimization.push("Vos dépenses variables sont plus élevées que vos charges fixes. Il y a une opportunité de réduction sur les extras.");
        }

        res.json({
            totals: { real: totalReal, planned: totalPlanned, variance: totalPlanned - totalReal },
            categories,
            trends: Object.entries(months).reverse().map(([month, data]) => ({ month, ...data })),
            optimization
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const result = await Expense.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (result) res.json({ message: "Expense deleted" });
        else res.status(404).json({ message: "Not found" });
    } catch (error) {
        next(error);
    }
};

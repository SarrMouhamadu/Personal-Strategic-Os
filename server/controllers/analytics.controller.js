const db = require('../models');
const Project = db.projects;
const Goal = db.goals;
const Decision = db.decisions;

exports.getAnnualSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const currentYear = new Date().getFullYear();

        // Fetch all relevant data for the user in parallel
        const [projects, goals, decisions] = await Promise.all([
            Project.findAll({ where: { userId } }),
            Goal.findAll({ where: { userId, year: currentYear } }),
            Decision.findAll({ where: { userId } })
        ]);

        // Aggregate Impact from Projects
        const impactScores = {
            PERSONAL: { total: 0, count: 0 },
            SOCIAL: { total: 0, count: 0 },
            ENVIRONMENTAL: { total: 0, count: 0 },
            NETWORK: { total: 0, count: 0 }
        };

        projects.forEach(p => {
            if (p.impact && Array.isArray(p.impact)) {
                p.impact.forEach(imp => {
                    if (impactScores[imp.dimension]) {
                        impactScores[imp.dimension].total += imp.score;
                        impactScores[imp.dimension].count += 1;
                    }
                });
            }
        });

        const averageImpact = {};
        Object.keys(impactScores).forEach(dim => {
            averageImpact[dim] = impactScores[dim].count > 0
                ? (impactScores[dim].total / impactScores[dim].count).toFixed(1)
                : 0;
        });

        // Project Status Distribution
        const statusDistribution = projects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});

        // Goal Statistics
        const completedGoals = goals.filter(g => g.status === 'COMPLETED').length;
        const completionRate = goals.length > 0 
            ? ((completedGoals / goals.length) * 100).toFixed(0) 
            : 0;

        res.json({
            year: currentYear.toString(),
            projects: {
                total: projects.length,
                activeCount: projects.filter(p => p.status !== 'ARCHIVED' && p.status !== 'DEPLOYED').length,
                statusDistribution
            },
            impact: averageImpact,
            goals: {
                total: goals.length,
                completed: completedGoals,
                completionRate: completionRate
            },
            decisions: {
                totalCount: decisions.length,
                latest: decisions.slice(-3).reverse() // Most recent first
            }
        });

    } catch (error) {
        next(error);
    }
};

const dbService = require('../services/db.service');

exports.getAnnualSummary = (req, res) => {
    try {
        const userId = req.user.id;
        const currentYear = new Date().getFullYear().toString();

        const projects = dbService.read('projects.json').filter(p => p.userId === userId);
        const goals = dbService.read('goals.json').filter(g => g.userId === userId && g.year === currentYear);
        const decisions = dbService.read('decisions.json').filter(d => d.userId === userId && d.date.startsWith(currentYear));

        // Aggregate Impact
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

        res.json({
            year: currentYear,
            projects: {
                total: projects.length,
                activeCount: projects.filter(p => p.status !== 'ARCHIVED' && p.status !== 'COMPLETED').length,
                statusDistribution
            },
            impact: averageImpact,
            goals: {
                total: goals.length,
                completed: goals.filter(g => g.completed).length,
                completionRate: goals.length > 0 ? (goals.filter(g => g.completed).length / goals.length * 100).toFixed(0) : 0
            },
            decisions: {
                totalCount: decisions.length,
                latest: decisions.slice(-3)
            }
        });

    } catch (error) {
        next(error);
    }
};

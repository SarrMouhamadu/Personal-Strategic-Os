module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("projects", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        tagline: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        accessLevel: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        logoUrl: {
            type: Sequelize.STRING
        },
        techStack: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        roadmap: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        documents: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        swot: {
            type: Sequelize.JSON
        },
        kpis: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        impact: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        compliance: {
            type: Sequelize.JSON
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Project;
};

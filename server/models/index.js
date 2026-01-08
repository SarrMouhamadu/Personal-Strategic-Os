const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require("./user.model.js")(sequelize, Sequelize);
db.projects = require("./project.model.js")(sequelize, Sequelize);
db.goals = require("./goal.model.js")(sequelize, Sequelize);
db.decisions = require("./decision.model.js")(sequelize, Sequelize);
db.contacts = require("./contact.model.js")(sequelize, Sequelize);
db.scenarios = require("./scenario.model.js")(sequelize, Sequelize);
db.knowledge = require("./knowledge.model.js")(sequelize, Sequelize);
db.opportunities = require("./opportunity.model.js")(sequelize, Sequelize);
db.profiles = require("./profile.model.js")(sequelize, Sequelize);
db.audits = require("./audit.model.js")(sequelize, Sequelize);

// Relationships
db.users.hasMany(db.projects, { as: "projects" });
db.projects.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.users.hasMany(db.goals, { as: "goals" });
db.goals.belongsTo(db.users, { foreignKey: "userId", as: "user" });

db.users.hasMany(db.contacts, { as: "contacts" });
db.contacts.belongsTo(db.users, { foreignKey: "userId", as: "user" });

db.users.hasOne(db.profiles, { as: "profile" });
db.profiles.belongsTo(db.users, { foreignKey: "userId", as: "user" });

module.exports = db;

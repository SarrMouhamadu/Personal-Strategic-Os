const fs = require('fs');
const path = require('path');

const scenariosFilePath = path.join(__dirname, '../data/scenarios.json');

const getScenariosData = () => {
    try {
        const data = fs.readFileSync(scenariosFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveScenariosData = (scenarios) => {
    fs.writeFileSync(scenariosFilePath, JSON.stringify(scenarios, null, 2));
};

exports.getScenariosByProject = (req, res) => {
    try {
        const { projectId } = req.params;
        const scenarios = getScenariosData();
        const projectScenarios = scenarios.filter(s => s.projectId === projectId);
        res.json(projectScenarios);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving scenarios', error: error.message });
    }
};

exports.createScenario = (req, res) => {
    try {
        const userId = req.user.id;
        const scenarioData = req.body;
        const scenarios = getScenariosData();

        const newScenario = {
            ...scenarioData,
            id: Date.now().toString(),
            userId,
            createdAt: new Date().toISOString()
        };

        scenarios.push(newScenario);
        saveScenariosData(scenarios);
        res.status(201).json(newScenario);
    } catch (error) {
        res.status(500).json({ message: 'Error creating scenario', error: error.message });
    }
};

exports.deleteScenario = (req, res) => {
    try {
        const { id } = req.params;
        const scenarios = getScenariosData();
        const filtered = scenarios.filter(s => s.id !== id);

        if (scenarios.length === filtered.length) {
            return res.status(404).json({ message: 'Scenario not found' });
        }

        saveScenariosData(filtered);
        res.json({ message: 'Scenario deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting scenario', error: error.message });
    }
};

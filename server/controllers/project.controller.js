const fs = require('fs');
const path = require('path');

const projectsFilePath = path.join(__dirname, '../data/projects.json');

const getProjectsData = () => {
    try {
        const data = fs.readFileSync(projectsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveProjectsData = (projects) => {
    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2));
};

exports.getProjects = (req, res) => {
    try {
        const userId = req.user.id;
        const projects = getProjectsData();
        const userProjects = projects.filter(p => p.userId === userId || p.accessLevel === 'PUBLIC');
        res.json(userProjects);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving projects', error: error.message });
    }
};

exports.getProjectById = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const projects = getProjectsData();
        const project = projects.find(p => p.id === id && (p.userId === userId || p.accessLevel === 'PUBLIC'));

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving project', error: error.message });
    }
};

exports.createProject = (req, res) => {
    try {
        const userId = req.user.id;
        const projectData = req.body;
        const projects = getProjectsData();

        const newProject = {
            ...projectData,
            id: Date.now().toString(),
            userId,
            createdAt: new Date().toISOString()
        };

        projects.push(newProject);
        saveProjectsData(projects);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

exports.updateProject = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const projectData = req.body;
        const projects = getProjectsData();

        const index = projects.findIndex(p => p.id === id && p.userId === userId);
        if (index === -1) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if SWOT or KPIs are being updated for a more specific audit later if needed
        // (The audit middleware currently uses a fixed string, but we can log details here)

        projects[index] = { ...projects[index], ...projectData };
        saveProjectsData(projects);
        res.json(projects[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

exports.archiveProject = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const projects = getProjectsData();

        const index = projects.findIndex(p => p.id === id && p.userId === userId);
        if (index === -1) {
            return res.status(404).json({ message: 'Project not found' });
        }

        projects[index].status = 'ARCHIVED';
        saveProjectsData(projects);
        res.json({ message: 'Project archived', project: projects[index] });
    } catch (error) {
        res.status(500).json({ message: 'Error archiving project', error: error.message });
    }
};

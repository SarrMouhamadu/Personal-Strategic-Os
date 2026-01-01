const fs = require('fs');
const path = require('path');

/**
 * DbService
 * Centralized service for JSON file operations.
 * Provides optimized read/write patterns and consistency.
 */
class DbService {
    constructor() {
        this.basePath = path.join(__dirname, '../data');
    }

    /**
     * Reads a JSON file and returns the parsed object.
     * @param {string} fileName - The name of the data file (e.g., 'projects.json').
     * @returns {Array|Object} The parsed data or an empty array if not found/error.
     */
    read(fileName) {
        try {
            const filePath = path.join(this.basePath, fileName);
            if (!fs.existsSync(filePath)) {
                return [];
            }
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`[DbService] Error reading ${fileName}:`, error.message);
            return [];
        }
    }

    /**
     * Writes an object to a JSON file.
     * @param {string} fileName - The name of the data file.
     * @param {Array|Object} data - The data to store.
     */
    write(fileName, data) {
        try {
            const filePath = path.join(this.basePath, fileName);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`[DbService] Error writing to ${fileName}:`, error.message);
            throw new Error(`Critical data persistence error: ${fileName}`);
        }
    }
}

module.exports = new DbService();

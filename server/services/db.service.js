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
        // Ensure data directory exists
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
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
                console.log(`[DbService] File ${fileName} not found, creating empty array`);
                // Auto-create empty file
                fs.writeFileSync(filePath, JSON.stringify([], null, 2));
                return [];
            }
            const data = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(data);
            console.log(`[DbService] Successfully read ${fileName}, items: ${Array.isArray(parsed) ? parsed.length : 'N/A'}`);
            return parsed;
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
            console.log(`[DbService] Successfully wrote to ${fileName}, items: ${Array.isArray(data) ? data.length : 'N/A'}`);
        } catch (error) {
            console.error(`[DbService] Error writing to ${fileName}:`, error.message);
            throw new Error(`Critical data persistence error: ${fileName}`);
        }
    }
}

module.exports = new DbService();

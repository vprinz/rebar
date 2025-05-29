import fs from 'node:fs';
import glob from 'fast-glob';
import { sanitizePath } from './shared.js';

const PLUGIN_FOLDER = 'src/core/plugins';

/**
 * Read all files in a given directory
 *
 * @export
 * @param {string} filePath
 * @return {string[]}
 */
export function getFiles(filePath) {
    if (!filePath) {
        throw new Error(`File path does not exist: ${filePath}`);
    }

    filePath = sanitizePath(filePath);
    return fs.readdirSync(filePath);
}

/**
 * Read all files / folders based on a path and return paths.
 *
 * @export
 * @param {string} path
 * @param {GlobOptionsWithFileTypesFalse} options
 * @return {string[]}
 */
export function globSync(path, options = {}) {
    path = sanitizePath(path);

    return glob.sync(path, { ...options }).map((filePath) => {
        return sanitizePath(filePath);
    });
}

/**
 * Read all files / folders based on a path and return paths async
 *
 * @export
 * @param {string} path
 * @param {GlobOptionsWithFileTypesFalse} options
 * @return {Promise<string[]>}
 */
export async function globAsync(path, options = {}) {
    path = sanitizePath(path);

    const results = await glob.glob(path, { ...options });
    return results.map((filePath) => {
        return sanitizePath(filePath);
    });
}

/**
 * Returns all plugin folders
 *
 * @export
 * @return {string[]}
 */
export function getAllPluginFolders() {
    return fs.readdirSync(PLUGIN_FOLDER);
}

/**
 * Return the plugin folder
 *
 * @export
 * @return {string}
 */
export function getPluginFolder() {
    return PLUGIN_FOLDER;
}

/**
 * Safely write a file even if the directory does not exist
 *
 * @export
 * @param {string} filePath
 * @param {string} data
 */
export function writeFile(filePath, data) {
    filePath = sanitizePath(filePath);
    const splitPath = filePath.split('/');
    splitPath.pop();

    const directory = splitPath.join('/');
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true, maxRetries: 999 });
    }

    fs.writeFileSync(filePath, data);
}

/**
 * Copy a file or directory recursively
 *
 * @export
 * @param {string} path
 * @param {string} destination
 */
export function copySync(path, destination) {
    path = sanitizePath(path);
    destination = sanitizePath(destination);

    if (path.includes('.')) {
        const splitPath = path.split('/');
        splitPath.pop();

        const directory = splitPath.join('/');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    fs.cpSync(path, destination, { force: true, recursive: true });
}

/**
 * Copy a file or directory asynchronously
 *
 * @export
 * @param {string} path
 * @param {string} destination
 * @returns {Promise<void>}
 */
export async function copyAsync(path, destination) {
    path = sanitizePath(path);
    destination = sanitizePath(destination);

    if (path.includes('.')) {
        const splitPath = path.split('/');
        splitPath.pop();

        const directory = splitPath.join('/');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    await fs.promises.cp(path, destination, { force: true, recursive: true });
}

import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

export const downloadAndHashFile = async (fileUrl) => {
    try {
        // Define local file path
        const localFilePath = path.join('/tmp', path.basename(fileUrl));

        // Download the file
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        const fileBuffer = await response.buffer();
        fs.writeFileSync(localFilePath, fileBuffer);

        // Create SHA-256 hash
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Clean up local file
        fs.unlinkSync(localFilePath);

        return hash;
    } catch (error) {
        console.error('Error downloading or hashing file:', error);
        throw error;
    }
};

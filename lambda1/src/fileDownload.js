import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

export const downloadAndHashFile = async (fileUrl) => {
    try {
       
        const localFilePath = path.join('/tmp', path.basename(fileUrl));

        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        const fileBuffer = await response.buffer();
        fs.writeFileSync(localFilePath, fileBuffer);

        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        fs.unlinkSync(localFilePath);

        return hash;
    } catch (error) {
        console.error('Error downloading or hashing file:', error);
        throw error;
    }
};

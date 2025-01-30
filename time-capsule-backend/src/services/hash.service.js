import crypto from 'crypto';
import fs from 'fs';

const generateFileHash = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    return hash;
};

export {generateFileHash, }

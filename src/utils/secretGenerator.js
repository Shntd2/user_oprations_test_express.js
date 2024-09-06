import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secret = crypto.randomBytes(32).toString('hex');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
    fs.appendFileSync(envPath, `\nJWT_SECRET=${secret}\n`);
} else {
    fs.writeFileSync(envPath, `JWT_SECRET =${secret}\n`);
}

console.log('JWT_SECRET has been generated and saved to .env file');

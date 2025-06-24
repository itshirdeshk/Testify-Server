#!/usr/bin/env node

// Post-install script to fix pdf-parse debug mode issue
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfParseIndexPath = path.join(__dirname, '..', 'node_modules', 'pdf-parse', 'index.js');

if (fs.existsSync(pdfParseIndexPath)) {
    let content = fs.readFileSync(pdfParseIndexPath, 'utf8');
    
    // Replace the debug mode line
    const originalLine = 'let isDebugMode = !module.parent;';
    const fixedLine = 'let isDebugMode = false; // Disabled debug mode to prevent auto-testing';
    
    if (content.includes(originalLine)) {
        content = content.replace(originalLine, fixedLine);
        fs.writeFileSync(pdfParseIndexPath, content);
        console.log('✅ pdf-parse debug mode disabled for production');
    } else {
        console.log('ℹ️  pdf-parse already patched or different version');
    }
} else {
    console.log('⚠️  pdf-parse not found - skipping patch');
}

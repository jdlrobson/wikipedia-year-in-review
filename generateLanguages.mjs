import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const TRANSLATIONS_DIRECTORY = `${__dirname}/i18n`;
const DESTINATION_FILE = `${__dirname}/src/LANGUAGES.json`
const files  = fs.readdirSync( TRANSLATIONS_DIRECTORY );
const supported = [];

files.forEach( ( file ) => {
    console.log ( file );
    if ( file !== 'qqq.json' ) {
        supported.push( file.split('.')[0] );
    }
});

fs.writeFileSync( DESTINATION_FILE, JSON.stringify( supported ) );

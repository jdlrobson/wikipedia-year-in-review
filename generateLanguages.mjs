import fs from 'fs';
import path from 'path';
import langConversions from './langConversions.json' assert { type: "json" };
import { fileURLToPath } from 'url';
import lang from './i18n/he.json' assert { type: "json" };
import en from './i18n/en.json' assert { type: "json" };
import qqq from './i18n/qqq.json' assert { type: "json" };

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

fs.writeFileSync( DESTINATION_FILE, JSON.stringify( supported.sort() ) );

/*
   # extra $2 param in num-articles
    */
Object.keys( langConversions ).forEach( ( newFinalKey ) => {
    const msg = langConversions[newFinalKey];
    const newMsg = msg.replace(/«([^«])*»/g, function ( match ) {
        const key = match.replace(/[«»]/g, '' );
        if ( [ '«num-articles»', '«edited-most-day-edit-total»' ].indexOf(
            match
        ) > -1 ) {
            return ( lang[key] || en[key] ).replace( '$1', '$2' );
        } else {
           return ( lang[key] || en[key] );
        }
    } );
    console.log( `"${newFinalKey}": "${newMsg}",` );
} );
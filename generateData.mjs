import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yir from './src/yir.js';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const ROOT = `${__dirname}/src/assets/data/shortcut`;

global.fetch = fetch;
global.localStorage = { setItem: () => {} };


/**
 * @param {number} year 
 * @param {string} project 
 */
function generateSummaryForProjectAndYear( year, project ) {
}


const currentYear = (new Date()).getFullYear();

/**
 * @param {number} year 
 * @param {string} project 
 */
function generateForProjectAndYear( year, project ) {
    const BASE_DIR = `${ROOT}/${year}/${project}`;
    const index = fs.readFileSync(  `${BASE_DIR}/index.json` );
    const usernames = JSON.parse( index );
    usernames.forEach( ( /** @type string */ username ) => {
        console.log( year, currentYear);
        if ( currentYear === year ) {
            const userPath = `${BASE_DIR}/${ encodeURIComponent( username.replace(/ /g, '_') ) }.json`;
            const localResults = fs.existsSync( userPath ) ?
                JSON.parse( fs.readFileSync( userPath ).toString() ) : [];
            // To avoid JavaScript heap out of memory bug, limit to only the first 1000 edits of the year
            if ( localResults.length < 1000 ) {
                // Expand the data we have on this user.
                yir.resumeContributionsFetch( username, year, project, localResults, 5 )
                    .then( ( contribs ) => {
                        // delete unused fields
                        contribs.forEach( ( contribution ) => {
                            delete contribution.user;
                            delete contribution.userid;
                        } );
                        fs.writeFileSync( userPath, JSON.stringify( contribs ) );
                    })
                }
        } else {
            const userPath = `${BASE_DIR}/${ encodeURIComponent( username.replace(/ /g, '_') ) }.summary.json`;
            if ( !fs.existsSync( userPath ) ) {
                yir( username, year, project ).then( ( result ) => {
                    fs.writeFileSync( userPath, JSON.stringify( result ) );
                } );
            }
        }
    } );
}

/**
 * @param {number} year 
 */
function generateYear( year ) {
    const files = fs.readdirSync( `${ROOT}/${year}` );
    files.forEach( ( file, index) => {
        const stats = fs.statSync( `${ROOT}/${year}/${file}` );
        if ( stats.isDirectory() ) {
            generateForProjectAndYear( year, file );
        }
    });
}

const files  = fs.readdirSync( ROOT );
files.forEach( ( file ) => {
    const stats = fs.statSync( `${ROOT}/${file}` );
    if ( stats.isDirectory() ) {
        generateYear( parseInt( file, 10 ) );
    }
});
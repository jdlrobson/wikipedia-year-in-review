// @ts-ignore
import en from '../i18n/en.json';

let langCode = 'en';
let messages = Object.assign( {}, en );

/**
 * @param {string} key 
 * @param  {...any} args 
 * @returns 
 */
function message( key, ...args ) {
    let val = messages[ key ];
    if ( val === undefined ) {
        val = en[ key ] || `«${key}»`;
    }
    if ( val.indexOf('$') > -1 ) {
        args.forEach( ( replacement, i ) => {
            val = val.replace( new RegExp( '\\$' + ( i + 1 ), 'g' ), replacement );
        } )
    }
    return val;
}

function getLanguage() {
    return langCode;
}

/**
 * @param {number} num
 * @return {string}
 */
function convertNumber( num ) {
    const formatter = new Intl.NumberFormat( getLanguage(), {
		style: 'decimal',
        // @ts-ignore
        notation: num > 1000 ? 'compact' : 'standard',
        compactDisplay: 'short',
		minimumFractionDigits: 0,
		maximumFractionDigits: 1
	} );
    return formatter.format( num );
}

/**
 * 
 * @param {string} languageCode
 * @return {Promise<boolean>}
 */
function setLanguage( languageCode ) {
    langCode = languageCode;
    return new Promise( ( resolve ) => {
        fetch( `/i18n/${languageCode}.json` )
        .then( ( r ) => r.json(), () => resolve( true ) )
        .then( ( json ) => {
            messages = Object.assign( {}, json );
            resolve( true );
        }, () => {
            // if the language code has a dash try without.
            if ( languageCode.indexOf( '-' ) > -1 ) {
                setLanguage( languageCode.split( '-' )[ 0 ] )
                    .then( () => resolve( true ) );
            }
            messages = {};
            resolve( true );
        } )
    } )
}

/**
 * @param {Document} doc
 */
const cleanHTML = ( doc ) => {
    let scripts = doc.querySelectorAll('script');
    for (let script of scripts) {
        script.remove();
    }
    // remove all attributes except href.
    Array.from( doc.querySelectorAll('*') )
        .filter((node)=>node.attributes.length)
        .forEach( ( node )=> {
            Array.from( node.attributes )
                .filter( ( attr ) => [ 'href' ].indexOf( attr.name ) === -1 )
                .forEach( (attr) => node.removeAttribute( attr.name ) )
        } );
};

/**
 * @param {string} html
 * @return {string}
 */
function sanitize( html ) {
    let parser = new DOMParser();
    let doc = parser.parseFromString( html, 'text/html');
    cleanHTML( doc );
    return doc.body.innerHTML;
}

/**
 * @param {string} key
 * @return {boolean}
 */
function exists( key ) {
    return messages[key] !== undefined;
}

export default {
    exists,
    sanitize,
    convertNumber,
    setLanguage,
    message
};

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
    const qqx = `«${key}»`;
    if ( langCode === 'qqx' ) {
        return qqx;
    }
    if ( val === undefined ) {
        val = en[ key ] || qqx;
    }
    if ( val.indexOf('$') > -1 && langCode !== 'qqx' ) {
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
    /** @type Intl.NumberFormatOptions */
    const formatterOptions = {
		style: 'decimal',
        // @ts-ignore
        notation: num > 1000 ? 'compact' : 'standard',
        compactDisplay: 'short',
		minimumFractionDigits: 0,
		maximumFractionDigits: 1
	};
    let formatter;
    try {
        formatter = new Intl.NumberFormat( getLanguage(), formatterOptions );
    } catch ( e ) {
        formatter = new Intl.NumberFormat( 'en', formatterOptions );
    }
    return formatter.format( num );
}

/**
 * @return {boolean}
 */
function isRTL() {
    return [
        'aeb_arab',
        'arc',
        'ar',
        'arz',
        'azb',
        'bcc',
        'bgn',
        'bqi',
        'ckb',
        'dv',
        'fa',
        'glk',
        'he',
        'khw',
        'kk_cn',
        'kk_arab',
        'ks_arab',
        'ku_arab',
        'lki',
        'lrc',
        'luz',
        'mzn',
        'pnb',
        'ps',
        'sd',
        'sdh',
        'skr_arab',
        'ug_arab',
        'ur',
        'yi'
    ].indexOf( langCode ) > -1
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
    isRTL,
    exists,
    sanitize,
    convertNumber,
    getLanguage,
    setLanguage,
    message
};

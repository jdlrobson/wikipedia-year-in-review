import en from '../i18n/en.json';

let langCode = 'en';
let messages = Object.assign( {}, en );
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

function impactMessage( key, ...args ) {
    args[ 0 ] = `<strong>${args[ 0 ]}</strong>`;
    return message( key, ...args );
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
        notation: num > 1000 ? 'compact' : 'standard',
        compactDisplay: 'short',
		minimumFractionDigits: 0,
		maximumFractionDigits: 1
	} );
    return formatter.format( num );
}

function setLanguage( languageCode ) {
    langCode = languageCode;
    return new Promise( ( resolve ) => {
        fetch( `/i18n/${languageCode}.json` )
        .then( ( r ) => r.json(), () => resolve( {} ) )
        .then( ( json ) => {
            messages = Object.assign( {}, json );
            resolve( true );
        }, () => {
            messages = {};
            resolve( true );
        } )
    } )
}

export default {
    convertNumber,
    setLanguage,
    message,
    impactMessage
};

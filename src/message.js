import en from '../i18n/en.json';

let messages = Object.assign( {}, en );
function message( key, ...args ) {
    let val = messages[ key ];
    if ( val === undefined ) {
        val = en[ key ];
    }
    args.forEach( ( replacement, i ) => {
        val = val.replace( new RegExp( '\\$' + ( i + 1 ), 'g' ), replacement );
    } )
    return val;
}

function impactMessage( key, ...args ) {
    args[ 0 ] = `<strong>${args[ 0 ]}</strong>`;
    return message( key, ...args );
}

function setLanguage( languageCode ) {
    return new Promise( ( resolve ) => {
        fetch( `/i18n/${languageCode}.json` )
        .then( ( r ) => r.json(), () => resolve( false ) )
        .then( ( json ) => {
            messages = Object.assign( {}, json );
            resolve( true );
        } )
    } )
}

export default {
    setLanguage,
    message,
    impactMessage
};

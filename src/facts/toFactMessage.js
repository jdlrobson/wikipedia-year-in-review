import message from '../message';

/**
 * @param {string} key 
 * @param  {...any} args 
 * @return {string}
 */
export function toFactMessage( key, ...args ) {
    return message.sanitize(
        message.message( key, ...args )
    );
}

/**
 * @param {string} key1
 * @param {string} value
 * @param {string} key2
 * @param {string} [key3]
 * @return {string}
 */
export function toFactMessageLegacy( key1, value, key2, key3 ) {
    const prefix = `${ message.message( key1 ) }<strong>${ value }</strong>`;
    if ( key3 ) {
        return `${ prefix }<span>${ message.message( key2 ) }</span>${ message.message( key3 ) }`;
    } else {
        return `${ prefix }${ message.message( key2 ) }`;
    }
}


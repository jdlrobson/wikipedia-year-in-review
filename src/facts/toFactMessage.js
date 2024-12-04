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


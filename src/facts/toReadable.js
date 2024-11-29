import message from '../message';

/**
 * @param {number} num
 * @return {string}
 */
export default ( num ) => {
    return `${message.convertNumber(num)}`;
}
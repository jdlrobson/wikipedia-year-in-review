/**
 * @param {number} num
 * @return {string}
 */
export default ( num ) => {
    let msg = `${num}`;
    if ( num > 1000 ) {
        const thousands = num / 1000;
        if ( thousands > 0 ) {
            msg = `${thousands}K+`;
        }
    }
    return `${msg}`;
}
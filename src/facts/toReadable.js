/**
 * @param {number} num
 * @return {string}
 */
export default ( num ) => {
    let msg = `${num}`;
    if ( num > 1000 ) {
        const thousands = num / 1000;
        if ( thousands > 0 ) {
            msg = `${thousands.toFixed(1)}K+`;
        }
    } else if ( num > 1000000 ) {
        const millions = num / 1000000;
        msg = `${millions.toFixed(1)}M+`;
    }
    return `${msg}`;
}
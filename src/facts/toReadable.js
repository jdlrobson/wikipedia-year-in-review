export default ( num ) => {
    let msg = num;
    if ( num > 1000 ) {
        const thousands = parseInt( num / 1000, 10 )
        if ( thousands > 0 ) {
            msg = `${thousands}K+`;
        }
    }
    return `${msg}`;
}
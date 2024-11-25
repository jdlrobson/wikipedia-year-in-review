import message from '../message';

const LIGHTNING = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/5/56/WP20Symbols_2019_dosangriff.png',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
    const value = String( stats.streak.longestStreak );
    if ( !value ) {
        return [];
    }
    return [ {
        messagePrefix: message.message( 'streak-prefix' ),
        value,
        qualifier: message.message( 'streak-days' ),
        image: LIGHTNING,
        messageSuffix: message.message( 'streak-suffix' ),
    } ];
}
import message from '../message';
import toReadable from './toReadable';
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
    const streak = stats.streak.longestStreak;
    if ( streak <= 1 ) {
        return [];
    }
    return [ {
        messagePrefix: message.message( 'streak-prefix' ),
        value: toReadable( streak ),
        image: LIGHTNING,
        messageSuffix: message.message( 'streak-suffix' ),
    } ];
}
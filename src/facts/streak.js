import toReadable from './toReadable';
import { toFactMessage } from "./toFactMessage";
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
        message: toFactMessage(
            'streak-message',
            toReadable( streak )
        ),
        image: LIGHTNING
    } ];
}
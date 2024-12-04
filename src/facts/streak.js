import toReadable from './toReadable';
import {  toFactMessageLegacy } from "./toFactMessage";
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
        message: toFactMessageLegacy(
            'streak-prefix',
            toReadable( streak ),
            'streak-suffix'
        ),
        image: LIGHTNING
    } ];
}
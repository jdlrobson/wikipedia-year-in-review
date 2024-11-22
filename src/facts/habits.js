import toReadable from "./toReadable";
import timeofday from './timeOfDay';
import { humanDay } from './habitUtils';
import message from '../message';

const PUZZLE_COLLAB = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Adapted_Wikipedia20symbol_collaboration.svg',
	width: 512,
	height: 401
};
const PEN_PAPER = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/WP20Symbols_PENANDPAPER.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
    const topDay = stats.dayofweek[ 0 ];
    if ( stats.articleEdits === 0 ) {
        return [];
    }
    return [ {
        messagePrefix: message.message( 'you-made' ),
        value: toReadable( stats.articleEdits ),
        qualifier: message.message( 'edits' ),
        image: PEN_PAPER,
        messageSuffix: message.message( 'num-articles', toReadable(stats.articlesNumber) ),
    },
    {
        messagePrefix: message.message( 'edited-most-day' ),
        class: 'smaller',
        image: PUZZLE_COLLAB,
        value: humanDay( topDay.day ),
        messageSuffix: message.message( 'edited-most-day-edit-total', topDay.count ),
    }, timeofday( stats.hourofweek )];
}
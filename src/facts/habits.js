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
        message: `${ message.message( 'you-made' ) } <strong>${ toReadable( stats.articleEdits )
}</strong> ${ message.message( 'edits' ) } ${ message.message( 'num-articles', toReadable( stats.articlesNumber ) ) }`,
        image: PEN_PAPER
    },
    {
        message: `${ message.message( 'edited-most-day' ) } <strong>${
            humanDay( topDay.day )
}</strong> ${ message.message( 'edited-most-day-edit-total', topDay.count ) }`,
        class: 'smaller',
        image: PUZZLE_COLLAB,
    }, timeofday( stats.hourofweek ) ];
}

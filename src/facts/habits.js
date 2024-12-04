import toReadable from "./toReadable";
import timeofday from './timeOfDay';
import { humanDay } from './habitUtils';
import { toFactMessage } from "./toFactMessage";

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
        message: toFactMessage(
            'you-made-edits-num-articles',
            toReadable( stats.articleEdits ),
            toReadable( stats.articlesNumber )
        ),
        image: PEN_PAPER
    },
    {
        message: toFactMessage(
            'edited-most-day-total',
            humanDay( topDay.day ),
            topDay.count
        ),
        class: 'smaller',
        image: PUZZLE_COLLAB,
    }, timeofday( stats.hourofweek ) ];
}

import toReadable from "./toReadable";

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
 * @param {number} day
 * @return {string}
 */
const humanDay = ( day ) => {
	return [ 'Sundays','Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays' ][ day ];
}

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
        messagePrefix: 'You made',
        value: toReadable( stats.articleEdits ),
        qualifier: 'edits',
        image: PEN_PAPER,
        messageSuffix: `in ${toReadable(stats.articlesNumber)} different articles`
    },
    {
        messagePrefix: 'You edited the most on',
        class: 'smaller',
        image: PUZZLE_COLLAB,
        value: humanDay( topDay.day ),
        messageSuffix: `${topDay.count} edits`
    } ];
}
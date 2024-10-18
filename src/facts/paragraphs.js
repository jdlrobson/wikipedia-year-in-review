import toReadable from "./toReadable";

const PUZZLE = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/6/65/WP20Symbols_puzzleglobe1.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
    if ( stats.paragraphs ) {
        return [ {
            image: PUZZLE,
            messagePrefix: 'Editing approximately',
            value: toReadable( stats.paragraphs ),
            qualifier: 'paragraphs',
            messageSuffix: 'of text!'
        } ];
    } else {
        return [];
    }
}
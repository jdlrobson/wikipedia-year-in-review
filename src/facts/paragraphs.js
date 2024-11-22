import toReadable from "./toReadable";
import message from '../message';

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
            messagePrefix: message.message( 'paragraph-1' ),
            value: toReadable( Math.floor( stats.paragraphs ) ),
            qualifier: message.message( 'paragraph-2' ),
            messageSuffix: message.message( 'paragraph-3' )
        } ];
    } else {
        return [];
    }
}
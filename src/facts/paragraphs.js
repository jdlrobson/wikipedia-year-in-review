import toReadable from "./toReadable";
import {  toFactMessageLegacy } from "./toFactMessage";

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
            message: toFactMessageLegacy(
                'paragraph-1',
                toReadable( Math.floor( stats.paragraphs ) ),
                'paragraph-2',
                'paragraph-3'
            )
        } ];
    } else {
        return [];
    }
}
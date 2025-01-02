import toReadable from "./toReadable";
import { toFactMessage } from "./toFactMessage";

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
    if ( stats.paragraphs && stats.project !== 'commons.wikimedia.org' ) {
        return [ {
            image: PUZZLE,
            message: toFactMessage(
                'paragraph-message', toReadable( Math.floor( stats.paragraphs ) )
            )
        } ];
    } else {
        return [];
    }
}
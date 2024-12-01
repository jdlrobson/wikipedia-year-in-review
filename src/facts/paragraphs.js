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
            impactMessage: message.impactMessage( 'paragraphs', Math.floor( stats.paragraphs ) )
        } ];
    } else {
        return [];
    }
}
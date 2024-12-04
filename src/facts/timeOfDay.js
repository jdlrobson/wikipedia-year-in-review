const PUZZLE_COLLAB = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Adapted_Wikipedia20symbol_collaboration.svg',
	width: 512,
	height: 401
};
import { getTimeslotNote } from './habitUtils';
import { toFactMessage } from "./toFactMessage";

/**
 * @param {YIRTimeSlot[]} hours
 * @return {YIRFact}
 */
export default ( hours ) => {
    const value = hours[0].timespan;
    
    return {
        message: toFactMessage(
            'most-edited-time-sleep',
            value,
            getTimeslotNote( value )
        ),
        class: 'smaller',
        image: PUZZLE_COLLAB
    };
};

const PUZZLE_COLLAB = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Adapted_Wikipedia20symbol_collaboration.svg',
	width: 512,
	height: 401
};
import { getTimeslotNote } from './habitUtils';

/**
 * @param {YIRTimeSlot[]} hours
 * @return {YIRFact}
 */
export default ( hours ) => {
    const value = hours[0].timespan;
    
    return {
        messagePrefix: 'Most editing occurs between',
        class: 'smaller',
        image: PUZZLE_COLLAB,
        value,
        messageSuffix: getTimeslotNote( value )
    };
};

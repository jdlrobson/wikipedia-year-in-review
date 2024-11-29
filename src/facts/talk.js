import toReadable from "./toReadable";
import message from '../message';

const MEETING = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Adapted_Wikipedia20symbol_meeting.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
	if ( stats.talkEdits > 0 ) {
		return [ {
			impactMessage: message.impactMessage( 'talk-impact', toReadable( stats.talkEdits ) ),
			image: MEETING
		} ];
	} else {
		return [];
	}
}
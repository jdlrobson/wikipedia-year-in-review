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
			messagePrefix: message.message( 'talk-1' ),
			image: MEETING,
			value: toReadable( stats.talkEdits ),
			qualifier: message.message( 'talk-2' ),
			messageSuffix: message.message( 'talk-3' )
		} ];
	} else {
		return [];
	}
}
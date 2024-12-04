import toReadable from "./toReadable";
import { toFactMessageLegacy } from "./toFactMessage";

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
			message: toFactMessageLegacy(
				'talk-1',
				toReadable( stats.talkEdits ),
				'talk-2',
				'talk-3'
			),
			image: MEETING
		} ];
	} else {
		return [];
	}
}
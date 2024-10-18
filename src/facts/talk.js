import toReadable from "./toReadable";
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
			messagePrefix: 'You contributed',
			image: MEETING,
			value: toReadable( stats.talkEdits ),
			qualifier: 'times',
			messageSuffix: 'to discussions.'
		} ];
	} else {
		return [];
	}
}
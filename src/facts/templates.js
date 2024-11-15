import toReadable from "./toReadable";
const DATA = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Adapted_Wikipedia20symbols_data_w.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
	if ( stats.templateEdits > 0 ) {
		return [ {
			messagePrefix: 'You edited templates',
			image: DATA,
			value: toReadable( stats.templateEdits ),
			qualifier: 'times'
		} ];
	} else {
		return [];
	}
}
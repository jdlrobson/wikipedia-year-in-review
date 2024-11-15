import toReadable from "./toReadable";
const CHEMISTRY = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Adapted_Wikipedia20symbols_chemistry_w.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
	if ( stats.interfaceEdits > 0 ) {
		return [ {
			messagePrefix: 'You edited gadgets and interface messages',
			image: CHEMISTRY,
			value: toReadable( stats.interfaceEdits ),
			qualifier: 'times'
		} ];
	} else {
		return [];
	}
}
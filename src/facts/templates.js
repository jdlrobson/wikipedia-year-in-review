import toReadable from "./toReadable";
import { toFactMessage } from "./toFactMessage";

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
			message: toFactMessage(
				'template-message',
				toReadable( stats.templateEdits )
			),
			image: DATA
		} ];
	} else {
		return [];
	}
}
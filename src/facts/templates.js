import toReadable from "./toReadable";
import message from '../message';
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
			messagePrefix: message.message( 'template-1' ),
			image: DATA,
			value: toReadable( stats.templateEdits ),
			qualifier: message.message( 'template-2' )
		} ];
	} else {
		return [];
	}
}
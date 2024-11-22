import toReadable from "./toReadable";
import message from '../message';

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
			messagePrefix: message.message( 'gadget-edits-1' ),
			image: CHEMISTRY,
			value: toReadable( stats.interfaceEdits ),
			qualifier: message.message( 'gadget-edits-2' )
		} ];
	} else {
		return [];
	}
}


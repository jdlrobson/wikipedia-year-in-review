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
			impactMessage: message.impactMessage( 'gadget-edits-impact', toReadable( stats.interfaceEdits ) ),
			image: CHEMISTRY
		} ];
	} else {
		return [];
	}
}


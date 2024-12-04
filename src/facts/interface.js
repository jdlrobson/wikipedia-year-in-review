import toReadable from "./toReadable";
import message from '../message';
import {  toFactMessageLegacy } from "./toFactMessage";

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
			message:  `${ message.message( 'gadget-edits-1' ) }<strong>${ toReadable( stats.interfaceEdits )
}</strong> <span>${ message.message( 'gadget-edits-2' ) }</span>`,
			image: CHEMISTRY
		} ];
	} else {
		return [];
	}
}


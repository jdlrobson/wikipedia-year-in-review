import toReadable from "./toReadable";
import message from '../message';
import { toFactMessage } from "./toFactMessage";

const FRIENDSHIP = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Adapted_Wikipedia20symbol_friendship.svg',
	width: 512,
	height: 401
};
const COMMUNITY = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Adapted_Wikipedia20symbol_community.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @return {YIRFact[]}
 */
export default ( stats ) => {
	let wasThanked = false;
	let /** @type YIRFact[] */pages = [];
	if ( stats.thanksCount > 0 ) {
		wasThanked = true;
		pages = pages.concat( [
			{
				message: toFactMessage(
					'appreciated-message',
					toReadable( stats.thankedCount )
				),
				image: FRIENDSHIP
			}
		] );
	}
	if ( stats.thanksCount > 0 ) {
		const messageKey = wasThanked ?
			'appreciated-message-1a' :
			'appreciated-message-1b';
		pages = pages.concat( [
			{
				image: COMMUNITY,
				message: toFactMessage(
					messageKey,
					toReadable( stats.thanksCount )
				)
			},
			{
				message: `<span>${ message.message( 'thanks-for-caring' )
}</span> ${ message.message( 'we-appreciate-you' ) }`
			}
		] );
	}
	if ( stats.topThanksTo.length  ) {
		pages = pages.concat( [
			{
				message: `<span>@${stats.topThanksTo[0].title}</span> ${ message.message( 'thanked-most' ) }`
			}
		] );
	}
	if ( stats.topThanksFrom.length ) {
		pages = pages.concat( [
			{
				message: `<span>@${stats.topThanksFrom[0].user}</span> ${message.message( 'thank-fan' ) }`
			}
		] );
	}
	return pages;
}

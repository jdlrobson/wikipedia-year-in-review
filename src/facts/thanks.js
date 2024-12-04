import toReadable from "./toReadable";
import message from '../message';

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
				message: `${ message.message( 'appreciated-1' ) } <strong>${ toReadable( stats.thankedCount )
}</strong> <span>${ message.message( 'appreciated-2' ) }</span>`,
				image: FRIENDSHIP
			}
		] );
	}
	if ( stats.thanksCount > 0 ) {
		const messagePrefix = wasThanked ?
			message.message( 'appreciated-to-1a' ) :
			message.message( 'appreciated-to-1b' );
		const qualifier = wasThanked ?
			message.message( 'appreciated-to-2a' ) :
			message.message( 'appreciated-to-2b' );
		pages = pages.concat( [
			{
				image: COMMUNITY,
				message: `${ messagePrefix } <strong>${ toReadable( stats.thanksCount )
}</strong> <span>${qualifier}</span>`
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

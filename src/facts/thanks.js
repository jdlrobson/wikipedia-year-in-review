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
				impactMessage: message.impactMessage( 'appreciated-impact', toReadable( stats.thankedCount ) ),
				image: FRIENDSHIP,
			}
		] );
	}
	if ( stats.thanksCount > 0 ) {
		pages = pages.concat( [
			{
				impactMessage: wasThanked ?
					message.impactMessage( 'appreciated-to-a', toReadable( stats.thanksCount ) ) :
					message.impactMessage( 'appreciated-to-b', toReadable( stats.thanksCount ) ),
				image: COMMUNITY,
			},
			{
				messagePrefix: message.message( 'thanks-for-caring' ),
				messageSuffix: message.message( 'we-appreciate-you' )
			}
		] );
	}
	if ( stats.topThanksTo.length  ) {
		pages = pages.concat( [
			{
				messageSuffix: message.message( 'thanked-most-impact', `@${stats.topThanksTo[0].title}` )
			}
		] );
	}
	if ( stats.topThanksFrom.length ) {
		pages = pages.concat( [
			{
				messageSuffix: message.message( 'thank-fan-impact', `@${stats.topThanksFrom[0].user}` )
			}
		] );
	}
	return pages;
}

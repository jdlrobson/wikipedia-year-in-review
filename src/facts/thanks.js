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
				messagePrefix: message.message( 'appreciated-1' ),
				image: FRIENDSHIP,
				value: toReadable( stats.thankedCount ),
				qualifier: message.message( 'appreciated-2' )
			}
		] );
	}
	if ( stats.thanksCount > 0 ) {
		pages = pages.concat( [
			{
				messagePrefix: wasThanked ?
					message.message( 'appreciated-to-1a' ) :
					message.message( 'appreciated-to-1b' ),
				image: COMMUNITY,
				value: toReadable( stats.thanksCount ),
				qualifier: wasThanked ?
					message.message( 'appreciated-to-2a' ) :
					message.message( 'appreciated-to-2b' )
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
				messagePrefix: `@${stats.topThanksTo[0].title}`,
				//value: stats.topThanksTo[0].count,
				//qualifier: 'User'
				messageSuffix: message.message( 'thanked-most' )
			}
		] );
	}
	if ( stats.topThanksFrom.length ) {
		pages = pages.concat( [
			{
				messagePrefix: `@${stats.topThanksFrom[0].user}`,
				messageSuffix: message.message( 'thank-fan' )
			}
		] );
	}
	return pages;
}

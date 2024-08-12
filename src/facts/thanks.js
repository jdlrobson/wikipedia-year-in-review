import toReadable from "./toReadable";
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
export default ( stats ) => {
	let wasThanked = false;
	let pages = [];
	if ( stats.thanksCount > 0 ) {
		wasThanked = true;
		pages = pages.concat( [
			{
				messagePrefix: 'You were appreciated by',
				image: FRIENDSHIP,
				value: toReadable( stats.thankedCount ),
				qualifier: 'editors'
			}
		] );
	}
	if ( stats.thanksCount > 0 ) {
		pages = pages.concat( [
			{
				messagePrefix: wasThanked ? 'And you showed appreciation to' :
					'You showed appreciation to',
				image: COMMUNITY,
				value: toReadable( stats.thanksCount ),
				qualifier: 'other humans'
			},
			{
				messagePrefix: 'Thank you caring!',
				messageSuffix: 'We appreciate you!'
			}
		] );
	}
	if ( stats.topThanksTo.length  ) {
		pages = pages.concat( [
			{
				messagePrefix: `@${stats.topThanksTo[0].title}`,
				//value: stats.topThanksTo[0].count,
				//qualifier: 'User'
				messageSuffix: 'was the user you thanked the most'
			}
		] );
	}
	if ( stats.topThanksFrom.length ) {
		pages = pages.concat( [
			{
				messagePrefix: `@${stats.topThanksFrom[0].user}`,
				messageSuffix: 'was your biggest fan'
			}
		] );
	}
	return pages;
}
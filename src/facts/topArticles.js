import message from '../message';

/**
 * @param {string} project
 * @param {string} title
 * @return {string}
 */
const wikiUrl = (project, title) => {
	return `https://${project}/wiki/${encodeURIComponent(title)}`;
};

/**
 * @param {YIRStats} stats
 * @param {string} project
 * @return {YIRFact[]}
 */
export default ( stats, project ) => {
   if ( stats.top5[0] ) {
		let topTitle = stats.top5[0].title;
		return [
			{
				messageSuffix: message.message( 'you-made-contributions-to-impact', `<p>[[<a class="wikiLink" href="${wikiUrl(project, topTitle)}">${topTitle}</a>]]</p>` ),
				image: stats.thumbs[0]
			},
			...stats.top5.slice(1).map((t, i) => {
				return {
					image: stats.thumbs[i+1],
					messageSuffix: message.message( 'and-impact', `<p>[[<a class="wikiLink" href="${wikiUrl(project, t.title)}">${t.title}</a>]]</p>` ),
				};
			} )
		];
	} else {
		return [];
	}
}
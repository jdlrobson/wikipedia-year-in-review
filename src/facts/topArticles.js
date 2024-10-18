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
				messagePrefix: 'You made contributions to',
				image: stats.thumbs[0],
				messageSuffix: `[[<a class="wikiLink" href="${wikiUrl(project, topTitle)}">${topTitle}</a>]]`
			},
			...stats.top5.slice(1).map((t, i) => {
				return {
					image: stats.thumbs[i+1],
					messagePrefix: 'and',
					messageSuffix: `[[<a class="wikiLink" href="${wikiUrl(project, t.title)}">${t.title}</a>]]`
				};
			} )
		];
	} else {
		return [];
	}
}
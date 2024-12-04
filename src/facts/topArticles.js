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
		const topLink = `<span>[[<a class="wikiLink" href="${wikiUrl(project, topTitle)}">${topTitle}</a>]]</span>`;
		return [
			{
				message: `${ message.message( 'you-made-contributions-to' ) } ${ topLink }`,
				image: stats.thumbs[0],
			},
			...stats.top5.slice(1).map((t, i) => {
				const link = `<span>[[<a class="wikiLink" href="${wikiUrl(project, t.title)}">${t.title}</a>]]</span>`;
				return {
					image: stats.thumbs[i+1],
					message: `${ message.message( 'and' ) } ${link}`
				};
			} )
		];
	} else {
		return [];
	}
}
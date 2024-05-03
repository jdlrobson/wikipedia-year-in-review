import toReadable from "./toReadable";
const WIKIPEDIA = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg',
	width: 512,
	height: 401
};

export default ( stats, year, project ) => {
    let contribs, qualifier, messagePrefix, messageSuffix;
    switch( project ) {
        case 'commons.wikimedia.org':
            contribs = stats.fileUploads;
            qualifier = 'files';
            messagePrefix = 'You uploaded';
            messageSuffix = 'across the project';
            break;
        default:
            contribs = stats.totalEdits;
            qualifier = 'edits';
            messagePrefix = 'You made';
            messageSuffix = 'across the project';
            break;
    }
    if ( contribs ) {
        switch( project ) {
            case 'commons.wikimedia.org':
            default:
                return {
                    image: WIKIPEDIA,
                    messagePrefix,
                    value: toReadable( contribs  ),
                    qualifier,
                    messageSuffix
                };
        }
    } else {
        return {
            image: WIKIPEDIA,
            messagePrefix: 'You didn\'t edit this project this year, but...',
            qualifier: year,
            messageSuffix: 'is another year to contribute to the sum of all human knowledge!'
        };
    }
};

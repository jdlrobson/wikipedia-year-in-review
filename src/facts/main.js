import toReadable from "./toReadable";
import message from '../message';

const WIKIPEDIA = {
	source: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg',
	width: 512,
	height: 401
};

/**
 * @param {YIRStats} stats
 * @param {number} year
 * @param {string} project
 * @return {YIRFact}
 */
export default ( stats, year, project ) => {
    let contribs, qualifier, messagePrefix, messageSuffix;
    switch( project ) {
        case 'commons.wikimedia.org':
            contribs = stats.fileUploads;
            qualifier = message.message( 'files' );
            messagePrefix = message.message( 'you-uploaded' );
            messageSuffix = message.message( 'across-project' );
            break;
        default:
            contribs = stats.totalEdits;
            qualifier = message.message( 'edits' );
            messagePrefix = message.message( 'you-made' );
            messageSuffix = message.message( 'across-project' );
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
            messagePrefix: message.message( 'no-contributions' ),
            qualifier: year,
            messageSuffix: message.message( 'next-year' ),
        };
    }
};

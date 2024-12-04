import toReadable from "./toReadable";
import { toFactMessage } from "./toFactMessage";

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
    let contribs, messageText, value;
    switch( project ) {
        case 'commons.wikimedia.org':
            contribs = stats.fileUploads;
            value = toReadable( contribs );
            messageText = toFactMessage( 'files-you-uploaded', value );
        default:
            contribs = stats.totalEdits;
            value = toReadable( contribs );
            messageText = toFactMessage( 'edits-you-made', value );
            break;
    }
    if ( contribs ) {
        switch( project ) {
            case 'commons.wikimedia.org':
            default:
                return {
                    image: WIKIPEDIA,
                    message: messageText
                };
        }
    } else {
        return {
            image: WIKIPEDIA,
            message: toFactMessage( 'no-contributions-this-year', year )
        };
    }
};

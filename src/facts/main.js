import toReadable from "./toReadable";
import message from '../message';
import { toFactMessage, toFactMessageLegacy } from "./toFactMessage";

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
            if ( message.exists( 'files-you-uploaded' ) ) {
                messageText = toFactMessage( 'files-you-uploaded', value )
            } else {
                messageText = toFactMessageLegacy( 'you-uploaded', value, 'files', 'across-project' );
            }
        default:
            contribs = stats.totalEdits;
            value = toReadable( contribs );
            if ( message.exists( 'edits-you-made' ) ) {
                messageText = toFactMessage( 'edits-you-made', value )
            } else {
                messageText = toFactMessageLegacy( 'you-made', value, 'edits', 'across-project' );
            }
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
            message: message.exists( 'no-contributions-this-year' ) ?
                toFactMessage( 'no-contributions-this-year', year ) :
                toFactMessageLegacy( 'no-contributions', String( year ), 'next-year' )
        };
    }
};

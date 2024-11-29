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
    let contribs, impactMessage, messagePrefix, messageSuffix;
    switch( project ) {
        case 'commons.wikimedia.org':
            contribs = stats.fileUploads;
            impactMessage = message.impactMessage( 'you-uploaded-impact', toReadable( contribs ) );
            break;
        default:
            contribs = stats.totalEdits;
            impactMessage = message.impactMessage( 'you-made-impact', toReadable( contribs ) );
            break;
    }
    if ( contribs ) {
        switch( project ) {
            case 'commons.wikimedia.org':
            default:
                return {
                    image: WIKIPEDIA,
                    impactMessage,
                };
        }
    } else {
        return {
            image: WIKIPEDIA,
            impactMessage: message.impactMessage( 'no-contributions-impact', year ),
        };
    }
};

import message from '../message';

/**
 * @param {YIRStats} stats
 * @return {string}
 */
export default ( stats ) => {
    return message.message(
        'share-text',
        stats.year - 1,
        stats.totalEdits,
        stats.talkEdits,
        stats.thanksCount,
        stats.thankedCount
    );
};

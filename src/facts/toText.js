/**
 * @param {YIRStats} stats
 * @return {string}
 */
export default ( stats ) => {
    const SHARE_TEXT = `Here is how I have been contributing to Wikipedia in ${stats.year - 1}!`;
    return `${SHARE_TEXT} Edits: ${stats.totalEdits}, Discussions: ${stats.talkEdits}, Thanks: ${stats.thanksCount}, Thanked: ${stats.thankedCount} #wikipediaYIR`
};

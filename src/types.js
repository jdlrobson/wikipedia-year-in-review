/**
 * @typedef {Object} YIRImage
 * @property {string} source
 * @property {number} width
 * @property {number} height
 */
/**
 * @typedef {Object} YIRPage
 * @property {string} title
 * @property {number} count
 * @property {string} [user]
 */
/**
 * @typedef {Object} YIRDay
 * @property {number} day
 * @property {number} hour
 * @property {number} count
 */
/**
 * @typedef {Object} YIRTimeSlot
 * @property {string} timespan
 * @property {number} count
 */
/**
 * @typedef {Object} YIRFact
 * @property {YIRImage} [image]
 * @property {string} [messagePrefix]
 * @property {string} [messageSuffix]
 * @property {string|number} [qualifier]
 * @property {string} [class]
 * @property {string} [value]
 */
/**
 * @typedef {Object} YIRStatsThanks
 * @property {YIRPage[]} topThanksTo
 * @property {number} thanksCount
 */
/**
 * @typedef {Object} YIRStatsThanked
 * @property {YIRPage[]} topThanksFrom
 * @property {number} thankedCount
 */
/**
 * @typedef {Object} YIRStatsContribs
 * @property {number} templateEdits
 * @property {number} interfaceEdits
 * @property {number} talkEdits
 * @property {number} totalEdits
 * @property {number} articlesNumber
 * @property {number} totalBytes
 * @property {number} [paragraphs]
 * @property {number} talkEdits
 * @property {number} pageEdits non-zero on wikisource
 * @property {number} articleEdits
 * @property {number} fileUploads
 * @property {YIRPage[]} top5
 * @property {YIRDay[]} dayofweek
 * @property {YIRTimeSlot[]} hourofweek
 * @property {YIRImage[]} thumbs
 */
/**
 * @typedef {Object} YIRStatsMeta
 * @property {number} year
 * @property {string} project
/**
 * @typedef {YIRStatsContribs & YIRStatsThanked & YIRStatsThanks & YIRStatsMeta} YIRStats
 */
/**
 * @typedef {Object} ApiListObj
 * @property {string} title
 * @property {string} user
 * @property {number} ns
 * @property {number} [sizediff]
 * @property {string} timestamp
 */
/**
 * @typedef {Object} ApiQueryObject
 * @property {ApiListObj[]} [logevents]
 * @property {ApiListObj[]} [usercontribs]
 */
/**
 * @typedef {Record<string, string>} ApiContinueObject
 */
/**
 * @typedef {Object} ApiRawResponse
 * @property {ApiQueryObject} query
 * @property {ApiContinueObject} continue
 */

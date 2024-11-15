/**
 * @param {number} day
 * @return {string}
 */
export const humanDay = ( day ) => {
	return [ 'Sundays','Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays' ][ day ];
}

/**
 * 
 * @param {string} timespan
 * @return {string}
 */
export const getTimeslotNote = ( timespan ) => {
    switch ( timespan ) {
        case '14:00 - 17:00':
            return 'afternoon editor';
        case '10:00 - 12:00':
            return 'morning editor';
        case '12:00 - 14:00':
            return 'lunchtime editor';
        case '22:00 - 0:00':
            return 'before bedtime editor';
        case '0:00 - 6:00':
            return 'nocturnal editor'
        case '6:00 - 10:00':
            return 'early editor';
        case '17:00 - 22:00':
            return 'evening editor';
        default:
            return '';
    }
};

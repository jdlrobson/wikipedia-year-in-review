import message from '../message';

/**
 * @param {number} day
 * @return {string}
 */
export const humanDay = ( day ) => {
	return [
        message.message( 'day-0' ),
        message.message( 'day-1' ),
        message.message( 'day-2' ),
        message.message( 'day-3' ),
        message.message( 'day-4' ),
        message.message( 'day-5' ),  
        message.message( 'day-6' ),
    ][ day ];
}

/**
 * 
 * @param {string} timespan
 * @return {string}
 */
export const getTimeslotNote = ( timespan ) => {
    switch ( timespan ) {
        case '14:00 - 17:00':
            return message.message( 'time-afternoon' );
        case '10:00 - 12:00':
            return message.message( 'time-morning' );
        case '12:00 - 14:00':
            return message.message( 'time-lunch' );
        case '22:00 - 0:00':
            return message.message( 'time-sleep' );
        case '0:00 - 6:00':
            return message.message( 'time-night' );
        case '6:00 - 10:00':
            return message.message( 'time-early' );
        case '17:00 - 22:00':
            return message.message( 'time-evening' );
        default:
            return '';
    }
};

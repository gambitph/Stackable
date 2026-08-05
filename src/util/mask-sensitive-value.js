/**
 * Masks a sensitive string for display while keeping it recognizable.
 *
 * Shows the first 6 and last 6 characters, and replaces the middle characters
 * with asterisks. Values with 12 or fewer characters are fully masked.
 *
 * @param {string} value The sensitive value to mask.
 *
 * @return {string} Masked value for display.
 */
export const maskSensitiveValue = value => {
	if ( ! value ) {
		return value
	}

	if ( value.length <= 12 ) {
		return '*'.repeat( value.length )
	}

	return `${ value.slice( 0, 6 ) }${ '*'.repeat( value.length - 12 ) }${ value.slice( -6 ) }`
}

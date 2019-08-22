/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	return {
		'.ugb-spacer': {
			height: getValue( 'height', `%s${ getValue( 'heightUnit' ) || 'px' }` ),
		},
		tablet: {
			'.ugb-spacer': {
				height: getValue( 'tabletHeight', `%s${ getValue( 'tabletHeightUnit' ) || 'px' }` ),
			},
		},
		mobile: {
			'.ugb-spacer': {
				height: getValue( 'mobileHeight', `%s${ getValue( 'mobileHeightUnit' ) || 'px' }` ),
			},
		},
	}
}

export default createStyles

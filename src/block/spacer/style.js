/**
 * External dependencies
 */
import { createBackgroundStyleSet } from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const styles = []

	styles.push( {
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
	} )

	// Column Background.
	styles.push( {
		...createBackgroundStyleSet( '%s', 'ugb-spacer--inner', props.attributes, {
			importantBackgroundColor: true,
		} ),
	} )

	return deepmerge.all( styles )
}

export default createStyles

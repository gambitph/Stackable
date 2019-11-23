/**
 * External dependencies
 */
import { createBackgroundStyleSet, __getValue } from '~stackable/util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

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

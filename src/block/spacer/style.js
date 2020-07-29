/**
 * External dependencies
 */
import { createBackgroundStyleSet, __getValue } from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Default attribute values if
 * no value is passed
 */
const defaultValues = {
	height: '50px',
}

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const { height } = defaultValues

	styles.push( {
		'.ugb-spacer': {
			height: getValue( 'height', `%s${ getValue( 'heightUnit' ) || 'px' }` ),
		},
		tablet: {
			'.ugb-spacer': {
				height: getValue( 'tabletHeight', `%s${ getValue( 'tabletHeightUnit' ) || 'px' }` ) || height,
			},
		},
		mobile: {
			'.ugb-spacer': {
				height: getValue( 'mobileHeight', `%s${ getValue( 'mobileHeightUnit' ) || 'px' }` ) || height,
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

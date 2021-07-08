/**
 * External dependencies
 */
import {
	createBackgroundStyleSet, __getValue, appendImportant,
} from '~stackable/util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	styles.push( {
		desktopTablet: {
			'.ugb-spacer': {
				height: appendImportant( getValue( 'height', `%s${ getValue( 'heightUnit' ) || 'px' }` ) ),
			},
		},
		tabletOnly: {
			'.ugb-spacer': {
				height: appendImportant( getValue( 'tabletHeight', `%s${ getValue( 'tabletHeightUnit' ) || 'px' }` ) ),
			},
		},
		mobile: {
			'.ugb-spacer': {
				height: appendImportant( getValue( 'mobileHeight', `%s${ getValue( 'mobileHeightUnit' ) || 'px' }` ) ),
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

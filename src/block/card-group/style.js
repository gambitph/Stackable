/**
 * External dependencies
 */
import {
	__getValue,
	StyleObject,
	appendImportantAll,
} from '~stackable/util'

const createStyles = ( version = '' ) => props => {
	const getValue = __getValue( props.attributes )
	const styles = new StyleObject()

	// Column styles.
	styles.add( {
		style: {
			'': appendImportantAll( {
				marginBottom: getValue( 'blockMarginBottom', '%spx' ),
			} ),
			tablet: {
				'': appendImportantAll( {
					marginBottom: getValue( 'blockMarginBottomTablet', '%spx' ),
				} ),
			},
			mobile: {
				'': appendImportantAll( {
					marginBottom: getValue( 'blockMarginBottomMobile', '%spx' ),
				} ),
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return styles.getMerged( version )
}

export default createStyles

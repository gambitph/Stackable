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
	{ props.attributes.blockMarginBottom !== '' ? `.stk-${ props.attributes.uniqueId } { margin-bottom: ${ props.attributes.blockMarginBottom }px; }` : '' }
	styles.add( {
		style: {
			desktopTablet: {
				'': appendImportantAll( {
					marginBottom: getValue( 'blockMarginBottom', '%spx' ),
				} ),
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return styles.getMerged( version )
}

export default createStyles

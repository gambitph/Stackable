/**
 * External dependencies
 */
import {
	__getValue,
	appendImportantAll,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'

export const getStyles = ( attributes, options = {} ) => {
	const getValue = __getValue( attributes )
	const {
		selector = '',
	} = options

	return {
		[ selector ]: appendImportantAll( {
			marginBottom: getValue( 'blockMarginBottom', '%spx' ),
		} ),
		tablet: {
			[ selector ]: appendImportantAll( {
				marginBottom: getValue( 'blockMarginBottomTablet', '%spx' ),
			} ),
		},
		mobile: {
			[ selector ]: appendImportantAll( {
				marginBottom: getValue( 'blockMarginBottomMobile', '%spx' ),
			} ),
		},
	}
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const getValue = __getValue( attributes )

	const styles = useMemo(
		() => getStyles( attributes, options ),
		[
			options.selector,
			getValue( 'blockMarginBottom' ),
			getValue( 'blockMarginBottomTablet' ),
			getValue( 'blockMarginBottomMobile' ),
			attributes.uniqueId,
		]
	)

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, options )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

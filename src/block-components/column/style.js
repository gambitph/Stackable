/**
 * External dependencies
 */
import {
	__getValue,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'
import { useMemo } from '@wordpress/element'

const getStyles = ( attributes, options = {} ) => {
	const {
		selector = '',
	} = options
	const getValue = __getValue( attributes )

	return {
		editor: {
			custom: {
				[ `.stk-preview-device-desktop :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"],
				.stk-preview-device-tablet :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"]` ]: {
					flex: getValue( 'columnWidth', '1 1 %s%' ),
					maxWidth: getValue( 'columnWidth', '%s%' ),
				},
				[ `.stk-preview-device-tablet :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"]` ]: {
					flex: getValue( 'columnWidthTablet', '1 1 %s%' ),
					maxWidth: getValue( 'columnWidthTablet', '%s%' ),
				},
				[ `.stk-preview-device-mobile :where(.block-editor-block-list__layout) [data-block="${ attributes.clientId }"]` ]: {
					flex: getValue( 'columnWidthMobile', '1 1 %s%' ),
					maxWidth: getValue( 'columnWidthMobile', '%s%' ),
				},
			},
		},
		saveOnly: {
			desktopTablet: {
				[ selector ]: {
					flex: getValue( 'columnWidth', '1 1 %s%' ),
					maxWidth: getValue( 'columnWidth', '%s%' ),
				},
			},
			tabletOnly: {
				[ selector ]: {
					flex: getValue( 'columnWidthTablet', '1 1 %s%' ),
					maxWidth: getValue( 'columnWidthTablet', '%s%' ),
				},
			},
			mobile: {
				[ selector ]: {
					flex: getValue( 'columnWidthMobile', '1 1 %s%' ),
					maxWidth: getValue( 'columnWidthMobile', '%s%' ),
				},
			},
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
		[ getValue( 'columnWidth' ), getValue( 'columnWidthTablet' ), getValue( 'columnWidthMobile' ), attributes.clientId ]
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

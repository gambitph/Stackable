/**
 * External dependencies
 */
import {
	__getValue,
} from '~stackable/util'

/**
 * Adds image styles.
 *
 * @param {Object} styles The StyleObject to append to
 * @param {Object} attributes Block attributes
 * @param {Object} options Other options
 */
export const addStyles = ( styles, attributes, options = {} ) => {
	const getValue = __getValue( attributes )

	const {
		selector = '',
	} = options

	styles.add( {
		style: {
			editor: {
				custom: {
					[ `.stk-preview-device-desktop .block-editor-block-list__layout [data-block="${ attributes.clientId }"],
					.stk-preview-device-tablet .block-editor-block-list__layout [data-block="${ attributes.clientId }"]` ]: {
						flex: getValue( 'columnWidth', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidth', '%s%' ),
					},
					[ `.stk-preview-device-tablet .block-editor-block-list__layout [data-block="${ attributes.clientId }"]` ]: {
						flex: getValue( 'columnWidthTablet', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidthTablet', '%s%' ),
					},
					[ `.stk-preview-device-mobile .block-editor-block-list__layout [data-block="${ attributes.clientId }"]` ]: {
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
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

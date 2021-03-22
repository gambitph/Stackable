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
 * @param {Object} blockProps Block props
 * @param {Object} options Other options
 */
export const addStyles = ( styles, blockProps, options = {} ) => {
	const getValue = __getValue( blockProps.attributes )

	const {
		selector = '',
	} = options

	styles.add( {
		style: {
			editor: {
				custom: {
					[ `.stk-preview-device-desktop .block-editor-block-list__layout [data-block="${ blockProps.clientId }"],
					.stk-preview-device-tablet .block-editor-block-list__layout [data-block="${ blockProps.clientId }"]` ]: {
						flex: getValue( 'columnWidth', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidth', '%s%' ),
					},
					[ `.stk-preview-device-tablet .block-editor-block-list__layout [data-block="${ blockProps.clientId }"]` ]: {
						flex: getValue( 'columnWidthTablet', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidthTablet', '%s%' ),
					},
					[ `.stk-preview-device-mobile .block-editor-block-list__layout [data-block="${ blockProps.clientId }"]` ]: {
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

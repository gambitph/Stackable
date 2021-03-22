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
 */
export const addStyles = ( styles, blockProps ) => {
	const getValue = __getValue( blockProps.attributes )

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
					'': {
						flex: getValue( 'columnWidth', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidth', '%s%' ),
					},
				},
				tabletOnly: {
					'': {
						flex: getValue( 'columnWidthTablet', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidthTablet', '%s%' ),
					},
				},
				mobile: {
					'': {
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

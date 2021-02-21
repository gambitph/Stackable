/**
 * External dependencies
 */
import {
	__getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => props => {
	const getValue = __getValue( props.attributes )
	const styles = new StyleObject()

	// Column styles.
	styles.add( {
		style: {
			editor: {
				custom: {
					[ `.stk-preview-device-desktop .block-editor-block-list__layout [data-block="${ props.clientId }"],
					.stk-preview-device-tablet .block-editor-block-list__layout [data-block="${ props.clientId }"]` ]: {
						flex: getValue( 'columnWidth', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidth', '%s%' ),
					},
					[ `.stk-preview-device-tablet .block-editor-block-list__layout [data-block="${ props.clientId }"]` ]: {
						flex: getValue( 'columnWidthTablet', '1 1 %s%' ),
						maxWidth: getValue( 'columnWidthTablet', '%s%' ),
					},
					[ `.stk-preview-device-mobile .block-editor-block-list__layout [data-block="${ props.clientId }"]` ]: {
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

	return styles.getMerged( version )
}

export default createStyles

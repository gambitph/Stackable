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

	// TODO: image adv styles like zoom, filter, etc.
	// Image styles.
	styles.add( {
		style: {
			// Only save styles since styles in edit are already in the Component.
			saveOnly: {
				'.stk-card__image': appendImportantAll( {
					width: getValue( 'imageWidth', `%s${ getValue( 'imageWidthUnit', '%s', '%' ) }` ),
					height: getValue( 'imageHeight', `%s${ getValue( 'imageHeightUnit', '%s', 'px' ) }` ),
				} ),
				tablet: {
					'.stk-card__image': appendImportantAll( {
						width: getValue( 'imageWidthTablet', `%s${ getValue( 'imageWidthUnitTablet', '%s', '%' ) }` ),
						height: getValue( 'imageHeightTablet', `%s${ getValue( 'imageHeightUnitTablet', '%s', 'px' ) }` ),
					} ),
				},
				mobile: {
					'.stk-card__image': appendImportantAll( {
						width: getValue( 'imageWidthMobile', `%s${ getValue( 'imageWidthUnitMobile', '%s', '%' ) }` ),
						height: getValue( 'imageHeightMobile', `%s${ getValue( 'imageHeightUnitMobile', '%s', 'px' ) }` ),
					} ),
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return styles.getMerged( version )
}

export default createStyles

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
 */
export const addStyles = ( styles, attributes ) => {
	const getValue = __getValue( attributes )

	const top = getValue( 'positionTop', `%s${ getValue( 'positionUnit' ) || 'px' }` )
	const isSticky = getValue( 'position' ) === 'sticky'

	styles.add( {
		style: {
			'': {
				opacity: getValue( 'opacity' ),
				zIndex: getValue( 'zIndex' ),
				overflow: getValue( 'overflow' ),
				clear: getValue( 'clear' ),
			},
			tablet: {
				'': {
					opacity: getValue( 'opacityTablet' ),
					zIndex: getValue( 'zIndexTablet' ),
					overflow: getValue( 'overflowTablet' ),
				},
			},
			mobile: {
				'': {
					opacity: getValue( 'opacityMobile' ),
					zIndex: getValue( 'zIndexMobile' ),
					overflow: getValue( 'overflowMobile' ),
				},
			},

			saveOnly: {
				'': {
					position: getValue( 'position' ),
					top: top || ( isSticky ? '0' : undefined ),
					right: getValue( 'positionRight', `%s${ getValue( 'positionUnit' ) || 'px' }` ),
					bottom: getValue( 'positionBottom', `%s${ getValue( 'positionUnit' ) || 'px' }` ),
					left: getValue( 'positionLeft', `%s${ getValue( 'positionUnit' ) || 'px' }` ),
				},
				tablet: {
					'': {
						position: getValue( 'positionTablet' ),
						top: getValue( 'positionTopTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
						right: getValue( 'positionRightTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
						bottom: getValue( 'positionBottomTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
						left: getValue( 'positionLeftTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
					},
				},
				mobile: {
					'': {
						position: getValue( 'positionMobile' ),
						top: getValue( 'positionTopMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
						right: getValue( 'positionRightMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
						bottom: getValue( 'positionBottomMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
						left: getValue( 'positionLeftMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
					},
				},
			},

			// We need to set these to the actual block so that the effects
			// would show in the editor.
			editor: {
				custom: {
					[ `.stk-preview-device-desktop [data-block="${ attributes.clientId }"]` ]: {
						position: getValue( 'position' ),
						top: top || ( isSticky ? '0' : undefined ),
						right: getValue( 'positionRight', `%s${ getValue( 'positionUnit' ) || 'px' }` ),
						bottom: getValue( 'positionBottom', `%s${ getValue( 'positionUnit' ) || 'px' }` ),
						left: getValue( 'positionLeft', `%s${ getValue( 'positionUnit' ) || 'px' }` ),
					},
					[ `.stk-preview-device-tablet [data-block="${ attributes.clientId }"]` ]: {
						position: getValue( 'positionTablet' ),
						top: getValue( 'positionTopTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
						right: getValue( 'positionRightTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
						bottom: getValue( 'positionBottomTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
						left: getValue( 'positionLeftTablet', `%s${ getValue( 'positionUnitTablet' ) || 'px' }` ),
					},
					[ `.stk-preview-device-mobile [data-block="${ attributes.clientId }"]` ]: {
						position: getValue( 'positionMobile' ),
						top: getValue( 'positionTopMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
						right: getValue( 'positionRightMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
						bottom: getValue( 'positionBottomMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
						left: getValue( 'positionLeftMobile', `%s${ getValue( 'positionUnitMobile' ) || 'px' }` ),
					},
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

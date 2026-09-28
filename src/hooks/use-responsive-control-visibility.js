/**
 * Internal dependencies
 */
import { useDeviceType } from './use-device-type'
import useCoreResponsiveEditing from './use-core-responsive-editing'

/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element'

const ALL_SCREENS = [ 'desktop', 'tablet', 'mobile' ]
const ResponsiveControlFilteringContext = createContext( {
	deviceType: undefined,
	isResponsiveEditing: false,
} )

/**
 * Normalize the responsive metadata already used by Stackable controls.
 * This visibility metadata does not change which responsive attribute a
 * control reads or writes.
 *
 * @param {string|string[]|boolean} responsive Responsive control metadata.
 * @return {string[]} Supported device names.
 */
export const normalizeResponsiveScreens = responsive => {
	if ( responsive === 'all' ) {
		return ALL_SCREENS
	}

	return Array.isArray( responsive ) ? responsive : []
}

/**
 * Determine control visibility without changing which attribute the control
 * reads or writes.
 *
 * @param {Object}          options                     Visibility inputs.
 * @param {string}          options.deviceType          Current visual device.
 * @param {boolean}         options.isResponsiveEditing Core toggle state.
 * @param {string|string[]|boolean} options.responsive  Supported devices.
 * @return {boolean} Whether the control should be rendered.
 */
export const isResponsiveControlVisible = ( {
	deviceType,
	isResponsiveEditing,
	responsive,
} ) => {
	if ( ! isResponsiveEditing || ! deviceType || deviceType === 'Desktop' ) {
		return true
	}

	return normalizeResponsiveScreens( responsive ).includes( deviceType.toLowerCase() )
}

/**
 * Scope Core responsive filtering to Stackable inspector trees.
 * Controls outside this provider use the non-filtering context default.
 *
 * @param {Object} options          Component options.
 * @param {*}      options.children Inspector controls.
 * @return {*} Context provider.
 */
export const ResponsiveControlFilterProvider = ( { children } ) => {
	const deviceType = useDeviceType()
	const isResponsiveEditing = useCoreResponsiveEditing()

	return (
		<ResponsiveControlFilteringContext.Provider value={ { deviceType, isResponsiveEditing } }>
			{ children }
		</ResponsiveControlFilteringContext.Provider>
	)
}

const useResponsiveControlVisibility = responsive => {
	const { deviceType, isResponsiveEditing } = useContext( ResponsiveControlFilteringContext )

	return isResponsiveControlVisible( {
		deviceType,
		isResponsiveEditing,
		responsive,
	} )
}

export default useResponsiveControlVisibility

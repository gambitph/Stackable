/**
 * Internal dependencies
 */
import useResponsiveControlVisibility from '~stackable/hooks/use-responsive-control-visibility'
export { ResponsiveControlFilterProvider } from '~stackable/hooks/use-responsive-control-visibility'

/**
 * WordPress dependencies
 */
import {
	createContext, useCallback, useContext, useLayoutEffect, useRef, useState,
} from '@wordpress/element'

const ResponsivePanelControlContext = createContext()

/**
 * Track child control visibility so a panel can hide when filtering removes
 * all of its registered controls. No registrations means the panel capability
 * is unknown, so the panel remains visible unless it has an explicit value.
 *
 * @return {Object} Registration callback and aggregate visibility state.
 */
export const useResponsivePanelControls = () => {
	const [ controls, setControls ] = useState( new Map() )

	const registerControl = useCallback( ( id, isVisible ) => {
		setControls( current => {
			if ( current.get( id ) === isVisible ) {
				return current
			}

			const next = new Map( current )
			next.set( id, isVisible )
			return next
		} )

		return () => {
			setControls( current => {
				if ( ! current.has( id ) ) {
					return current
				}

				const next = new Map( current )
				next.delete( id )
				return next
			} )
		}
	}, [] )

	const registeredControls = [ ...controls.values() ]
	const shouldHide = registeredControls.length > 0 && ! registeredControls.some( Boolean )

	return {
		registerControl,
		shouldHide,
	}
}

export const useRegisterResponsivePanelControl = isVisible => {
	const registerControl = useContext( ResponsivePanelControlContext )
	const controlId = useRef( {} )

	// Register before paint so an empty panel does not visibly flash while its
	// controls report their responsive capabilities.
	useLayoutEffect( () => {
		return registerControl?.( controlId.current, isVisible )
	}, [ isVisible, registerControl ] )
}

export const ResponsivePanelControlProvider = ResponsivePanelControlContext.Provider

const ResponsiveControlVisibility = ( { children, responsive } ) => {
	const isVisible = useResponsiveControlVisibility( responsive )
	useRegisterResponsivePanelControl( isVisible )

	return isVisible ? children : null
}

export default ResponsiveControlVisibility

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data'
import { useEffect, useRef } from '@wordpress/element'
import { useDeviceType } from '~stackable/hooks/use-device-type'
import {
	DEFAULT_STYLE_STATE_VIEWPORT,
	getPrivateBlockEditorDispatch,
	getPrivateBlockEditorSelectors,
	getStyleStateViewportForDeviceType,
} from '~stackable/hooks/use-core-responsive-editing'

/**
 * Stackable already stores responsive values in its own tablet and mobile
 * attributes. WordPress 7.1 responsive editing hides the normal inspector and
 * only renders controls backed by Core style states. Temporarily opt the
 * selected Stackable block out of that Core viewport state while preserving
 * the editor's visual device preview.
 *
 * @param {string} clientId Block client ID.
 */
const useCoreResponsiveStylesCompatibility = clientId => {
	// Remember the viewport that Core owned before Stackable temporarily moved
	// the style-state inspector back to its default state.
	const previousViewport = useRef( DEFAULT_STYLE_STATE_VIEWPORT )
	const compatibilityState = useRef()
	const deviceType = useDeviceType()
	const dispatchers = useDispatch( 'core/block-editor' )
	const privateDispatchers = getPrivateBlockEditorDispatch( dispatchers )
	const setStyleStateViewport = privateDispatchers?.setStyleStateViewport

	const {
		isSelected,
		isResponsiveEditing,
		styleStateViewport,
	} = useSelect( select => {
		const blockEditor = select( 'core/block-editor' )
		const privateSelectors = getPrivateBlockEditorSelectors( select )

		return {
			isSelected: blockEditor.isBlockSelected( clientId ),
			isResponsiveEditing: privateSelectors?.isResponsiveEditing?.() || false,
			styleStateViewport: privateSelectors?.getStyleStateViewport?.() || DEFAULT_STYLE_STATE_VIEWPORT,
		}
	}, [ clientId ] )
	compatibilityState.current = {
		deviceType,
		isResponsiveEditing,
		styleStateViewport,
	}

	useEffect( () => {
		if ( ! setStyleStateViewport ) {
			return
		}

		if ( isSelected && isResponsiveEditing ) {
			if ( deviceType === 'Desktop' ) {
				previousViewport.current = DEFAULT_STYLE_STATE_VIEWPORT
			} else {
				// Core may already be at its default viewport when the visual device
				// changes. Remember the active device so native blocks can still have
				// their responsive inspector restored when Stackable is deselected.
				previousViewport.current = styleStateViewport !== DEFAULT_STYLE_STATE_VIEWPORT
					? styleStateViewport
					: getStyleStateViewportForDeviceType( deviceType )

				if ( styleStateViewport !== DEFAULT_STYLE_STATE_VIEWPORT ) {
					// Change only Core's inspector state. The visual Tablet or Mobile
					// preview still drives Stackable's responsive attributes.
					setStyleStateViewport( DEFAULT_STYLE_STATE_VIEWPORT )
				}
			}

			return
		}

		if ( ! isSelected && previousViewport.current !== DEFAULT_STYLE_STATE_VIEWPORT ) {
			if ( isResponsiveEditing && styleStateViewport === DEFAULT_STYLE_STATE_VIEWPORT && deviceType !== 'Desktop' ) {
				// Native blocks need their Core viewport state restored so their
				// normal Responsive Styles inspector can take over again.
				setStyleStateViewport( getStyleStateViewportForDeviceType( deviceType ) )
			}

			previousViewport.current = DEFAULT_STYLE_STATE_VIEWPORT
		}
	}, [
		deviceType,
		isResponsiveEditing,
		isSelected,
		setStyleStateViewport,
		styleStateViewport,
	] )

	useEffect( () => {
		return () => {
			// Selection changes normally restore the viewport above. This cleanup
			// also covers block deletion and inspector unmounting.
			const state = compatibilityState.current
			if (
				setStyleStateViewport &&
				previousViewport.current !== DEFAULT_STYLE_STATE_VIEWPORT &&
				state.isResponsiveEditing &&
				state.styleStateViewport === DEFAULT_STYLE_STATE_VIEWPORT &&
				state.deviceType !== 'Desktop'
			) {
				setStyleStateViewport( getStyleStateViewportForDeviceType( state.deviceType ) )
			}

			previousViewport.current = DEFAULT_STYLE_STATE_VIEWPORT
		}
	}, [ setStyleStateViewport ] )
}

export default useCoreResponsiveStylesCompatibility

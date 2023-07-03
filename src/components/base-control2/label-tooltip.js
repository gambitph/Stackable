/**
 * This component replaces the default label of a control with a label that
 * when hovered on or clicked on will show a help tooltip
 */

/**
 * Internal dependencies
 */
import HelpTooltip from '../help-tooltip'

/**
 * WordPress dependencies
 */
import {
	useRef, useState, useEffect,
} from '@wordpress/element'
import { loadPromise, models } from '@wordpress/api'
import domReady from '@wordpress/dom-ready'

const LabelTooltip = props => {
	const {
		title,
		label: controlLabel,
		video,
		description,
	} = props

	const [ showTooltip, _setShowTooltip ] = useState( false )
	const [ tooltipsEnabled, setTooltipsEnabled ] = useHelpTooltipEnabled()

	// Close all other tooltips when this tooltip is opened.
	const setShowTooltip = useCloseOtherTooltips( _setShowTooltip )

	const timeout = useRef()
	const wasOpen = useRef()

	if ( ! description || ( ! tooltipsEnabled && ! showTooltip ) ) {
		return <div className="components-base-control__label">{ controlLabel }</div>
	}

	return (
		<div className="components-base-control__label">
			<span
				className="stk-control__label--has-tooltip"
				onMouseEnter={ () => {
					clearTimeout( timeout.current )
					timeout.current = setTimeout( () => {
						setShowTooltip( true )

						setTimeout( () => {
							document.querySelector( '.stk-control-help-tooltip' ).focus()
						}, 100 )
					}, 800 )
				} }
				onMouseLeave={ () => {
					clearTimeout( timeout.current )
				} }
				onMouseDown={ () => {
					// This prevents the popover from showing again when the
					// user clicks on the label to close it.
					wasOpen.current = showTooltip
				} }
				onClick={ () => {
					if ( ! wasOpen.current ) {
						clearTimeout( timeout.current )
						setShowTooltip( show => ! show )
						if ( ! showTooltip ) {
							setTimeout( () => {
								document.querySelector( '.stk-control-help-tooltip' ).focus()
							}, 100 )
						}
					}
				} }
				onKeyDown={ ev => {
					// On enter or space, open the tooltip
					if ( ev.keyCode === 13 || ev.keyCode === 32 ) {
						ev.preventDefault()
						setShowTooltip( show => ! show )
					}
				} }
				role="button"
				tabIndex="0"
			>
				{ controlLabel }
			</span>
			{ showTooltip && (
				<HelpTooltip
					title={ title || controlLabel }
					description={ description }
					video={ video }
					onClose={ () => setShowTooltip( false ) }
					tooltipsEnabled={ tooltipsEnabled }
					onTooltipsEnabledChange={ setTooltipsEnabled }
				/>
			) }
		</div>
	)
}

LabelTooltip.defaultProps = {
	label: '',
	description: '',
	video: '',
}

export default LabelTooltip

let helpTooltipEnabled = true // Initial value, this will be updated on load.

// At the start, get whether the helpTooltips are enabled or disabled.
domReady( () => {
	loadPromise.then( () => {
		const settings = new models.Settings()
		settings.fetch().then( response => {
			helpTooltipEnabled = ! response.stackable_help_tooltip_disabled
		} )
	} ).catch( () => {} )
} )

// Custom hook for the small store for checking tooltip enable/disable across
// other components.
function useHelpTooltipEnabled() {
	const [ enabled, setEnabled ] = useState( helpTooltipEnabled )

	useEffect( () => {
		// Function to handle value changes
		const onChangeHandler = event => setEnabled( event.detail )

		// Add event listener to listen for value changes
		// eslint-disable-next-line @wordpress/no-global-event-listener
		window?.addEventListener( '_stkHelpTooltipEnabledChanged', onChangeHandler )

		// Clean up the event listener when the component unmounts
		return () => {
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener( '_stkHelpTooltipEnabledChanged', onChangeHandler )
		}
	}, [] )

	const updateHelpTooltipEnabled = newValue => {
		helpTooltipEnabled = newValue

		const model = new models.Settings( {
			stackable_help_tooltip_disabled: newValue ? '' : '1', // eslint-disable-line
		} )
		model.save()

		// Let the other components know that the value has changed.
		window.dispatchEvent( new CustomEvent( '_stkHelpTooltipEnabledChanged', { detail: newValue } ) )
	}

	return [ enabled, updateHelpTooltipEnabled ]
}

// This hook overrides the setState function so that it will close all other
// tooltips when this tooltip is opened.
const useCloseOtherTooltips = setShowTooltip => {
	// Listen to the event that will close all other tooltips.
	useEffect( () => {
		// Just close the tooltip when the event is fired.
		const closeHandler = () => setShowTooltip( false )

		// eslint-disable-next-line @wordpress/no-global-event-listener
		window?.addEventListener( '_stkHelpTooltipOpened', closeHandler )

		return () => {
			// eslint-disable-next-line @wordpress/no-global-event-listener
			window.removeEventListener( '_stkHelpTooltipOpened', closeHandler )
		}
	}, [] )

	// Create a new setShowTooltip function that will close all other tooltips
	const newSetShowTooltip = show => {
		if ( show ) {
			window.dispatchEvent( new CustomEvent( '_stkHelpTooltipOpened' ) )
		}

		setShowTooltip( show )
	}

	return newSetShowTooltip
}

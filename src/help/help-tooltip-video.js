/**
 * Internal dependencies
 */
import VIDEOS from './videos'
import HelpTooltip from './help-tooltip'

/**
 * External dependencies
 */
import {
	srcUrl, cdnUrl,
} from 'stackable'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { addAction, removeAction } from '@wordpress/hooks'
import { loadPromise, models } from '@wordpress/api'
import { useEffect, useState } from '@wordpress/element'
import { startListening, stopListening } from './events-show'

// Provides the URL of the video. If during development, use the local copies; if production, use the CDN.
const videoUrl = video => `${ process.env.NODE_ENV === 'development' ? srcUrl : cdnUrl }/${ video }`

// Gets the Help ID from the class.
export const getHelpId = el => el && el.closest( '[class*="ugb--help-tip-"]' ) && camelCase( ( el.closest( '[class*="ugb--help-tip-"]' ).getAttribute( 'class' ).match( /ugb--help-tip-([\w\d-_]+)/ ) || [ '', '' ] )[ 1 ] )

const HelpToolTipVideo = props => {
	const [ target, setTarget ] = useState( null )
	const [ show, setShow ] = useState( false )
	const [ helpId, setHelpId ] = useState( '' )
	const [ tooltipsEnabled, setTooltipsEnabled ] = useState( false )

	const showHelp = elORString => {
		// If there's a currently focused element, blur it since closing the popover
		// can trigger a scroll to the previously focused element that can confuse the user.
		if ( document.activeElement ) {
			document.activeElement.blur()
		}

		const target = typeof elORString !== 'string' && elORString
		const helpId = elORString && typeof elORString !== 'string' ? getHelpId( elORString ) : elORString

		setTarget( target )
		setHelpId( helpId )
		setShow( true )
	}

	const hideHelp = () => {
		setShow( false )

		// If there are other popovers open, most likely we came from there, focus on those so that the auto-close when focus outside would work.
		const currentPopover = document.querySelector( '.components-popover .components-popover__content' )
		if ( currentPopover ) {
			currentPopover.focus()
		}
	}

	// Get the position on where to place the tooltip, but change the X & width to match the whole inspector area.
	const calculateRect = () => {
		if ( ! target ) {
			return null
		}

		const elRect = target.getBoundingClientRect()
		const sidebar = document.querySelector( '.edit-post-sidebar' )
		if ( sidebar ) {
			const inspectorRect = sidebar.getBoundingClientRect()
			elRect.x = inspectorRect.x
			elRect.width = inspectorRect.width
		}
		return elRect
	}

	const updateTooltipDisabled = enabled => {
		const model = new models.Settings( {
			stackable_help_tooltip_disabled: enabled ? '' : '1', // eslint-disable-line
		} )

		model.save()
	}

	useEffect( () => {
		// Get settings.
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setTooltipsEnabled( ! response.stackable_help_tooltip_disabled )
			} )
		} )

		// Tooptips are shown/hidden only through these triggers.
		addAction( 'stackable.help-video.show', 'stackable/help', showHelp )
		addAction( 'stackable.help-video.hide', 'stackable/help', hideHelp )

		return () => {
			removeAction( 'stackable.help-video.show', 'stackable/help' )
			removeAction( 'stackable.help-video.hide', 'stackable/help' )
		}
	}, [] )

	useEffect( () => {
		if ( tooltipsEnabled ) {
			startListening()
		} else {
			stopListening()
		}
	}, [ tooltipsEnabled ] )

	if ( ! show ) {
		return null
	}

	if ( typeof props.tooltipData[ helpId ] === 'undefined' ) {
		return null
	}

	const {
		title,
		video,
		description,
		learnMore,
	} = props.tooltipData[ helpId ]

	return (
		<HelpTooltip
			onClickClose={ hideHelp }
			getAnchorRect={ calculateRect }
			title={ title }
			description={ description }
			videoUrl={ videoUrl( video ) }
			learnMoreUrl={ learnMore }
			tooltipsEnabled={ tooltipsEnabled }
			onTooltipsEnabledChange={ enabled => {
				updateTooltipDisabled( enabled )
				setTooltipsEnabled( enabled )
			} }
		/>
	)
}

HelpToolTipVideo.defaultProps = {
	tooltipData: VIDEOS,
}

export default HelpToolTipVideo

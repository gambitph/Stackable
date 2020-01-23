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
import { Component } from '@wordpress/element'

// Provides the URL of the video. If during development, use the local copies; if production, use the CDN.
const videoUrl = video => `${ process.env.NODE_ENV === 'development' ? srcUrl : cdnUrl }/${ video }`

// Gets the Help ID from the class.
export const getHelpId = el => el && el.closest( '[class*="ugb--help-tip-"]' ) && camelCase( ( el.closest( '[class*="ugb--help-tip-"]' ).getAttribute( 'class' ).match( /ugb--help-tip-([\w\d-_]+)/ ) || [ '', '' ] )[ 1 ] )

class HelpToolTipVideo extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			target: null,
			show: false,
			helpId: '',
			rect: {},
		}
		this.showHelp = this.showHelp.bind( this )
		this.hideHelp = this.hideHelp.bind( this )
		this.calculateRect = this.calculateRect.bind( this )
	}

	showHelp( elORString ) {
		// If there's a currently focused element, blur it since closing the popover
		// can trigger a scroll to the previously focused element that can confuse the user.
		if ( document.activeElement ) {
			document.activeElement.blur()
		}

		const target = typeof elORString !== 'string' && elORString
		const helpId = elORString && typeof elORString !== 'string' ? getHelpId( elORString ) : elORString

		this.setState( {
			target,
			helpId,
			show: true,
		} )
	}

	// Get the position on where to place the tooltip, but change the X & width to match the whole inspector area.
	calculateRect() {
		if ( ! this.state.target ) {
			return null
		}

		const elRect = this.state.target.getBoundingClientRect()
		const sidebar = document.querySelector( '.edit-post-sidebar' )
		if ( sidebar ) {
			const inspectorRect = sidebar.getBoundingClientRect()
			elRect.x = inspectorRect.x
			elRect.width = inspectorRect.width
		}
		return elRect
	}

	hideHelp() {
		this.setState( {
			show: false,
		} )

		// If there are other popovers open, most likely we came from there, focus on those so that the auto-close when focus outside would work.
		const currentPopover = document.querySelector( '.components-popover .components-popover__content' )
		if ( currentPopover ) {
			currentPopover.focus()
		}
	}

	/**
	 * Tooptips are shown/hidden only through these triggers.
	 */
	componentDidMount() {
		addAction( 'stackable.help-video.show', 'stackable/help', this.showHelp )
		addAction( 'stackable.help-video.hide', 'stackable/help', this.hideHelp )
	}

	componentWillUnmount() {
		removeAction( 'stackable.help-video.show', 'stackable/help' )
		removeAction( 'stackable.help-video.hide', 'stackable/help' )
	}

	render() {
		if ( ! this.state.show ) {
			return null
		}
		if ( typeof this.props.tooltipData[ this.state.helpId ] === 'undefined' ) {
			return null
		}

		const {
			title,
			video,
			description,
			learnMore,
		} = this.props.tooltipData[ this.state.helpId ]

		return (
			<HelpTooltip
				onClickClose={ this.hideHelp }
				getAnchorRect={ this.calculateRect }
				title={ title }
				description={ description }
				videoUrl={ videoUrl( video ) }
				learnMoreUrl={ learnMore }
			/>
		)
	}
}

HelpToolTipVideo.defaultProps = {
	tooltipData: VIDEOS,
}

export default HelpToolTipVideo

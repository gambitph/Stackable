/**
 * Internal dependencies
 */
import VIDEOS from './videos'

/**
 * External dependencies
 */
import {
	i18n, srcUrl, cdnUrl,
} from 'stackable'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Popover,
	Spinner,
	Dashicon,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import domReady from '@wordpress/dom-ready'
import { Component, render } from '@wordpress/element'

const HOVER_TIMEOUT = 1500

// Provides the URL of the video. If during development, use the local copies; if production, use the CDN.
const videoUrl = video => `${ process.env.NODE_ENV === 'development' ? srcUrl : cdnUrl }/${ video }`

// Gets the Help ID from the class.
const getHelpId = el => camelCase( ( el.closest( '[class*="ugb--help-tip-"]' ).getAttribute( 'class' ).match( /ugb--help-tip-([\w\d-_]+)/ ) || [ '', '' ] )[ 1 ] )

let currentElement = null
const onHover = ( selector, hoverCallback = () => {}, hoverOutCallback = () => {} ) => {
	document.body.addEventListener( 'mouseover', ev => {
		const matchingElement = ev.target.closest( selector )
		if ( matchingElement && currentElement !== matchingElement ) {
			currentElement = matchingElement
			hoverCallback( matchingElement )
		}
	} )
	document.body.addEventListener( 'mouseout', ev => {
		const matchingElement = ev.target.closest( selector )
		if ( ev.relatedTarget && matchingElement === ev.relatedTarget.closest( selector ) ) {
			return
		}
		if ( matchingElement && currentElement === matchingElement ) {
			hoverOutCallback( currentElement )
			currentElement = null
		}
	} )
}

const onClick = ( selector, callback = () => {} ) => {
	document.body.addEventListener( 'click', ev => {
		const matchingElement = ev.target.closest( selector )
		if ( matchingElement ) {
			callback( matchingElement )
		}
	} )
}

class HelpToolTipVideo extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			target: null,
			controlEl: null,
			show: false,
			helpId: '',
			rect: {},
			showTimeout: null,
		}
		this.showHelp = this.showHelp.bind( this )
		this.hideHelp = this.hideHelp.bind( this )
		this.startHelpTimeout = this.startHelpTimeout.bind( this )
		this.stopHelpTimeout = this.stopHelpTimeout.bind( this )
		this.calculateRect = this.calculateRect.bind( this )
	}

	startHelpTimeout( el ) {
		this.setState( {
			helpTimeout: setTimeout( () => {
				this.showHelp( el )
			}, HOVER_TIMEOUT ),
		} )
	}

	stopHelpTimeout() {
		if ( this.state.helpTimeout ) {
			clearTimeout( this.state.helpTimeout )
		}
		this.setState( { helpTimeout: null } )
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.helpId !== prevState.helpId && this.state.show ) {
			// We need to do this 2 steps or else the video won't load. We can also force the video
			// to load with video.load() but that will flicker the Spinner.
			this.setState( { show: false } )
			setTimeout( () => this.setState( { show: true } ), 1 )
		}
	}

	showHelp( el ) {
		const scroll = document.querySelector( '.edit-post-sidebar' ).scrollTop
		this.setState( {
			target: el,
			controlEl: el.closest( '[class*="ugb--help-tip-"]' ),
			helpId: getHelpId( el ),
			show: true,
		} )

		// Sometimes, the scroll position might change (not sure what triggers it)
		// Bring it back to old position.
		if ( scroll !== document.querySelector( '.edit-post-sidebar' ).scrollTop ) {
			document.querySelector( '.edit-post-sidebar' ).scrollTop = scroll
		}
	}

	// Get the position on where to place the tooltip, but change the X & width to match the whole inspector area.
	calculateRect() {
		const elRect = this.state.target.getBoundingClientRect()
		const inspectorRect = document.querySelector( '.edit-post-sidebar' ).getBoundingClientRect()
		elRect.x = inspectorRect.x
		elRect.width = inspectorRect.width
		return elRect
	}

	hideHelp() {
		this.stopHelpTimeout()
		this.setState( {
			show: false,
		} )

		// If there are other popovers open, most likely we came from there, focus on those so that the auto-close when focus outside would work.
		const currentPopover = document.querySelector( '.components-popover' )
		if ( currentPopover ) {
			currentPopover.focus()
		}
	}

	/**
	 * Contains all the tooptip show/hide logic.
	 */
	componentDidMount() {
		// If hovered long enough on a control label, show the tooltip.
		onHover( '[class*="ugb--help-tip-"].components-base-control .components-base-control__label, [class*="ugb--help-tip-"].components-base-control .components-toggle-control__label, [class*="ugb--help-tip-"].components-panel__body .components-panel__body-toggle',
			el => this.startHelpTimeout( el ),
			() => this.stopHelpTimeout()
		)

		// When a control label is clicked, show the tooltip.
		onClick( '[class*="ugb--help-tip-"].components-base-control .components-base-control__label, [class*="ugb--help-tip-"].components-base-control .components-toggle-control__label', el => {
			// Show the tooltip if nothing's shown yet.
			if ( ! this.state.show ) {
				return this.showHelp( el )
			}

			if ( el === this.state.target ) {
				// If the label of the open tooltip is clicked, close the tooltip.
				this.hideHelp()
			} else {
				// If the another label is clicked, show that one instead.
				this.showHelp( el )
			}
		} )

		// Track clicks outside the tooltip and outside the current control which the tooltip belongs to.
		// Close the tooltip if clicked outside these areas.
		document.body.addEventListener( 'click', ev => {
			if ( this.state.show ) {
				if ( ! ev.target.closest( '.ugb-help-tooltip-video' ) && ev.target.closest( '[class*="ugb--help-tip-"]' ) !== this.state.controlEl ) {
					this.hideHelp()
				}
			}
		} )
	}

	render() {
		if ( ! this.state.show ) {
			return null
		}
		if ( typeof VIDEOS[ this.state.helpId ] === 'undefined' ) {
			return null
		}

		const {
			title,
			video,
			description,
			learnMore,
		} = VIDEOS[ this.state.helpId ]

		return (
			<Popover
				title={ title || __( 'Help', i18n ) }
				focusOnMount="container"
				className="ugb-help-tooltip-video"
				position="middle left"
				getAnchorRect={ this.calculateRect }
			>
				<PanelBody>
					<button className="ugb-help-tooltip-video__remove" onClick={ this.hideHelp }><Dashicon icon="no" /></button>
					<video width="600" autoPlay loop muted>
						<source src={ videoUrl( video ) } type="video/mp4" />
					</video>
					<Spinner />
					<div className="ugb-help-tooltip-video__description">
						{ title && <h4>{ title }</h4> }
						{ description }
						{ learnMore &&
							<div className="ugb-help-tooltip-video__link">
								<a href={ learnMore } target="_learn">{ __( 'Learn more', i18n ) } <Dashicon icon="external" /></a>
							</div>
						}
					</div>
				</PanelBody>
			</Popover>
		)
	}
}

domReady( () => {
	// Don't do this for old browsers.
	if ( ! Element.prototype.closest ) {
		return
	}

	const helpContainer = document.createElement( 'DIV' )
	document.querySelector( 'body' ).appendChild( helpContainer )
	render( <HelpToolTipVideo />, helpContainer )
} )

/**
 * WordPress dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks'
import {
	BaseControl, IconButton, PanelBody, Popover, ToggleControl,
} from '@wordpress/components'
import { Component, createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

// Keep the instance ID.
let buttonInstance = 1

class ButtonIconPopoverControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			open: false,
			isMouseOutside: false,
		}
		this.handleOpen = this.handleOpen.bind( this )
		this.handleClose = this.handleClose.bind( this )
		this.handleMouseLeave = this.handleMouseLeave.bind( this )
		this.handleMouseEnter = this.handleMouseEnter.bind( this )
		this.handleOnClickOutside = this.handleOnClickOutside.bind( this )
		this.buttonRef = createRef()
		this.instanceId = buttonInstance++
	}

	checkIfAttributeShouldToggleOn( attributes, blockProps ) {
		if ( ! this.props.onToggle || ! this.props.toggleAttributeName || ! this.props.toggleOnSetAttributes.length ) {
			return attributes
		}

		// Don't do anything if turned on already.
		if ( blockProps.attributes[ this.props.toggleAttributeName ] ) {
			return attributes
		}

		// Check if an attribute we're watching for was modified with a value.
		let checkToggle = false
		this.props.toggleOnSetAttributes.some( attrName => {
			if ( Object.keys( attributes ).includes( attrName ) ) {
				if ( attributes[ attrName ] !== '' ) {
					checkToggle = true
					return true
				}
			}
			return false
		} )

		// Toggle on the "show" attribute along with the other attributes being set.
		if ( checkToggle ) {
			return {
				...attributes,
				[ this.props.toggleAttributeName ]: true,
			}
		}

		return attributes
	}

	componentDidMount() {
		// Watch for attribute changes.
		addFilter( 'stackable.setAttributes', `stackable/button-icon-popover-control-${ this.instanceId }`, this.checkIfAttributeShouldToggleOn.bind( this ), 9 )

		/**
		 * Added event listener for mousedown
		 *
		 * Dragging text input in RangeControl component triggers onBlur in Popover in WP5.5.
		 * To fix this, an event listener is added which only triggers whenever a user
		 * clicks outside the Popover.
		 */
		document.addEventListener( 'mousedown', this.handleOnClickOutside )
	}

	componentWillUnmount() {
		removeFilter( 'stackable.setAttributes', `stackable/button-icon-popover-control-${ this.instanceId }` )

		// Remove event listener for moousedown
		document.removeEventListener( 'mousedown', this.handleOnClickOutside )
	}

	handleOpen() {
		this.setState( { open: ! this.state.open } )
	}

	handleClose() {
		this.setState( { open: false } )
	}

	handleMouseLeave() {
		this.setState( { isMouseOutside: true } )
	}

	handleMouseEnter() {
		this.setState( { isMouseOutside: false } )
	}

	/**
	 * Use our own click/close handler. Don't close when a popover (e.g. a colorpicker) is clicked.
If this is not used, the popover will close when a color control's custom color field (when inside the popover) is clicked.
	 *
	 * @param ev
	 */
	handleOnClickOutside( ev ) {
		const clickedElements = ev.path.filter( elements => elements.outerHTML === this.buttonRef.current.outerHTML )
		if ( this.state.isMouseOutside && clickedElements.length === 0 ) {
			this.handleClose()
		}
	}

	render() {
		return (
			<BaseControl
				help={ this.props.help }
				label={ ! this.props.onToggle && <label htmlFor={ `ugb-button-icon-control__edit-${ this.instanceId }` }>{ this.props.label }</label> }
				id="ugb-button-icon-control"
				className={ classnames( 'ugb-button-icon-control', this.props.className ) }
			>
				{ this.props.onToggle && (
					<ToggleControl
						label={ this.props.label }
						checked={ this.props.checked }
						onChange={ this.props.onToggle }
					/>
				) }
				<div className="ugb-button-icon-control__wrapper">
					{ this.props.allowReset && (
						<IconButton
							onClick={ this.props.onReset }
							className="ugb-button-icon-control__reset"
							label={ __( 'Reset', i18n ) }
							icon="image-rotate"
						/>
					) }
					<IconButton
						onClick={ this.handleOpen }
						className="ugb-button-icon-control__edit"
						label={ __( 'Edit', i18n ) }
						isDefault
						icon="edit"
						id={ `ugb-button-icon-control__edit-${ this.instanceId }` }
						ref={ this.buttonRef }
					/>
					{ this.state.open && (
						<Popover
							className="ugb-button-icon-control__popover"
							focusOnMount="container"
							anchorRef={ this.buttonRef.current }
							onMouseLeave={ this.handleMouseLeave }
							onMouseEnter={ this.handleMouseEnter }
						>
							<PanelBody>
								{ ( this.props.label || this.props.popoverLabel ) &&
									<h2 className="components-panel__body-title">{ this.props.popoverLabel || this.props.label }</h2>
								}
								{ this.props.children }
							</PanelBody>
						</Popover>
					) }
				</div>
			</BaseControl>
		)
	}
}

ButtonIconPopoverControl.defaultProps = {
	help: '',
	label: '',
	popoverLabel: '',
	className: '',
	allowReset: false,
	onReset: () => {},
	checked: false,
	onToggle: undefined,
	toggleOnSetAttributes: [],
	toggleAttributeName: '',
}

export default ButtonIconPopoverControl

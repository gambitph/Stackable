/**
 * Internal dependencies
 */
import ColorPreview from './color-preview'
import Button from '../button'

/**
 * WordPress dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks'
import {
	BaseControl, Popover, ToggleControl, ButtonGroup, PanelBody,
} from '@wordpress/components'
import {
	Component, createRef, Fragment,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import ImagePreview from './image-preview'

// Keep the instance ID.
let buttonInstance = 1

class ButtonIconPopoverControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			open: false,
			isMouseOutside: false,
			showResetPopover: false,
		}
		this.handleOpen = this.handleOpen.bind( this )
		this.handleClose = this.handleClose.bind( this )
		this.handleMouseLeave = this.handleMouseLeave.bind( this )
		this.handleMouseEnter = this.handleMouseEnter.bind( this )
		this.handleOnClickOutside = this.handleOnClickOutside.bind( this )
		this.handleReset = this.handleReset.bind( this )
		this.buttonRef = createRef()
		this.buttonRefColorPreview = createRef()
		this.buttonRefImagePreview = createRef()
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

	handleReset() {
		if ( this.props.resetPopoverTitle || this.props.resetPopoverDescription ) {
			this.setState( { showResetPopover: true } )
		} else {
			this.props.onReset()
		}
	}

	/**
	 * Use our own click/close handler. Don't close when a popover (e.g. a
	 * colorpicker) is clicked.  If this is not used, the popover will close when
	 * a color control's custom color field (when inside the popover) is clicked.
	 *
	 * @param {Event} ev Click event
	 */
	handleOnClickOutside( ev ) {
		// If the Media Manager is open, do not do anything since this might
		// interfere with how the Media Manager works.
		if ( window.wp?.media?.frame?.el?.clientHeight ) {
			return
		}

		// If the click isn't from our button, close the popup.
		if ( this.state.isMouseOutside && (
			ev.target.closest( 'button' ) !== this.buttonRef.current &&
			ev.target.closest( 'button' ) !== this.buttonRefColorPreview.current &&
			ev.target.closest( 'button' ) !== this.buttonRefImagePreview.current
		) ) {
			if ( ! ev.target.closest( '.ugb-button-icon-control__popover' ) ) {
				this.handleClose()
			}
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
						<Fragment>
							<Button
								onClick={ this.handleReset }
								className="ugb-button-icon-control__reset"
								label={ __( 'Reset', i18n ) }
								icon="image-rotate"
							/>
							{ this.state.showResetPopover && (
								<Popover
									onClickOutside={ () => this.setState( { showResetPopover: false } ) }
									focusOnMount={ false }
									position="bottom center"
								>
									<div className="components-color-picker__body">
										<h4 className="ugb-button-icon-control__text-title">
											{ this.props.resetPopoverTitle }
										</h4>
										<p className="components-base-control__help">
											{ this.props.resetPopoverDescription }
										</p>
										<ButtonGroup>
											<Button
												onClick={ () => {
													this.setState( { showResetPopover: false } )
													this.props.onReset()
												} }
												isDestructive
												isSecondary
												isSmall
											>
												{ __( 'Reset', i18n ) }
											</Button>
											<Button
												onClick={ () => this.setState( { showResetPopover: false } ) }
												isSmall
											>
												{ __( 'Cancel', i18n ) }
											</Button>
										</ButtonGroup>
									</div>
								</Popover>
							) }
						</Fragment>
					) }
					{ this.props.hasImagePreview &&
						<ImagePreview
							imageUrl={ this.props.imageUrlPreview }
							onClick={ this.handleOpen }
							_ref={ this.buttonRefImagePreview }
						/>
					}
					{ this.props.hasColorPreview &&
						<ColorPreview
							color={ this.props.colorPreview }
							onClick={ this.handleOpen }
							_ref={ this.buttonRefColorPreview }
						/>
					}
					{ this.props.renderCustomPreview && this.props.renderCustomPreview() }
					<Button
						onClick={ this.handleOpen }
						className="ugb-button-icon-control__edit"
						label={ __( 'Edit', i18n ) }
						isSecondary
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
								{ ( typeof this.props.popoverLabel !== 'undefined' ? this.props.popoverLabel : this.props.label ) &&
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
	popoverLabel: undefined,
	className: '',
	allowReset: false,
	onReset: () => {},
	checked: false,
	onToggle: undefined,
	toggleOnSetAttributes: [],
	toggleAttributeName: '',
	colorPreview: null,
	imageUrlPreview: '',
	hasColorPreview: false,
	hasImagePreview: false,
	renderCustomPreview: null,
}

export default ButtonIconPopoverControl

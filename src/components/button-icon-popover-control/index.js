/**
 * WordPress dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks'
import {
	BaseControl, IconButton, PanelBody, Popover, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { i18n } from 'stackable'

// Keep the instance ID.
let buttonInstance = 1

class ButtonIconPopoverControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			open: false,
		}
		this.handleOpen = this.handleOpen.bind( this )
		this.handleClose = this.handleClose.bind( this )
		this.handleOnClickOutside = this.handleOnClickOutside.bind( this )
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
	}

	componentWillUnmount() {
		removeFilter( 'stackable.setAttributes', `stackable/button-icon-popover-control-${ this.instanceId }` )
	}

	handleOpen() {
		if ( ! this.state.open ) {
			this.setState( { open: true } )
		}
	}

	handleClose() {
		this.setState( { open: false } )
	}

	/**
	 * Use our own click/close handler. Don't close when a popover (e.g. a colorpicker) is clicked.
	 * If this is not used, the popover will close when a color control's custom color field (when inside the popover) is clicked.
	 *
	 * @param {Event} ev Click event
	 */
	handleOnClickOutside( ev ) {
		if ( ! ev.target.closest( '.components-popover' ) ) {
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
					>
						{ this.state.open && (
							<Popover
								className="ugb-button-icon-control__popover"
								focusOnMount="container"
								onClose={ this.handleClose }
								onClickOutside={ this.handleOnClickOutside }
							>
								<PanelBody>
									{ ( this.props.label || this.props.popoverLabel ) &&
										<h2 className="components-panel__body-title">{ this.props.popoverLabel || this.props.label }</h2>
									}
									{ this.props.children }
								</PanelBody>
							</Popover>
						) }
					</IconButton>
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

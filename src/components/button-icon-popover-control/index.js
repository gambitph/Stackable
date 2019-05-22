import { BaseControl, IconButton, PanelBody, Popover } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Component } from '@wordpress/element'

class ButtonIconPopoverControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			open: false,
		}
		this.handleOpen = this.handleOpen.bind( this )
		this.handleClose = this.handleClose.bind( this )
	}

	handleOpen() {
		if ( ! this.state.open ) {
			this.setState( { open: true } )
		}
	}

	handleClose() {
		this.setState( { open: false } )
	}

	render() {
		return (
			<BaseControl
				help={ this.props.help }
				label={ this.props.label }
				className={ classnames( 'ugb-button-icon-control', this.props.className ) }
			>
				<div className="ugb-button-icon-control__wrapper">
					{ this.props.allowReset && (
						<IconButton
							onClick={ this.props.onReset }
							className="ugb-button-icon-control__reset"
							label={ __( 'Reset' ) }
							icon="image-rotate"
						/>
					) }
					<IconButton
						onClick={ this.handleOpen }
						className="ugb-button-icon-control__edit"
						label={ __( 'Edit' ) }
						isDefault
						icon="edit"
					>
						{ this.state.open && (
							<Popover
								className="ugb-button-icon-control__popover"
								focusOnMount="container"
								onClose={ this.handleClose }
							>
								<PanelBody>
									{ this.props.label && <h2 className="components-panel__body-title">{ this.props.label }</h2> }
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
	className: '',
	allowReset: false,
	onReset: () => {},
}

export default ButtonIconPopoverControl

/**
 * This does not perform the actual saving of modified designs.
 */

import {
	Button, IconButton, Modal, TextControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'

class ModalDesignManage extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isDirty: false,
			designs: this.props.designs,
		}
		this.onCancel = this.onCancel.bind( this )
		this.onSave = this.onSave.bind( this )
		this.onReset = this.onReset.bind( this )
		this.onChange = this.onChange.bind( this )
	}

	onCancel() {
		if ( this.state.isDirty ) {
			if ( ! window.confirm( __( 'You have unsaved changes, discard them?' ) ) ) { // eslint-disable-line
				return
			}
		}
		this.props.onClose()
	}

	onReset() {
		this.setState( {
			isDirty: false,
			designs: this.props.designs,
		} )
	}

	onSave() {
		this.props.onSave( this.state.designs )
		this.props.onClose()
	}

	onChange( prop, value, index ) {
		this.setState( {
			isDirty: true,
			designs: this.state.designs.map( ( design, i ) => {
				if ( i !== index ) {
					// Only one can be default.
					if ( prop === 'setAsDefault' ) {
						return {
							...design,
							setAsDefault: false,
						}
					}
					return design
				}
				return {
					...design,
					[ prop ]: value,
				}
			} ),
		} )
	}

	onRemove( index ) {
		const designs = this.state.designs.slice()
		designs.splice( index, 1 )
		this.setState( { designs } )
	}

	render() {
		return (
			<Modal
				className="ugb-modal-design-manage"
				onRequestClose={ this.onCancel }
				title={ __( 'Manage Saved Designs' ) }
			>
				<div className="ugb-modal-design-manage__designs">
					<header className="ugb-modal-design-manage__design">
						<span>{ __( 'Favorite' ) }</span>
						<span>{ __( 'Design Name' ) }</span>
						{ /* <span>{ __( 'Default' ) }</span> */ }
					</header>
					<div className="ugb-modal-design-manage__design-wrapper">
						{ this.state.designs.map( ( design, i ) => {
							return (
								<div
									key={ i }
									className="ugb-modal-design-manage__design"
								>

									<ToggleControl
										className="ugb-modal-design-manage__favorite-control"
										checked={ design.isFavorite }
										label={ __( 'Set as a favorite design' ) }
										onChange={ value => this.onChange( 'isFavorite', value, i ) }
									/>
									<TextControl
										className="ugb-modal-design-manage__name-control"
										value={ design.name }
										label={ __( 'Design name' ) }
										onChange={ value => this.onChange( 'name', value, i ) }
									/>
									{ /* <ToggleControl
										className="ugb-modal-design-manage__default-control"
										checked={ design.setAsDefault }
										label={ __( 'Set as default block design' ) }
										onChange={ value => this.onChange( 'setAsDefault', value, i ) }
									/> */ }
									<IconButton
										icon="trash"
										onClick={ () => this.onRemove( i ) }
									/>
								</div>
							)
						} ) }
					</div>
				</div>
				<div className="ugb-modal-design-manage__buttons">
					<Button isDefault onClick={ this.onCancel }>{ __( 'Cancel' ) }</Button>
					<Button className="ugb--is-reset" onClick={ this.onReset }>{ __( 'Reset' ) }</Button>
					<Button isPrimary onClick={ this.onSave }>{ __( 'Save Changes' ) }</Button>
				</div>
			</Modal>
		)
	}
}

ModalDesignManage.defaultProps = {
	designs: [],
	onSave: () => {},
	onClose: () => {},
}

export default ModalDesignManage

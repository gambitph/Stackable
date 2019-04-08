/**
 * This does not perform the actual saving of new designs.
 */

import {
	Button, Modal, TextControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'

class ModalDesignNew extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			designs: this.props.designs,
			name: __( 'My Block Design' ),
			setAsDefault: false,
			isFavorite: false,
		}
		this.onChangeName = this.onChangeName.bind( this )
		this.onBlurName = this.onBlurName.bind( this )
		this.onChangeFavorite = this.onChangeFavorite.bind( this )
		this.onChangeDefault = this.onChangeDefault.bind( this )
		this.onSave = this.onSave.bind( this )
	}

	componentDidMount() {
		// Highlight on mount doesn't work.
		setTimeout( () => {
			document.querySelector( '.components-modal__content input' ).select()
		}, 1 )
	}

	onChangeName( value ) {
		this.setState( { name: value } )
	}

	onChangeFavorite( value ) {
		this.setState( { isFavorite: value } )
	}

	onChangeDefault( value ) {
		this.setState( { setAsDefault: value } )
	}

	onSave() {
		const design = {
			name: this.state.name,
			setAsDefault: this.state.setAsDefault,
			isFavorite: this.state.isFavorite,
			attributes: this.props.blockAttributes,
		}
		this.props.onSave( design )
		this.props.onClose()
	}

	onBlurName( event ) {
		const value = event.target.value
		this.setState( { name: this.getUniqueName( value ) } )
	}

	getUniqueName( name ) {
		return this.state.designs.reduce( ( untakenName, design ) => {
			if ( design.name === name.trim() ) {
				const numMatch = name.match( /\((\d+)\)\s*$/ )
				if ( numMatch ) {
					const num = parseInt( numMatch[ 1 ], 10 ) + 1
					const newName = name.replace( /(.*?)(\(\d+\))\s*$/g, `$1(${ num })` ).trim()
					return this.getUniqueName( newName )
				}
				return this.getUniqueName( `${ name.trim() } (2)` )
			}
			return untakenName
		}, name )
	}

	render() {
		return (
			<Modal
				className="ugb-modal-design-new"
				onRequestClose={ this.props.onClose }
				title={ __( 'Save as New Block Design' ) }
			>
				<TextControl
					label={ __( 'Design Name' ) }
					value={ this.state.name }
					onChange={ this.onChangeName }
					onBlur={ this.onBlurName }
				/>
				<ToggleControl
					label={ __( 'Set as favorite' ) }
					help={ __( 'Place at the top of the list of saved designs' ) }
					checked={ this.state.isFavorite }
					onChange={ this.onChangeFavorite }
				/>
				{/* <ToggleControl
					label={ __( 'Set as default block design' ) }
					help={ __( 'New blocks created will use this design automatically' ) }
					checked={ this.state.setAsDefault }
					onChange={ this.onChangeDefault }
				/> */}
				<div className="ugb-modal-design-new__buttons">
					<Button isDefault onClick={ this.props.onClose }>{ __( 'Cancel' ) }</Button>
					<Button isPrimary onClick={ this.onSave }>{ __( 'Add New Design' ) }</Button>
				</div>
			</Modal>
		)
	}
}

ModalDesignNew.defaultProps = {
	designs: [],
	blockAttributes: {},
	onSave: () => {},
	onClose: () => {},
}

export default ModalDesignNew

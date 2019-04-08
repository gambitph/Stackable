/**
 * A Panel for pre-designed designs
 */

import { Button, IconButton } from '@wordpress/components'
import { dispatch, select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { DesignPanelBody } from '@stackable/components'
import ModalDesignManage from './modal-design-manage'
import ModalDesignNew from './modal-design-new'
import { omit } from 'lodash'
import SVGStar from './images/star.svg'

class PanelDesignUserLibrary extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isManaging: false,
			isSaving: false,
			currentBlockAttributes: {},
			designs: [ {
				name: 'Test',
				setAsDefault: false,
				isFavorite: true,
				attributes: {},
			}, {
				name: 'Me second block',
				setAsDefault: false,
				isFavorite: true,
				attributes: {},
			} ],
		}
		this.onToggleManage = this.onToggleManage.bind( this )
		this.onToggleNew = this.onToggleNew.bind( this )
		this.onSaveNewDesign = this.onSaveNewDesign.bind( this )
		this.onSaveManagedDesigns = this.onSaveManagedDesigns.bind( this )
		this.onClick = this.onClick.bind( this )
	}

	/**
	 * Order: default > favorite > alphabetical
	 *
	 * @param {Object} a
	 * @param {Object} b
	 *
	 * @return {number} order
	 */
	designSortingFunction( a, b ) {
		if ( a.setAsDefault ) {
			return -1
		}
		if ( b.setAsDefault ) {
			return 1
		}
		if ( a.isFavorite && b.isFavorite ) {
			return a.name.localeCompare( b.name )
		} else if ( a.isFavorite ) {
			return -1
		} else if ( b.isFavorite ) {
			return 1
		}
		return a.name.localeCompare( b.name )
	}

	fixDesignOrder() {
		const designs = this.state.designs.sort( this.designSortingFunction )
		this.setState( { designs } )
		return designs
	}

	onToggleManage() {
		this.setState( { isManaging: ! this.state.isManaging } )
	}

	onToggleNew() {
		const currentBlockClientID = select( 'core/editor' ).getBlockSelectionStart()
		const attributes = select( 'core/editor' ).getBlockAttributes( currentBlockClientID )
		this.setState( { currentBlockAttributes: attributes } )
		this.setState( { isSaving: ! this.state.isSaving } )
	}

	onSaveNewDesign( newDesign ) {
		const isSetAsDefault = newDesign.setAsDefault
		this.setState( {
			designs: [
				...this.state.designs.map( design => {
					return {
						...design,
						setAsDefault: isSetAsDefault ? false : design.setAsDefault,
					}
				} ),
				newDesign,
			],
		} )
	}

	onSaveManagedDesigns( designs ) {
		this.setState( { designs } )
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( JSON.stringify( this.state.designs ) !== JSON.stringify( prevState.designs ) ) {
			const designs = this.fixDesignOrder()
			// TODO save designs
			console.log('save', designs)
		}
	}

	onClick( index ) {
		const design = this.state.designs[ index ]
		const currentBlockClientID = select( 'core/editor' ).getBlockSelectionStart()
		dispatch( 'core/editor' ).updateBlockAttributes( currentBlockClientID, design.attributes )
	}

	render() {
		const {
			className = '',
			title = __( 'Saved Block Designs' ),
			help = __( 'Save designs to reuse them across your site. Note that using saved designs will override your current block settings.' ),
		} = this.props

		const mainClasses = classnames( [ 'ugb-panel-design-settings', className ] )

		return (
			<DesignPanelBody
				{ ...omit( this.props, [ 'options' ] ) }
				selectedOptionInTitle={ false }
				title={ title }
				className={ mainClasses }
				help={ help }
			>
				{ ! this.state.designs.length && (
					<IconButton
						icon="plus"
						className="ugb-panel-design-user-library__empty-save-button"
						onClick={ this.onToggleNew }
					>
						<span>{ __( 'No saved designs yet' ) }</span>
						<small>{ __( 'Click here to save your block\'s design' ) }</small>
					</IconButton>
				) }
				{ !! this.state.designs.length && (
					<div className="ugb-panel-design-user-library__buttons">
						<IconButton
							icon="plus"
							className="ugb-panel-design-user-library__save-button"
							onClick={ this.onToggleNew }
						>
							{ __( 'Save as new block design' ) }
						</IconButton>
						<IconButton
							icon="admin-generic"
							size="12"
							label={ __( 'Manage saved designs' ) }
							className={ classnames( [
								'ugb-panel-design-user-library__manage-button',
							], {
								'is-active': this.state.isManaging,
							} ) }
							onClick={ this.onToggleManage }
						/>
					</div>
				) }
				<div className="ugb-panel-design-user-library__designs-wrapper">
					{ this.state.designs.map( ( design, i ) => {
						return (
							<Button
								key={ i }
								onClick={ () => this.onClick( i ) }
							>
								{ design.name }
								{ design.setAsDefault &&
									<small>{ __( '(default)' ) }</small>
								}
								{ ! design.setAsDefault && design.isFavorite &&
									<SVGStar size="14" role="img" aria-label={ __( 'Favorite' ) }/>
								}
							</Button>
						)
					} ) }
				</div>
				{ this.state.isManaging && (
					<ModalDesignManage
						designs={ this.state.designs }
						onClose={ this.onToggleManage }
						onSave={ this.onSaveManagedDesigns }
					/>
				) }
				{ this.state.isSaving && (
					<ModalDesignNew
						designs={ this.state.designs }
						blockAttributes={ this.state.currentBlockAttributes }
						onClose={ this.onToggleNew }
						onSave={ this.onSaveNewDesign }
					/>
				) }
				{ this.props.children }
			</DesignPanelBody>
		)
	}
}

export default PanelDesignUserLibrary

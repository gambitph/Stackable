/**
 * A Panel for pre-designed designs
 */

import { Button, IconButton, Spinner } from '@wordpress/components'
import { dispatch, select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { send as ajaxSend } from '@wordpress/ajax'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { DesignPanelBody } from '@stackable/components'
import ModalDesignManage from './modal-design-manage'
import ModalDesignNew from './modal-design-new'
import { nonce } from 'stackable'
import { omit } from 'lodash'
import SVGStar from './images/star.svg'

/**
 * Keep our ajax loaded designs here for fast getting.
 */
const cachedDesigns = {}

class PanelDesignUserLibrary extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isManaging: false,
			isCreating: false,
			isSaving: false,
			isLoading: false,
			errored: false,
			firstLoad: true,
			currentBlockAttributes: {},
			currentSelected: null,
			designs: [],
		}
		this.onToggleManage = this.onToggleManage.bind( this )
		this.onToggleNew = this.onToggleNew.bind( this )
		this.onSaveNewDesign = this.onSaveNewDesign.bind( this )
		this.onSaveManagedDesigns = this.onSaveManagedDesigns.bind( this )
		this.onApplyDesign = this.onApplyDesign.bind( this )
		this.ajaxLoadDesigns = this.ajaxLoadDesigns.bind( this )
	}

	ajaxLoadDesigns() {
		this.setState( { isLoading: true } )

		ajaxSend( 'stackable_get_user_designs_library', {
			success: designs => {
				this.setState( {
					isLoading: false,
					designs: JSON.parse( designs ),
					firstLoad: false,
					errored: false,
				} )
			},
			error: message => {
				this.setState( {
					isLoading: false,
					errored: true,
				} )
				alert( message ) // eslint-disable-line no-alert
			},
			data: {
				nonce,
				block: this.props.block,
			},
		} )
	}

	componentDidMount() {
		if ( cachedDesigns[ this.props.block ] ) {
			this.setState( {
				designs: cachedDesigns[ this.props.block ],
				firstLoad: false,
			} )
			return
		}

		this.ajaxLoadDesigns()
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
		const blockName = select( 'core/editor' ).getBlockName( currentBlockClientID ).replace( /^\w+\//g, '' )
		const attributes = omit(
			select( 'core/editor' ).getBlockAttributes( currentBlockClientID ),
			applyFilters( 'stackable.user-design-library.save.ignore', this.props.ignoredAttributes, blockName ),
		)
		this.setState( { currentBlockAttributes: attributes } )
		this.setState( { isCreating: ! this.state.isCreating } )
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

	onSaveChanges( index ) {
		const currentBlockClientID = select( 'core/editor' ).getBlockSelectionStart()
		const blockName = select( 'core/editor' ).getBlockName( currentBlockClientID ).replace( /^\w+\//g, '' )
		const attributes = omit(
			select( 'core/editor' ).getBlockAttributes( currentBlockClientID ),
			applyFilters( 'stackable.user-design-library.save.ignore', this.props.ignoredAttributes, blockName ),
		)
		this.setState( {
			designs: this.state.designs.map( ( design, i ) => {
				if ( i === index ) {
					return {
						...design,
						attributes,
					}
				}
				return design
			} ),
		} )
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( JSON.stringify( this.state.designs ) !== JSON.stringify( prevState.designs ) ) {
			// Clear selection.
			if ( ! this.state.designs.length ) {
				this.setState( { currentSelected: null } )
			}

			const designs = this.fixDesignOrder()

			// Cache our new designs.
			cachedDesigns[ this.props.block ] = designs

			// On first load, don't save our designs since the inequality above
			// is because we just assigned our deisgns.
			if ( prevState.firstLoad ) {
				return
			}

			this.setState( { isSaving: true } )

			ajaxSend( 'stackable_update_user_designs_library', {
				success: () => {
					this.setState( { isSaving: false } )
				},
				error: message => {
					this.setState( { isSaving: false } )
					alert( message ) // eslint-disable-line no-alert
				},
				data: {
					nonce,
					designs: JSON.stringify( designs ),
					block: this.props.block,
				},
			} )
		}
	}

	/**
	 * Apply the attributes of a design.
	 *
	 * @param {number} index The index of the design to apply
	 */
	onApplyDesign( index ) {
		this.setState( { currentSelected: index } )
		const design = this.state.designs[ index ]
		const currentBlockClientID = select( 'core/editor' ).getBlockSelectionStart()
		const attributes = applyFilters( 'stackable.user-design-library.apply.attributes', design.attributes, currentBlockClientID )
		dispatch( 'core/editor' ).updateBlockAttributes( currentBlockClientID, attributes )
	}

	render() {
		const {
			className,
			title,
			help,
		} = this.props

		const mainClasses = classnames( [ 'ugb-panel-design-user-library', className ] )

		return (
			<DesignPanelBody
				{ ...omit( this.props, [ 'options' ] ) }
				selectedOptionInTitle={ false }
				title={ (
					<span>
						{ title }
						{ ( this.state.isSaving || this.state.isLoading ) && <Spinner /> }
					</span>
				) }
				className={ mainClasses }
				help={ help }
			>
				{ ! this.state.designs.length && ! this.state.isLoading && ! this.state.errored && (
					<IconButton
						icon="plus"
						className="ugb-panel-design-user-library__empty-save-button"
						onClick={ this.onToggleNew }
					>
						<span>{ __( 'No saved designs yet' ) }</span>
						<small>{ __( 'Click here to save your block\'s design' ) }</small>
					</IconButton>
				) }
				{ ! this.state.isLoading && this.state.errored && (
					<IconButton
						icon="warning"
						className="ugb-panel-design-user-library__empty-save-button ugb--is-error"
						onClick={ this.ajaxLoadDesigns }
					>
						<span>{ __( 'Error Getting Designs' ) }</span>
						<small>{ __( 'Click here to retry fetching your saved designs' ) }</small>
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
						if ( this.state.currentSelected === i ) {
							return (
								<div key={ i } className="ugb-panel-design-user-library__design-button">
									{ design.name }
									{ design.setAsDefault &&
										<small>{ __( '(default)' ) }</small>
									}
									{ ! design.setAsDefault && design.isFavorite &&
										<SVGStar size="14" role="img" aria-label={ __( 'Favorite' ) } />
									}
									<div>
										<Button
											isLink
											isSmall
											onClick={ () => this.onApplyDesign( i ) }
										>
											{ __( 'Reset' ) }
										</Button>
										<Button
											isDefault
											isSmall
											onClick={ () => this.onSaveChanges( i ) }
										>
											{ __( 'Save Changes' ) }
										</Button>
									</div>
								</div>
							)
						}
						return (
							<Button
								key={ i }
								onClick={ () => this.onApplyDesign( i ) }
								className="ugb-panel-design-user-library__design-button"
							>
								{ design.name }
								{ design.setAsDefault &&
									<small>{ __( '(default)' ) }</small>
								}
								{ ! design.setAsDefault && design.isFavorite &&
									<SVGStar size="14" role="img" aria-label={ __( 'Favorite' ) } />
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
				{ this.state.isCreating && (
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

PanelDesignUserLibrary.defaultProps = {
	className: '',
	title: __( 'Saved Block Designs' ),
	help: __( 'Save designs to reuse them across your site. Note that using saved designs will override your current block settings.' ),
	ignoredAttributes: [],
	block: '',
}

export default PanelDesignUserLibrary

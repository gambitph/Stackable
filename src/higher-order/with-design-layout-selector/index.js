/**
 * Higher-order component for displaying layout design selector
 * when adding a new Stackable block.
 *
 * Used in BLOCK_NAME/edit.js.
 */

/**
 * External dependencies
 */
import {
	i18n, srcUrl, isPro,
} from 'stackable'
import { applyBlockDesign } from '~stackable/util'
import { getDesigns, getDesign } from '~stackable/design-library'
import classnames from 'classnames'

/**
 * Wordpress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import {
	applyFilters, addAction, removeAction, doAction, hasFilter, addFilter, hasAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import {
	Placeholder, Icon, Button, ButtonGroup, BaseControl,
} from '@wordpress/components'
import {
	dispatch, useSelect, select,
} from '@wordpress/data'

/**
 * Internal dependencies
 */
import BasicDesignImage from './images/basic.png'

// Filter used for adding a "Layout and Preset Designs" control inside inspector General tab.
if ( ! hasFilter( 'stackable.with-design-layout-selector.switch-design-panel', 'switch-design-layout' ) ) {
	addFilter( 'stackable.with-design-layout-selector.switch-design-panel', 'switch-design-layout', () => {
		const selectedBlockId = select( 'core/block-editor' ).getSelectedBlockClientId()
		const block = select( 'core/block-editor' ).getBlocksByClientId( selectedBlockId )

		return (
			<BaseControl>
				<h5 className="ugb-design-layout-selector__filter-title">{ __( 'Layouts and Preset Designs', i18n ) }</h5>
				<div className="ugb-design-layout-selector__filter-content">
					<Icon icon="info-outline" />
					<p>{ __( 'You may switch your layout or choose a preset design from our Design Library here.', i18n ) }</p>
				</div>
				{ block && hasAction( `stackable.design-layout-selector.${ selectedBlockId }` ) && (
					<div className="ugb-design-layout-selector__filter-button-group">
						<Button
							className="ugb-design-layout-selector__filter-button"
							onClick={ () => {
								doAction( `stackable.design-layout-selector.${ selectedBlockId }`, ( { isOpen: true } ) )
							} }
							isSecondary
							isLarge
						>
							{ __( 'Switch design/layout', i18n ) }
						</Button>
					</div>
				) }
			</BaseControl>
		)
	} )
}

const LayoutDesignSelectorItem = ( {
	image,
	label,
	className,
	...otherProps
} ) => {
	const src = ! image ? '' :
	            image.match( /https?:/i ) ? image :
	            srcUrl ? `${ srcUrl }/${ image }` :
	            image

	const itemClassNames = classnames( 'ugb-design-layout-selector__item', {
		[ className ]: className,
	} )
	const imgClassNames = classnames( 'ugb-design-layout-selector__image', {
		'is-premium': ! isPro && otherProps.plan === 'premium',
	} )

	return (
		<li className={ itemClassNames } { ...otherProps }>
			<Button className="ugb-design-layout-selector__item-button">
				{ otherProps.plan && ! isPro && otherProps.plan !== 'free' && (
					<span className="ugb-design-layout-selector__premium">{ otherProps.plan }</span>
				) }
				{ src && <img className={ imgClassNames } src={ src } alt={ label } /> }
			</Button>
			{ label && <span className="ugb-design-layout-selector__label">{ label }</span> }
		</li>
	)
}

const DesignLayoutSelector = props => {
	const {
		name,
		layouts,
		isNewlyAddedBlock,
	} = props
	const basicDesign = {
		image: BasicDesignImage,
		plan: 'free',
		label: 'Basic',
		id: 'basic',
	}
	const [ designs, setDesigns ] = useState( layouts.length ? [] : isNewlyAddedBlock ? [ basicDesign ] : [] )
	const [ isBusy, setIsBusy ] = useState( true )
	const selectedLayout = props.attributes.design

	useEffect( () => {
		// Hide the inspector tab content when selector is active.
		const blockButtonElement = document.querySelector( 'button[aria-label="Block (selected)"]' )
		const sidebarPanel = document.querySelector( '.block-editor-block-inspector' )
		let blockButtonDisplay, sidebarPanelDisplay
		if ( sidebarPanel && blockButtonElement ) {
			blockButtonDisplay = blockButtonElement.style.display
			sidebarPanelDisplay = sidebarPanel.style.display
			blockButtonElement.style.display = 'none'
			sidebarPanel.style.display = 'none'
		}

		// Cleanup. Show the inspector panel.
		return () => {
			if ( sidebarPanel && blockButtonElement ) {
				blockButtonElement.style.display = blockButtonDisplay
				sidebarPanel.style.display = sidebarPanelDisplay
			}
		}
	}, [] )

	useEffect( () => {
		getDesigns( {
			type: 'block',
			block: name,
		} ).then( designs => {
			setDesigns( currDesigns => [ ...currDesigns, ...designs ] )
			setIsBusy( false )
		} )
	}, [ name, setDesigns ] )

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Pick a layout or design', i18n ) }</Fragment>
	const classNames = classnames( 'ugb-design-layout-selector', { 'is-busy': isBusy } )

	// Function for handling the switching designs.
	const handleSwitchDesign = designData => {
		const {
			attributes,
		} = designData

		// Refetch the initial blocks. Include the currently added block.
		dispatch( 'stackable/util' ).updateInitialBlocks()
		setIsBusy( false )

		// Close the layout selector
		doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) )

		// Apply the block design.
		applyBlockDesign( attributes, props.clientId )
	}

	return (
		<Placeholder
			className={ classNames }
			label={ label }
			instructions={ !! layouts.length && __( 'Select a variation to start with.', i18n ) }
		>
			{ !! layouts.length && (
				<ul className="ugb-design-layout-selector__layout-items">
					{ ( layouts || [] ).map( layout => (
						<LayoutDesignSelectorItem
							className="ugb-design-layout-selector__layout-item"
							onClick={ () => {
								doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) )
								// Manually trigger the setAttributes filter.
								const newAttributes = applyFilters( `stackable.${ name }.setAttributes`, { ...props.attributes, design: layout.value }, props )

								// Check if a custom filter exists in the block.
								if ( hasFilter( `stackable.${ name }.edit.inspector.layout.attributes` ) ) {
									props.setAttributes( applyFilters( `stackable.${ name }.edit.inspector.layout.attributes`, { ...newAttributes, design: layout.value } ) )
								} else {
									props.setAttributes( { design: layout.value } )
								}
								dispatch( 'stackable/util' ).updateInitialBlocks()
							} }
							key={ layout.label }
							{ ...layout }
						/>
					) ) }
				</ul>
			) }
			{ !! designs.length && (
				<div className="ugb-design-layout-selector__design-library">
					<div className="components-placeholder__instructions" >
						{ !! layouts.length && __( 'Or pick from our Design Library.', i18n ) }
						{ ! layouts.length && __( 'Select a design from our library to start with.', i18n ) }
					</div>
					<div className="components-placeholder__fieldset ugb-design-layout-selector__design-container">
						<ul className="ugb-design-layout-selector__design-items">
							{ ( designs || [] ).map( design => {
								const passedProps = {
									image: design.image,
									plan: design.plan,
								}
								return (
									<LayoutDesignSelectorItem
										className="ugb-design-layout-selector__design-item"
										onClick={ () => {
											// Should not be selected if not premium user
											if ( ! isPro && design.plan !== 'free' ) {
												return
											}
											setIsBusy( true )
											if ( design.id === 'basic' ) {
												setIsBusy( false )
												// Close the layout selector
												doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) )
												return
											}
											getDesign( design.id ).then( handleSwitchDesign ).catch( () => {
												setIsBusy( false )
											} )
										} }
										key={ design.label }
										{ ...passedProps } />
								)
							} ) }
						</ul>
					</div>
				</div>
			) }
			<div className="ugb-design-layout-selector__open-design-library">
				<ButtonGroup>
					{ selectedLayout !== '' && (
						<Button
							isLink
							isLarge
							onClick={ () => doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) ) }
						>
							{ isNewlyAddedBlock ? __( 'Skip', i18n ) : __( 'Cancel', i18n ) }
						</Button>
					) }
				</ButtonGroup>
			</div>
		</Placeholder>
	)
}

const withDesignLayoutSelector = createHigherOrderComponent(
	WrappedComponent => props => {
		const [ isOpen, setIsOpen ] = useState( false )
		const name = props.name.split( '/' )[ 1 ]
		const layouts = applyFilters( `stackable.${ name }.edit.layouts`, [] )
		const { isExistingBlock, isSelectedBlock } = useSelect( select => ( {
			isExistingBlock: select( 'stackable/util' ).getInitialBlockClientId( props.clientId ),
			isSelectedBlock: select( 'core/block-editor' ).getSelectedBlockClientId(),
		} ) )
		const [ isNewlyAddedBlock, setIsNewlyAddedBlock ] = useState( false )

		// Close the selector when the block is not already selected.
		useEffect( () => {
			if ( ! isNewlyAddedBlock && isSelectedBlock !== props.clientId ) {
				setIsOpen( false )
			}
		}, [ isSelectedBlock ] )

		useEffect( () => {
			// Allow control of isOpen from other sources by clientId.
			addAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle', ( { isOpen: newSetIsOpen, isNewlyAddedBlock: newIsNewlyAddedBlock } ) => {
				if ( newSetIsOpen !== undefined ) {
					setIsOpen( newSetIsOpen )
				}

				if ( newIsNewlyAddedBlock !== undefined ) {
					setIsNewlyAddedBlock( newIsNewlyAddedBlock )
				}
			} )

			return () => {
				removeAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle' )
			}
		}, [] )

		// Side effect for isExistingBlock.
		useEffect( () => {
			// When the editor recognizes that the block is newly added, show the selector.
			if ( isExistingBlock === null ) {
				setIsOpen( true )
				setIsNewlyAddedBlock( true )
			}
		}, [ isExistingBlock ] )

		if ( isOpen ) {
			return <DesignLayoutSelector { ...{
				...props, name, layouts, isNewlyAddedBlock,
			} } />
		}
		return <WrappedComponent { ...props } />
	},
	'withDesignLayoutSelector'
)

export default withDesignLayoutSelector


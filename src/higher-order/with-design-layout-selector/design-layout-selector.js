
/**
 * External dependencies
 */
import {
	i18n, isPro,
} from 'stackable'
import { applyBlockDesign } from '~stackable/util'
import { getDesigns, getDesign } from '~stackable/design-library'
import classnames from 'classnames'

/**
 * Wordpress dependencies
 */
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import {
	applyFilters, doAction, hasFilter,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import {
	Placeholder, Icon, Button, ButtonGroup,
} from '@wordpress/components'
import { dispatch } from '@wordpress/data'

/**
 * Internal dependencies
 */
import BasicDesignImage from './images/basic.png'
import DesignLayoutSelectorItem from './design-layout-selector-item'

const basicDesign = {
	image: BasicDesignImage,
	plan: 'free',
	label: 'Basic',
	id: 'basic',
}

const DesignLayoutSelector = props => {
	const {
		name,
		layouts,
		isNewlyAddedBlock,
		isSelectedBlock,
	} = props
	const selectedLayout = props.attributes.design

	const [ designs, setDesigns ] = useState( layouts.length ? [] : isNewlyAddedBlock ? [ basicDesign ] : [] )
	const [ isBusy, setIsBusy ] = useState( true )

	useEffect( () => {
		const blockButtonElement = document.querySelector( 'button[data-label="Block"]' )
		const sidebarPanel = document.querySelector( '.block-editor-block-inspector' )

		getDesigns( {
			type: 'block',
			block: name,
		} ).then( designs => {
			setDesigns( currDesigns => [ ...currDesigns, ...designs ] )
			setIsBusy( false )
		} )

		// Hide the sidebar panel and block tab.
		if ( blockButtonElement && sidebarPanel ) {
			blockButtonElement.style.opacity = '0'
			sidebarPanel.style.opacity = '0'
		}

		return () => {
			if ( blockButtonElement && sidebarPanel ) {
				blockButtonElement.style.opacity = '1'
				sidebarPanel.style.opacity = '1'
			}
		}
	}, [] )

	// Close the selector when the block is not already selected.
	useEffect( () => {
		if ( isSelectedBlock !== props.clientId ) {
			// Close the layout selector.
			doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false } ) )
		}
	}, [ isSelectedBlock, isNewlyAddedBlock ] )

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Pick a layout or design', i18n ) }</Fragment>
	const classNames = classnames( 'ugb-design-layout-selector', { 'is-busy': isBusy } )

	const layoutInstructions = isNewlyAddedBlock ? __( 'Select a variation to start with.', i18n ) : __( 'Select a variation.', i18n )
	const designInstructions = isNewlyAddedBlock ? __( 'Select a design from our library to start with.', i18n ) : __( 'Select a design from our library.', i18n )

	const layoutItems = !! layouts.length && (
		<ul className="ugb-design-layout-selector__layout-items">
			{ ( layouts || [] ).map( layout => (
				<DesignLayoutSelectorItem
					className="ugb-design-layout-selector__layout-item"
					onClick={ () => {
						const { updateInitialBlocks } = dispatch( 'stackable/util' )
						const { setAttributes } = props

						// Close the layout selector.
						doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) )

						// Manually trigger the setAttributes filter.
						const newAttributes = applyFilters( `stackable.${ name }.setAttributes`, {
							...props.attributes,
							design: layout.value,
						},
						props )

						// Check if a custom filter exists in the block.
						if ( hasFilter( `stackable.${ name }.edit.inspector.layout.attributes` ) ) {
							setAttributes( applyFilters( `stackable.${ name }.edit.inspector.layout.attributes`, newAttributes ) )
						} else {
							setAttributes( { design: layout.value } )
						}

						updateInitialBlocks()
					} }

					key={ layout.label }
					{ ...layout }
				/>
			) ) }
		</ul>
	)

	const designItems = !! designs.length && (
		<div className="ugb-design-layout-selector__design-library">
			<div className="components-placeholder__instructions" >
				{ !! layouts.length && __( 'Or pick from our Design Library.', i18n ) }
				{ ! layouts.length && designInstructions }
			</div>
			<div className="components-placeholder__fieldset ugb-design-layout-selector__design-container">
				<ul className="ugb-design-layout-selector__design-items">
					{ ( designs || [] ).map( design => {
						const passedProps = {
							image: design.image,
							plan: design.plan,
						}
						return (
							<DesignLayoutSelectorItem
								className="ugb-design-layout-selector__design-item"
								onClick={ () => {
									const { updateInitialBlocks } = dispatch( 'stackable/util' )

									// Should not be selected if not premium user
									if ( ! isPro && design.plan !== 'free' ) {
										return
									}

									setIsBusy( true )

									// If chosen design is basic, just close the layout selector.
									if ( design.id === 'basic' ) {
										setIsBusy( false )
										// Close the layout selector
										doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) )
										return
									}

									getDesign( design.id )
										.then( designData => {
											const {
												attributes,
											} = designData

											setIsBusy( false )

											// Refetch the initial blocks. Include the currently added block.
											updateInitialBlocks()

											// Close the layout selector
											doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false, isNewlyAddedBlock: false } ) )

											// Apply the block design.
											applyBlockDesign( attributes, props.clientId )
										} )
										.catch( () => {
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
	)

	return (
		<Placeholder
			className={ classNames }
			label={ label }
			instructions={ !! layouts.length && layoutInstructions }
		>
			{ layoutItems }
			{ designItems }
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

DesignLayoutSelector.defaultProps = {
	name: '',
	layouts: [],
	isNewlyAddedBlock: false,
	isSelectedBlock: true,
}

export default DesignLayoutSelector


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

const DesignLayoutSelectorItem = ( {
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

DesignLayoutSelectorItem.defaultProps = {
	name: '',
	label: '',
	className: '',
}

const DesignLayoutSelector = props => {
	const {
		name,
		layouts,
		isNewlyAddedBlock,
		isSelectedBlock,
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

	// Close the selector when the block is not already selected.
	useEffect( () => {
		if ( isSelectedBlock !== props.clientId ) {
			// Close the layout selector.
			doAction( `stackable.design-layout-selector.${ props.clientId }`, ( { isOpen: false } ) )
		}
	}, [ isSelectedBlock, isNewlyAddedBlock ] )

	useEffect( () => {
		const blockButtonElement = document.querySelector( 'button[data-label="Block"]' )
		const sidebarPanel = document.querySelector( '.block-editor-block-inspector' )

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

	const layoutInstructions = isNewlyAddedBlock ? __( 'Select a variation to start with.', i18n ) : __( 'Select a variation.', i18n )
	const designInstructions = isNewlyAddedBlock ? __( 'Select a design from our library to start with.', i18n ) : __( 'Select a design from our library.', i18n )

	return (
		<Placeholder
			className={ classNames }
			label={ label }
			instructions={ !! layouts.length && layoutInstructions }
		>
			{ !! layouts.length && (
				<ul className="ugb-design-layout-selector__layout-items">
					{ ( layouts || [] ).map( layout => (
						<DesignLayoutSelectorItem
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

DesignLayoutSelector.defaultProps = {
	name: '',
	layouts: [],
	isNewlyAddedBlock: false,
	isSelectedBlock: true,
}

export default DesignLayoutSelector

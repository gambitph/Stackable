
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
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import {
	Placeholder, Icon, Button, ButtonGroup, Spinner,
} from '@wordpress/components'

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
		isNewlyAddedBlock,
	} = props

	const [ layouts, setLayouts ] = useState( [] )
	const [ designs, setDesigns ] = useState( layouts.length ? [] : isNewlyAddedBlock ? [ basicDesign ] : [] )
	const [ isBusy, setIsBusy ] = useState( true )

	useEffect( () => {
		const name = props.name.split( '/' )[ 1 ]
		setLayouts( applyFilters( `stackable.${ name }.edit.layouts`, [] ).map( layout => ( { ...layout, plan: layout.premium ? 'premium' : 'free' } ) ) )

		let isMounted = true
		const blockButtonElement = document.querySelector( 'button[data-label="Block"]' )
		const sidebarPanel = document.querySelector( '.block-editor-block-inspector' )

		getDesigns( {
			type: 'block',
			block: name,
		} ).then( designs => {
			if ( isMounted ) {
				setDesigns( currDesigns => [ ...currDesigns, ...designs ] )
				setIsBusy( false )
			}
		} )

		// Hide the sidebar panel and block tab.
		if ( blockButtonElement && sidebarPanel ) {
			blockButtonElement.style.opacity = '0'
			sidebarPanel.style.opacity = '0'
		}

		return () => {
			isMounted = false
			if ( blockButtonElement && sidebarPanel ) {
				blockButtonElement.style.opacity = '1'
				sidebarPanel.style.opacity = '1'
			}
		}
	}, [] )

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Pick a layout or design', i18n ) }</Fragment>
	const classNames = classnames( 'ugb-design-layout-selector', { 'is-busy': isBusy } )

	const layoutInstructions = isNewlyAddedBlock ? __( 'Select a variation to start with.', i18n ) : __( 'Select a variation.', i18n )
	const designInstructions = isNewlyAddedBlock ? __( 'Select a design from our library to start with.', i18n ) : __( 'Select a design from our library.', i18n )

	const layoutItems = !! layouts.length && (
		<div className="ugb-design-layout-selector__layout-items">
			{ ( layouts.filter( layout => ! applyFilters( `stackable.${ name }.edit.inspector.layout.excludeDesigns`, [] ).includes( layout.value ) ) || [] ).map( layout => (
				<DesignLayoutSelectorItem
					className="ugb-design-layout-selector__layout-item"
					onClick={ () => {
						if ( layout.premium && ! isPro ) {
							return
						}

						const { setAttributes } = props
						setAttributes( { design: layout.value } )
					} }
					key={ layout.label }
					{ ...layout }
				/>
			) ) }
		</div>
	)

	const designItems = !! designs.length && (
		<div className="ugb-design-layout-selector__design-library">
			<div className="components-placeholder__fieldset ugb-design-layout-selector__design-container">
				<div className="ugb-design-layout-selector__design-items">
					{ ( designs || [] ).map( design => {
						const passedProps = {
							image: design.image,
							plan: design.plan,
							label: design.label,
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

									getDesign( design.id )
										.then( designData => {
											setIsBusy( false )
											applyBlockDesign( designData.attributes, props.clientId )
										} )
										.catch( () => {
											setIsBusy( false )
										} )
								} }

								key={ design.label }
								{ ...passedProps } />
						)
					} ) }
				</div>
			</div>
		</div>
	)

	return (
		<Placeholder
			className={ classNames }
			label={ label }
		>
			{ isBusy && <div className="ugb-design-layout-selector__spinner" data-testid="spinner"><Spinner /></div> }
			<div className="ugb-design-layout-selector__content">
				{ !! layouts.length &&
					<div className="components-placeholder__instructions">{ layoutInstructions }</div>
				}
				{ layoutItems }
				{ !! designs.length &&
					<div className="components-placeholder__instructions" >
						{ !! layouts.length && __( 'Or pick from our Design Library.', i18n ) }
						{ ! layouts.length && designInstructions }
					</div>
				}
				{ designItems }
			</div>
			<div className="ugb-design-layout-selector__close-button">
				<ButtonGroup>
					<Button
						isLink
						isLarge
						onClick={ () => {
							if ( layouts.length ) {
								const layout = layouts.find( layout => {
									return ! isPro ? ! layout.premium : true
								} )

								const { setAttributes } = props
								setAttributes( { design: layout.value } )
							}
						} }
					>
						{ __( 'Skip', i18n ) }
					</Button>
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

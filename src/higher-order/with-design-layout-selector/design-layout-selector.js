/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
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
	} = props

	const [ layouts, setLayouts ] = useState( [] )
	const [ designs, setDesigns ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( false )
	const [ isDesignBusy, setIsDesignBusy ] = useState( true )

	useEffect( () => {
		const isMounted = true
		const name = props.name.split( '/' )[ 1 ]
		const layouts = applyFilters( `stackable.${ name }.edit.layouts`, [] ).map( layout => ( { ...layout, plan: layout.premium ? 'premium' : 'free' } ) )

		// If there are no layouts, then allow the user to selec the default look and not be forced to pick from the design library.
		setLayouts( layouts.length ? layouts : [ basicDesign ] )

		// Get the designs.
		getDesigns( {
			type: 'block',
			block: name,
		} ).then( designs => {
			if ( isMounted ) {
				setDesigns( designs )
				setIsDesignBusy( false )

				// If there are no layouts and designs available, just pick the first one right away.
				if ( ! designs.length && layouts.length <= 1 ) {
					props.setAttributes( { design: layouts[ 0 ]?.value || basicDesign.id } )
				}
			}
		} )
	}, [] )

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Pick a layout or design', i18n ) }</Fragment>

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

	const designClassNames = classnames( 'ugb-design-layout-selector__design-library', { 'is-busy': isDesignBusy } )
	const designItems = !! designs.length && (
		<div className={ designClassNames }>
			<div className="components-placeholder__fieldset ugb-design-layout-selector__design-container">
				{ isDesignBusy && <div className="ugb-design-layout-selector__spinner" data-testid="spinner"><Spinner /></div> }
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

	const classNames = classnames( 'ugb-design-layout-selector', { 'is-busy': isBusy } )
	return (
		<Placeholder
			className={ classNames }
			label={ label }
		>
			{ isBusy && <div className="ugb-design-layout-selector__spinner" data-testid="spinner"><Spinner /></div> }
			<div className="ugb-design-layout-selector__content">
				{ !! layouts.length &&
					<div className="components-placeholder__instructions">{ __( 'Select a variation to start with.', i18n ) }</div>
				}
				{ layoutItems }
				{ !! designs.length &&
					<div className="components-placeholder__instructions" >
						{ !! layouts.length && __( 'Or pick from our Design Library.', i18n ) }
						{ ! layouts.length && __( 'Select a design from our library to start with.', i18n ) }
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
				{ ! isPro && showProNotice &&
					<p className="ugb-design-layout-selector__notice">{ __( 'You can hide premium hints in the settings', i18n ) }</p>
				}
			</div>
		</Placeholder>
	)
}

DesignLayoutSelector.defaultProps = {
	name: '',
}

export default DesignLayoutSelector

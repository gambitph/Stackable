/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'

/**
 * External dependencies
 */
import { BlockContainer } from '~stackable/components'
import { i18n, srcUrl } from 'stackable'
import { getDesigns } from '~stackable/design-library'
import classnames from 'classnames'

/**
 * Wordpress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import {
	Placeholder, Icon, Button, Spinner, ButtonGroup,
} from '@wordpress/components'

const LayoutDesignSelectorItem = ( {
	image, active, label, ...otherProps
} ) => {
	const src = ! image ? '' :
	            image.match( /https?:/i ) ? image :
	            srcUrl ? `${ srcUrl }/${ image }` :
	            image

	const imgClassNames = classnames( 'ugb-design-layout-selector__image', { active } )

	return (
		<div className="ugb-design-layout-selector__item" { ...otherProps }>
			{ otherProps.plan && <span className="ugb-design-layout-selector__premium">{ otherProps.plan }</span> }
			{ src && <img className={ imgClassNames } src={ src } alt={ label } /> }
			<span className="ugb-design-layout-selector__label">{ label }</span>
		</div>
	)
}

const LayoutDesignSelector = props => {
	const name = props.name.split( '/' )[ 1 ]
	const [ designs, setDesigns ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ selectedLayout, setSelectedLayout ] = useState( '' )
	const [ selectedDesign, setSelectedDesign ] = useState( '' )

	useEffect( () => {
		getDesigns( {
			type: 'block',
			block: name,
		} ).then( designs => {
			setDesigns( designs )
			setIsBusy( false )
		} )

		setSelectedLayout( props.attributes.design )
	}, [ name, setDesigns, props.attributes.design, setSelectedLayout ] )

	const layouts = applyFilters( `stackable.${ name }.edit.layouts`, [
		{
			label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
		},
		{
			label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
		},
	] )

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Layout Options', i18n ) }</Fragment>

	return (
		<Fragment>
			<Placeholder
				label={ label }
				instructions={ __( 'Select a variation to start with.', i18n ) }
			>
				<div className="ugb-design-layout-selector__layout-items">
					{ ( layouts || [] ).map( layout => (
						<LayoutDesignSelectorItem
							onClick={ () => setSelectedLayout( layout.value ) }
							key={ layout.label }
							active={ selectedLayout === layout.value }
							{ ...layout } /> ) ) }
				</div>
				<div className="ugb-design-layout-selector__design-library">
					<div className="components-placeholder__instructions" >
						{ __( 'You may also select one of our preset designs from our Design Library.', i18n ) }
					</div>
					<div className="components-placeholder__fieldset ugb-design-layout-selector__design-container">
						<div className="ugb-design-layout-selector__design-items">
							{ isBusy && <Spinner /> }
							{ ! isBusy && ( designs || [] ).map( design => {
								const passedProps = {
									label: design.label,
									image: design.image,
									plan: design.plan,
								}
								return (
									<LayoutDesignSelectorItem
										onClick={ () => setSelectedDesign( design.label ) }
										key={ design.label }
										active={ selectedDesign === design.label }
										{ ...passedProps } />
								)
							} ) }
						</div>
					</div>
					<div className="ugb-design-layout-selector__open-design-library">
						<ButtonGroup>
							<Button
								isSecondary
								isLarge
							>{ __( 'Open Design Library', i18n ) }</Button>
							{ selectedLayout !== '' && <Button
								isLink
								onClick={ () => {
									props.setAttributes( { design: selectedLayout } )
									// TODO: Add handle change design.
								} }
							>
								{ __( 'Done', i18n ) }
							</Button> }
						</ButtonGroup>
					</div>
				</div>
			</Placeholder>
		</Fragment> )
}

const withLayoutDesignSelector = createHigherOrderComponent(
	WrappedComponent => props => {
		if ( props.attributes.design === 'basic' ) {
			return <LayoutDesignSelector { ...props } />
		}
		return <WrappedComponent { ...props } />
	},
	'withLayoutDesignSelector'
)

export default withLayoutDesignSelector


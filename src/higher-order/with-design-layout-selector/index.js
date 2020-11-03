/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'

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
	applyFilters, addAction, removeAction, doAction,
} from '@wordpress/hooks'
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

	const imgClassNames = classnames( 'ugb-design-layout-selector__image', {
		active,
		'is-premium': ! isPro && otherProps.plan === 'premium',
	} )

	return (
		<div className={ 'ugb-design-layout-selector__item' } { ...otherProps }>
			{ otherProps.plan && ! isPro && otherProps.plan !== 'free' && (
				<span className="ugb-design-layout-selector__premium">{ otherProps.plan }</span>
			) }
			{ src && <img className={ imgClassNames } src={ src } alt={ label } /> }
			<span className="ugb-design-layout-selector__label">{ label }</span>
		</div>
	)
}

const LayoutDesignSelector = props => {
	const name = props.name.split( '/' )[ 1 ]
	const [ designs, setDesigns ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( true )
	const selectedLayout = props.attributes.design

	useEffect( () => {
		getDesigns( {
			type: 'block',
			block: name,
		} ).then( designs => {
			setDesigns( designs )
			setIsBusy( false )
		} )
	}, [ name, setDesigns ] )

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
		<Placeholder
			className="ugb-design-layout-selector"
			label={ label }
			instructions={ __( 'Select a variation to start with.', i18n ) }
		>
			<div className="ugb-design-layout-selector__layout-items">
				{ ( layouts || [] ).map( layout => (
					<LayoutDesignSelectorItem
						onClick={ () => {
							doAction( `stackable.design-layout-selector.${ props.clientId }`, false )
							props.setAttributes( { design: layout.value } )
						} }
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
									onClick={ () => {
										// Should not be selected if not premium user
										if ( ! isPro && design.plan !== 'free' ) {
											return
										}
										getDesign( design.id ).then( designData => {
											const {
												attributes,
											} = designData
											doAction( `stackable.design-layout-selector.${ props.clientId }`, false )
											applyBlockDesign( attributes )
										} )
									} }
									key={ design.label }
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
						>
							{ __( 'Open Design Library', i18n ) }
						</Button>
						{ selectedLayout !== '' && (
							<Button
								isLink
								isLarge
								onClick={ () => doAction( `stackable.design-layout-selector.${ props.clientId }`, false ) }
							>
								{ __( 'Close', i18n ) }
							</Button>
						) }
					</ButtonGroup>
				</div>
			</div>
		</Placeholder>
	)
}

const withLayoutDesignSelector = createHigherOrderComponent(
	WrappedComponent => props => {
		const [ isOpen, setIsOpen ] = useState( false )

		useEffect( () => {
			addAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle', toggle => {
				setIsOpen( toggle )
			} )

			return () => {
				removeAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle' )
			}
		}, [] )

		if ( isOpen || props.attributes.design === '' ) {
			return <LayoutDesignSelector { ...props } />
		}
		return <WrappedComponent { ...props } />
	},
	'withLayoutDesignSelector'
)

export default withLayoutDesignSelector


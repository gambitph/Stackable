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
	Placeholder, Icon, Button, ButtonGroup,
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

// List of default layout attributes which will be applied when applying a design.
const defaultLayouts = {
	[ `accordion` ]: 'basic',
	[ `blockquote` ]: 'plain',
	[ `blog-posts` ]: 'basic',
	[ `button` ]: 'basic',
	[ `call-to-action` ]: 'basic',
	[ `card` ]: 'basic',
	[ `columns` ]: 'plain',
	[ `container` ]: 'basic',
	[ `count-up` ]: 'plain',
	[ `divider` ]: 'basic',
	[ `feature` ]: 'plain',
	[ `feature-grid` ]: 'basic',
	[ `header` ]: 'basic',
	[ `image-box` ]: 'basic',
	[ `notification` ]: 'basic',
	[ `number-box` ]: 'basic',
	[ `pricing-box` ]: 'basic',
	[ `separator` ]: 'wave-1',
	[ `team-member` ]: 'basic',
	[ `testimonial` ]: 'basic',
	[ `text` ]: 'plain',
}

const DesignLayoutSelector = props => {
	const {
		name,
		layouts,
	} = props
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

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Layout Options', i18n ) }</Fragment>
	const classNames = classnames( 'ugb-design-layout-selector', { 'is-busy': isBusy } )

	return (
		<Placeholder
			className={ classNames }
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
			{ !! designs.length && (
				<div className="ugb-design-layout-selector__design-library">
					<div className="components-placeholder__instructions" >
						{ __( 'You may also select one of our preset designs from our Design Library.', i18n ) }
					</div>
					<div className="components-placeholder__fieldset ugb-design-layout-selector__design-container">
						<div className="ugb-design-layout-selector__design-items">
							{ ( designs || [] ).map( design => {
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
											setIsBusy( true )
											getDesign( design.id ).then( designData => {
												const {
													attributes,
												} = designData

												// If no design attribute is set, set the default value.
												if ( ! attributes.design ) {
													attributes.design = defaultLayouts[ name ]
												}
												setIsBusy( false )
												doAction( `stackable.design-layout-selector.${ props.clientId }`, false )
												applyBlockDesign( attributes )
											} ).catch( () => {
												setIsBusy( false )
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
			) }
		</Placeholder>
	)
}

const withDesignLayoutSelector = createHigherOrderComponent(
	WrappedComponent => props => {
		const [ isOpen, setIsOpen ] = useState( false )
		const name = props.name.split( '/' )[ 1 ]
		const layouts = applyFilters( `stackable.${ name }.edit.layouts`, [] )

		useEffect( () => {
			addAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle', toggle => {
				setIsOpen( toggle )
			} )

			return () => {
				removeAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle' )
			}
		}, [] )

		if ( layouts.length && ( isOpen || props.attributes.design === '' ) ) {
			return <DesignLayoutSelector { ...{
				...props, name, layouts,
			} } />
		}
		return <WrappedComponent { ...props } />
	},
	'withDesignLayoutSelector'
)

export default withDesignLayoutSelector


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
import { useSelect } from '@wordpress/data'

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

	const label = <Fragment><Icon icon="admin-settings" />{ __( 'Pick a layout or design', i18n ) }</Fragment>
	const classNames = classnames( 'ugb-design-layout-selector', { 'is-busy': isBusy } )

	const handleSwitchDesign = designData => {
		const {
			attributes,
		} = designData

		setIsBusy( false )
		doAction( `stackable.design-layout-selector.${ props.clientId }`, false )
		applyBlockDesign( attributes )
	}

	return (
		<Placeholder
			className={ classNames }
			label={ label }
			instructions={ !! layouts.length && __( 'Select a variation to start with.', i18n ) }
		>
			{ !! layouts.length && (
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
			) }
			{ !! designs.length && (
				<div className="ugb-design-layout-selector__design-library">
					<div className="components-placeholder__instructions" >
						{ !! layouts.length && __( 'You may also select one of our preset designs from our Design Library.', i18n ) }
						{ ! layouts.length && __( 'Choose one of our preset designs from our Design Library.', i18n ) }
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
											getDesign( design.id ).then( handleSwitchDesign ).catch( () => {
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
			) }
			<div className="ugb-design-layout-selector__open-design-library">
				<ButtonGroup>
					{ selectedLayout !== '' && (
						<Button
							isLink
							isLarge
							onClick={ () => doAction( `stackable.design-layout-selector.${ props.clientId }`, false ) }
						>
							{ __( 'Cancel', i18n ) }
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
		const isExistingBlock = useSelect( select => select( 'stackable/util' ).getInitialBlockClientId( props.clientId ) )

		useEffect( () => {
			// Allow control of isOpen from other sources by clientId.
			addAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle', toggle => {
				setIsOpen( toggle )
			} )

			return () => {
				removeAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle' )
			}
		}, [] )

		/**
		 * Side effect for isExistingBlock.
		 */
		useEffect( () => {
			// If the block is newly added, setIsOpen to true.
			if ( isExistingBlock !== undefined && isExistingBlock === null ) {
				setIsOpen( true )
			}
		}, [ JSON.stringify( isExistingBlock ) ] )

		if ( isOpen ) {
			return <DesignLayoutSelector { ...{
				...props, name, layouts,
			} } />
		}
		return <WrappedComponent { ...props } />
	},
	'withDesignLayoutSelector'
)

export default withDesignLayoutSelector


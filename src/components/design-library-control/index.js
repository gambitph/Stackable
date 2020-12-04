/**
 * Internal dependencies
 */
import AdvancedToolbarControl from '../advanced-toolbar-control'

/**
 * External dependencies
 */
import {
	DesignLibraryList, ModalDesignLibrary,
} from '~stackable/components'
import { getDesigns } from '~stackable/design-library'
import { isPro, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	TextControl, Button,
} from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const DesignLibraryControl = props => {
	const [ isLibraryOpen, setIsLibraryOpen ] = useState( false )
	const [ search, setSearch ] = useState( '' )
	const [ designs, setDesigns ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ plan, setPlan ] = useState( '' )

	useEffect( () => {
		let isMounted = true
		getDesigns( {
			type: 'block',
			block: props.block,
			search,
		} ).then( designs => {
			if ( isMounted ) {
				setDesigns( designs )
			}
		} ).finally( () => {
			if ( isMounted ) {
				setIsBusy( false )
			}
		} )
		return () => {
			isMounted = false
		}
	}, [ props.block, search ] )

	return (
		<div>
			<Button
				className="ugb-design-library-control__open-library"
				label={ __( 'Open Design Library', i18n ) }
				isSmall
				isLink
				onClick={ () => setIsLibraryOpen( true ) }
			>{ __( 'Open Design Library', i18n ) }</Button>
			<TextControl
				placeholder={ __( 'E.g. light, dark, red, minimalist...', i18n ) }
				value={ search }
				onChange={ search => setSearch( search ) }
			/>
			{ ! isPro &&
				<AdvancedToolbarControl
					controls={ [
						{
							value: '',
							custom: <span className="ugb-advanced-toolbar-control__text-button ugb-design-library-control__open-library__toolbar">{ __( 'All', i18n ) }<span>{ designs.length }</span></span>,
						},
						{
							value: 'free',
							custom: <span className="ugb-advanced-toolbar-control__text-button ugb-design-library-control__open-library__toolbar">{ __( 'Free', i18n ) }<span>{ designs.reduce( ( sum, { plan } ) => sum + ( plan === 'free' ? 1 : 0 ), 0 ) }</span></span>,
						},
						{
							value: 'premium',
							custom: <span className="ugb-advanced-toolbar-control__text-button ugb-design-library-control__open-library__toolbar">{ __( 'Premium', i18n ) }<span>{ designs.reduce( ( sum, { plan } ) => sum + ( plan !== 'free' ? 1 : 0 ), 0 ) }</span></span>,
						},
					] }
					value={ plan }
					onChange={ plan => setPlan( plan ) }
				/>
			}
			<DesignLibraryList
				designs={ designs.filter( ( { plan: designPlan } ) => plan ? designPlan === plan : true ) }
				isBusy={ isBusy }
				onSelect={ props.onSelect }
			/>
			{ isLibraryOpen &&
				<ModalDesignLibrary
					search={ search }
					selectedBlock={ props.block }
					onClose={ () => {
						setIsLibraryOpen( false )
						setSearch( '' )
					} }
					onSelect={ designData => {
						props.onSelect( designData )
						setIsLibraryOpen( false )
					} }
				/>
			}
		</div>
	)
}

DesignLibraryControl.defaultProps = {
	block: '',
	onSelect: () => {},
}

export default DesignLibraryControl

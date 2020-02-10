/**
 * Externak dependencies
 */
import {
	DesignLibraryList, ModalDesignLibrary,
} from '~stackable/components'
import { getDesigns } from '~stackable/design-library'
import { i18n } from 'stackable'

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

	useEffect( () => {
		getDesigns( {
			type: 'block',
			block: props.block,
			search,
		} ).then( designs => {
			setDesigns( designs )
		} ).finally( () => {
			setIsBusy( false )
		} )
	}, [ props.block, search ] )

	return (
		<div>
			<Button
				className="ugb-design-library-control__open-library"
				label={ __( 'Open Design Library', i18n ) }
				isSmall
				alignRight
				isLink
				onClick={ () => setIsLibraryOpen( true ) }
			>{ __( 'Open Design Library', i18n ) }</Button>
			<TextControl
				placeholder={ __( 'Search designs...', i18n ) }
				value={ search }
				onChange={ search => setSearch( search ) }
			/>
			<DesignLibraryList
				designs={ designs }
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

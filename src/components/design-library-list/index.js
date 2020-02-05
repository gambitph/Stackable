import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import { TextControl, Spinner } from '@wordpress/components'
import { getDesigns } from '~stackable/design-library'
import DesignLibraryListItem from './design-library-list-item'
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

const DesignLibraryList = props => {
	const {
		type, block, onSelect,
	} = props

	const [ designs, setDesigns ] = useState( [] )
	const [ search, setSearch ] = useState( props.search )
	const [ isBusy, setIsBusy ] = useState( true )

	useEffect( () => {
		getDesigns( {
			type,
			block,
			search,
		} ).then( designs => {
			setDesigns( designs )
		} ).finally( () => {
			setIsBusy( false )
		} )
	}, [ block, search ] )

	return <Fragment>
		{ props.hasSearch && (
			<TextControl
				className="ugb-design-library-search"
				placeholder={ __( 'Search designs...', i18n ) }
				autocomplete="off"
				value={ search }
				onChange={ search => setSearch( search ) }
			/>
		) }

		<div className="ugb-design-library-items">
			{ designs.map( design => {
				return (
					<DesignLibraryListItem
						key={ design }
						type={ design.type }
						block={ design.block }
						template={ design.template }
						plan={ design.plan }
						designId={ design.id }
						image={ design.image }
						label={ design.label }
						onClick={ designData => {
							onSelect( designData )
						} }
					/>
				)
			} ) }

			{ isBusy && <Spinner /> }

			{ ! isBusy && ! designs.length &&
				<p className="components-base-control__help">{ __( 'No designs found', i18n ) }</p>
			}
		</div>
	</Fragment>
}

DesignLibraryList.defaultProps = {
	hasSearch: false,
	type: 'block',
	block: '',
	search: '',
	onSelect: () => {},
}

export default DesignLibraryList

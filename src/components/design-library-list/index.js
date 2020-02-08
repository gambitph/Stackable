/**
 * Internal dependencies
 */
import DesignLibraryListItem from './design-library-list-item'

/**
 * External dependencies
 */
import { getDesigns } from '~stackable/design-library'
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import { TextControl, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const DesignLibraryList = props => {
	const {
		type, block, onSelect,
	} = props

	const [ designs, setDesigns ] = useState()
	const [ search, setSearch ] = useState()
	const [ isBusy, setIsBusy ] = useState()

	// Update state if props change.
	useEffect( () => setIsBusy( props.busy !== null ? props.busy : ! props.designs ), [ props.busy ] )
	useEffect( () => setSearch( props.search ), [ props.search ] )
	useEffect( () => setDesigns( props.designs || [] ), [ props.designs ] )

	useEffect( () => {
		if ( ! props.designs ) {
			getDesigns( {
				type,
				block,
				search,
			} ).then( designs => {
				setDesigns( designs )
			} ).finally( () => {
				setIsBusy( false )
			} )
		}
	}, [ type, block, search ] )

	const listClasses = classnames( [
		'ugb-design-library-items',
	], {
		[ `ugb-design-library-items--columns-${ props.columns }` ]: ! isBusy && props.columns,
	} )

	return <Fragment>
		{ props.hasSearch && (
			<TextControl
				className="ugb-design-library-search"
				placeholder={ props.searchPlaceholder }
				autoComplete="off"
				value={ search }
				onChange={ search => setSearch( search ) }
			/>
		) }

		<div className={ listClasses }>
			{ ( designs || [] ).map( ( design, i ) => {
				return (
					<DesignLibraryListItem
						key={ i }
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

			{ isBusy && <div className="ugb-design-library-search__spinner" data-testid="spinner"><Spinner /></div> }

			{ ! isBusy && ! ( designs || [] ).length &&
				<p className="components-base-control__help" data-testid="nothing-found-note">{ __( 'No designs found', i18n ) }</p>
			}
		</div>
	</Fragment>
}

DesignLibraryList.defaultProps = {
	designs: null, // If provided, the component will not load its own
	hasSearch: false,
	searchPlaceholder: __( 'Search designs...', i18n ),
	search: '',
	type: 'block',
	block: '',
	onSelect: () => {},
	columns: 1,
	busy: null, // If not null, the list will show this busy state.
}

export default DesignLibraryList

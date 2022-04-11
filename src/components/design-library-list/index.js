/**
 * Internal dependencies
 */
import DesignLibraryListItem from './design-library-list-item'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const DesignLibraryList = props => {
	const {
		className = '',
		designs,
		isBusy,
		onSelect,
		onSelectMulti,
		apiVersion,
		isMultiSelectMode = false,
		selectedDesigns = [],
	} = props

	const listClasses = classnames( [
		'ugb-design-library-items',
		className,
	], {
		[ `ugb-design-library-items--columns-${ props.columns }` ]: ! isBusy && props.columns,
	} )

	return <div className={ listClasses }>
		{ ( designs || [] ).map( ( design, i ) => {
			const selectedNum = isMultiSelectMode ? selectedDesigns.indexOf( design.id ) + 1 : false
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
					apiVersion={ apiVersion }
					isMultiSelectMode={ isMultiSelectMode }
					selectedNum={ selectedNum }
					onClick={ designData => {
						if ( ! isMultiSelectMode ) {
							onSelect( designData, design )
						} else if ( onSelectMulti ) {
							onSelectMulti( designData )
						}
					} }
				/>
			)
		} ) }

		{ isBusy && <div className="ugb-design-library-search__spinner" data-testid="spinner"><Spinner /></div> }

		{ ! isBusy && ! ( designs || [] ).length &&
			<p className="components-base-control__help" data-testid="nothing-found-note">{ __( 'No designs found', i18n ) }</p>
		}
	</div>
}

DesignLibraryList.defaultProps = {
	designs: [],
	columns: 1,
	onSelect: () => {},
	isBusy: false,
	apiVersion: '',
}

export default DesignLibraryList

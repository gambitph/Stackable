/**
 * The block list component creates it's own list of UI Kits and Categories
 * based on the API, and builds a list of counters for each uikit and category.
 *
 * Designs are passed to this component as a prop, and the list of counters are
 * populated.
 */

/**
 * External dependencies
 */
import { sortBy } from 'lodash'
import { AdvancedToolbarControl } from '..'
import { fetchDesignLibrary } from '~stackable/design-library'
import { isPro, i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	useEffect, useState,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useLocalStorage } from '~stackable/util'

const BlockList = props => {
	const [ uiKitList, setUiKitList ] = useState( [] )
	const [ categoryList, setCategoryList ] = useState( [] )
	const [ selected, setSelected ] = useLocalStorage( 'stk__design_library__block-list__selected', '' )
	const [ viewBy, setViewBy ] = useLocalStorage( 'stk__design_library__block-list__view_by', 'uikit' )
	const { apiVersion } = props

	// Create our block list.
	useEffect( () => {
		fetchDesignLibrary( apiVersion ).then( designs => {
			const designList = Object.keys( designs ).reduce( ( output, name ) => {
				const design = designs[ name ]
				const { categories, uikit } = design

				if ( typeof output.uikits[ uikit ] === 'undefined' ) {
					output.uikits[ uikit ] = {
						id: uikit,
						label: design.uikit,
						plan: design.plan,
						count: 0,
					}
				}

				categories.forEach( category => {
					if ( typeof output.categories[ category ] === 'undefined' ) {
						output.categories[ category ] = {
							id: category,
							label: category,
							count: 0,
						}
					}
				} )

				return output
			}, { uikits: {}, categories: {} } )

			let uikitSort = [ 'label' ]
			if ( ! isPro ) {
				uikitSort = [ 'plan', 'label' ]
			}

			const uikits = sortBy( Object.values( designList.uikits ), uikitSort )
			const categories = sortBy( Object.values( designList.categories ), 'label' )
			categories.unshift( {
				id: 'all',
				label: __( 'All', i18n ),
				count: 0,
			} )

			setUiKitList( uikits )
			setCategoryList( categories )
		} )
	}, [ apiVersion ] )

	// Update the counts of the designs, but don't update the list, only the counts.
	useEffect( () => {
		// If these are empty, then our component hasn't finished initializing.
		if ( ! uiKitList.length || ! categoryList.length ) {
			return
		}

		const newUiKits = uiKitList.reduce( ( uiKits, uiKit ) => {
			uiKits[ uiKit.id ] = {
				...uiKit,
				count: 0,
			}
			return uiKits
		}, {} )
		const newCategories = categoryList.reduce( ( categories, category ) => {
			categories[ category.id ] = {
				...category,
				count: 0,
			}
			return categories
		}, {} )

		props.designs.forEach( design => {
			if ( design.uikit && newUiKits[ design.uikit ] ) {
				newUiKits[ design.uikit ].count++
			}
			design.categories.forEach( category => {
				if ( category && newCategories[ category ] ) {
					newCategories[ category ].count++
				}
			} )
		} )

		let uikitSort = [ 'label' ]
		if ( ! isPro ) {
			uikitSort = [ 'plan', 'label' ]
		}
		setUiKitList( sortBy( Object.values( newUiKits ), uikitSort ) )

		// Sort the categories so that the "All" is first.
		if ( newCategories.all ) {
			newCategories.all.count = props.designs.length
			newCategories.all.label = '    ' // Spaces so we will be first when sorting.
		}
		const sorted = sortBy( Object.values( newCategories ), 'label' )
		if ( sorted[ 0 ] ) {
			sorted[ 0 ].label = __( 'All', i18n )
		}
		setCategoryList( sorted )
	}, [ props.designs.length, JSON.stringify( uiKitList ), JSON.stringify( categoryList ) ] )

	useEffect( () => {
		// If these are empty, then our component hasn't finished initializing.
		if ( ! uiKitList.length || ! categoryList.length ) {
			return
		}

		setSelected( viewBy === 'uikit' ? uiKitList[ 0 ].id : 'all' )
	}, [ viewBy ] )

	useEffect( () => {
		props.onSelect( { id: selected, type: viewBy } )
	}, [ selected ] )

	return (
		<ul className="ugb-block-list">
			<AdvancedToolbarControl
				controls={ [
					{
						value: 'uikit',
						title: __( 'UI Kits', i18n ),
					},
					{
						value: 'category',
						title: __( 'Categories', i18n ),
					},
				] }
				value={ viewBy }
				onChange={ setViewBy }
				isSmall={ true }
				fullwidth={ false }
				isToggleOnly={ true }
				allowReset={ false }
			/>
			{ ( viewBy === 'uikit' ? uiKitList : categoryList ).reduce( ( list, itemData ) => {
				const {
					id,
					label,
					count,
					plan,
				} = itemData

				const classes = classnames( [
					'stk-design-library__sidebar-item',
				], {
					'is-active': selected === id,
					'is-disabled': ! isPro && plan === 'premium',
				} )

				list.push(
					<li key={ id }>
						<div
							className={ classes }
							data-count={ count }
							onClick={ () => setSelected( id ) }
							onKeyPress={ e => {
								if ( e.keyCode === 13 ) {
									this.click()
								}
							} }
							role="button"
							tabIndex={ 0 }
							aria-pressed={ selected === id ? 'true' : 'false' }
						>
							{ label }
							<span
								className="ugb-block-list__count"
								data-testid={ `${ id }-count` }
							>{ count }</span>
						</div>
					</li>
				)

				return list
			}, [] ) }
		</ul>
	)
}

BlockList.defaultProps = {
	select: '',
	onSelect: () => {},
	apiVersion: '',
	designs: [],
}

export default BlockList

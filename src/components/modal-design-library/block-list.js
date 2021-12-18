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

const isWireframe = design => design.uikit.toLowerCase() === 'wireframes'

const BlockList = props => {
	const [ uiKitList, setUiKitList ] = useState( [] )
	const [ categoryList, setCategoryList ] = useState( [] )
	const [ wireframeList, setWireframeList ] = useState( [] )
	const [ selected, setSelected ] = useLocalStorage( 'stk__design_library__block-list__selected', '' )
	const { viewBy, apiVersion } = props

	// Create our block list.
	useEffect( () => {
		fetchDesignLibrary( apiVersion ).then( designs => {
			const designList = Object.keys( designs ).reduce( ( output, name ) => {
				const design = designs[ name ]
				const { categories, uikit } = design

				// Get all UI Kits. Don't include the Wireframe UI Kit.
				if ( typeof output.uikits[ uikit ] === 'undefined' && ! isWireframe( design ) ) {
					output.uikits[ uikit ] = {
						id: uikit,
						label: design.uikit,
						plan: design.plan,
						count: 0,
					}
				}

				// Get all wireframe categories.
				if ( isWireframe( design ) ) {
					categories.forEach( category => {
						if ( typeof output.wireframes[ category ] === 'undefined' ) {
							output.wireframes[ category ] = {
								id: category,
								label: category,
								count: 0,
							}
						}
					} )
				} else {
					// Get all block design categories.
					categories.forEach( category => {
						if ( typeof output.categories[ category ] === 'undefined' ) {
							output.categories[ category ] = {
								id: category,
								label: category,
								count: 0,
							}
						}
					} )
				}

				return output
			}, {
				uikits: {},
				categories: {},
				wireframes: {},
			} )

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
			const wireframes = sortBy( Object.values( designList.wireframes ), 'label' )
			wireframes.unshift( {
				id: 'all',
				label: __( 'All', i18n ),
				count: 0,
			} )

			setUiKitList( uikits )
			setCategoryList( categories )
			setWireframeList( wireframes )
		} )
	}, [ apiVersion ] )

	// Update the counts of the designs, but don't update the list, only the counts.
	useEffect( () => {
		// If these are empty, then our component hasn't finished initializing.
		if ( ! uiKitList.length || ! categoryList.length || ! wireframeList.length ) {
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
		const newWireframes = wireframeList.reduce( ( categories, category ) => {
			categories[ category.id ] = {
				...category,
				count: 0,
			}
			return categories
		}, {} )

		props.designs.forEach( design => {
			// Gather all wireframe designs.
			if ( isWireframe( design ) ) {
				design.categories.forEach( category => {
					if ( category && newWireframes[ category ] ) {
						newWireframes[ category ].count++
					}
				} )
				return
			}

			// Gather all ui kit designs.
			if ( design.uikit && newUiKits[ design.uikit ] ) {
				newUiKits[ design.uikit ].count++
			}

			// Gather all block design categories.
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
			newCategories.all.count = props.designs.filter( design => ! isWireframe( design ) ).length
			newCategories.all.label = '    ' // Spaces so we will be first when sorting.
		}
		const sorted = sortBy( Object.values( newCategories ), 'label' )
		if ( sorted[ 0 ] ) {
			sorted[ 0 ].label = __( 'All', i18n )
		}
		setCategoryList( sorted )

		// Sort the wireframes so that the "All" is first.
		if ( newWireframes.all ) {
			newWireframes.all.count = props.designs.filter( isWireframe ).length
			newWireframes.all.label = '    ' // Spaces so we will be first when sorting.
		}
		const sortedWireframes = sortBy( Object.values( newWireframes ), 'label' )
		if ( sortedWireframes[ 0 ] ) {
			sortedWireframes[ 0 ].label = __( 'All', i18n )
		}
		setWireframeList( sortedWireframes )
	}, [ props.designs.length, JSON.stringify( uiKitList ), JSON.stringify( categoryList ), JSON.stringify( wireframeList ) ] )

	useEffect( () => {
		// If these are empty, then our component hasn't finished initializing.
		if ( ! uiKitList.length || ! categoryList.length || ! wireframeList.length ) {
			return
		}

		setSelected( viewBy === 'uikit' ? uiKitList[ 0 ].id : 'all' )
	}, [ viewBy ] )

	useEffect( () => {
		props.onSelect( selected )
	}, [ selected ] )

	const list = viewBy === 'uikit'
		? uiKitList : viewBy === 'category'
			? categoryList : wireframeList

	return (
		<ul className="ugb-block-list">
			{ list.reduce( ( list, itemData ) => {
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

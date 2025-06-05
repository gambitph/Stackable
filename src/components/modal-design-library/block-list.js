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
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const BlockList = props => {
	const [ categoryList, setCategoryList ] = useState( [] )
	const {
		viewBy, designs, plan, selected, onSelect,
	} = props

	useEffect( () => {
		let total = 0
		const _categories = designs.reduce( ( output, design ) => {
			const category = design.category

			if ( plan && plan !== design.plan ) {
				return output
			}

			if ( category in output ) {
				output[ category ].count++
			} else {
				output[ category ] = {
					id: category,
					label: category,
					count: 1,
				}
			}

			total++
			return output
		}, {} )

		const toAdd = [
			[ 'Contact', 22 ],
			[ 'Featured Products', 14 ],
			[ 'Footer', 11 ],
			[ 'Header', 12 ],
			[ 'Map', 10 ],
			[ 'Service Menu', 10 ],
			[ 'Stats', 15 ],
			[ 'Post Loop', 6 ],
			[ 'Pricing Table', 15 ],
			[ 'Quote', 10 ],
			[ 'Carousel', 13 ],
			[ 'Table of Contents', 8 ],
			[ 'Tabs', 11 ],
			[ 'Team Members', 10 ],
			[ 'Testimonials', 25 ],
			[ 'Timeline', 9 ],
			[ 'Video', 11 ],
		]

		toAdd.forEach( ( [ label, count ] ) => {
			_categories[ label ] = {
				id: label,
				label,
				count,
			}
			total += count
		} )

		_categories.all = {
			id: '',
			label: '    ',
			count: total,
		}

		const sortedCategories = sortBy( Object.values( _categories ), 'label' )
		sortedCategories[ 0 ].label = __( 'All', i18n )

		setCategoryList( sortedCategories )
	}, [ designs, viewBy, plan ] )

	return (
		<ul className="ugb-block-list">
			{ categoryList.reduce( ( list, itemData ) => {
				const {
					id,
					label,
					count,
				} = itemData

				const classes = classnames( [
					'stk-design-library__sidebar-item',
				], {
					'is-active': selected === id,
					// 'is-disabled': ! isPro && plan === 'premium',
				} )

				list.push(
					<li key={ id }>
						<div
							className={ classes }
							data-count={ count }
							onClick={ () => onSelect( id ) }
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

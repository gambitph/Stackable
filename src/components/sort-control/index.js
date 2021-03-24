/**
 * External dependencies
 */
import classnames from 'classnames'
import { BaseControlMultiLabel, Button } from '~stackable/components'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import { i18n } from 'stackable'
import { omit, range } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { BaseControl } from '@wordpress/components'

const SortableContainer = sortableContainer( ( { children } ) => {
	return <div className="ugb-sort-control__container">{ children }</div>
} )

const SortableItem = sortableElement( ( {
	value, key, index, ...props // eslint-disable-line
} ) => {
	return <div className="ugb-sort-control__item" { ...props } >{ value }</div>
} )

const applySort = ( values, oldIndex, newIndex ) => {
	values.splice( oldIndex < newIndex ? newIndex + 1 : newIndex, 0, values[ oldIndex ] ) // Add the value in new position.
	values.splice( oldIndex < newIndex ? oldIndex : oldIndex + 1, 1 ) // Remove value in old position.
	return values
}

// Use a variable here instead of useState. react-sortable-hoc somehow behaves incorrectly
// when using states.
let isSorting = false

const SortControl = props => {
	const values = props.values ? props.values.splice( 0, props.num ) : range( props.num ).map( i => i + 1 )
	// If a number was added outside our sorter.
	while ( values.length < props.num ) {
		values.push( values.length + 1 )
	}
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( [ 'ugb-sort-control', props.className, `ugb-sort-control--axis-${ props.axis }` ] ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				{ ...omit( props, Object.keys( SortControl.defaultProps ) ) }
				afterButton={ ! props.hasReset ? null : (
					<Button
						disabled={ ! props.values }
						onClick={ () => props.onChange( '', { oldIndex: 0, newIndex: 0 } ) }
						isSmall
						isSecondary
					>
						{ __( 'Reset' ) }
					</Button>
				) }
			/>
			<SortableContainer
				onSortStart={ () => isSorting = true }
				onSortOver={ ( { newIndex } ) => {
					props.onHover( newIndex )
				} }
				onSortEnd={ ( { oldIndex, newIndex } ) => {
					isSorting = false
					const newValues = applySort( values, oldIndex, newIndex )
					props.onChange( newValues, { oldIndex, newIndex } )
				} }
				axis={ props.axis }
			>
				{ values.map( ( value, i ) => (
					<SortableItem
						key={ i }
						index={ i }
						value={ value }
						onMouseEnter={ () => {
							if ( ! isSorting ) {
								props.onHover( i )
							}
						} }
						onMouseLeave={ () => {
							if ( ! isSorting ) {
								props.onHover( null )
							}
						} }
					/>
				) ) }
			</SortableContainer>
		</BaseControl>
	)
}

SortControl.defaultProps = {
	className: '',
	help: '',
	label: __( 'Column Arrangement', i18n ),
	num: 2,
	axis: 'x',
	values: null,
	onChange: () => {},
	onHover: () => {},
	hasReset: false,
}

export default SortControl

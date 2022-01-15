/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import { i18n } from 'stackable'
import { range, isEqual } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

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

const SortControl = memo( props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	let values = typeof props.values === 'undefined' ? _value
		: Array.isArray( props.values ) ? [ ...props.values ] : _value
	values = values ? values.splice( 0, props.num ) : range( props.num ).map( i => i + 1 )
	// If a number was added outside our sorter.
	while ( values.length < props.num ) {
		values.push( values.length + 1 )
	}

	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange
	const showReset = ! isEqual( values.map( i => i.toString() ), range( props.num ).map( i => ( i + 1 ).toString() ) )

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( [ 'ugb-sort-control', props.className, `ugb-sort-control--axis-${ props.axis }` ] ) }
		>
			<SortableContainer
				{ ...propsToPass }
				onSortStart={ () => isSorting = true }
				onSortOver={ ( { newIndex } ) => {
					props.onHover( newIndex )
				} }
				onSortEnd={ ( { oldIndex, newIndex } ) => {
					isSorting = false
					const newValues = applySort( values, oldIndex, newIndex )
					onChange( [ ...newValues ], { oldIndex, newIndex } )
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
			<ResetButton
				allowReset={ props.allowReset }
				showReset={ showReset }
				value={ values }
				default={ props.default }
				onChange={ () => onChange( '', { oldIndex: 0, newIndex: 0 } ) }
			/>
		</AdvancedControl>
	)
} )

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

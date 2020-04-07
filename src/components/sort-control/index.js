/**
 * External dependencies
 */
import classnames from 'classnames'
import { BaseControlMultiLabel } from '~stackable/components'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import { i18n } from 'stackable'
import { omit, range } from 'lodash'
import { useState } from '@wordpress/element'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { BaseControl, Button } from '@wordpress/components'

const SortableContainer = sortableContainer( ( { children } ) => {
	return <div className="ugb-sort-control__container">{ children }</div>
} )

const SortableItem = sortableElement( ( {
	value, key, index, ...props, // eslint-disable-line
} ) => {
	return <div className="ugb-sort-control__item" { ...props } >{ value }</div>
} )

const applySort = ( values, oldIndex, newIndex ) => {
	values.splice( oldIndex < newIndex ? newIndex + 1 : newIndex, 0, values[ oldIndex ] ) // Add the value in new position.
	values.splice( oldIndex < newIndex ? oldIndex : oldIndex + 1, 1 ) // Remove value in old position.
	return values
}

const SortControl = props => {
	const values = props.values ? props.values.splice( 0, props.num ) : range( props.num ).map( i => i + 1 )
	const [ isSorting, setIsSorting ] = useState( false )
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-sort-control', props.className, `ugb-sort-control--axis-${ props.axis }` ) }
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
				transitionDuration={ 0 }
				onSortStart={ () => setIsSorting( true ) }
				onSortOver={ ( { newIndex } ) => {
					props.onHover( newIndex )
				} }
				onSortEnd={ ( { oldIndex, newIndex } ) => {
					setIsSorting( false )
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

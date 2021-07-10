/**
 * Internal dependencies
 */
import { AdvancedRangeControl } from '..'
import { useControlHandlers } from '../base-control2/hooks'
import AdvancedControl, { extractControlProps } from '../base-control2'

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { compact, omit } from 'lodash'

const FILTERS = {
	blur: {
		label: __( 'Blur', i18n ),
		min: 0,
		sliderMax: 10,
		step: 0.1,
		placeholder: 0,
		format: '%spx',
	},
	brightness: {
		label: __( 'Brightness', i18n ),
		min: 0,
		sliderMax: 3,
		step: 0.1,
		placeholder: 1,
		format: '%s',
	},
	contrast: {
		label: __( 'Contrast', i18n ),
		min: 0,
		sliderMax: 3,
		step: 0.1,
		placeholder: 1,
		format: '%s',
	},
	grayscale: {
		label: __( 'Grayscale', i18n ),
		min: 0,
		sliderMax: 1,
		step: 0.01,
		placeholder: 0,
		format: '%s',
	},
	'hue-rotate': {
		label: __( 'Hue Rotate', i18n ),
		min: 0,
		sliderMax: 360,
		step: 1,
		placeholder: 0,
		format: '%sdeg',
	},
	invert: {
		label: __( 'Invert', i18n ),
		min: 0,
		sliderMax: 1,
		step: 0.01,
		placeholder: 0,
		format: '%s',
	},
	opacity: {
		label: __( 'Opacity', i18n ),
		min: 0,
		sliderMax: 1,
		step: 0.01,
		placeholder: 1,
		format: '%s',
	},
	saturate: {
		label: __( 'Saturate', i18n ),
		min: 0,
		sliderMax: 3,
		step: 0.1,
		placeholder: 1,
		format: '%s',
	},
	sepia: {
		label: __( 'Sepia', i18n ),
		min: 0,
		sliderMax: 1,
		step: 0.01,
		placeholder: 0,
		format: '%s',
	},
}

const filterToValue = filters => {
	const newFilters = Object.keys( filters ).map( filterName => {
		const value = filters[ filterName ]
		const { format, placeholder } = FILTERS[ filterName ]
		if ( isNaN( value ) || value === '' ) {
			return ''
		}
		return `${ filterName }(${ sprintf( format, value || placeholder ) })`
	} )
	return compact( newFilters ).join( ' ' )
}

export const ImageFilterControl = props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const [ filters, setFilters ] = useState( {} )

	const value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	// Convert incoming value to filter values.
	useEffect( () => {
		const extractedValues = [ ...( value.matchAll( /([\w-]+)\(([^\)]+)\)/g ) ) ]
		const newFilters = extractedValues.reduce( ( filters, match ) => {
			const [ , name, value ] = match
			filters[ name ] = parseFloat( value )
			return filters
		}, {} )
		setFilters( newFilters )
	}, [ value ] )

	return (
		<AdvancedControl
			{ ...controlProps }
			boldLabel={ true }
			className={ classnames( 'stk-image-filter-control', props.className ) }
		>
			{ Object.keys( FILTERS ).map( ( filterName, i ) => {
				const filter = FILTERS[ filterName ]
				return (
					<AdvancedRangeControl
						key={ i }
						allowReset={ true }
						{ ...omit( filter, [ 'format' ] ) }
						value={ filters[ filterName ] }
						onChange={ value => {
							filters[ filterName ] = value
							setFilters( filters )
							onChange( filterToValue( filters ) )
						} }
					/>
				)
			} ) }
		</AdvancedControl>
	)
}

ImageFilterControl.defaultProps = {
	// onChange: () => {},
	// help: '',
	// className: '',
	// screens: [ 'desktop' ],
	// allowReset: true,
	// value: '',
	// defaultValue: '',

	allowReset: true,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
}

export default ImageFilterControl

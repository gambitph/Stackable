/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	compact, isNumber, isEqual,
} from 'lodash'
import { AdvancedRangeControl, ColorPaletteControl } from '~stackable/components'
import { hexToRgba, extractColor } from '~stackable/util'
import AdvancedControl, { extractControlProps } from '~stackable/components/base-control2'
import { useControlHandlers } from '~stackable/components/base-control2/hooks'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	useState,
	useRef,
	useEffect,
	memo,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import {
	Button, Popover, Dashicon,
} from '@wordpress/components'

const getShadows = () => {
	return applyFilters( 'stackable.shadows', [
		'none',
		'0 0 0 1px rgba(120, 120, 120, 0.1)',
		'0 0 0 2px rgba(120, 120, 120, 0.1)',
		'0 5px 5px 0 rgba(18, 63, 82, 0.035)',
		'0px 2px 20px rgba(153, 153, 153, 0.2)',
		'0 5px 30px -10px rgba(18, 63, 82, 0.3)',
		'0px 10px 30px rgba(0, 0, 0, 0.05)',
		'7px 5px 30px rgba(72, 73, 121, 0.15)',
		'0px 10px 60px rgba(0, 0, 0, 0.1)',
		'0px 70px 90px -20px rgba(72, 73, 121, 0.30)',
	] )
}

const FILTERS = [
	{
		component: AdvancedRangeControl,
		key: 'horizontalOffset',
		props: {
			label: __( 'Horizontal Offset', i18n ),
			placeholder: 0,
			sliderMin: -100,
			sliderMax: 100,
		},
		format: '%spx',
		default: '0px',
	},
	{
		component: AdvancedRangeControl,
		key: 'verticalOffset',
		props: {
			label: __( 'Vertical Offset', i18n ),
			placeholder: 0,
			sliderMin: -100,
			sliderMax: 100,
		},
		format: '%spx',
		default: '0px',
	},
	{
		component: AdvancedRangeControl,
		key: 'blur',
		props: {
			label: __( 'Blur', i18n ),
			placeholder: 0,
			sliderMin: 0,
			sliderMax: 100,
		},
		format: '%spx',
		default: '0px',
	},
	{
		component: AdvancedRangeControl,
		key: 'shadowSpread',
		props: {
			label: __( 'Shadow Spread', i18n ),
			placeholder: 0,
			sliderMin: 0,
			sliderMax: 100,
		},
		format: '%spx',
		default: '0px',
		show: props => ! props.isFilter,
	},
	{
		component: ColorPaletteControl,
		key: 'shadowColor',
		props: {
			label: __( 'Shadow Color', i18n ),
			disableAlpha: false,
		},
		default: 'rgba(0,0,0,1)',
		changeCallback: color => {
			if ( color?.startsWith( 'rgba(' ) ) {
				return color
			}

			if ( color?.startsWith( 'rgb(' ) ) {
				return color?.replace( 'rgb', 'rgba' ).replace( /\)$/g, ', 1)' ) || ''
			}

			color = extractColor( color )

			const rgba = hexToRgba( color )

			return rgba.startsWith( 'rgb(' ) ? rgba.replace( 'rgb', 'rgba' ).replace( /\)$/g, ', 1)' ) : rgba
		},
	},
	{
		component: AdvancedRangeControl,
		key: 'opacity',
		props: {
			label: __( 'Shadow Opacity', i18n ),
			min: 0,
			max: 1,
			step: 0.1,
		},
	},
]

const filterToValue = ( props, filters ) => {
	const newValue = compact( FILTERS.map( filterItem => {
		const { key } = filterItem

		if ( key === 'opacity' ) {
			return undefined
		}

		if ( key === 'shadowColor' ) {
			const opacity = filters.opacity
			if ( isNumber( opacity ) || opacity === '' || opacity === undefined ) {
				return ( filters[ key ] || filterItem.default || '' ).replace( /,[\d| ||\.]*\)$/g, () => `, ${ ! isNumber( opacity ) ? 1 : opacity })` )
			}
		}

		if ( filterItem.show && ! filterItem.show( props ) ) {
			return undefined
		}

		if ( filterItem.format && filters[ key ] !== undefined && filters[ key ] !== '' ) {
			return sprintf( filterItem.format, filters[ key ] )
		}

		return filters[ key ] || filterItem.default || ''
	} ) )

	return newValue.join( ' ' )
}

const ShadowFilterControl = props => {
	const [ filters, setFilters ] = useState( {} )

	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ _, controlProps ] = extractControlProps( props )

	useEffect( () => {
		if ( value ) {
			let _value = value
			let rgbaValue = ''
			let opacity = 1
			_value = _value.replace( /rgba\(.*\)$/g, value => {
				rgbaValue = value
				opacity = value.match( /[\d| ||\.]*\)$/g )[ 0 ]
				opacity = parseFloat( opacity )
				return ''
			} )

			const [ horizontalOffset, verticalOffset, blur, spread ] = _value.split( ' ' )
			filters.horizontalOffset = parseInt( horizontalOffset )
			filters.verticalOffset = parseInt( verticalOffset )
			filters.blur = parseInt( blur )
			filters.shadowSpread = isNaN( parseInt( spread ) ) ? '' : parseInt( spread )
			filters.shadowColor = rgbaValue
			filters.opacity = opacity
			setFilters( { ...filters } )
		}
	}, [ value ] )

	return (
		<Popover
			position="top center"
			className="shadow-control__popover"
			anchorRect={ props.anchorRect }
		>
			<div className="components-panel__body is-opened">
				<AdvancedControl
					{ ...controlProps }
					label={ __( 'Advanced Shadow Options', i18n ) }
					boldLabel={ true }
				>
					{ FILTERS.map( filter => {
						const Component = filter.component
						if ( filter.show && ! filter.show( props.parentProps ) ) {
							return null
						}

						return (
							<Component
								key={ filter.key }
								allowReset={ true }
								{ ...filter.props }
								value={ filters[ filter.key ] || '' }
								onChange={ value => {
									const newValue = ( filter.changeCallback || ( v => v ) )( value )
									filters[ filter.key ] = newValue
									setFilters( { ...filters } )
									onChange( filterToValue( props.parentProps, filters ) )
								} }
							/>
						)
					} ) }
				</AdvancedControl>
			</div>
		</Popover>
	)
}

const ShadowControl = memo( props => {
	const {
		options,
		label,
		..._props
	} = props

	const shadows = options || getShadows()
	const buttonRef = useRef( null )
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false )

	const valueCallback = value => {
		return value ? shadows.indexOf( value ) === -1 ? 'custom' : shadows.indexOf( value ) : ''
	}

	const changeCallback = index => {
		return index !== '' ? shadows[ index ] : index
	}

	const [ _value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, valueCallback, changeCallback )
	const value = typeof props.value === 'undefined' ? _value : props.value
	const [ propsToPass ] = extractControlProps( _props )

	useEffect( () => {
		const clickOutsideListener = event => {
			if ( isPopoverOpen ) {
				if ( ! event.target.closest( '.shadow-control__popover' ) &&
					 ! event.target.closest( '.stk-shadow-control__more-button' ) &&
					 ! event.target.closest( '.components-color-picker' ) &&
					 ! event.target.closest( '.react-autosuggest__suggestions-container' ) ) {
					setIsPopoverOpen( false )
				}
			}
		}

		document.body.addEventListener( 'mousedown', clickOutsideListener )
		return () => document.body.removeEventListener( 'mousedown', clickOutsideListener )
	}, [] )

	useEffect( () => {
		if ( isPopoverOpen ) {
		}
	}, [ value, isPopoverOpen ] )

	return (
		<>
			<AdvancedRangeControl
				{ ...propsToPass }
				label={ label }
				value={ value }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
				min={ 0 }
				max={ shadows.length - 1 }
				allowReset={ true }
				className="ugb--help-tip-general-shadow"
				hover={ props.hover }
				placeholder={ value === 'custom' ? __( 'Custom', i18n ) : '' }
				after={ (
					<Button
						className="stk-shadow-control__more-button"
						ref={ buttonRef }
						isSmall
						isTertiary
						isPressed={ isPopoverOpen || value === 'custom' }
						aria-label={ __( 'Shadow Settings', i18n ) }
						onClick={ () => setIsPopoverOpen( ! isPopoverOpen ) }
						icon={ <Dashicon icon="admin-generic" /> }
					/>
				) }
			/>
			{ isPopoverOpen && (
				<ShadowFilterControl
					anchorRect={ buttonRef.current?.getBoundingClientRect() }
					attribute={ props.attribute }
					responsive={ props.responsive }
					hover={ props.hover }
					parentProps={ props }
				/>
			) }
		</>
	)
}, isEqual )

ShadowControl.defaultProps = {
	label: __( 'Shadow / Outline', i18n ),
	placeholder: '',
	options: null,
	valueCallback: null,
	changeCallback: null,
	isFilter: false, // If the style rule is `filter`, disable spread.
}

export default ShadowControl

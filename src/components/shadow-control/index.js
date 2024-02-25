/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { compact, isEqual } from 'lodash'
import {
	AdvancedRangeControl, AdvancedToggleControl, ColorPaletteControl, Popover,
} from '~stackable/components'
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
import { Button, Dashicon } from '@wordpress/components'

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
		component: AdvancedToggleControl,
		key: 'inset',
		props: {
			label: __( 'Inset', i18n ),
		},
		default: false,
	},
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
		},
		default: '#000000',
	},
]

const filterToValue = ( props, filters ) => {
	const newValue = compact( FILTERS.map( filterItem => {
		const { key } = filterItem

		if ( key === 'inset' ) {
			return filters[ key ] ? 'inset' : ''
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
			let hexValue = ''
			_value = _value.replace( /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/g, value => {
				hexValue = value
				return ''
			} ).trim()

			if ( _value.startsWith( 'inset' ) ) {
				filters.inset = true
				_value = _value.replace( /^inset\s*/, '' )
			} else {
				filters.inset = false
			}

			const [ horizontalOffset, verticalOffset, blur, spread ] = _value.split( ' ' )
			filters.horizontalOffset = parseInt( horizontalOffset )
			filters.verticalOffset = parseInt( verticalOffset )
			filters.blur = parseInt( blur )
			filters.shadowSpread = isNaN( parseInt( spread ) ) ? '' : parseInt( spread )
			filters.shadowColor = hexValue
			setFilters( { ...filters } )
		}
	}, [ value ] )

	return (
		<Popover
			placement="top-start"
			className="shadow-control__popover"
			anchorRect={ props.anchorRect }
			onEscape={ props.onEscape }
		>
			<div className="components-panel__body is-opened">
				<AdvancedControl
					{ ...controlProps }
					label={ __( 'Advanced Shadow Options', i18n ) }
					boldLabel={ true }
				>
					{ FILTERS.map( filter => {
						if ( ! props.hasInset && filter.key === 'inset' ) {
							return null
						}

						const propsToPass = { ...filter.props }

						const Component = filter.component
						if ( filter.show && ! filter.show( props.parentProps ) ) {
							return null
						}

						if ( filter.key === 'inset' ) {
							propsToPass.checked = !! filters[ filter.key ]
						}

						return (
							<Component
								key={ filter.key }
								allowReset={ true }
								{ ...propsToPass }
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

ShadowFilterControl.defaultProps = {
	hasInset: true,
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
					 ! event.target.closest( '.react-autosuggest__suggestions-container' ) &&
					 ! event.target.closest( '.components-dropdown__content' ) ) {
					setIsPopoverOpen( false )
				}
			}
		}

		document.body.addEventListener( 'mousedown', clickOutsideListener )
		return () => document.body.removeEventListener( 'mousedown', clickOutsideListener )
	}, [ isPopoverOpen ] )

	useEffect( () => {
		if ( isPopoverOpen ) {
		}
	}, [ value, isPopoverOpen ] )

	return (
		<>
			<AdvancedRangeControl
				{ ...propsToPass }
				attribute={ props.attribute }
				label={ label }
				value={ value }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
				min={ 0 }
				max={ shadows.length - 1 }
				allowReset={ true }
				helpTooltip={ props.helpTooltip }
				hover={ props.hover }
				placeholder={ value === 'custom' ? __( 'Custom', i18n ) : '' }
				after={ (
					<Button
						className="stk-shadow-control__more-button"
						ref={ buttonRef }
						isSmall
						isTertiary
						isPressed={ isPopoverOpen || value === 'custom' }
						label={ __( 'Shadow Settings', i18n ) }
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
					hasInset={ props.hasInset }
					onEscape={ () => setIsPopoverOpen( false ) }
				/>
			) }
		</>
	)
}, isEqual )

ShadowControl.defaultProps = {
	attribute: '',
	label: __( 'Shadow / Outline', i18n ),
	placeholder: '',
	options: null,
	valueCallback: null,
	changeCallback: null,
	isFilter: false, // If the style rule is `filter`, disable spread.
	hasInset: true,
	helpTooltip: {
		video: 'general-shadow',
		title: __( 'Shadow/Outline', i18n ),
		description: __( 'Adjusts the intensity of the shadow/outline of the block and the appearance of the block border', i18n ),
	},
}

export default ShadowControl

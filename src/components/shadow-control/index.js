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
import {
	Button, Dashicon, PanelBody, Tooltip,
} from '@wordpress/components'

export const getShadows = () => {
	return applyFilters( 'stackable.shadows', [
		'none',
		'0 0 0 1px #7878781a',
		'0 0 0 2px #7878781a',
		'0 5px 5px 0 #123f5209',
		'0px 2px 20px #99999933',
		'0 5px 30px -10px #123f524d',
		'0px 10px 30px #0000000d',
		'7px 5px 30px #48497927',
		'0px 10px 60px #0000001a',
		'0px 70px 90px -20px #4849794d',
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
	const [ filtersPlaceholder, setFiltersPlaceholder ] = useState( {} )

	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover )
	const [ _, controlProps ] = extractControlProps( props )

	const value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	// Split string into 5 parts, the last part contains the rest of the string.
	const splitStringIntoParts = ( str, splitTo = 5 ) => {
		const parts = str.split( ' ' )
		const result = []
		for ( let i = 0; i < splitTo - 1; i++ ) {
			if ( parts.length ) {
				result.push( parts.shift() )
			} else {
				result.push( '' )
			}
		}
		result.push( parts.join( ' ' ) )
		return result
	}
	const updateFilters = ( __value, _filters, _setFilters, isFilter ) => {
		if ( __value ) {
			let _value = __value.trim()
			if ( _value.startsWith( 'inset' ) ) {
				_filters.inset = true
				_value = _value.replace( /^inset\s*/, '' )
			} else {
				_filters.inset = false
			}

			const [ horizontalOffset, verticalOffset, blur, spread, color ] = splitStringIntoParts( _value, isFilter ? 4 : 5 )
			_filters.horizontalOffset = isNaN( parseInt( horizontalOffset ) ) ? 0 : parseInt( horizontalOffset )
			_filters.verticalOffset = isNaN( parseInt( verticalOffset ) ) ? 0 : parseInt( verticalOffset )
			_filters.blur = isNaN( parseInt( blur ) ) ? 0 : parseInt( blur )
			_filters.shadowSpread = isNaN( parseInt( spread ) ) ? 0 : parseInt( spread )
			_filters.shadowColor = color || ''

			if ( isFilter ) {
				_filters.shadowSpread = ''
				_filters.shadowColor = spread
			}

			_setFilters( { ..._filters } )
		}
	}

	useEffect( () => {
		updateFilters( value, filters, setFilters, props.isFilter )
	}, [ value, props.isFilter ] )

	useEffect( () => {
		updateFilters( props.placeholder, filtersPlaceholder, setFiltersPlaceholder, props.isFilter )
	}, [ props.placeholder, props.isFilter ] )

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

						if ( filter.key === 'shadowColor' ) {
							propsToPass.default = filtersPlaceholder[ filter.key ] || ''
							propsToPass.value = filters[ filter.key ] || filtersPlaceholder[ filter.key ] || ''
						}

						return (
							<Component
								key={ filter.key }
								allowReset={ true }
								value={ filters[ filter.key ] || '' }
								{ ...propsToPass }
								placeholder={ filtersPlaceholder[ filter.key ] || '' }
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
	isFilter: false,
}

const ShadowControl = memo( props => {
	const {
		options,
		label,
		..._props
	} = props

	const shadows = options || getShadows()
	const presetButtonRef = useRef( null )
	const settingsButtonRef = useRef( null )
	const [ openPopover, setOpenPopover ] = useState( '' )

	const valueCallback = value => {
		return value ? shadows.indexOf( value ) === -1 ? 'custom' : shadows.indexOf( value ) : ''
	}

	const changeCallback = index => {
		return index !== '' ? shadows[ index ] : index
	}

	const [ _value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, valueCallback, changeCallback )
	const value = typeof props.value === 'undefined' ? _value : props.value
	const effectiveOnChange = typeof props.onChange === 'undefined' ? onChange : props.onChange
	const selectedValue = value === '' ? valueCallback( props.placeholder ) : value

	const [ propsToPass, controlProps ] = extractControlProps( _props )

	useEffect( () => {
		const clickOutsideListener = event => {
			if ( openPopover ) {
				if ( ! event.target.closest( '.shadow-control__popover' ) &&
					 ! event.target.closest( '.stk-shadow-control__presets-button' ) &&
					 ! event.target.closest( '.stk-shadow-control__more-button' ) &&
					 ! event.target.closest( '.components-color-picker' ) &&
					 ! event.target.closest( '.react-autosuggest__suggestions-container' ) &&
					 ! event.target.closest( '.components-dropdown__content' ) ) {
					setOpenPopover( '' )
				}
			}
		}

		document.body.addEventListener( 'mousedown', clickOutsideListener )
		return () => document.body.removeEventListener( 'mousedown', clickOutsideListener )
	}, [ openPopover ] )

	return (
		<>
			<AdvancedControl
				{ ...propsToPass }
				{ ...controlProps }
				attribute={ props.attribute }
				label={ label }
				helpTooltip={ props.helpTooltip }
				hover={ props.hover }
				after={ (
					<Button
						className="stk-shadow-control__more-button"
						ref={ settingsButtonRef }
						isSmall
						isTertiary
						isPressed={ openPopover === 'settings' || value === 'custom' }
						label={ __( 'Shadow Settings', i18n ) }
						onClick={ () => setOpenPopover( openPopover === 'settings' ? '' : 'settings' ) }
						icon={ <Dashicon icon="admin-generic" /> }
					/>
				) }
			>
				<Button
					className="stk-shadow-control__presets-button"
					ref={ presetButtonRef }
					isSecondary
					isPressed={ openPopover === 'presets' }
					onClick={ () => setOpenPopover( openPopover === 'presets' ? '' : 'presets' ) }
				>
					<Dashicon icon="lightbulb" />
					{ value === 'custom' ? __( 'Custom shadow', i18n ) : __( 'Drop shadow', i18n ) }
				</Button>
			</AdvancedControl>
			{ openPopover === 'presets' && (
				<Popover
					placement="bottom-start"
					className="shadow-control__popover ugb-button-icon-control__popover stk-shadow-control__presets-popover"
					anchorRect={ presetButtonRef.current?.getBoundingClientRect() }
					onEscape={ () => setOpenPopover( '' ) }
				>
					<PanelBody>
						<h2 className="components-panel__body-title">{ __( 'Drop shadow', i18n ) }</h2>
						<div className="stk-shadow-control__preset-grid">
							{ shadows.map( ( shadow, index ) => {
								const isSelected = selectedValue === index
								const presetLabel = index === 0
									? __( 'No shadow', i18n )
									: sprintf( __( 'Shadow %d', i18n ), index )

								return (
									<Tooltip
										key={ `${ shadow }-${ index }` }
										text={ presetLabel }
										placement="top"
									>
										<button
											type="button"
											className={ `stk-shadow-control__preset${ isSelected ? ' is-selected' : '' }${ index === 0 ? ' is-none' : '' }` }
											style={ index === 0 ? undefined : { boxShadow: shadow } }
											aria-label={ presetLabel }
											aria-pressed={ isSelected }
											onClick={ () => {
												effectiveOnChange( index )
											} }
										>
											{ isSelected && <Dashicon icon="saved" /> }
										</button>
									</Tooltip>
								)
							} ) }
						</div>
						<Button
							className="stk-shadow-control__clear"
							isTertiary
							onClick={ () => {
								effectiveOnChange( '' )
								setOpenPopover( '' )
							} }
						>
							{ __( 'Clear', i18n ) }
						</Button>
					</PanelBody>
				</Popover>
			) }
			{ openPopover === 'settings' && (
				<ShadowFilterControl
					{ ...controlProps }
					anchorRect={ settingsButtonRef.current?.getBoundingClientRect() }
					attribute={ props.attribute }
					responsive={ props.responsive }
					placeholder={ props.placeholder }
					hover={ props.hover }
					parentProps={ props }
					hasInset={ props.hasInset }
					isFilter={ props.isFilter }
					onEscape={ () => setOpenPopover( '' ) }
					value={ props.shadowFilterValue }
					onChange={ props.shadowFilterOnChange }
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

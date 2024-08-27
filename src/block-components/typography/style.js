/**
 * Internal dependencies
 */
import { getFontFamily, clampInheritedStyle } from '~stackable/util'
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
		selectorCallback = null,
		attrNameTemplate = '%s',
		inherit = true,
		inheritMin,
		inheritMax = 50,
		hoverSelector = '',
		hoverSelectorCallback = null,
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="textShadow"
				attrName="textShadow"
				key="textShadow"
				hover="all"
				hoverSelector={ hoverSelector }
				hoverSelectorCallback={ hoverSelectorCallback }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="fontSize"
				attrName="fontSize"
				key="fontSize"
				hasUnits="px"
				responsive="all"
				clampCallback={ ( _value, getAttribute, device, state ) => {
					const currentValue = getAttribute( 'fontSize', device, state )
					const isMobile = device === 'mobile'

					let value = _value
					const clampedValue = inherit && clampInheritedStyle(
						_value,
						{
							min: inheritMin, max: inheritMax,
						}
					)

					/**
					 * When clamping values in mobile, make sure to get the
					 * clamped desktop value first before checking the clamped
					 * tablet value.
					 *
					 * When the tablet is already clamped, the fallback value should
					 * be undefined already to avoid generating 2 identical styles.
					 */
					if ( isMobile ) {
						const clampedDesktopValue = inherit && clampInheritedStyle(
							getAttribute( 'fontSize', 'desktop', state ),
							{
								min: inheritMin, max: inheritMax,
							}
						)
						value = clampedDesktopValue ? clampedDesktopValue : value
					}

					value = clampedValue ? clampedValue : value
					value = typeof currentValue !== 'undefined' && currentValue !== ''
						? currentValue
						: isMobile ? undefined : value
					return value
				} }
				dependencies={ [ 'fontSizeUnit', 'fontSize', ...dependencies ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRuleCallback={ getAttribute => {
					const textColorType = getAttribute( 'textColorType' )
					return textColorType === 'gradient' ? 'backgroundImage' : 'color'
				} }
				hover="all"
				hoverSelector={ hoverSelector }
				hoverSelectorCallback={ hoverSelectorCallback }
				attrName="textColor1"
				key="textColor1-color"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( ! value && getAttribute( 'textColorType', 'desktop', state ) === 'gradient' ) {
						return 'currentColor'
					}
					return value
				} }
				valueCallback={ ( value, getAttribute ) => {
					const textColorType = getAttribute( 'textColorType' )
					const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

					// If the type was switched, adjust the value so that gradient will show up.
					if ( textColorType === 'gradient' && ! isGradient ) {
						return `linear-gradient(${ value } 0%, ${ value } 100%)`
					} else if ( textColorType !== 'gradient' && isGradient ) {
						const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
						if ( color ) {
							return color[ 0 ]
						}
					}
					return value
				} }
				dependencies={ [ 'textColorType', ...dependencies ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="lineHeight"
				attrName="lineHeight"
				key="lineHeight"
				responsive="all"
				hasUnits="em"
				dependencies={ dependencies }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="fontWeight"
				attrName="fontWeight"
				key="fontWeight"
				dependencies={ dependencies }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="textTransform"
				attrName="textTransform"
				key="textTransform"
				dependencies={ dependencies }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="fontStyle"
				attrName="fontStyle"
				key="fontStyle"
				dependencies={ dependencies }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="fontFamily"
				attrName="fontFamily"
				key="fontFamily"
				valueCallback={ value => getFontFamily( value ) }
				dependencies={ dependencies }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				attrNameTemplate={ attrNameTemplate }
				styleRule="letterSpacing"
				attrName="letterSpacing"
				key="letterSpacing"
				format="%spx"
				responsive="all"
				dependencies={ dependencies }
			/>
		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}

Style.addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
		editSelector = '',
		saveSelector = '',
		selectorCallback = null,
		attrNameTemplate = '%s',
		inherit = true,
		inheritMin,
		inheritMax = 50,
		hoverSelector = '',
		hoverSelectorCallback = null,
		editHoverSelectorCallback = null,
		saveHoverSelectorCallback = null,
		dependencies = [],
	} = props

	blockStyleGenerator.addBlockStyles( 'textShadow', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'textShadow',
		attrName: 'textShadow',
		key: 'textShadow',
		hover: 'all',
		hoverSelector,
		hoverSelectorCallback: editHoverSelectorCallback || hoverSelectorCallback,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'textShadow',
		attrName: 'textShadow',
		key: 'textShadow',
		hover: 'all',
		hoverSelector,
		hoverSelectorCallback: saveHoverSelectorCallback || hoverSelectorCallback,
	} ] )

	blockStyleGenerator.addBlockStyles( 'fontSize', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontSize',
		attrName: 'fontSize',
		key: 'fontSize',
		hasUnits: 'px',
		responsive: 'all',
		clampCallback: ( _value, getAttribute, device, state ) => {
			const currentValue = getAttribute( 'fontSize', device, state )
			const isMobile = device === 'mobile'

			let value = _value
			const clampedValue = inherit && clampInheritedStyle(
				_value,
				{
					min: inheritMin, max: inheritMax,
				}
			)

			/**
			 * When clamping values in mobile, make sure to get the
			 * clamped desktop value first before checking the clamped
			 * tablet value.
			 *
			 * When the tablet is already clamped, the fallback value should
			 * be undefined already to avoid generating 2 identical styles.
			 */
			if ( isMobile ) {
				const clampedDesktopValue = inherit && clampInheritedStyle(
					getAttribute( 'fontSize', 'desktop', state ),
					{
						min: inheritMin, max: inheritMax,
					}
				)
				value = clampedDesktopValue ? clampedDesktopValue : value
			}

			value = clampedValue ? clampedValue : value
			value = typeof currentValue !== 'undefined' && currentValue !== ''
				? currentValue
				: isMobile ? undefined : value
			return value
		},
		dependencies: [ 'fontSizeUnit', 'fontSize', ...dependencies ],
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontSize',
		attrName: 'fontSize',
		key: 'fontSize',
		hasUnits: 'px',
		responsive: 'all',
		clampCallback: ( _value, getAttribute, device, state ) => {
			const currentValue = getAttribute( 'fontSize', device, state )
			const isMobile = device === 'mobile'

			let value = _value
			const clampedValue = inherit && clampInheritedStyle(
				_value,
				{
					min: inheritMin, max: inheritMax,
				}
			)

			/**
			 * When clamping values in mobile, make sure to get the
			 * clamped desktop value first before checking the clamped
			 * tablet value.
			 *
			 * When the tablet is already clamped, the fallback value should
			 * be undefined already to avoid generating 2 identical styles.
			 */
			if ( isMobile ) {
				const clampedDesktopValue = inherit && clampInheritedStyle(
					getAttribute( 'fontSize', 'desktop', state ),
					{
						min: inheritMin, max: inheritMax,
					}
				)
				value = clampedDesktopValue ? clampedDesktopValue : value
			}

			value = clampedValue ? clampedValue : value
			value = typeof currentValue !== 'undefined' && currentValue !== ''
				? currentValue
				: isMobile ? undefined : value
			return value
		},
		dependencies: [ 'fontSizeUnit', 'fontSize', ...dependencies ],
	} ] )

	blockStyleGenerator.addBlockStyles( 'textColor1', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRuleCallback: getAttribute => {
			const textColorType = getAttribute( 'textColorType' )
			return textColorType === 'gradient' ? 'backgroundImage' : 'color'
		},
		hover: 'all',
		hoverSelector,
		hoverSelectorCallback: editHoverSelectorCallback || hoverSelectorCallback,
		attrName: 'textColor1',
		key: 'textColor1-color',
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( ! value && getAttribute( 'textColorType', 'desktop', state ) === 'gradient' ) {
				return 'currentColor'
			}
			return value
		},
		valueCallback: ( value, getAttribute ) => {
			const textColorType = getAttribute( 'textColorType' )
			const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

			// If the type was switched, adjust the value so that gradient will show up.
			if ( textColorType === 'gradient' && ! isGradient ) {
				return `linear-gradient(${ value } 0%, ${ value } 100%)`
			} else if ( textColorType !== 'gradient' && isGradient ) {
				const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
				if ( color ) {
					return color[ 0 ]
				}
			}
			return value
		},
		dependencies: [ 'textColorType', ...dependencies ],
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRuleCallback: getAttribute => {
			const textColorType = getAttribute( 'textColorType' )
			return textColorType === 'gradient' ? 'backgroundImage' : 'color'
		},
		hover: 'all',
		hoverSelector,
		hoverSelectorCallback: saveHoverSelectorCallback || hoverSelectorCallback,
		attrName: 'textColor1',
		key: 'textColor1-color',
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( ! value && getAttribute( 'textColorType', 'desktop', state ) === 'gradient' ) {
				return 'currentColor'
			}
			return value
		},
		valueCallback: ( value, getAttribute ) => {
			const textColorType = getAttribute( 'textColorType' )
			const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

			// If the type was switched, adjust the value so that gradient will show up.
			if ( textColorType === 'gradient' && ! isGradient ) {
				return `linear-gradient(${ value } 0%, ${ value } 100%)`
			} else if ( textColorType !== 'gradient' && isGradient ) {
				const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
				if ( color ) {
					return color[ 0 ]
				}
			}
			return value
		},
		dependencies: [ 'textColorType', ...dependencies ],
	} ] )

	blockStyleGenerator.addBlockStyles( 'lineHeight', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'lineHeight',
		attrName: 'lineHeight',
		key: 'lineHeight',
		responsive: 'all',
		hasUnits: 'em',
		dependencies,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'lineHeight',
		attrName: 'lineHeight',
		key: 'lineHeight',
		responsive: 'all',
		hasUnits: 'em',
		dependencies,
	} ] )

	blockStyleGenerator.addBlockStyles( 'fontWeight', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontWeight',
		attrName: 'fontWeight',
		key: 'fontWeight',
		dependencies,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontWeight',
		attrName: 'fontWeight',
		key: 'fontWeight',
		dependencies,
	} ] )

	blockStyleGenerator.addBlockStyles( 'textTransform', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'textTransform',
		attrName: 'textTransform',
		key: 'textTransform',
		dependencies,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'textTransform',
		attrName: 'textTransform',
		key: 'textTransform',
		dependencies,
	} ] )

	blockStyleGenerator.addBlockStyles( 'fontStyle', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontStyle',
		attrName: 'fontStyle',
		key: 'fontStyle',
		dependencies,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontStyle',
		attrName: 'fontStyle',
		key: 'fontStyle',
		dependencies,
	} ] )

	blockStyleGenerator.addBlockStyles( 'fontFamily', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontFamily',
		attrName: 'fontFamily',
		key: 'fontFamily',
		valueCallback: value => getFontFamily( value ),
		dependencies,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'fontFamily',
		attrName: 'fontFamily',
		key: 'fontFamily',
		valueCallback: value => getFontFamily( value ),
		dependencies,
	} ] )

	blockStyleGenerator.addBlockStyles( 'letterSpacing', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'letterSpacing',
		attrName: 'letterSpacing',
		key: 'letterSpacing',
		format: '%spx',
		responsive: 'all',
		dependencies,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		selectorCallback,
		attrNameTemplate,
		styleRule: 'letterSpacing',
		attrName: 'letterSpacing',
		key: 'letterSpacing',
		format: '%spx',
		responsive: 'all',
		dependencies,
	} ] )
}

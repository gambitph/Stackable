/**
 * External dependencies
 */
import {
	hexToRgba, extractColor, attributeHasValue,
} from '~stackable/util'
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
		attrNameTemplate = '%s',
		backgroundFallbackColor = '#ffffff',
		attributes,
	} = props

	return (
		<>
			{ attributeHasValue( 'backgroundColor', attributes, { attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					hoverSelector={ `${ selector }:hover` }
					styleRule="backgroundColor"
					attrName="backgroundColor"
					attrNameTemplate={ attrNameTemplate }
					hoverCallback={ getAttribute => {
						return getAttribute( 'backgroundColorType' ) !== 'gradient'
							? 'all' : false
					} }
					valueCallback={ ( value, getAttribute, device, state ) => {
						const backgroundColorType = getAttribute( 'backgroundColorType' )
						const backgroundColorOpacity = getAttribute( 'backgroundColorOpacity', 'desktop', state )
						const backgroundColor2 = getAttribute( 'backgroundColor2' )

						const hasBackground = getAttribute( 'backgroundMediaUrl', 'desktop' ) ||
						getAttribute( 'backgroundMediaUrl', 'tablet' ) ||
						getAttribute( 'backgroundMediaUrl', 'mobile' )

						if ( ! backgroundColorType && backgroundColorOpacity !== '' && ! hasBackground ) {
						// Checks if color comes from Non-stackable color palette.
							const hexColor = extractColor( value )
							return `${ hexToRgba( hexColor || '#ffffff', backgroundColorOpacity || 0 ) }`
						}

						if ( backgroundColorType === 'gradient' && backgroundColor2 === 'transparent' ) {
							return 'transparent'
						}

						return value
					} }
					valuePreCallback={ ( _value, getAttribute, device, state ) => {
						let value = _value
						if ( ! value && getAttribute( 'backgroundColorOpacity', 'desktop', state ) !== '' ) {
							if ( device !== 'desktop' || state !== 'normal' ) {
								value = getAttribute( 'backgroundColor', 'desktop', 'normal' ) || backgroundFallbackColor
							} else {
								value = backgroundFallbackColor
							}
						}
						return value
					} }
					dependencies={ [ 'backgroundColor2', 'backgroundColorOpacity', 'backgroundColorType', 'backgroundMediaUrl' ] }
				/>
			}
			{ attributeHasValue( 'backgroundMediaUrl', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="backgroundImage"
					attrName="backgroundMediaUrl"
					attrNameTemplate={ attrNameTemplate }
					format="url(%s)"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'fixedBackground', attributes, { attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="backgroundAttachment"
					attrName="fixedBackground"
					attrNameTemplate={ attrNameTemplate }
					valueCallback={ value => value ? 'fixed' : undefined }
				/>
			}

			{ attributeHasValue( 'backgroundPosition', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="backgroundPosition"
					attrName="backgroundPosition"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
				/>
			}
			{ attributeHasValue( 'backgroundRepeat', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="backgroundRepeat"
					attrName="backgroundRepeat"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
				/>
			}
			{ attributeHasValue( 'backgroundSize', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="backgroundSize"
					attrName="backgroundSize"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					valueCallback={ ( value, getAttribute, device ) => {
						if ( value === 'custom' ) {
							if ( getAttribute( 'backgroundCustomSize', device ) ) {
								return getAttribute( 'backgroundCustomSize', device ) + ( getAttribute( 'backgroundCustomSizeUnit', device ) || '%' )
							}
						}
						return value
					} }
					dependencies={ [ 'backgroundCustomSize', 'backgroundCustomSizeUnit' ] }
				/>
			}
			{ attributeHasValue( 'backgroundImageBlendMode', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="backgroundBlendMode"
					attrName="backgroundImageBlendMode"
					attrNameTemplate={ attrNameTemplate }
				/>
			}
			{ attributeHasValue( 'backgroundColor', attributes, { hasHover: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector }:before` }
					hoverSelector={ `${ selector }:hover:before` }
					styleRule="backgroundColor"
					attrName="backgroundColor"
					attrNameTemplate={ attrNameTemplate }
					hover="all"
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( value === '' ) {
							if ( getAttribute( 'backgroundTintStrength', device, state ) ) {
								return '#000000'
							}
						}
						return value
					} }
					valueCallback={ ( value, getAttribute ) => {
						const isGradient = getAttribute( 'backgroundColorType' ) === 'gradient'
						return ! isGradient && value ? value : undefined
					} }
					dependencies={ [ 'backgroundColorType', 'backgroundColor2', 'backgroundTintStrength' ] }
				/>
			}
			{ attributeHasValue( 'backgroundTintStrength', attributes, { hasHover: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector }:before` }
					hoverSelector={ `${ selector }:hover:before` }
					styleRule="opacity"
					attrName="backgroundTintStrength"
					attrNameTemplate={ attrNameTemplate }
					hover="all"
					enabledCallback={ getAttribute => !! getAttribute( 'backgroundMediaUrl', 'mobile', 'normal', true ) }
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( value === '' ) {
							if ( getAttribute( 'backgroundColor', device, state ) ) {
								return 5
							}
						}
						return value
					} }
					valueCallback={ value => {
						return parseInt( value, 10 ) / 10
					} }
					dependencies={ [ 'backgroundColor', 'backgroundColor2', 'backgroundMediaUrl' ] }
				/>
			}
			{ attributeHasValue( 'backgroundGradientBlendMode', attributes, { attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector }:before` }
					styleRule="mixBlendMode"
					attrName="backgroundGradientBlendMode"
					attrNameTemplate={ attrNameTemplate }
					enabledCallback={ getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient' }
					dependencies={ [ 'backgroundColorType' ] }
				/>
			}
			{ attributeHasValue( 'backgroundColor', attributes, { attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector }:before` }
					styleRule="backgroundImage"
					attrName="backgroundColor"
					attrNameTemplate={ attrNameTemplate }
					enabledCallback={ getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient' }
					valueCallback={ ( value, getAttribute ) => {
					// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
						const defaultColor1 = hexToRgba( getAttribute( 'backgroundColor2' ) || '#ffffff', 0 )
						const defaultColor2 = hexToRgba( getAttribute( 'backgroundColor' ) || '#ffffff', 0 )

						// Gradient location.
						const color1Location = `${ getAttribute( 'backgroundGradientLocation1' ) || '0' }%`
						const color2Location = `${ getAttribute( 'backgroundGradientLocation2' ) || '100' }%`

						let angle = getAttribute( 'backgroundGradientDirection' )
						if ( angle === '' ) {
							angle = '90'
						}
						angle = `${ angle }deg`

						return `linear-gradient(${ angle }, ${ getAttribute( 'backgroundColor' ) || defaultColor1 } ${ color1Location }, ${ getAttribute( 'BackgroundColor2' ) || defaultColor2 } ${ color2Location })`
					} }
					dependencies={ [ 'backgroundColorType', 'backgroundColor', 'backgroundColor2', 'backgroundGradientLocation1', 'backgroundGradientLocation2', 'backgroundGradientDirection' ] }
				/>
			}
			{ attributeHasValue( 'borderRadius', attributes, { attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					// In the editor, the background overlay can go outside the block if there's a border radius.
					renderIn="edit"
					selector={ `${ selector }:before` }
					styleRule="borderRadius"
					attrName="borderRadius"
					attrNameTemplate={ attrNameTemplate }
					format="%spx"
					enabledCallback={ getAttribute =>
						getAttribute( 'backgroundColorType' ) === 'gradient' ||
					getAttribute( 'backgroundColor' ) ||
					getAttribute( 'backgroundColor', 'desktop', 'hover' ) ||
					getAttribute( 'backgroundColor', 'desktop', 'parent-hovered' ) }
					dependencies={ [ 'backgroundColorType', 'backgroundColor', 'backgroundColor2' ] }
				/>
			}
		</>
	)
}

export const BackgroundStyle = props => {
	return <Styles { ...props } />
}

BackgroundStyle.Content = props => {
	return <Styles { ...props } />
}

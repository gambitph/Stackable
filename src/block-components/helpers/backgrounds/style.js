/**
 * External dependencies
 */
import {
	hexToRgba,
	__getValue,
	getStyles,
	useStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const getStyleParams = ( options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
		backgroundFallbackColor = '#ffffff',
	} = options

	// const getAttrName = getAttrNameFunction( attrNameTemplate )

	return [
		{
			selector,
			styleRule: 'backgroundColor',
			attrName: 'backgroundColor',
			attrNameTemplate,
			hoverCallback: getAttribute => {
				return getAttribute( 'backgroundColorType' ) !== 'gradient'
					? 'all' : false
			},
			valueCallback: ( value, getAttribute, device, state ) => {
				const backgroundColorType = getAttribute( 'backgroundColorType' )
				const backgroundColorOpacity = getAttribute( 'backgroundColorOpacity', 'desktop', state )

				const hasBackground = getAttribute( 'backgroundMediaUrl', 'desktop' ) ||
					getAttribute( 'backgroundMediaUrl', 'tablet' ) ||
					getAttribute( 'backgroundMediaUrl', 'mobile' )

				if ( ! backgroundColorType && backgroundColorOpacity !== '' && ! hasBackground ) {
					return `${ hexToRgba( value || '#ffffff', backgroundColorOpacity || 0 ) }`
				}

				return value
			},
			valuePreCallback: ( _value, getAttribute, device, state ) => {
				let value = _value
				if ( ! value && getAttribute( 'backgroundColorOpacity', 'desktop', state ) !== '' ) {
					if ( device !== 'desktop' || state !== 'normal' ) {
						value = getAttribute( 'backgroundColor', 'desktop', 'normal' ) || backgroundFallbackColor
					} else {
						value = backgroundFallbackColor
					}
				}
				return value
			},
			dependencies: [ 'backgroundColorOpacity', 'backgroundColorType', 'backgroundMediaUrl' ],
		},
		{
			selector,
			styleRule: 'backgroundImage',
			attrName: 'backgroundMediaUrl',
			attrNameTemplate,
			format: 'url(%s)',
			responsive: 'all',
		},
		{
			selector,
			styleRule: 'backgroundAttachment',
			attrName: 'fixedBackground',
			attrNameTemplate,
			valueCallback: value => value ? 'fixed' : undefined,
		},
		{
			selector,
			styleRule: 'backgroundPosition',
			attrName: 'backgroundPosition',
			attrNameTemplate,
			responsive: 'all',
		},
		{
			selector,
			styleRule: 'backgroundRepeat',
			attrName: 'backgroundRepeat',
			attrNameTemplate,
			responsive: 'all',
		},
		{
			selector,
			styleRule: 'backgroundSize',
			attrName: 'backgroundSize',
			attrNameTemplate,
			responsive: 'all',
			valueCallback: ( value, getAttribute, device ) => {
				if ( value === 'custom' ) {
					if ( getAttribute( 'backgroundCustomSize', device ) ) {
						return getAttribute( 'backgroundCustomSize', device ) + ( getAttribute( 'backgroundCustomSizeUnit', device ) || '%' )
					}
				}
				return value
			},
			dependencies: [ 'backgroundCustomSize', 'backgroundCustomSizeUnit' ],
		},
		{
			selector,
			styleRule: 'backgroundBlendMode',
			attrName: 'backgroundImageBlendMode',
			attrNameTemplate,
		},

		{
			selector: `${ selector }:before`,
			hoverSelector: `${ selector }:hover:before`,
			styleRule: 'backgroundColor',
			attrName: 'backgroundColor',
			attrNameTemplate,
			hover: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( value === '' ) {
					if ( getAttribute( 'backgroundTintStrength', device, state ) ) {
						return '#000000'
					}
				}
				return value
			},
			valueCallback: ( value, getAttribute ) => {
				const isGradient = getAttribute( 'backgroundColorType' ) === 'gradient'
				return ! isGradient && value ? value : undefined
			},
			dependencies: [ 'backgroundColorType' ],
		},
		{
			selector: `${ selector }:before`,
			hoverSelector: `${ selector }:hover:before`,
			styleRule: 'opacity',
			attrName: 'backgroundTintStrength',
			attrNameTemplate,
			hover: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'backgroundMediaUrl', 'mobile', 'normal', true ),
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( value === '' ) {
					if ( getAttribute( 'backgroundColor', device, state ) ) {
						return 5
					}
				}
				return value
			},
			valueCallback: value => {
				return parseInt( value, 10 ) / 10
			},
			dependencies: [ 'backgroundColor', 'backgroundMediaUrl' ],
		},
		{
			selector: `${ selector }:before`,
			styleRule: 'mixBlendMode',
			attrName: 'backgroundGradientBlendMode',
			attrNameTemplate,
			enabledCallback: getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient',
			dependencies: [ 'backgroundColorType' ],
		},

		{
			selector: `${ selector }:before`,
			styleRule: 'backgroundImage',
			attrName: 'backgroundColor',
			attrNameTemplate,
			enabledCallback: getAttribute => getAttribute( 'backgroundColorType' ) === 'gradient',
			valueCallback: ( value, getAttribute ) => {
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
			},
			dependencies: [ 'backgroundColorType', 'backgroundColor', 'backgroundColor2', 'backgroundGradientLocation1', 'backgroundGradientLocation2', 'backgroundGradientDirection' ],
		},

		// In the editor, the background overlay can go outside the block if there's a border radius.
		{
			renderIn: 'edit',
			selector: `${ selector }:before`,
			styleRule: 'borderRadius',
			attrName: 'borderRadius',
			attrNameTemplate,
			format: '%spx',
			enabledCallback: getAttribute =>
				getAttribute( 'backgroundColorType' ) === 'gradient' ||
				getAttribute( 'backgroundColor' ) ||
				getAttribute( 'backgroundColor', 'desktop', 'hover' ) ||
				getAttribute( 'backgroundColor', 'desktop', 'parent-hovered' ),
			dependencies: [ 'backgroundColorType', 'backgroundColor' ],
		},
	]
}

export const BackgroundStyle = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

BackgroundStyle.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

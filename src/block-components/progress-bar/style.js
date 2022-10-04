import {
	useStyles, getStyles, hexToRgba,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'
import {
	DEFAULT_PERCENT, DEFAULT_SIZE, DEFAULT_THICKNESS,
} from './attributes'

const getStyleParams = ( { isCircle } ) => {
	return [
		{
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-percent',
			attrName: 'progressPercent',
			...( ! isCircle && {
				format: '%s%',
			} ),
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-color-1',
			attrName: 'progressColor1',
			valuePreCallback: ( value, getAttribute ) => {
				if ( getAttribute( 'progressColorType' ) === 'gradient' && isCircle ) {
					const uniqueId = getAttribute( 'uniqueId' )
					return `url(#gradient-${ uniqueId })`
				}
				return value
			},
			dependencies: [ 'progressColorType' ],
		},

		{
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-background',
			attrName: 'progressBackgroundColor',
		},
		{
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-size',
			attrName: 'progressSize',
			format: '%spx',
		},
		// only use these stylRules when it's a circular progress
		...( isCircle ? [ {
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-rounded',
			attrName: 'progressRounded',
			valuePreCallback: value => {
				if ( typeof value === 'string' || value === false ) {
					return undefined
				}
				return 'round'
			},
		},
		{
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-thickness',
			attrName: 'progressThickness',
			format: '%spx',
		},
		{
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-dash-array',
			attrName: 'progressSize',
			valuePreCallback: ( value, getAttribute ) => {
				const derivedThickness = getAttribute( 'progressThickness' ) || DEFAULT_THICKNESS
				const derivedSize = ( value || DEFAULT_SIZE )

				const radius = ( derivedSize / 2 ) - ( derivedThickness / 2 )
				return Math.PI * ( radius * 2 )
			},
		},
		{
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-dash-offset',
			attrName: 'progressPercent',
			valuePreCallback: ( value, getAttribute ) => {
				const derivedThickness = getAttribute( 'progressThickness' ) || DEFAULT_THICKNESS
				const derivedSize = getAttribute( 'progressSize' ) || DEFAULT_SIZE

				// this is to handle dynamic content; only show valid value
				const parsedPercent = parseFloat( value )
				const derivedPercent = isNaN( parsedPercent ) ? DEFAULT_PERCENT : parsedPercent

				const radius = ( derivedSize / 2 ) - ( derivedThickness / 2 )
				const circumference = Math.PI * ( radius * 2 )
				return ( ( 100 - derivedPercent ) / 100 ) * circumference
			},
		} ] : [ {
			selector: '[class*="stk-progress-"]',
			styleRule: '--progress-border-radius',
			attrName: 'progressBorderRadius',
			hasUnits: 'px',
		},
		{
			selector: '.stk-progress__bar.stk--has-background-overlay:before',
			styleRule: 'backgroundImage',
			attrName: 'progressColor1',
			enabledCallback: getAttribute => getAttribute( 'progressColorType' ) === 'gradient',
			valueCallback: ( value, getAttribute ) => {
				if ( ! getAttribute( 'progressColor2' ) ) {
					return undefined
				}
				// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
				const defaultColor1 = hexToRgba( getAttribute( 'progressColor2' ) || '#ffffff', 0 )
				const defaultColor2 = hexToRgba( getAttribute( 'progressColor1' ) || '#3498db', 0 )

				// Gradient location.
				const color1Location = `${ getAttribute( 'progressColorGradientLocation1' ) || '0' }%`
				const color2Location = `${ getAttribute( 'progressColorGradientLocation2' ) || '100' }%`

				const directionAngle = getAttribute( 'progressColorGradientDirection' )
				const angle = typeof directionAngle === 'string' ? '90deg' : `${ directionAngle }deg`

				return `linear-gradient(${ angle }, ${ getAttribute( 'progressColor1' ) || defaultColor1 } ${ color1Location }, ${ getAttribute( 'progressColor2' ) || defaultColor2 } ${ color2Location })`
			},
			dependencies: [ 'progressColorType', 'progressColor1', 'progressColor2', 'progressColorGradientLocation1', 'progressColorGradientLocation2', 'progressColorGradientDirection' ],
		},
	 ] ),
	]
}

export const Style = props => {
	const progressBarStyles = useStyles( getStyleParams( { isCircle: props.isCircle } ) )

	return (
		<StyleComponent
			styles={ progressBarStyles }
			versionAdded="3.4.5"
			versionDeprecated=""
			{ ...props }
		/>
	)
}

Style.defaultProps = {
	isCircle: false,
	isEditor: false,
	attributes: {},
	options: {},
}

Style.Content = props => {
	const {
		...propsToPass
	} = props

	const progressBarStyles = getStyles( propsToPass.attributes, getStyleParams( { isCircle: props.isCircle } ) )

	return (
		<StyleComponent.Content
			styles={ progressBarStyles }
			versionAdded="3.4.5"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

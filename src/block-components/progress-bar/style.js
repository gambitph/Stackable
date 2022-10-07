import md5 from 'md5'
import {
	useStyles, getStyles, hexToRgba,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( { isCircle } ) => {
	const selector = isCircle ? '.stk-progress-circle' : '.stk-progress-bar'
	return [
		{
			selector,
			styleRule: '--progress-percent',
			attrName: 'progressPercent',
			...( ! isCircle && {
				format: '%s%',
			} ),
		},
		{
			selector,
			styleRule: '--progress-color-1',
			attrName: 'progressColor1',
			...( isCircle && {
				renderIn: 'save',
				valuePreCallback: ( value, getAttribute ) => {
					if ( getAttribute( 'progressColorType' ) === 'gradient' ) {
						const uniqueId = getAttribute( 'uniqueId' )
						return `url(#gradient-${ uniqueId })`
					}
					return value
				},
			} ),
			dependencies: [ 'progressColorType', 'progressColor2' ],
		},
		{
			selector,
			styleRule: '--progress-background',
			attrName: 'progressBackgroundColor',
		},
		{
			selector,
			responsive: 'all',
			styleRule: '--progress-size',
			attrName: 'progressSize',
			format: '%spx',
		},
		// only use these stylRules when it's a circular progress
		...( isCircle ? [ {
			selector,
			renderIn: 'edit',
			styleRule: '--progress-color-1',
			attrName: 'progressColor1',
			valuePreCallback: ( value, getAttribute ) => {
				if ( getAttribute( 'progressColorType' ) === 'gradient' ) {
					// generate custom identifier on the editor as uniqueId can be blank.
					// This happens when adding block with default block styling created.
					// should use uniqueId upon saving
					const color1 = getAttribute( 'progressColor1' ) || ''
					const color2 = getAttribute( 'progressColor2' ) || ''
					const direction = getAttribute( 'progressColorGradientDirection' ) || ''
					const customGradientId = md5( color1 + color2 + direction )
					return `url(#gradient-${ customGradientId })`
				}
				return value
			},
			dependencies: [ 'progressColorType', 'progressColor2', 'progressColorGradientDirection' ],
		},
		{
			selector,
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
			selector,
			responsive: 'all',
			styleRule: '--progress-thickness',
			attrName: 'progressThickness',
			format: '%spx',
		} ] : [ {
			selector,
			styleRule: '--progress-bar-width',
			attrName: 'progressWidth',
			hasUnits: '%',
		},
		{
			selector,
			styleRule: '--progress-border-radius',
			attrName: 'progressBorderRadius',
			hasUnits: 'px',
		},
		{
			selector,
			styleRule: '--progress-bar-border-radius',
			attrName: 'progressApplyBarRadius',
			valuePreCallback: ( value, getAttribute ) => {
				const borderRadius = getAttribute( 'progressBorderRadius' )
				return value ? borderRadius : undefined
			},
			hasUnits: 'px',
		},
		{
			selector: '.stk-progress-bar__bar.stk--has-background-overlay:before',
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
	const progressBarStyles = useStyles( getStyleParams( props.options ) )

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
	isEditor: false,
	attributes: {},
	options: {
		isCircle: false,
	},
}

Style.Content = props => {
	const {
		...propsToPass
	} = props

	const progressBarStyles = getStyles( propsToPass.attributes, getStyleParams( props.options ) )

	return (
		<StyleComponent.Content
			styles={ progressBarStyles }
			versionAdded="3.4.5"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

Style.Content.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {
		isCircle: false,
	},
}

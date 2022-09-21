import { useStyles, getStyles } from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'
import {
	DEFAULT_PERCENT, DEFAULT_SIZE, DEFAULT_THICKNESS,
} from './attributes'

const getStyleParams = () => {
	return [
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-thickness',
			attrName: 'progressThickness',
			format: '%spx',
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-percent',
			attrName: 'progressPercent',
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-color-1',
			attrName: 'progressColor1',
			valuePreCallback: ( value, getAttribute, _, state ) => {
				if ( getAttribute( 'progressColorType', 'desktop', state ) === 'gradient' ) {
					const uniqueId = getAttribute( 'uniqueId' )
					return `url(#gradient-${ uniqueId })`
				}
				return value
			},
			dependencies: [ 'progressColorType' ],
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-background',
			attrName: 'progressBackgroundColor',
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-size',
			attrName: 'progressSize',
			format: '%spx',
		},
		{
			selector: '.stk-progress-circle',
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
			selector: '.stk-progress-circle',
			styleRule: '--progress-dash-array',
			attrName: 'progressSize',
			valuePreCallback: ( value, getAttribute ) => {
				const derivedThickness = getAttribute( 'progressThickness' ) || DEFAULT_THICKNESS
				const derivedSize = ( value || DEFAULT_SIZE )

				const radius = ( derivedSize / 2 ) - ( derivedThickness / 2 )
				return parseInt( Math.PI * ( radius * 2 ) )
			},
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-dash-offset',
			attrName: 'progressPercent',
			valuePreCallback: ( value, getAttribute ) => {
				const derivedThickness = getAttribute( 'progressThickness' ) || DEFAULT_THICKNESS
				const derivedSize = getAttribute( 'progressSize' ) || DEFAULT_SIZE
				const derivedPercent = typeof value === 'string' ? DEFAULT_PERCENT : value

				const radius = ( derivedSize / 2 ) - ( derivedThickness / 2 )
				const circumference = parseInt( Math.PI * ( radius * 2 ) )
				return ( ( 100 - derivedPercent ) / 100 ) * circumference
			},
		},
	]
}

export const Style = props => {
	const progressBarStyles = useStyles( getStyleParams() )

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
	options: {},
}

Style.Content = props => {
	const {
		...propsToPass
	} = props

	const progressBarStyles = getStyles( propsToPass.attributes, getStyleParams() )

	return (
		<StyleComponent.Content
			styles={ progressBarStyles }
			versionAdded="3.4.5"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

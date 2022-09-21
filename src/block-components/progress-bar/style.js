import { useStyles, getStyles } from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

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
			styleRule: '--progress-color',
			attrName: 'progressColor',
		},
		{
			selector: '.stk-progress-circle',
			styleRule: '--progress-color',
			attrName: 'progressColor',
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

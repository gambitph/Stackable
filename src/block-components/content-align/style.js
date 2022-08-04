/**
 * External dependencies
 */
import {
	getStyles,
	useStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = () => {
	return [
		{
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: '--stk-column-gap',
			attrName: 'columnGap',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: '--stk-column-gap',
			attrName: 'columnGap',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: 'justifyContent',
			attrName: 'columnFitAlign',
			responsive: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'columnFit' ),
		},
		{
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: 'justifyContent',
			attrName: 'columnFitAlign',
			responsive: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'columnFit' ),
		},
	]
}

export const Style = props => {
	const styles = useStyles( getStyleParams( props ) )

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...props }
		/>
	)
}

Style.defaultProps = {
	isEditor: false,
}

Style.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( propsToPass.options ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

Style.Content.defaultProps = {
	attributes: {},
}


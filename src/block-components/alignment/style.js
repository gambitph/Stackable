/**
 * Internal dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'

const getStyleParams = ( options = {} ) => {
	const {
		selectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		editorSelectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
	} = options

	return [
		{
			selector: '',
			responsive: 'all',
			styles: {
				alignSelf: 'columnAlign',
			},
		},
		{
			renderIn: 'save',
			selectorCallback,
			styles: {
				alignItems: 'rowAlign',
				justifyContent: 'innerBlockVerticalAlign',
			},
			responsive: 'all',
			enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		},
		{
			renderIn: 'save',
			selectorCallback,
			styleRule: 'alignItems',
			attrName: 'innerBlockVerticalAlign',
			responsive: 'all',
			enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		},

		{
			renderIn: 'edit',
			selectorCallback: editorSelectorCallback,
			styles: {
				alignItems: 'rowAlign',
				justifyContent: 'innerBlockVerticalAlign',
			},
			responsive: 'all',
			enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		},
		{
			renderIn: 'edit',
			selectorCallback: editorSelectorCallback,
			styleRule: 'alignItems',
			attrName: 'innerBlockVerticalAlign',
			responsive: 'all',
			enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

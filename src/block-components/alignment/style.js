/**
 * Internal dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'

const getStyleParams = () => {
	return [
		{
			selector: '',
			responsive: 'all',
			styles: {
				textAlign: 'contentAlign',
				alignSelf: 'columnAlign',
			},
		},

		{
			renderIn: 'save',
			selectorCallback: attributes => `.stk--block-align-${ attributes.uniqueId }`,
			styles: {
				alignItems: 'rowAlign',
				justifyContent: 'innerBlockVerticalAlign',
			},
			responsive: 'all',
			enabledCallback: attributes => attributes.innerBlockOrientation !== 'horizontal',
		},
		{
			renderIn: 'save',
			selectorCallback: attributes => `.stk--block-align-${ attributes.uniqueId }`,
			styleRule: 'alignItems',
			attrName: 'innerBlockVerticalAlign',
			responsive: 'all',
			enabledCallback: attributes => attributes.innerBlockOrientation === 'horizontal',
		},

		{
			renderIn: 'edit',
			selectorCallback: attributes => `.stk--block-align-${ attributes.uniqueId } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
			styles: {
				alignItems: 'rowAlign',
				justifyContent: 'innerBlockVerticalAlign',
			},
			responsive: 'all',
			enabledCallback: attributes => attributes.innerBlockOrientation !== 'horizontal',
		},
		{
			renderIn: 'edit',
			selectorCallback: attributes => `.stk--block-align-${ attributes.uniqueId } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
			styleRule: 'alignItems',
			attrName: 'innerBlockVerticalAlign',
			responsive: 'all',
			enabledCallback: attributes => attributes.innerBlockOrientation === 'horizontal',
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

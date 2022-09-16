/**
 * Internal dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'

const getStyleParams = ( options = {} ) => {
	const {
		selectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		editorSelectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		columnAlignSelectorCallback = ( () => '' ),
	} = options
	return [
		{
			selectorCallback: columnAlignSelectorCallback,
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
			},
			responsive: 'all',
			enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
			depenencies: [ 'innerBlockOrientation' ],
		},

		{
			renderIn: 'edit',
			selectorCallback: editorSelectorCallback,
			styles: {
				alignItems: 'rowAlign',
			},
			responsive: 'all',
			enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
			depenencies: [ 'innerBlockOrientation' ],
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

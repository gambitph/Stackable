/**
 * Internal dependencies
 */
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule="--stk-column-gap"
				attrName="columnGap"
				key="columnGap-save"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-column-gap"
				attrName="columnGap"
				key="columnGap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule="rowGap"
				attrName="rowGap"
				key="rowGap-save"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="rowGap"
				attrName="rowGap"
				key="rowGap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule="justifyContent"
				attrName="columnFitAlign"
				key="columnFitAlign-save"
				responsive="all"
				enabledCallback={ getAttribute => !! getAttribute( 'columnFit' ) }
				dependencies={ [ 'columnFit' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="justifyContent"
				attrName="columnFitAlign"
				key="columnFitAlign"
				responsive="all"
				enabledCallback={ getAttribute => !! getAttribute( 'columnFit' ) }
				dependencies={ [ 'columnFit' ] }
			/>
		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}

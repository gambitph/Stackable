/**
 * Internal dependencies
 */
import { BlockCss } from '~stackable/components'
import { attributeHasValue } from '~stackable/util'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
	} = props

	return (
		<>
			{ attributeHasValue( 'columnGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector=".%s-column"
					styleRule="--stk-column-gap"
					attrName="columnGap"
					format="%spx"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'columnGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
					styleRule="--stk-column-gap"
					attrName="columnGap"
					format="%spx"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'rowGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector=".%s-column"
					styleRule="rowGap"
					attrName="rowGap"
					format="%spx"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'rowGap', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
					styleRule="rowGap"
					attrName="rowGap"
					format="%spx"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'columnFitAlign', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector=".%s-column"
					styleRule="justifyContent"
					attrName="columnFitAlign"
					responsive="all"
					enabledCallback={ getAttribute => !! getAttribute( 'columnFit' ) }
					dependencies={ [ 'columnFit' ] }
				/>
			}
			{ attributeHasValue( 'columnFitAlign', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
					styleRule="justifyContent"
					attrName="columnFitAlign"
					responsive="all"
					enabledCallback={ getAttribute => !! getAttribute( 'columnFit' ) }
					dependencies={ [ 'columnFit' ] }
				/>
			}

		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}

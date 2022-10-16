/**
 * Internal dependencies
 */
import { BlockCss, extractControlProps } from '~stackable/components'
import { attributeHasValue } from '~stackable/util'

const AlignmentStyles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		editorSelectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		columnAlignSelectorCallback = ( () => '' ),
	} = extractControlProps
	const {
		attributes,
	} = props

	return (
		<>
			{ attributeHasValue( 'columnAlign', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ columnAlignSelectorCallback }
					responsive="all"
					styleRule="alignSelf"
					attrName="columnAlign"
				/>
			}
			{ attributeHasValue( 'rowAlign', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selectorCallback={ selectorCallback }
					styleRule="alignItems"
					attrName="rowAlign"
					responsive="all"
					enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
					dependencies={ [ 'innerBlockOrientation' ] }
				/>
			}
			{ attributeHasValue( 'rowAlign', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selectorCallback={ editorSelectorCallback }
					styleRule="alignItems"
					attrName="rowAlign"
					responsive="all"
					enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
					dependencies={ [ 'innerBlockOrientation' ] }
				/>
			}
		</>
	)
}

export const Style = props => {
	return <AlignmentStyles { ...props } />
}

Style.Content = props => {
	return <AlignmentStyles { ...props } />
}

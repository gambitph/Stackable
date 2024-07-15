/**
 * Internal dependencies
 */
import { BlockCss } from '~stackable/components'

import { memo } from '@wordpress/element'

const AlignmentStyles = memo( props => {
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
		innerBlockSelectorCallback = getAttribute => `.stk-${ getAttribute( 'uniqueId' ) }-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout`,
		editorInnerBlockSelectorCallback = getAttribute => `.stk-${ getAttribute( 'uniqueId' ) }-inner-blocks`,
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selectorCallback={ columnAlignSelectorCallback }
				responsive="all"
				styleRule="alignSelf"
				attrName="columnAlign"
				key="columnAlign"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ selectorCallback }
				styleRule="alignItems"
				attrName="rowAlign"
				key="rowAlign-save"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				 ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ editorSelectorCallback }
				styleRule="alignItems"
				attrName="rowAlign"
				key="rowAlign"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			{ /* When blocks are vertical */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="alignItems"
				attrName="innerBlockJustify"
				key="innerBlockJustifyVerticalEdit"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="alignItems"
				attrName="innerBlockJustify"
				key="innerBlockJustifyVerticalSave"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="justifyContent"
				attrName="innerBlockAlign"
				key="innerBlockAlignVerticalEdit"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="justifyContent"
				attrName="innerBlockAlign"
				key="innerBlockAlignVerticalSave"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			{ /* When blocks are horizontal */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="justifyContent"
				attrName="innerBlockJustify"
				key="innerBlockJustifyHorizontalEdit"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="justifyContent"
				attrName="innerBlockJustify"
				key="innerBlockJustifyHorizontalSave"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="alignItems"
				attrName="innerBlockAlign"
				key="innerBlockAlignHorizontalEdit"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="alignItems"
				attrName="innerBlockAlign"
				key="innerBlockAlignHorizontalSave"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>

			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="flexWrap"
				attrName="innerBlockWrap"
				key="innerBlockWrapEdit"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="flexWrap"
				attrName="innerBlockWrap"
				key="innerBlockWrapSave"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>

			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="columnGap"
				attrName="innerBlockColumnGap"
				key="innerBlockColumnGapEdit"
				format={ `%spx` }
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="columnGap"
				attrName="innerBlockColumnGap"
				key="innerBlockColumnGapSave"
				format={ `%spx` }
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' }
				dependencies={ [
					'innerBlockOrientation',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="rowGap"
				attrName="innerBlockRowGap"
				key="innerBlockRowGapEdit"
				format={ `%spx` }
				responsive="all"
				enabledCallback={ getAttribute => {
					return getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ||
						( getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' )
				} }
				dependencies={ [
					'innerBlockOrientation',
					'innerBlockWrap',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="rowGap"
				attrName="innerBlockRowGap"
				key="innerBlockRowGapSave"
				format={ `%spx` }
				responsive="all"
				enabledCallback={ getAttribute => {
					return getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ||
						( getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' )
				} }
				dependencies={ [
					'innerBlockOrientation',
					'innerBlockWrap',
					...dependencies,
				] }
			/>

			{ /* On flex wrap, we also need to set alignContent so that the wrapped elements would align correctly. Or else we will have huge gaps. */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ innerBlockSelectorCallback }
				styleRule="alignContent"
				attrName="innerBlockAlign"
				key="innerBlockAlignWrapEdit"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' }
				dependencies={ [
					'innerBlockOrientation',
					'innerBlockWrap',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selectorCallback={ editorInnerBlockSelectorCallback }
				styleRule="alignContent"
				attrName="innerBlockAlign"
				key="innerBlockAlignWrapSave"
				responsive="all"
				enabledCallback={ getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' }
				dependencies={ [
					'innerBlockOrientation',
					'innerBlockWrap',
					...dependencies,
				] }
			/>
		</>
	)
} )

export const Style = props => {
	return <AlignmentStyles { ...props } />
}

Style.Content = props => {
	return <AlignmentStyles { ...props } />
}

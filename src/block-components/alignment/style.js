export const addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const {
		selectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		editorSelectorCallback = getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) }`,
		columnAlignSelectorEditCallback = ( () => '' ),
		columnAlignSelectorSaveCallback = ( () => '' ),
		innerBlockSelectorCallback = getAttribute => `.stk-${ getAttribute( 'uniqueId' ) }-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout`,
		editorInnerBlockSelectorCallback = getAttribute => `.stk-${ getAttribute( 'uniqueId' ) }-inner-blocks`,
		dependencies = [],
	} = props

	blockStyleGenerator.addBlockStyles( 'columnAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: columnAlignSelectorEditCallback,
		responsive: 'all',
		styleRule: 'alignSelf',
		attrName: 'columnAlign',
		key: 'columnAlign',
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: columnAlignSelectorSaveCallback,
		responsive: 'all',
		styleRule: 'alignSelf',
		attrName: 'columnAlign',
		key: 'columnAlign',
	} ] )

	blockStyleGenerator.addBlockStyles( 'rowAlign', [ {
		...propsToPass,
		renderIn: 'save',
		selectorCallback,
		styleRule: 'alignItems',
		attrName: 'rowAlign',
		key: 'rowAlign-save',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		 ],
	}, {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'rowAlign',
		key: 'rowAlign',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	{ /* When blocks are vertical */ }
	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalEdit',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalSave',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalEdit',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalSave',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	{ /* When blocks are horizontal */ }
	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalEdit',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalSave',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalEdit',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalSave',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockWrap', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'flexWrap',
		attrName: 'innerBlockWrap',
		key: 'innerBlockWrapEdit',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'flexWrap',
		attrName: 'innerBlockWrap',
		key: 'innerBlockWrapSave',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockColumnGap', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'columnGap',
		attrName: 'innerBlockColumnGap',
		key: 'innerBlockColumnGapEdit',
		format: `%spx`,
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'columnGap',
		attrName: 'innerBlockColumnGap',
		key: 'innerBlockColumnGapSave',
		format: `%spx`,
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockRowGap', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'rowGap',
		attrName: 'innerBlockRowGap',
		key: 'innerBlockRowGapEdit',
		format: `%spx`,
		responsive: 'all',
		enabledCallback: getAttribute => {
			return getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ||
				( getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' )
		},
		dependencies: [
			'innerBlockOrientation',
			'innerBlockWrap',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'rowGap',
		attrName: 'innerBlockRowGap',
		key: 'innerBlockRowGapSave',
		format: `%spx`,
		responsive: 'all',
		enabledCallback: getAttribute => {
			return getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ||
			( getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' )
		},
		dependencies: [
			'innerBlockOrientation',
			'innerBlockWrap',
			...dependencies,
		],
	} ] )

	{ /* On flex wrap, we also need to set alignContent so that the wrapped elements would align correctly. Or else we will have huge gaps. */ }
	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignWrapEdit',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap',
		dependencies: [
			'innerBlockOrientation',
			'innerBlockWrap',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignWrapSave',
		responsive: 'all',
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap',
		dependencies: [
			'innerBlockOrientation',
			'innerBlockWrap',
			...dependencies,
		],
	} ] )
}

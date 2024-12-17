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
		editorInnerBlockSelectorCallback = getAttribute => `.stk-${ getAttribute( 'uniqueId' ) }-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout`,
		innerBlockSelectorCallback = getAttribute => `.stk-${ getAttribute( 'uniqueId' ) }-inner-blocks`,
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

	blockStyleGenerator.addBlockStyles( 'innerBlockOrientation', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'flexDirection',
		attrName: 'innerBlockOrientation',
		key: 'innerBlockOrientation',
		responsive: 'all',
		valueCallback: value => value === 'horizontal' ? 'row' : 'column',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'flexDirection',
		attrName: 'innerBlockOrientation',
		key: 'innerBlockOrientation-save',
		responsive: 'all',
		valueCallback: value => value === 'horizontal' ? 'row' : 'column',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		 ],
	} ] )

	/* Desktop alignItems */
	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalEdit',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalSave',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalEdit',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalSave',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	/* Tablet alignItems */
	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalEdit',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalSave',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalEdit',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalSave',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	/* Mobile alignItems */
	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalEdit',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) !== 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyVerticalSave',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) !== 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalEdit',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) === 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignHorizontalSave',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) === 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	/* Desktop justifyContent */
	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalEdit',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalSave',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalEdit',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalSave',
		responsive: [ 'desktop' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	/* Tablet justifyContent */
	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalEdit',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalSave',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalEdit',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalSave',
		responsive: [ 'tablet' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal',
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	/* Mobile justifyContent */
	blockStyleGenerator.addBlockStyles( 'innerBlockAlign', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalEdit',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) !== 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockAlign',
		key: 'innerBlockAlignVerticalSave',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) !== 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) !== 'horizontal' : getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockJustify', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalEdit',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) === 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockJustify',
		key: 'innerBlockJustifyHorizontalSave',
		responsive: [ 'mobile' ],
		enabledCallback: getAttribute => getAttribute( 'innerBlockOrientationMobile' ) ? getAttribute( 'innerBlockOrientationMobile' ) === 'horizontal' : ( getAttribute( 'innerBlockOrientationTablet' ) ? getAttribute( 'innerBlockOrientationTablet' ) === 'horizontal' : getAttribute( 'innerBlockOrientation' ) === 'horizontal' ),
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	} ] )

	/* Inner Block Wrap */
	blockStyleGenerator.addBlockStyles( 'innerBlockWrap', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
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
		selectorCallback: innerBlockSelectorCallback,
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
		selectorCallback: editorInnerBlockSelectorCallback,
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
		selectorCallback: innerBlockSelectorCallback,
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
		selectorCallback: editorInnerBlockSelectorCallback,
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
		selectorCallback: innerBlockSelectorCallback,
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
		selectorCallback: editorInnerBlockSelectorCallback,
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
		selectorCallback: innerBlockSelectorCallback,
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

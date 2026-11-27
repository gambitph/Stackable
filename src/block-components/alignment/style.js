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

	blockStyleGenerator.addBlockStyles( 'innerBlockOrientation', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockOrientation',
		key: 'innerBlockOrientationAlignItems',
		responsive: 'all',
		valuePreCallback: ( value, getAttribute, device ) => {
			if ( device === 'desktop' ) {
				if ( value === 'horizontal' ) {
					return getAttribute( 'innerBlockAlign' )
				}

				return getAttribute( 'innerBlockJustify' )
			}

			const inheritOrientation = device === 'tablet' ? getAttribute( 'innerBlockOrientation', 'desktop' ) : getAttribute( 'innerBlockOrientation', 'tablet' ) || getAttribute( 'innerBlockOrientation', 'desktop' )

			// For tablet and mobile, inner block orientation is '' if it is the same as the previous device
			// otherwise, it will have a value of either 'horizontal' or 'vertical'
			// reset alignItems to default if inner block orientation is different than the previous device
			if ( value === 'horizontal' ) {
				return getAttribute( 'innerBlockAlign', device ) || 'initial'
			} else if ( value === 'vertical' ) {
				return getAttribute( 'innerBlockJustify', device ) || 'initial'
			} else if ( inheritOrientation === 'horizontal' ) {
				return getAttribute( 'innerBlockAlign', device )
			}

			return getAttribute( 'innerBlockJustify', device )
		},
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'alignItems',
		attrName: 'innerBlockOrientation',
		key: 'innerBlockOrientationAlignItems-save',
		responsive: 'all',
		valuePreCallback: ( value, getAttribute, device ) => {
			if ( device === 'desktop' ) {
				if ( value === 'horizontal' ) {
					return getAttribute( 'innerBlockAlign' )
				}

				return getAttribute( 'innerBlockJustify' )
			}

			const inheritOrientation = device === 'tablet' ? getAttribute( 'innerBlockOrientation', 'desktop' ) : getAttribute( 'innerBlockOrientation', 'tablet' ) || getAttribute( 'innerBlockOrientation', 'desktop' )

			// For tablet and mobile, inner block orientation is '' if it is the same as the previous device
			// otherwise, it will have a value of either 'horizontal' or 'vertical'
			// reset alignItems to default if inner block orientation is different than the previous device
			if ( value === 'horizontal' ) {
				return getAttribute( 'innerBlockAlign', device ) || 'initial'
			} else if ( value === 'vertical' ) {
				return getAttribute( 'innerBlockJustify', device ) || 'initial'
			} else if ( inheritOrientation === 'horizontal' ) {
				return getAttribute( 'innerBlockAlign', device )
			}

			return getAttribute( 'innerBlockJustify', device )
		},
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		 ],
	} ] )

	blockStyleGenerator.addBlockStyles( 'innerBlockOrientation', [ {
		...propsToPass,
		renderIn: 'edit',
		selectorCallback: editorInnerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockOrientation',
		key: 'innerBlockOrientationJustifyContent',
		responsive: 'all',
		valuePreCallback: ( value, getAttribute, device ) => {
			if ( device === 'desktop' ) {
				if ( value === 'horizontal' ) {
					return getAttribute( 'innerBlockJustify' )
				}

				return getAttribute( 'innerBlockAlign' )
			}

			const inheritOrientation = device === 'tablet' ? getAttribute( 'innerBlockOrientation', 'desktop' ) : getAttribute( 'innerBlockOrientation', 'tablet' ) || getAttribute( 'innerBlockOrientation', 'desktop' )

			// For tablet and mobile, inner block orientation is '' if it is the same as the previous device
			// otherwise, it will have a value of either 'horizontal' or 'vertical'
			// reset justifyContent to default if inner block orientation is different than the previous device
			if ( value === 'horizontal' ) {
				return getAttribute( 'innerBlockJustify', device ) || 'space-evenly'
			} else if ( value === 'vertical' ) {
				return getAttribute( 'innerBlockAlign', device ) || 'initial'
			} else if ( inheritOrientation === 'horizontal' ) {
				return getAttribute( 'innerBlockJustify', device )
			}

			return getAttribute( 'innerBlockAlign', device )
		},
		dependencies: [
			'innerBlockOrientation',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selectorCallback: innerBlockSelectorCallback,
		styleRule: 'justifyContent',
		attrName: 'innerBlockOrientation',
		key: 'innerBlockOrientationJustifyContent-save',
		responsive: 'all',
		valuePreCallback: ( value, getAttribute, device ) => {
			if ( device === 'desktop' ) {
				if ( value === 'horizontal' ) {
					return getAttribute( 'innerBlockJustify' )
				}

				return getAttribute( 'innerBlockAlign' )
			}

			const inheritOrientation = device === 'tablet' ? getAttribute( 'innerBlockOrientation', 'desktop' ) : getAttribute( 'innerBlockOrientation', 'tablet' ) || getAttribute( 'innerBlockOrientation', 'desktop' )

			// For tablet and mobile, inner block orientation is '' if it is the same as the previous device
			// otherwise, it will have a value of either 'horizontal' or 'vertical'
			// reset justifyContent to default if inner block orientation is different than the previous device
			if ( value === 'horizontal' ) {
				return getAttribute( 'innerBlockJustify', device ) || 'space-evenly'
			} else if ( value === 'vertical' ) {
				return getAttribute( 'innerBlockAlign', device ) || 'initial'
			} else if ( inheritOrientation === 'horizontal' ) {
				return getAttribute( 'innerBlockJustify', device )
			}

			return getAttribute( 'innerBlockAlign', device )
		},
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
		responsive: 'all',
		valueCallback: value => {
			// Substitute with using format to work with preset controls
			if ( typeof value === 'string' && value.startsWith( 'var' ) ) {
				return value
			}
			return value + 'px'
		},
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
		responsive: 'all',
		valueCallback: value => {
			// Substitute with using format to work with preset controls
			if ( typeof value === 'string' && value.startsWith( 'var' ) ) {
				return value
			}
			return value + 'px'
		},
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
		responsive: 'all',
		enabledCallback: getAttribute => {
			return getAttribute( 'innerBlockOrientation' ) !== 'horizontal' ||
				( getAttribute( 'innerBlockOrientation' ) === 'horizontal' && getAttribute( 'innerBlockWrap' ) === 'wrap' )
		},
		valueCallback: value => {
			// Substitute with using format to work with preset controls
			if ( typeof value === 'string' && value.startsWith( 'var' ) ) {
				return value
			}
			return value + 'px'
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
		responsive: 'all',
		valueCallback: value => {
			// Substitute with using format to work with preset controls
			if ( typeof value === 'string' && value.startsWith( 'var' ) ) {
				return value
			}
			return value + 'px'
		},
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

export const addSizeStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const {
		selector = '',
		attrNameTemplate = '%s',
		horizontalAlignRule = 'margin',
		verticalAlignRule = 'alignItems',
		verticalAlignSelectorEdit = '',
		verticalAlignSelectorSave = '',
		verticalAlignSelector = '',
		hasPaddings = true, // Disallow the padding styles
		wrapperSelector = '', // The outer wrapper element that where the outer flex alignments, widths and margins are applied to.
		dependencies = [],
	} = props

	blockStyleGenerator.addBlockStyles( 'height', [ {
		...propsToPass,
		selector,
		styleRule: 'minHeight',
		attrName: 'height',
		key: 'height',
		attrNameTemplate,
		responsive: 'all',
		hasUnits: 'px',
	} ] )

	if ( verticalAlignSelectorEdit ) {
		blockStyleGenerator.addBlockStyles( 'verticalAlign', [ {
			...propsToPass,
			renderIn: 'edit',
			selector: verticalAlignSelectorEdit,
			styleRule: verticalAlignRule || 'alignItems',
			attrName: 'verticalAlign',
			key: 'verticalAlign-edit',
			attrNameTemplate,
			responsive: 'all',
		} ] )
	}

	if ( verticalAlignSelectorSave ) {
		blockStyleGenerator.addBlockStyles( 'verticalAlign', [ {
			...propsToPass,
			renderIn: 'save',
			selector: verticalAlignSelectorSave,
			styleRule: verticalAlignRule || 'alignItems',
			attrName: 'verticalAlign',
			key: 'verticalAlign-save',
			attrNameTemplate,
			responsive: 'all',
		} ] )
	}

	if ( ! verticalAlignSelectorEdit && ! verticalAlignSelectorSave ) {
		blockStyleGenerator.addBlockStyles( 'verticalAlign', [ {
			...propsToPass,
			selector: verticalAlignSelector || selector,
			styleRule: verticalAlignRule || 'alignItems',
			attrName: 'verticalAlign',
			key: 'verticalAlign',
			attrNameTemplate,
			responsive: 'all',
		} ] )
	}

	blockStyleGenerator.addBlockStyles( 'width', [ {
		...propsToPass,
		selector: wrapperSelector || selector,
		styleRule: 'maxWidth',
		attrName: 'width',
		key: 'width-maxwidth',
		attrNameTemplate,
		responsive: 'all',
		hasUnits: 'px',
	}, {
		...propsToPass,
		selector: wrapperSelector || selector,
		styleRule: 'minWidth',
		attrName: 'width',
		key: 'width-minwidth',
		attrNameTemplate,
		responsive: 'all',
		hover: 'all',
		versionAdded: '3.0.0',
		versionDeprecated: '3.0.2',
		valueCallback: value => {
			return value !== '' ? 'auto' : undefined
		},
	} ] )

	if ( hasPaddings ) {
		blockStyleGenerator.addBlockStyles( 'padding', [ {
			...propsToPass,
			selector,
			styleRule: 'paddingTop',
			attrName: 'padding',
			key: 'padding-top',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.top,
		}, {
			...propsToPass,
			selector,
			styleRule: 'paddingRight',
			attrName: 'padding',
			key: 'padding-right',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.right,
		}, {
			...propsToPass,
			selector,
			styleRule: 'paddingBottom',
			attrName: 'padding',
			key: 'padding-bottom',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
		}, {
			...propsToPass,
			selector,
			styleRule: 'paddingLeft',
			attrName: 'padding',
			key: 'padding-left',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.left,
		} ] )
	}

	blockStyleGenerator.addBlockStyles( 'margin', [ {
		...propsToPass,
		selector: wrapperSelector || selector,
		styleRule: 'marginTop',
		attrName: 'margin',
		key: 'margin-top',
		attrNameTemplate,
		responsive: 'all',
		hasUnits: 'px',
		valuePreCallback: value => value?.top,
		valueCallback: value => {
			return value.startsWith( 'auto' ) ? 'auto' : value
		},
	}, {
		...propsToPass,
		selector: wrapperSelector || selector,
		styleRule: 'marginRight',
		attrName: 'margin',
		key: 'margin-right',
		attrNameTemplate,
		responsive: 'all',
		hasUnits: 'px',
		valuePreCallback: ( value, getAttribute, device ) => {
			const right = value?.right
			const horizontalAlign = getAttribute( 'horizontalAlign', device )
			const blockWidth = getAttribute( 'width', device )
			if ( blockWidth || typeof right !== 'undefined' ) {
				switch ( horizontalAlign ) {
					case 'flex-start':
					case 'center':
						return 'auto'
					case 'flex-end':
						return right || 0
					default: return right
				}
			} else {
				return ''
			}
		},
		valueCallback: value => {
			return value.startsWith( 'auto' ) ? 'auto' : value
		},
		dependencies: [
			'horizontalAlign',
		 'width',
		 ...dependencies,
		],
	}, {
		...propsToPass,
		selector: wrapperSelector || selector,
		styleRule: 'marginBottom',
		attrName: 'margin',
		key: 'margin-bottom',
		attrNameTemplate,
		responsive: 'all',
		hasUnits: 'px',
		valuePreCallback: value => value?.bottom,
		valueCallback: value => {
			return value.startsWith( 'auto' ) ? 'auto' : value
		},
	}, {
		...propsToPass,
		selector: wrapperSelector || selector,
		styleRule: 'marginLeft',
		attrName: 'margin',
		key: 'margin-left',
		attrNameTemplate,
		responsive: 'all',
		hasUnits: 'px',
		valuePreCallback: ( value, getAttribute, device ) => {
			const left = value?.left
			const horizontalAlign = getAttribute( 'horizontalAlign', device )
			const blockWidth = getAttribute( 'width', device )
			if ( blockWidth || typeof left !== 'undefined' ) {
				switch ( horizontalAlign ) {
					case 'flex-start':
						return left || 0
					case 'center':
					case 'flex-end':
						return 'auto'
					default: return left
				}
			} else {
				return ''
			}
		},
		valueCallback: value => {
			return value.startsWith( 'auto' ) ? 'auto' : value
		},
		dependencies: [
			'horizontalAlign',
		 'width',
		 ...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'verticalAlign', [ {
		...propsToPass,
		selector,
		styleRule: 'display',
		attrName: 'verticalAlign',
		key: 'verticalAlign-display',
		attrNameTemplate,
		responsive: 'all',
		valueCallback: () => {
			return 'flex'
		},
	} ] )

	// blockStyleGenerator.addBlockStyles( 'verticalAlign', [ {
	// 	...propsToPass,
	// 	renderIn: 'save',
	// 	selector,
	// 	styleRule: 'flexDirection',
	// 	attrName: 'verticalAlign',
	// 	key: 'verticalAlign-save-flex',
	// 	responsive: 'all',
	// 	attrNameTemplate,
	// 	valueCallback: () => {
	// 		return ( verticalAlignRule || 'alignItems' ) === 'justifyContent' ? 'column' : undefined
	// 	},
	// }, {
	// 	...propsToPass,
	// 	renderIn: 'edit',
	// 	selector,
	// 	styleRule: 'flexDirection',
	// 	attrName: 'verticalAlign',
	// 	key: 'verticalAlign-flex',
	// 	responsive: 'all',
	// 	attrNameTemplate,
	// 	valueCallback: () => {
	// 		return 'column'
	// 	},
	// } ] )

	if ( horizontalAlignRule !== 'margin' ) {
		blockStyleGenerator.addBlockStyles( 'horizontalAlign', [ {
			...propsToPass,
			renderIn: 'save',
			selector: wrapperSelector || selector,
			styleRule: horizontalAlignRule || 'justifyContent',
			attrName: 'horizontalAlign',
			key: 'horizontalAlign',
			attrNameTemplate,
			responsive: 'all',
		} ] )
	}
}

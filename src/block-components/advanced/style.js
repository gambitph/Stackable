/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		positionSelector = '',
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="top"
				attrName="positionNum"
				key="positionNum-save-top"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					// If position is sticky, we need to set top: 0px or else the sticky won't show.
					if ( device === 'desktop' && state === 'normal' ) {
						const isSticky = getAttribute( 'position', device, 'normal', true ) === 'sticky'
						const isTopBlank = ! value || ( value && value.top === '' )
						if ( isSticky && isTopBlank ) {
							return 0
						}
					}

					return value?.top
				} }
				dependencies={ [
					'position',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="right"
				attrName="positionNum"
				key="positionNum-save-right"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.right }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="bottom"
				attrName="positionNum"
				key="positionNum-save-bottom"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.bottom }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="left"
				attrName="positionNum"
				key="positionNum-save-left"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.left }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=""
				styleRule="position"
				attrName="position"
				key="position-save"
				responsive="all"
			/>
			{ /**
			   * For positions (top, right, bottom, left) and postiion (absolute,
			   * sticky) we need to apply these to the block itself so it would look
			   * correctly in the editor.
			   */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				hoverSelectorCallback={ ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined }
				styleRule="top"
				attrName="positionNum"
				key="positionNum-top"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
				// If position is sticky, we need to set top: 0px or else the sticky won't show.
					if ( device === 'desktop' && state === 'normal' ) {
						const isSticky = getAttribute( 'position', device, 'normal', true ) === 'sticky'
						const isTopBlank = ! value || ( value && value.top === '' )
						if ( isSticky && isTopBlank ) {
							return 0
						}
					}

					return value?.top
				} }
				dependencies={ [
					'position',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				hoverSelectorCallback={ ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined }
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="bottom"
				attrName="positionNum"
				key="positionNum-bottom"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.bottom }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				hoverSelectorCallback={ ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined }
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="left"
				attrName="positionNum"
				key="positionNum-left"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.left }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				hoverSelectorCallback={ ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined }
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="right"
				attrName="positionNum"
				key="positionNum-right"
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.right }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ positionSelector }
				hoverSelector={ positionSelector ? `${ positionSelector }:hover` : undefined }
				styleRule="position"
				attrName="positionNum"
				key="positionNum"
				responsive="all"
				hover="all"
				valuePreCallback={ ( value, getAttribute, device ) => {
					if ( value && ( value.top !== '' || value.right !== '' || value.bottom !== '' || value.left !== '' ) ) {
						if ( getAttribute( 'position', device ) === '' ) {
							return 'relative'
						}
					}
					return undefined
				} }
				dependencies={ [
					'position',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				styleRule="position"
				attrName="position"
				key="position"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="opacity"
				attrName="opacity"
				key="opacity"
				responsive="all"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				// We need to implement z-index on the block itself or else it won't look correct in the editor.
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				styleRule="zIndex"
				attrName="zIndex"
				key="zIndex"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=""
				styleRule="zIndex"
				attrName="zIndex"
				key="zIndex-save"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="overflow"
				attrName="overflow"
				key="overflow"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-container"
				styleRule="overflow"
				attrName="overflow"
				key="overflow-container"
				enabledCallback={ getAttribute => getAttribute( 'overflow' ) === 'visible' }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="clear"
				attrName="clear"
				key="clear"
			/>

			{
			// If a top, right, bottom, left hover state position was given, it will not
			// animate since there is no initial value for the position (e.g. top: 0). This
			// function adds a `top: 0` for the normal state of the CSS if there's a hover
			// state position e.g. hover `top: 20px` given but no initial state.
			}
			<BlockCss
				{ ...propsToPass }
				selector={ positionSelector }
				styleRule="top"
				attrName="positionNum"
				key="positionNum-hover-top"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( ( ! value || value.top === '' ) && state === 'normal' ) {
						const hoverValue = getAttribute( 'positionNum', device, 'hover' )
						const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
						if ( ( hoverValue && hoverValue.top !== '' ) || ( parentHoverValue && parentHoverValue.top !== '' ) ) {
							return 0
						}
					}
					return undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ positionSelector }
				styleRule="right"
				attrName="positionNum"
				key="positionNum-hover-right"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( ( ! value || value.right === '' ) && state === 'normal' ) {
						const hoverValue = getAttribute( 'positionNum', device, 'hover' )
						const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
						if ( ( hoverValue && hoverValue.right !== '' ) || ( parentHoverValue && parentHoverValue.right !== '' ) ) {
							return 0
						}
					}
					return undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ positionSelector }
				styleRule="bottom"
				attrName="positionNum"
				key="positionNum-hover-bottom"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( ( ! value || value.bottom === '' ) && state === 'normal' ) {
						const hoverValue = getAttribute( 'positionNum', device, 'hover' )
						const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
						if ( ( hoverValue && hoverValue.bottom !== '' ) || ( parentHoverValue && parentHoverValue.bottom !== '' ) ) {
							return 0
						}
					}
					return undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ positionSelector }
				styleRule="left"
				attrName="positionNum"
				key="positionNum-hover-left"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( ( ! value || value.left === '' ) && state === 'normal' ) {
						const hoverValue = getAttribute( 'positionNum', device, 'hover' )
						const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
						if ( ( hoverValue && hoverValue.left !== '' ) || ( parentHoverValue && parentHoverValue.left !== '' ) ) {
							return 0
						}
					}
					return undefined
				} }
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

Style.addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		positionSelector = '',
		dependencies = [],
	} = props

	blockStyleGenerator.addBlockStyles( 'positionNum', [ {
		...propsToPass,
		renderIn: 'save',
		selector: positionSelector,
		hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		styleRule: 'top',
		attrName: 'positionNum',
		key: 'positionNum-save-top',
		responsive: 'all',
		hover: 'all',
		hasUnits: 'px',
		valuePreCallback: ( value, getAttribute, device, state ) => {
			// If position is sticky, we need to set top: 0px or else the sticky won't show.
			if ( device === 'desktop' && state === 'normal' ) {
				const isSticky = getAttribute( 'position', device, 'normal', true ) === 'sticky'
				const isTopBlank = ! value || ( value && value.top === '' )
				if ( isSticky && isTopBlank ) {
					return 0
				}
			}

			return value?.top
		},
		dependencies: [
			'position',
			...dependencies,
		],
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: positionSelector,
		hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		styleRule: 'right',
		attrName: 'positionNum',
		key: 'positionNum-save-right',
		responsive: 'all',
		hover: 'all',
		hasUnits: 'px',
		valuePreCallback: value => value?.right,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: positionSelector,
		hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		styleRule: 'bottom',
		attrName: 'positionNum',
		key: 'positionNum-save-bottom',
		responsive: 'all',
		hover: 'all',
		hasUnits: 'px',
		valuePreCallback: value => value?.bottom,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: positionSelector,
		hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		styleRule: 'left',
		attrName: 'positionNum',
		key: 'positionNum-save-left',
		responsive: 'all',
		hover: 'all',
		hasUnits: 'px',
		valuePreCallback: value => value?.left,
	} ] )

	blockStyleGenerator.addBlockStyles( 'position', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '',
		styleRule: 'position',
		attrName: 'position',
		key: 'position-save',
		responsive: 'all',
	} ] )

	/**
		* For positions (top, right, bottom, left) and postiion (absolute,
		* sticky) we need to apply these to the block itself so it would look
		* correctly in the editor.
		*/
	blockStyleGenerator.addBlockStyles( 'positionNum', [ {
	 ...propsToPass,
		 renderIn: 'edit',
		 selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		 hoverSelectorCallback: ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined,
		 styleRule: 'top',
		 attrName: 'positionNum',
		 key: 'positionNum-top',
		 responsive: 'all',
		 hover: 'all',
		 hasUnits: 'px',
		 valuePreCallback: ( value, getAttribute, device, state ) => {
		 // If position is sticky, we need to set top: 0px or else the sticky won't show.
			 if ( device === 'desktop' && state === 'normal' ) {
				 const isSticky = getAttribute( 'position', device, 'normal', true ) === 'sticky'
				 const isTopBlank = ! value || ( value && value.top === '' )
				 if ( isSticky && isTopBlank ) {
					 return 0
				 }
			 }

			 return value?.top
		 },
		 dependencies: [
			 'position',
			 ...dependencies,
		 ],
	}, {
		 ...propsToPass,
		 renderIn: 'edit',
		 selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		 hoverSelectorCallback: ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined,
		 selector: positionSelector,
		 hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		 styleRule: 'bottom',
		 attrName: 'positionNum',
		 key: 'positionNum-bottom',
		 responsive: 'all',
		 hover: 'all',
		 hasUnits: 'px',
		 valuePreCallback: value => value?.bottom,
	}, {
		 ...propsToPass,
		 renderIn: 'edit',
		 selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		 hoverSelectorCallback: ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined,
		 selector: positionSelector,
		 hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		 styleRule: 'left',
		 attrName: 'positionNum',
		 key: 'positionNum-left',
		 responsive: 'all',
		 hover: 'all',
		 hasUnits: 'px',
		 valuePreCallback: value => value?.left,
	}, {
		...propsToPass,
		 renderIn: 'edit',
		 selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		 hoverSelectorCallback: ( getAttributes, attributes, clientId ) => positionSelector ? `.editor-styles-wrapper [data-block="${ clientId }"]:hover` : undefined,
		 selector: positionSelector,
		 hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		 styleRule: 'right',
		 attrName: 'positionNum',
		 key: 'positionNum-right',
		 responsive: 'all',
		 hover: 'all',
		 hasUnits: 'px',
		 valuePreCallback: value => value?.right,
	}, {
		...propsToPass,
		 renderIn: 'edit',
		 selector: positionSelector,
		 hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
		 styleRule: 'position',
		 attrName: 'positionNum',
		 key: 'positionNum',
		 responsive: 'all',
		 hover: 'all',
		 valuePreCallback: ( value, getAttribute, device ) => {
			 if ( value && ( value.top !== '' || value.right !== '' || value.bottom !== '' || value.left !== '' ) ) {
				 if ( getAttribute( 'position', device ) === '' ) {
					 return 'relative'
				 }
			 }
			 return undefined
		 },
		 dependencies: [
			 'position',
			 ...dependencies,
		 ],
	} ] )

	blockStyleGenerator.addBlockStyles( 'position', [ {
		...propsToPass,
		 renderIn: 'edit',
		 selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		 styleRule: 'position',
		 attrName: 'position',
		 key: 'position',
		 responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'opacity', [ {
		...propsToPass,
		 selector: '',
		 styleRule: 'opacity',
		 attrName: 'opacity',
		 key: 'opacity',
		 responsive: 'all',
		 hover: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'zIndex', [ {
		...propsToPass,
		 // We need to implement z-index on the block itself or else it won't look correct in the editor.
		 renderIn: 'edit',
		 selectorCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
		 styleRule: 'zIndex',
		 attrName: 'zIndex',
		 key: 'zIndex',
		 responsive: 'all',
	}, {
		...propsToPass,
		 renderIn: 'save',
		 selector: '',
		 styleRule: 'zIndex',
		 attrName: 'zIndex',
		 key: 'zIndex-save',
		 responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'overflow', [ {
		...propsToPass,
		 selector: '',
		 styleRule: 'overflow',
		 attrName: 'overflow',
		 key: 'overflow',
		 responsive: 'all',
	}, {
		...propsToPass,
		 selector: '.stk-container',
		 styleRule: 'overflow',
		 attrName: 'overflow',
		 key: 'overflow-container',
		 enabledCallback: getAttribute => getAttribute( 'overflow' ) === 'visible',
		 responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'clear', [ {
		...propsToPass,
		 selector: '',
		 styleRule: 'clear',
		 attrName: 'clear',
		 key: 'clear',
	} ] )

	 // If a top, right, bottom, left hover state position was given, it will not
	 // animate since there is no initial value for the position (e.g. top: 0). This
	 // function adds a `top: 0` for the normal state of the CSS if there's a hover
	 // state position e.g. hover `top: 20px` given but no initial state.

	 blockStyleGenerator.addBlockStyles( 'positionNum', [ {
		...propsToPass,
		 selector: positionSelector,
		 styleRule: 'top',
		 attrName: 'positionNum',
		 key: 'positionNum-hover-top',
		 responsive: 'all',
		 valuePreCallback: ( value, getAttribute, device, state ) => {
			 if ( ( ! value || value.top === '' ) && state === 'normal' ) {
				 const hoverValue = getAttribute( 'positionNum', device, 'hover' )
				 const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
				 if ( ( hoverValue && hoverValue.top !== '' ) || ( parentHoverValue && parentHoverValue.top !== '' ) ) {
					 return 0
				 }
			 }
			 return undefined
		 },
	}, {
		...propsToPass,
		 selector: positionSelector,
		 styleRule: 'right',
		 attrName: 'positionNum',
		 key: 'positionNum-hover-right',
		 responsive: 'all',
		 valuePreCallback: ( value, getAttribute, device, state ) => {
			 if ( ( ! value || value.right === '' ) && state === 'normal' ) {
				 const hoverValue = getAttribute( 'positionNum', device, 'hover' )
				 const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
				 if ( ( hoverValue && hoverValue.right !== '' ) || ( parentHoverValue && parentHoverValue.right !== '' ) ) {
					 return 0
				 }
			 }
			 return undefined
		 },
	}, {
		...propsToPass,
		 selector: positionSelector,
		 styleRule: 'bottom',
		 attrName: 'positionNum',
		 key: 'positionNum-hover-bottom',
		 responsive: 'all',
		 valuePreCallback: ( value, getAttribute, device, state ) => {
			 if ( ( ! value || value.bottom === '' ) && state === 'normal' ) {
				 const hoverValue = getAttribute( 'positionNum', device, 'hover' )
				 const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
				 if ( ( hoverValue && hoverValue.bottom !== '' ) || ( parentHoverValue && parentHoverValue.bottom !== '' ) ) {
					 return 0
				 }
			 }
			 return undefined
		 },
	}, {
		...propsToPass,
		 selector: positionSelector,
		 styleRule: 'left',
		 attrName: 'positionNum',
		 key: 'positionNum-hover-left',
		 responsive: 'all',
		 valuePreCallback: ( value, getAttribute, device, state ) => {
			 if ( ( ! value || value.left === '' ) && state === 'normal' ) {
				 const hoverValue = getAttribute( 'positionNum', device, 'hover' )
				 const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hover' )
				 if ( ( hoverValue && hoverValue.left !== '' ) || ( parentHoverValue && parentHoverValue.left !== '' ) ) {
					 return 0
				 }
			 }
			 return undefined
		 },
	} ] )
}

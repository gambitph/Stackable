/**
 * External dependencies
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
		selector = '',
		attrNameTemplate = '%s',
		horizontalAlignRule = 'margin',
		verticalAlignRule = 'alignItems',
		verticalAlignSelectorEdit = '',
		verticalAlignSelector = '',
		wrapperSelector = '', // The outer wrapper element that where the outer flex alignments, widths and margins are applied to.
	} = props

	return (
		<>
			{ attributeHasValue( 'height', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="minHeight"
					attrName="height"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hasUnits="px"
				/>
			}
			{ attributeHasValue( 'verticalAlign', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ verticalAlignSelector || selector }
					styleRule={ verticalAlignRule || 'alignItems' }
					attrName="verticalAlign"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
				/>
			}
			{ attributeHasValue( 'verticalAlign', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector={ verticalAlignSelectorEdit || verticalAlignSelector || selector }
					styleRule="justifyContent"
					attrName="verticalAlign"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
				/>
			}
			{ attributeHasValue( 'width', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ wrapperSelector || selector }
					styleRule="maxWidth"
					attrName="width"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hasUnits="px"
				/>
			}
			{ attributeHasValue( 'width', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ wrapperSelector || selector }
					styleRule="minWidth"
					attrName="width"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					versionAdded="3.0.0"
					versionDeprecated="3.0.2"
					valueCallback={ value => {
						return value !== '' ? 'auto' : undefined
					} }
				/>
			}
			{ attributeHasValue( 'padding', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingTop"
					attrName="padding"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.top }
				/>
			}
			{ attributeHasValue( 'padding', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingRight"
					attrName="padding"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.right }
				/>
			}
			{ attributeHasValue( 'padding', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingBottom"
					attrName="padding"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.bottom }
				/>
			}
			{ attributeHasValue( 'padding', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingLeft"
					attrName="padding"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.left }
				/>
			}
			{ attributeHasValue( 'margin', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ wrapperSelector || selector }
					styleRule="marginTop"
					attrName="margin"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hasUnits="px"
					valuePreCallback={ value => value?.top }
					valueCallback={ value => {
						return value.startsWith( 'auto' ) ? 'auto' : value
					} }
				/>
			}
			{ attributeHasValue( 'margin', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ wrapperSelector || selector }
					styleRule="marginRight"
					attrName="margin"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hasUnits="px"
					valuePreCallback={ ( value, getAttribute, device ) => {
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
					} }
					valueCallback={ value => {
						return value.startsWith( 'auto' ) ? 'auto' : value
					} }
					dependencies={ [ 'horizontalAlign', 'width' ] }
				/>
			}
			{ attributeHasValue( 'margin', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ wrapperSelector || selector }
					styleRule="marginBottom"
					attrName="margin"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hasUnits="px"
					valuePreCallback={ value => value?.bottom }
					valueCallback={ value => {
						return value.startsWith( 'auto' ) ? 'auto' : value
					} }
				/>
			}
			{ attributeHasValue( 'margin', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ wrapperSelector || selector }
					styleRule="marginLeft"
					attrName="margin"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hasUnits="px"
					valuePreCallback={ ( value, getAttribute, device ) => {
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
					} }
					valueCallback={ value => {
						return value.startsWith( 'auto' ) ? 'auto' : value
					} }
					dependencies={ [ 'horizontalAlign', 'width' ] }
				/>
			}
			{ attributeHasValue( 'verticalAlign', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="display"
					attrName="verticalAlign"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					valueCallback={ () => {
						return 'flex'
					} }
				/>
			}
			{ attributeHasValue( 'verticalAlign', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ selector }
					styleRule="flexDirection"
					attrName="verticalAlign"
					responsive="all"
					attrNameTemplate={ attrNameTemplate }
					valueCallback={ () => {
						return ( verticalAlignRule || 'alignItems' ) === 'justifyContent' ? 'column' : undefined
					} }
				/>
			}
			{ attributeHasValue( 'verticalAlign', attributes, { hasResponsive: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector={ selector }
					styleRule="flexDirection"
					attrName="verticalAlign"
					responsive="all"
					attrNameTemplate={ attrNameTemplate }
					valueCallback={ () => {
						return 'column'
					} }
				/>
			}

			{ horizontalAlignRule !== 'margin' &&
				attributeHasValue( 'horizontalAlign', attributes, { hasResponsive: true, attrNameTemplate } ) &&
					<BlockCss
						{ ...propsToPass }
						renderIn="save"
						selector={ wrapperSelector || selector }
						styleRule={ horizontalAlignRule || 'justifyContent' }
						attrName="horizontalAlign"
						attrNameTemplate={ attrNameTemplate }
						responsive="all"
					/>

			}
		</>
	)
}

export const SizeStyle = props => {
	return <Styles { ...props } />
}

SizeStyle.Content = props => {
	return <Styles { ...props } />
}

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
			<BlockCss
				selector={ selector }
				styleRule="minHeight"
				attrName="height"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hasUnits="px"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="save"
				selector={ verticalAlignSelector || selector }
				styleRule={ verticalAlignRule || 'alignItems' }
				attrName="verticalAlign"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="edit"
				selector={ verticalAlignSelectorEdit || verticalAlignSelector || selector }
				styleRule="justifyContent"
				attrName="verticalAlign"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ wrapperSelector || selector }
				styleRule="maxWidth"
				attrName="width"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hasUnits="px"
				{ ...propsToPass }
			/>
			<BlockCss
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
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ selector }
				styleRule="paddingTop"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.top }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ selector }
				styleRule="paddingRight"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.right }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ selector }
				styleRule="paddingBottom"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.bottom }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ selector }
				styleRule="paddingLeft"
				attrName="padding"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hasUnits="px"
				valuePreCallback={ value => value?.left }
				{ ...propsToPass }
			/>
			<BlockCss
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
				{ ...propsToPass }
			/>
			<BlockCss
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
				{ ...propsToPass }
			/>
			<BlockCss
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
				{ ...propsToPass }
			/>
			<BlockCss
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
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ selector }
				styleRule="display"
				attrName="verticalAlign"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				valueCallback={ () => {
					return 'flex'
				} }
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="save"
				selector={ selector }
				styleRule="flexDirection"
				attrName="verticalAlign"
				responsive="all"
				attrNameTemplate={ attrNameTemplate }
				valueCallback={ () => {
					return ( verticalAlignRule || 'alignItems' ) === 'justifyContent' ? 'column' : undefined
				} }
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="edit"
				selector={ selector }
				styleRule="flexDirection"
				attrName="verticalAlign"
				responsive="all"
				attrNameTemplate={ attrNameTemplate }
				valueCallback={ () => {
					return 'column'
				} }
				{ ...propsToPass }
			/>
			{ horizontalAlignRule !== 'margin' &&
				<BlockCss
					renderIn="save"
					selector={ wrapperSelector || selector }
					styleRule={ horizontalAlignRule || 'justifyContent' }
					attrName="horizontalAlign"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					{ ...propsToPass }
				/> }
		</>
	)
}

export const SizeStyle = props => {
	return <Styles { ...props } />
}

SizeStyle.Content = props => {
	return <Styles { ...props } />
}

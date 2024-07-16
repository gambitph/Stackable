/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

import { memo } from '@wordpress/element'

const _Styles = props => {
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
		// verticalAlignSelectorEdit = '',
		verticalAlignSelector = '',
		hasPaddings = true, // Disallow the padding styles
		wrapperSelector = '', // The outer wrapper element that where the outer flex alignments, widths and margins are applied to.
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="minHeight"
				attrName="height"
				key="height"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hasUnits="px"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ verticalAlignSelector || selector }
				styleRule={ verticalAlignRule || 'alignItems' }
				attrName="verticalAlign"
				key="verticalAlign-save"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ wrapperSelector || selector }
				styleRule="maxWidth"
				attrName="width"
				key="width-maxwidth"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hasUnits="px"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ wrapperSelector || selector }
				styleRule="minWidth"
				attrName="width"
				key="width-minwidth"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				versionAdded="3.0.0"
				versionDeprecated="3.0.2"
				valueCallback={ value => {
					return value !== '' ? 'auto' : undefined
				} }
			/>
			{ hasPaddings && <>
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingTop"
					attrName="padding"
					key="padding-top"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.top }
				/>
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingRight"
					attrName="padding"
					key="padding-right"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.right }
				/>
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingBottom"
					attrName="padding"
					key="padding-bottom"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.bottom }
				/>
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="paddingLeft"
					attrName="padding"
					key="padding-left"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hasUnits="px"
					valuePreCallback={ value => value?.left }
				/>
			</> }
			<BlockCss
				{ ...propsToPass }
				selector={ wrapperSelector || selector }
				styleRule="marginTop"
				attrName="margin"
				key="margin-top"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hasUnits="px"
				valuePreCallback={ value => value?.top }
				valueCallback={ value => {
					return value.startsWith( 'auto' ) ? 'auto' : value
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ wrapperSelector || selector }
				styleRule="marginRight"
				attrName="margin"
				key="margin-right"
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
				dependencies={ [
					'horizontalAlign',
					 'width',
					 ...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ wrapperSelector || selector }
				styleRule="marginBottom"
				attrName="margin"
				key="margin-bottom"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hasUnits="px"
				valuePreCallback={ value => value?.bottom }
				valueCallback={ value => {
					return value.startsWith( 'auto' ) ? 'auto' : value
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ wrapperSelector || selector }
				styleRule="marginLeft"
				attrName="margin"
				key="margin-left"
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
				dependencies={ [
					'horizontalAlign',
					 'width',
					 ...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="display"
				attrName="verticalAlign"
				key="verticalAlign-display"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				valueCallback={ () => {
					return 'flex'
				} }
			/>
			{ /* <BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ selector }
				styleRule="flexDirection"
				attrName="verticalAlign"
				key="verticalAlign-save-flex"
				responsive="all"
				attrNameTemplate={ attrNameTemplate }
				valueCallback={ () => {
					return ( verticalAlignRule || 'alignItems' ) === 'justifyContent' ? 'column' : undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ selector }
				styleRule="flexDirection"
				attrName="verticalAlign"
				key="verticalAlign-flex"
				responsive="all"
				attrNameTemplate={ attrNameTemplate }
				valueCallback={ () => {
					return 'column'
				} }
			/> */ }
			{ horizontalAlignRule !== 'margin' &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ wrapperSelector || selector }
					styleRule={ horizontalAlignRule || 'justifyContent' }
					attrName="horizontalAlign"
					key="horizontalAlign"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
				/> }
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const SizeStyle = props => {
	return <Styles { ...props } />
}

SizeStyle.Content = props => {
	return <Styles.Content { ...props } />
}

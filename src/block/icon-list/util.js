/**
 * WordPress dependencies
 */
import { createElement } from '@wordpress/element'
import { __, _x } from '@wordpress/i18n'
import { createBlock } from '@wordpress/blocks'

import { forwardRef } from 'react'

import { i18n } from 'stackable'

// The default icon list SVG.
export const DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>'

export const IconSvgDef = props => {
	const { icon, uniqueId } = props

	const rawHtml = `<defs><g id="stk-icon-list__icon-svg-def-${ uniqueId }">${ icon }</g></defs>`

	return createElement( 'svg', { dangerouslySetInnerHTML: { __html: rawHtml }, style: { display: 'none' } } )
}

export const getUseSvgDef = href => {
	return `<svg><use xlink:href="${ href }"></use></svg>`
}

// eslint-disable-next-line no-unused-vars
export const WithForwardRefComponent = forwardRef( ( props, ref ) => {
	const { component: Component, ...propsToPass } = props

	return <Component { ...propsToPass }> { props.children } </Component>
} )
/**
 * WordPress dependencies
 */

const listStyleTypeOptions = {
	d: {
		label: __( 'Number', i18n ),
		value: 'decimal',
	},
	D: {
		label: __( 'Padded Number', i18n ),
		value: 'decimal-leading-zero',
	},
	i: {
		label: __( 'Lowercase Roman', i18n ),
		value: 'lower-roman',
	},
	I: {
		label: __( 'Uppercase Roman', i18n ),
		value: 'upper-roman',
	},
	a: {
		label: __( 'Lowercase Letters', i18n ),
		value: 'lower-alpha',
	},
	A: {
		label: __( 'Uppercase Letters', i18n ),
		value: 'upper-alpha',
	},
}

export function createListBlockFromDOMElement( listElement ) {
	const type = listElement.getAttribute( 'type' )
	const listAttributes = {
		ordered: 'OL' === listElement.tagName,
		anchor: listElement.id === '' ? undefined : listElement.id,
		listType: type && listStyleTypeOptions[ type ] ? listStyleTypeOptions[ type ] : undefined,
	}

	const innerBlocks = Array.from( listElement.children ).map(
		listItem => {
			const children = Array.from( listItem.childNodes ).filter(
				node =>
					node.nodeType !== node.TEXT_NODE ||
					node.textContent.trim().length !== 0
			)
			children.reverse()
			const [ nestedList, ...nodes ] = children

			const hasNestedList =
				nestedList?.tagName === 'UL' || nestedList?.tagName === 'OL'
			if ( ! hasNestedList ) {
				return createBlock( 'stackable/icon-list-item', {
					text: listItem.innerHTML,
				} )
			}
			const htmlNodes = nodes.map( node => {
				if ( node.nodeType === node.TEXT_NODE ) {
					return node.textContent
				}
				return node.outerHTML
			} )
			htmlNodes.reverse()
			const childAttributes = {
				text: htmlNodes.join( '' ).trim(),
			}
			const childInnerBlocks = [
				createListBlockFromDOMElement( nestedList ),
			]
			return createBlock(
				'stackable/icon-list-item',
				childAttributes,
				childInnerBlocks
			)
		}
	)

	return createBlock( 'stackable/icon-list', listAttributes, innerBlocks )
}

export function migrateTypeToInlineStyle( attributes ) {
	const { type } = attributes

	if ( type && listStyleTypeOptions[ type ] ) {
		return {
			...attributes,
			listType: listStyleTypeOptions[ type ],
		}
	}

	return attributes
}


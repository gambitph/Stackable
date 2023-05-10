import { useMemo, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { useDeviceType } from '~stackable/hooks'
import { first, last } from 'lodash'

const BlockHighlighter = props => {
	const {
		uniqueId,
		selector = '',
		highlight = '',
		value = '',
		defaultValue = '',
		responsive = 'all',
	} = props || {}

	const highlightSelector = `.editor-styles-wrapper.editor-styles-wrapper .stk-${ uniqueId } ${ selector.replace( /%s/g, uniqueId ) }`.trim()

	const { getEditorDom } = useSelect( 'stackable/editor-dom' )
	const deviceType = useDeviceType()
	const [ rerender, setRerender ] = useState( 0 )

	const computedStyles = useMemo( () => {
		const firstElSelector = highlightSelector.split( ',' )[ 0 ]
		const el = getEditorDom().querySelector( firstElSelector )

		// We can sometimes not find the element when we switched device types,
		// just try again when that happens.
		if ( ! el ) {
			setTimeout( () => {
				if ( setRerender ) {
					setRerender( rerender + 1 )
				}
			}, 50 )
		}
		return el ? window.getComputedStyle( el ) : {}
	}, [ highlightSelector, rerender ] ) || {}

	// Allow some to only be displayed in some device types.
	if ( responsive !== 'all' && ( ! responsive.includes( deviceType.toLowerCase() ) ) ) {
		return null
	}

	const styles = createHightlightStyles( highlight, highlightSelector, value, defaultValue, computedStyles )

	return <style>{ styles }</style>
}

BlockHighlighter.defaultProps = {
	uniqueId: '',
	highlightStyles: {},
}

export default BlockHighlighter

const OUTLINE_COLOR = `var(--wp-components-color-accent, var(--wp-admin-theme-color, #007cba))`
const PADDING_COLOR = `rgba(162, 201, 68, 0.5)`
const MARGIN_COLOR = `rgba(220, 158, 93, 0.5)`
const MARGIN_NEGATIVE_COLOR = `rgba(220, 158, 93, 0.25)`

const createHightlightStyles = ( highlightType, selector, value, defaultValue, computedStyles ) => {
	switch ( highlightType ) {
		case 'row-gap':
			return `${ selector } {
				position: relative;
			}
			${ selector } > [data-type]:not(:nth-last-child(2))::before {
				content: '';
				position: absolute;
				z-index: 2;
				top: 100%;
				left: 0;
				width: 100%;
				height: max(${ parseInt( computedStyles.rowGap, 10 ) || 0 }px, 1px);
				background: ${ MARGIN_COLOR };
				pointer-events: none;
			}`

		case 'column-gap':
			return `${ selector } {
				position: relative;
			}
			${ selector } > [data-type]:not(:nth-last-child(2))::before {
				content: '';
				position: absolute;
				z-index: 2;
				left: 100%;
				top: 0;
				width: max(${ parseInt( computedStyles.columnGap, 10 ) || 0 }px, 1px);
				height: 100%;
				background: ${ MARGIN_COLOR };
				pointer-events: none;
			}`

		case 'columns:column-gap':
			return `${ selector } {
				position: relative;
			}
			${ selector } > [data-type="stackable/column"]:not(:last-child)::before {
				content: '';
				position: absolute;
				z-index: 2;
				left: 100%;
				top: 0;
				width: max(${ parseInt( computedStyles.columnGap, 10 ) || 0 }px, 1px);
				height: 100%;
				background: ${ MARGIN_COLOR };
				pointer-events: none;
			}`

		case 'padding':
			return `${ selector } {
				position: relative;
			}
			${ selector }::after {
				all: unset;
				content: '' !important;
				z-index: 2;
				position: absolute;
				inset: 0;
				border-style: solid;
				border-color: ${ PADDING_COLOR };
				border-top-width: max(${ computedStyles.paddingTop }, 1px);
				border-right-width: max(${ computedStyles.paddingRight }, 1px);
				border-bottom-width: max(${ computedStyles.paddingBottom }, 1px);
				border-left-width: max(${ computedStyles.paddingLeft }, 1px);
				background-color: transparent !important;
			}`

		case 'margin':
			const borderTopColor = parseInt( computedStyles.marginTop, 10 ) < 0 ? MARGIN_NEGATIVE_COLOR : MARGIN_COLOR
			const borderRightColor = parseInt( computedStyles.marginRight, 10 ) < 0 ? MARGIN_NEGATIVE_COLOR : MARGIN_COLOR
			const borderBottomColor = parseInt( computedStyles.marginBottom, 10 ) < 0 ? MARGIN_NEGATIVE_COLOR : MARGIN_COLOR
			const borderLeftColor = parseInt( computedStyles.marginLeft, 10 ) < 0 ? MARGIN_NEGATIVE_COLOR : MARGIN_COLOR

			return `${ selector } {
				position: relative;
				overflow: visible !important;
			}
			${ selector }::after {
				all: unset;
				content: '' !important;
				z-index: 2;
				position: absolute;
				inset: 0;
				border-style: solid;
				border-top-color: ${ borderTopColor };
				border-right-color: ${ borderRightColor };
				border-bottom-color: ${ borderBottomColor };
				border-left-color: ${ borderLeftColor };
				border-top-width: max(${ computedStyles.marginTop }, calc(${ computedStyles.marginTop } * -1), 1px);
				border-right-width: max(${ computedStyles.marginRight }, calc(${ computedStyles.marginRight } * -1), 1px);
				border-bottom-width: max(${ computedStyles.marginBottom }, calc(${ computedStyles.marginBottom } * -1), 1px);
				border-left-width: max(${ computedStyles.marginLeft }, calc(${ computedStyles.marginLeft } * -1), 1px);
				top: calc(max(${ computedStyles.marginTop }, 1px) * -1);
				right: calc(max(${ computedStyles.marginRight }, 1px) * -1);
				bottom: calc(max(${ computedStyles.marginBottom }, 1px) * -1);
				left: calc(max(${ computedStyles.marginLeft }, 1px) * -1);
				background-color: transparent !important;
			}`

		// This is a special type that is very coupled with how the Columns
		// block & Inner Column block generate column spacing.
		case 'column-spacing':
			return `${ selector } {
				position: relative;
			}
			${ selector }::after {
				all: unset;
				content: '';
				z-index: 2;
				position: absolute;
				width: 100%;
				height: 100%;
				border-style: solid;
				border-color: ${ MARGIN_COLOR };
				top: calc(max(var(--column-spacing-top, var(--stk-columns-spacing, ${ defaultValue })), 1px) * -1);
				border-top-width: max(var(--column-spacing-top, var(--stk-columns-spacing, ${ defaultValue })), 1px);
				right: calc(max(var(--column-spacing-right, var(--stk-columns-spacing, ${ defaultValue })), 1px) * -1);
				border-right-width: max(var(--column-spacing-right, var(--stk-columns-spacing, ${ defaultValue })), 1px);
				bottom: calc(max(var(--column-spacing-bottom, var(--stk-columns-spacing, ${ defaultValue })), 1px) * -1);
				border-bottom-width: max(var(--column-spacing-bottom, var(--stk-columns-spacing, ${ defaultValue })), 1px);
				left: calc(max(var(--column-spacing-left, var(--stk-columns-spacing, ${ defaultValue })), 1px) * -1);
				border-left-width: max(var(--column-spacing-left, var(--stk-columns-spacing, ${ defaultValue })), 1px);
				background-color: transparent !important;
			}`

		case 'outline-first-offset':
			return `${ selector } {
				outline: 1px dashed ${ OUTLINE_COLOR };
			}
			${ first( selector.split( ',' ) ) } {
				outline-offset: 8px;
			}`

		case 'outline-second-offset':
			return `${ selector } {
				outline: 1px dashed ${ OUTLINE_COLOR };
			}
			${ last( selector.split( ',' ) ) } {
				outline-offset: 8px;
			}`

		case 'outline':
		default:
			return `${ selector } {
				outline: 1px dashed ${ OUTLINE_COLOR };
			}`
	}
}

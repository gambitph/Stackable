/**
 * Internal dependencies
 */
import {
	addBorderStyles, addSizeStyles, addBackgroundStyles,
} from '../helpers'

export const addStyles = ( blockStyleGenerator, props = {} ) => {
	const {
		backgroundSelector = '.%s-container',
		borderSelector = '.%s-container',
		sizeSelector = '.%s-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = 'margin',
		wrapperSelector = '',
		sizeVerticalAlignSelector = '',
		// sizeVerticalAlignSelectorEdit = '',
	} = props

	addBackgroundStyles( blockStyleGenerator, {
		...props,
		renderCondition: 'hasContainer',
		attrNameTemplate: 'container%s',
		selector: backgroundSelector,
	} )
	addBorderStyles( blockStyleGenerator, {
		...props,
		renderCondition: 'hasContainer',
		attrNameTemplate: 'container%s',
		selector: borderSelector,
		hoverSelector: `${ borderSelector }:hover`,
	} )
	addSizeStyles( blockStyleGenerator, {
		...props,
		attrNameTemplate: 'container%s',
		selector: sizeSelector,
		verticalAlignRule: sizeVerticalAlignRule,
		verticalAlignSelector: sizeVerticalAlignSelector,
		// verticalAlignSelectorEdit: sizeVerticalAlignSelectorEdit,
		horizontalAlignRule: sizeHorizontalAlignRule,
		wrapperSelector,
		// hasPaddings: hasContainer,
	} )
}

/**
 * Internal dependencies
 */
import {
	addBorderStyles, addSizeStyles, addBackgroundStyles,
} from '../helpers'

export const addStyles = ( blockStyleGenerator, props = {} ) => {
	addBackgroundStyles( blockStyleGenerator, {
		...props,
		renderCondition: 'hasBackground',
		attrNameTemplate: 'block%s',
	} )
	addBorderStyles( blockStyleGenerator, {
		...props,
		attrNameTemplate: 'block%s',
	} )
	addSizeStyles( blockStyleGenerator, {
		...props,
		attrNameTemplate: 'block%s',
	} )
}

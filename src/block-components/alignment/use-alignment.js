/**
 * External dependencies
 */
import classnames from 'classnames'
import { useBlockAttributesContext } from '~stackable/hooks'

export const useAlignment = () => {
	const { innerBlockOrientation } = useBlockAttributesContext()

	return {
		blockOrientation: innerBlockOrientation || 'vertical',
	}
}

export const getAlignmentClasses = attributes => {
	const innerBlocksClass = classnames( {
		// Use alignment class for aligning text.
		[ `has-text-align-${ attributes.contentAlign }` ]: attributes.contentAlign,
		[ `has-text-align-${ attributes.contentAlignTablet }-tablet` ]: attributes.contentAlignTablet,
		[ `has-text-align-${ attributes.contentAlignMobile }-mobile` ]: attributes.contentAlignMobile,

		// We need to put this in a class to we can also target horizontal
		// orientations in css.
		[ `stk--block-orientation-${ attributes.innerBlockOrientation }` ]: attributes.innerBlockOrientation,

		// We need to add our own class so we won't have to worry about rules
		// being applied to the nested children of our blocks.
		[ `stk--block-align-${ attributes.uniqueId }` ]:
			attributes.rowAlign || attributes.rowAlignTablet || attributes.rowAlignMobile,
	} )

	return innerBlocksClass
}

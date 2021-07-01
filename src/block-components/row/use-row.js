/**
 * External Dependencies
 */
import classnames from 'classnames'

export const getRowClasses = attributes => {
	return classnames( [
		'stk-row',
	], {
		[ `stk-columns-${ attributes.numInnerBlocks }` ]: attributes.numInnerBlocks && attributes.numInnerBlocks > 1,
	} )
}

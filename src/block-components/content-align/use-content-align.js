/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

export const getContentAlignmentClasses = attributes => {
	return classnames(
		'stk-content-align',
		`stk-${ attributes.uniqueId }-column`,
		applyFilters( 'stackable.block-components.content-align.getContentAlignmentClasses', {
			'stk--flex': attributes.columnJustify,
			alignwide: attributes.innerBlockContentAlign === 'alignwide', // This will align the columns inside.
			alignfull: attributes.innerBlockContentAlign === 'alignfull', // This will align the columns inside.
		}, attributes ) )
}

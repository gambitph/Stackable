/**
 * External dependencies
 */
import classnames from 'classnames'

export const getContentAlignmentClasses = attributes => {
	return classnames(
		'stk-content-align',
		`stk-${ attributes.uniqueId }-column`,
		{
			'stk--fit-content': attributes.columnFit,
			alignwide: attributes.innerBlockContentAlign === 'alignwide', // This will align the columns inside.
			alignfull: attributes.innerBlockContentAlign === 'alignfull', // This will align the columns inside.
		} )
}

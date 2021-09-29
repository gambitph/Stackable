/**
 * External dependencies
 */
import classnames from 'classnames'

export const getContentAlignmentClasses = attributes => {
	return classnames( 'stk-content-align', {
		'stk--fit-content': attributes.columnFit,
		alignwide: attributes.contentAlign === 'alignwide', // This will align the columns inside.
		alignfull: attributes.contentAlign === 'alignfull', // This will align the columns inside.
	} )
}

export const useContentAlignmentClasses = attributes => {
	return classnames( {
		'wp-block': !! attributes.contentAlign, // Only in the backend.
	}, getContentAlignmentClasses( attributes ) )
}


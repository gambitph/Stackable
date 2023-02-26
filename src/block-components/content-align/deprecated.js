import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.block-components.content-align.getContentAlignmentClasses', 'stackable/3_6_3', ( classes, attributes ) => {
	// We changed this to stk--flex.
	classes[ 'stk--fit-content' ] = attributes.columnFit
	return classes
} )

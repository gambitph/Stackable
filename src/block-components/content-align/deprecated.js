import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.block-components.content-align.getContentAlignmentClasses', 'stackable/3_6_3', ( classes, attributes ) => {
	// We changed this to stk--flex.
	classes[ 'stk--fit-content' ] = attributes.columnFit
	return classes
} )

export const deprecatedAddAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			// This has been removed, but still keep this for graceful deprecation.
			// Deprecation will trigger when columnFit is true.
			columnFit: {
				type: 'boolean',
				default: '',
			},
			// This is replaced with columnJustify.
			columnFitAlign: {
				type: 'string',
				default: '',
				stkResponsive: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}

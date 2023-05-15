/**
 * Internal dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

// Version 3.6.2 Deprecations, we now don't need the stk--has-column-order class.
addFilter( 'stackable.columns.save.contentClassNames', 'stackable/3.8.0', ( classes, props ) => {
	if ( semverCompare( props.version, '<', '3.8.0' ) ) {
		return [
			...classes,
			{
				// This makes the `--stk-col-order-#` custom properties to get
				// applied to the columns.
				'stk--has-column-order': props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet,
			},
		]
	}

	return classes
} )

const deprecated = [
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		isEligible: attributes => !! attributes.columnFit,
		migrate: attributes => {
			return {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: !! attributes.columnFit ? ( attributes.columnFitAlign || 'flex-start' ) : '',
			}
		},
	},
	{
		attributes: attributes( '3.6.1' ),
		save: withVersion( '3.6.1' )( Save ),
	},
]

export default deprecated

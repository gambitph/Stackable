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
import { deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity } from '~stackable/block-components'

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
		// Support the new combined opacity and color.
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasColumnFit = !! attributes.columnFit

			return hasContainerOpacity || hasBlockOpacity || hasColumnFit
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: !! attributes.columnFit ? ( attributes.columnFitAlign || 'flex-start' ) : '',
			}

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		isEligible: attributes => {
			const hasColumnFit = !! attributes.columnFit

			return hasColumnFit
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: !! attributes.columnFit ? ( attributes.columnFitAlign || 'flex-start' ) : '',
			}

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			return newAttributes
		},
	},
	{
		attributes: attributes( '3.6.1' ),
		save: withVersion( '3.6.1' )( Save ),
	},
]

export default deprecated

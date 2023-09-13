/**
 * Internal dependencies
 */
import { attributes } from './schema'
import { Save } from './save'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import { deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity } from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.table-of-contents.save.blockClasses', 'stackable/classesNotRendered', ( output, textClasses, props ) => {
	if ( compareVersions( props.version, '3.6.2' ) === 0 ) {
		output.push( textClasses )
		return output
	}

	return output
} )

addFilter( 'stackable.table-of-contents.save.tableOfContentsClasses', 'stackable/classesNotRendered', ( output, props ) => {
	if ( compareVersions( props.version, '3.6.2' ) === 0 ) {
		return 'stk-table-of-contents__table'
	}
	return output
} )

const deprecated = [
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )

			return hasContainerOpacity || hasBlockOpacity
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			const newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
	 {
		 attributes: attributes( '3.6.2' ),
		 migrate: attributes => {
			return {
				 ...attributes,
				 titleShow: false,
			 }
		 },
		 save: withVersion( '3.6.2' )( Save ),
	 },
]

export default deprecated


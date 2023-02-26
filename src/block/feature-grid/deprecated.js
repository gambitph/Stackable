/**
 * Internal Dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import { getResponsiveClasses, getSeparatorClasses } from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.1.0 Deprecations
addFilter( 'stackable.feature-grid.save.blockClassNames', 'stackable/3.1.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.1.0' ) === 1 ) {
		return output
	}

	const separatorClass = getSeparatorClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	return [
		props.className,
		'stk-block-feature-grid',
		responsiveClass,
		separatorClass,
	]
} )

const deprecated = [
	{
		attributes: attributes(),
		save: withVersion( '3.8.0' )( Save ),
		isEligible: attributes => !! attributes.columnFit,
		migrate: attributes => {
			return {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: attributes.columnFitAlign,
			}
		},
	},
	{
		attributes: attributes( '3.1.0' ),
		save: withVersion( '3.1.0' )( Save ),
	},
]

export default deprecated

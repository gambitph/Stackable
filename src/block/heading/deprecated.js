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
import { getResponsiveClasses } from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.6.1 Deprecations
addFilter( 'stackable.heading.save.blockClassNames', 'stackable/3.6.1', ( output, props ) => {
	if ( compareVersions( props.version, '3.6.1' ) === 1 ) { // Current version is greater than 3.6.1
		return output
	}

	const responsiveClass = getResponsiveClasses( props.attributes )
	return [
		props.className,
		'stk-block-heading',
		responsiveClass,
	]
} )

const deprecated = [
	{
		attributes: attributes( '3.5.0' ),
		save: withVersion( '3.5.0' )( Save ),
		migrate: attributes => {
			const {
				textRemoveTextMargins: _textRemoveTextMargins,
				...newAttributes
			} = attributes
			return {
				...newAttributes,
				useThemeTextMargins: attributes.textRemoveTextMargins ? false : true,
			}
		},
	},
]

export default deprecated

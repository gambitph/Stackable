/**
 * Internal dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'

// Version 3.0.2 Deprecations
addFilter( 'stackable.card.save.container-div.content', 'stackable/3.0.2', ( output, version, innerClassNames ) => {
	if ( true || compareVersions( version, '3.0.2' ) < 1 ) {
		return (
			<div className={ innerClassNames }>
				<InnerBlocks.Content />
			</div>
		)
	}

	return output
} )

addFilter( 'stackable.card.save.contentClassNames', 'stackable/3.0.2', ( output, version ) => {
	if ( true || compareVersions( version, '3.0.2' ) < 1 ) {
		return {
			// `stk-block-card__content` is the first class, so we put it before the other classes.
			'stk-block-card__content': true,
			...output,
		}
	}

	return output
} )

addFilter( 'stackable.card.save.wrapperClassNames', 'stackable/3.0.2', ( output, version ) => {
	if ( true || compareVersions( version, '3.0.2' ) < 1 ) {
		return {
			...output,
			'stk-container-padding': undefined,
			'stk-block-card__content': undefined,
		}
	}

	return output
} )

addFilter( 'stackable.card.save.innerClassNames', 'stackable/3.0.2', ( output, version, attributes ) => {
	if ( true || compareVersions( version, '3.0.2' ) < 1 ) {
		return {
			...output,
			'stk-container-padding': attributes.hasContainer,
			'stk-block-card__content': true,
		}
	}

	return output
} )

const deprecated = [
	{
		attributes: attributes(),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated

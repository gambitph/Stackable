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
import { getAlignmentClasses } from '~stackable/block-components'

// Version 3.0.2 Deprecations
addFilter( 'stackable.card.save.container-div.content', 'stackable/3.0.2', ( output, props, innerClassNames ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	return (
		<div className={ innerClassNames }>
			<InnerBlocks.Content />
		</div>
	)
} )

addFilter( 'stackable.card.save.contentClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	return {
		// `stk-block-card__content` is the first class, so we put it before the other classes.
		'stk-block-card__content': true,
		'stk--no-padding': true,
	}
} )

addFilter( 'stackable.card.save.wrapperClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	return {}
} )

addFilter( 'stackable.card.save.innerClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	return {
		'stk-block-content': true,
		'stk-inner-blocks': true,
		[ blockAlignmentClass ]: blockAlignmentClass,
		'stk-container-padding': props.attributes.hasContainer,
	}
} )

const deprecated = [
	{
		attributes: attributes(),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated

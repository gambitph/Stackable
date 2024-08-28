/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
	SeparatorStyles as SeparatorStyles_,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
SeparatorStyles_.addSeparatorStyles( blockStyles, {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
	location: '',
} )
applyFilters( 'stackable.block-component.separator.layer-styles.addStyles', blockStyles, {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
	location: '',
} )
export default blockStyles

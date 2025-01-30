/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
	addSeparatorStyles,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Transform.addStyles( blockStyles )
addSeparatorStyles( blockStyles, {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
	location: '',
} )
doAction( 'stackable.block-component.separator.layer-styles.addStyles', blockStyles, {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
	location: '',
} )
export default blockStyles

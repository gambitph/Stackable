/** Internal dependencies
 */
import variations from './variations'

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	ContainerDiv,
	EffectsAnimations,
	Image,
	Transform,
} from '~stackable/block-components'
import { getBlockStyle } from '~stackable/hooks'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Column.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
ContainerDiv.addStyles( blockStyles, {
	sizeSelector: '.stk-block-card__content',
	sizeHorizontalAlignRule: 'margin',
	wrapperSelector: '.%s-container',
} )
Image.addStyles( blockStyles, {
	enableWidthCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		return blockStyle.name === 'horizontal'
	},
	editorWidthUnitCallback: ( unit, device, state, getAttribute ) => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		if ( blockStyle.name === 'horizontal' ) {
			if ( device === 'tablet' ) {
				return 'px'
			}
		}
		return unit
	},
	enableAspectRatio: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		return ! [ 'horizontal', 'full', 'faded' ].includes( blockStyle.name )
	},
	selector: '.stk-block-card__image',
} )

export default blockStyles

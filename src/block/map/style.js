/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'

import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'height', [ {
	renderIn: 'edit',
	selector: '.stk-block-map__canvas',
	styleRule: 'height',
	attrName: 'height',
	key: 'height',
	format: '%spx',
	responsive: 'all',
}, {
	renderIn: 'save',
	selector: '.stk-block-map__canvas, iframe',
	styleRule: 'height',
	attrName: 'height',
	key: 'height-save',
	format: '%spx',
	responsive: 'all',
} ] )

BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles


/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'buttonFullWidth', [ {
	renderIn: 'edit',
	selectorCallback: ( getAttributes, attributes, clientId ) => `.editor-styles-wrapper [data-block="${ clientId }"]`,
	styleRule: 'width',
	attrName: 'buttonFullWidth',
	key: 'buttonFullWidth',
	valueCallback: value => {
		return value ? '100%' : undefined
	},
} ] )

BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Button.addStyles( blockStyles, {
	selector: '.stk-button',
} )
Typography.addStyles( blockStyles, {
	selector: '.stk-button__inner-text',
	hoverSelector: '.stk-button:hover .stk-button__inner-text',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles

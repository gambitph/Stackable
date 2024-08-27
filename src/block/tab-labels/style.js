/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	EffectsAnimations,
	Transform,
	Icon,
	Button,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'tabAlignment', [ {
	selector: '.stk-block-tab-labels__wrapper',
	styleRule: 'justifyContent',
	attrName: 'tabAlignment',
	key: 'tabAlignment',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'fullWidth', [ {
	selector: '.stk-block-content.stk-block-tabs--horizontal .%s',
	styleRule: '--tabs-flex',
	attrName: 'fullWidth',
	key: 'fullWidth',
	valuePreCallback: value => {
		return value ? '1 1 auto' : undefined
	},
} ] )

blockStyles.addBlockStyles( 'columnGap', [ {
	selector: '',
	styleRule: '--tabs-column-gap',
	attrName: 'columnGap',
	key: 'columnGap',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'rowGap', [ {
	selector: '',
	styleRule: '--tabs-row-gap',
	attrName: 'rowGap',
	key: 'rowGap',
	responsive: 'all',
	format: '%spx',
} ] )

{ /* Icon */ }
blockStyles.addBlockStyles( 'iconPosition', [ {
	selector: '.stk-block-tabs__tab',
	styleRule: 'flex-direction',
	attrName: 'iconPosition',
	key: 'iconPosition',
	valueCallback: value => {
		if ( value === 'right' ) {
			return 'row-reverse'
		} else if ( value === 'top' ) {
			return 'column'
		} else if ( value === 'bottom' ) {
			return 'column-reverse'
		}
	},
} ] )

{ /* Icon alignment */ }
blockStyles.addBlockStyles( 'contentAlign', [ {
	selector: '.stk-block-tabs__tab',
	styleRuleCallback: getAttribute => {
		return getAttribute( 'iconPosition' ) === '' || getAttribute( 'iconPosition' ) === 'right'
			? 'justifyContent'
			 : 'alignItems'
	},
	attrName: 'contentAlign',
	key: 'iconAlignment-iconPosition',
	enabledCallback: getAttribute => getAttribute( 'fullWidth' ) !== undefined || getAttribute( 'iconPosition' ) === 'top' || getAttribute( 'iconPosition' ) === 'bottom',
	valueCallback: ( value, getAttribute ) => {
		let newValue = value
		if ( value === '' || value === 'left' ) {
			newValue = 'flex-start'
		} else if ( value === 'center' ) {
			newValue = 'center'
		} else {
			newValue = 'flex-end'
		}

		// If right icon position, then we need to reverse the alignment.
		if ( getAttribute( 'iconPosition' ) === 'right' ) {
			if ( newValue === 'flex-start' ) {
				newValue = 'flex-end'
			} else if ( newValue === 'flex-end' ) {
				newValue = 'flex-start'
			}
		}

		return newValue
	},
	responsive: 'all',
	dependencies: [
		'fullWidth',
		'iconPosition',
	],
} ] )

blockStyles.addBlockStyles( 'iconGap', [ {
	selector: '.stk-block-tabs__tab',
	styleRule: 'gap',
	attrName: 'iconGap',
	key: 'iconGap',
	format: '%spx',
} ] )

{ /* Tab text colors */ }
blockStyles.addBlockStyles( 'tabTextColor1', [ {
	selector: '.stk-block-tabs__tab',
	hoverSelector: '.stk-block-tabs__tab:hover',
	styleRule: 'color',
	attrName: 'tabTextColor1',
	key: 'tabTextColor',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'activeTabTextColor', [ {
	selector: '.stk-block-tabs__tab.stk-block-tabs__tab--active .stk-block-tab-labels__text',
	hoverSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active:hover .stk-block-tab-labels__text',
	styleRule: 'color',
	attrName: 'activeTabTextColor',
	key: 'activeTabTextColor',
	hover: 'all',
} ] )

{ /* Enable labels layout to more customizable */ }
blockStyles.addBlockStyles( 'fixedIconPosition', [ {
	enabledCallback: getAttribute => getAttribute( 'iconPosition' ) === '' || getAttribute( 'iconPosition' ) === 'right',
	selector: '.stk-block-tab-labels__wrapper .stk-block-tab-labels__text',
	styleRule: 'width',
	attrName: 'fixedIconPosition',
	valueCallback: value => {
		return value ? '100%' : undefined
	},
	key: 'fixedIconPosition',
	responsive: 'all',
	dependencies: [
		'iconPosition',
	],
} ] )

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-tab-labels__text',
	hoverSelector: '.stk-block-tabs__tab:hover .stk-block-tab-labels__text',
	attrNameTemplate: 'tab%s',
} )
Icon.Style.addStyles( blockStyles, {
	selector: '.stk-block-tabs__tab',
	hoverSelector: '.stk-block-tabs__tab:hover',
	hasIconGap: false,
} )
EffectsAnimations.Style.addStyles( blockStyles )
Button.Style.addStyles( blockStyles, {
	selector: '.stk-block-tabs__tab',
	hoverSelector: '.stk-block-tabs__tab:not(.stk-block-tabs__tab--active):hover',
	backgroundSelector: '.stk-block-tabs__tab',
	borderSelector: '.stk-block-tabs__tab',
	borderHoverSelector: '.stk-block-tabs__tab:not(.stk-block-tabs__tab--active):hover',
	attrNameTemplate: 'tab%s',
} )
Button.Style.addStyles( blockStyles, {
	selector: '.stk-block-tabs__tab.stk-block-tabs__tab--active',
	hoverSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active:hover',
	backgroundSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active',
	borderSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active',
	borderHoverSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active:hover',
	borderEnabledCallback: null, // If this is enabled, then we should be able to render the border attributes for the active tab.
	attrNameTemplate: 'activeTab%s',
} )

export default blockStyles

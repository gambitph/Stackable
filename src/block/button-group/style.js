/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	FlexGapStyles,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'flexWrap', [ {
	renderIn: 'save',
	selector: '.stk-button-group',
	styleRule: 'flexWrap',
	attrName: 'flexWrap',
	key: 'flexWrap-save',
	responsive: 'all',
}, {
	renderIn: 'edit',
	selector: '.stk-button-group .block-editor-block-list__layout',
	styleRule: 'flexWrap',
	attrName: 'flexWrap',
	key: 'flexWrap',
	responsive: 'all',
	valuePreCallback: ( value, getAttribute, device ) => {
	// In the editor, it should correctly wrap in mobile.
		if ( device === 'mobile' ) {
			return 'wrap'
		}
		return value || 'nowrap'
	},
} ] )

blockStyles.addBlockStyles( 'buttonAlign', [ {
	renderIn: 'save',
	selector: '.stk-button-group',
	styleRule: 'flexDirection',
	attrName: 'buttonAlign',
	key: 'buttonAlign-save-group',
	responsive: 'all',
	valuePreCallback: value => {
		if ( value === 'vertical' ) {
			return 'column'
		}

		return 'row'
	},
}, {
	renderIn: 'edit',
	selector: '.stk-button-group .block-editor-block-list__layout',
	styleRule: 'flexDirection',
	attrName: 'buttonAlign',
	key: 'buttonAlign-list-layout',
	responsive: 'all',
	valuePreCallback: value => {
		if ( value === 'vertical' ) {
			return 'column'
		} else if ( value === 'horizontal' ) {
			return 'row'
		}
		return value
	},
}, {
// If the buttons are set to vertical, we also need to reset the flex
// basis or else full-width buttons (set per button block) will overlap
// each other vertically.
	renderIn: 'save',
	selector: '.stk-block',
	styleRule: 'flexBasis',
	attrName: 'buttonAlign',
	key: 'buttonAlign-save-block',
	responsive: 'all',
	valuePreCallback: value => {
		return value === 'vertical' ? 'auto'
			: value === 'horizontal' ? 0
				: undefined
	},
}, {
	renderIn: 'save',
	selector: '.stk-button-group',
	styleRule: 'alignItems',
	attrName: 'buttonAlign',
	key: 'buttonAlign-save-button-group',
	responsive: 'all',
	valuePreCallback: ( value, getAttribute, device ) => {
		const getInherited = true
		const contentAlign = getAttribute( 'contentAlign', device, 'normal', getInherited )

		if ( value === 'vertical' ) {
			const buttonFullWidth = getAttribute( 'buttonFullWidth' )
			if ( buttonFullWidth ) {
				return 'stretch'
			}
			if ( contentAlign === 'center' ) {
				return 'center'
			} else if ( contentAlign === 'right' ) {
				return 'flex-end'
			}
			return 'flex-start'
		} else if ( value === 'horizontal' ) {
			return 'center'
		}
		return value
	},
	dependencies: [ 'contentAlign', 'buttonFullWidth' ],
}, {
	renderIn: 'edit',
	selector: '.stk-button-group .block-editor-block-list__layout',
	styleRule: 'alignItems',
	attrName: 'buttonAlign',
	key: 'buttonAlign-group-list-layout',
	responsive: 'all',
	valuePreCallback: ( value, getAttribute, device ) => {
		const getInherited = true
		const contentAlign = getAttribute( 'contentAlign', device, 'normal', getInherited )

		if ( value === 'vertical' ) {
			const buttonFullWidth = getAttribute( 'buttonFullWidth' )
			if ( buttonFullWidth ) {
				return 'stretch'
			}
			if ( contentAlign === 'center' ) {
				return 'center'
			} else if ( contentAlign === 'right' ) {
				return 'flex-end'
			}
			return 'flex-start'
		} else if ( value === 'horizontal' ) {
			return 'center'
		}
		return value
	},
	dependencies: [ 'contentAlign', 'buttonFullWidth' ],
} ] )

blockStyles.addBlockStyles( 'buttonFullWidth', [ {
	renderIn: 'save',
	selector: '.stk-block-button, .stk-block-icon-button',
	styleRule: 'flex',
	attrName: 'buttonFullWidth',
	key: 'buttonFullWidth-save',
	valueCallback: ( value, getAttribute ) => {
		let basis = '0%' // This is the default value of flex-basis
		// If we're wrapping, we need to set flex-basis to auto so
		// that it will wrap and go full-width.
		if ( getAttribute( 'flexWrap' ) ) {
			basis = 'auto'
		}
		return value ? ( '1 0 ' + basis ) : undefined
	},
	dependencies: [ 'flexWrap' ],
}, {
	renderIn: 'edit',
	selector: `.stk-block-button, .stk-block-icon-button, [data-type^="stackable/"]`,
	styleRule: 'flex',
	attrName: 'buttonFullWidth',
	key: 'buttonFullWidth',
	valueCallback: ( value, getAttribute ) => {
		let basis = '0%' // This is the default value of flex-basis
		// If we're wrapping, we need to set flex-basis to auto so
		// that it will wrap and go full-width.
		if ( getAttribute( 'flexWrap' ) ) {
			basis = 'auto'
		}
		return value ? ( '1 0 ' + basis ) : undefined
	},
	dependencies: [ 'flexWrap' ],
} ] )

blockStyles.addBlockStyles( 'flexWrap', [ {
	renderIn: 'save',
	selector: '.stk-button-group',
	styleRule: '--stk-button-group-flex-wrap',
	attrName: 'flexWrap',
	key: 'flexWrap-save-button-group',
	responsive: 'all',
	valueCallback: value => {
		return value ? 'auto' : undefined
	},
}, {
	renderIn: 'save',
	selector: '.stk-button-group .stk-block-button',
	styleRule: 'width',
	attrName: 'flexWrap',
	key: 'flexWrap-save-button-group-unset-width',
	responsive: 'all',
	valueCallback: value => {
		return value ? 'unset' : undefined
	},
} ] )

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles, {
	verticalAlignSelectorEdit: '.stk-button-group > .block-editor-inner-blocks > .block-editor-block-list__layout',
	verticalAlignSelectorSave: '.stk-button-group',
} )
MarginBottom.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
FlexGapStyles.addStyles( blockStyles, {
	editSelector: '.block-editor-block-list__layout',
	saveSelector: '.stk-inner-blocks',
} )

export default blockStyles

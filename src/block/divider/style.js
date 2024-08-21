/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Alignment,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { getBlockStyle } from '~stackable/hooks'
import { BlockStyleGenerator } from '~stackable/components'

/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'

const dividerStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

dividerStyles.addBlockStyles( 'color', [ {
	selectorCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name

		if ( blockStyle === 'dots' ) {
			return '.stk-block-divider__dot'
		}

		if ( blockStyle === 'asterisks' ) {
			return '.stk-block-divider__dot:before'
		}

		return 'hr.stk-block-divider__hr'
	},
	styleRuleCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name

		if ( blockStyle === 'asterisks' ) {
			return 'color'
		}

		return 'background'
	},
	attrName: 'color',
	key: 'color',
	dependencies: [ 'className' ],
} ] )

dividerStyles.addBlockStyles( 'height', [ {
	selector: '.stk-block-divider__dot:before',
	styleRule: 'fontSize',
	attrName: 'height',
	key: 'height-dot',
	responsive: 'all',
	format: 'calc(%spx * 1.8)',
	enabledCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
		return blockStyle === 'asterisks'
	},
	dependencies: [ 'className' ],
} ] )

dividerStyles.addBlockStyles( 'height', [ {
	selector: 'hr.stk-block-divider__hr',
	styleRule: 'borderRadius',
	attrName: 'height',
	key: 'height-hr',
	responsive: 'all',
	format: 'calc(%spx / 2)',
	enabledCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
		return blockStyle === 'bar'
	},
	dependencies: [ 'className' ],
} ] )

dividerStyles.addBlockStyles( 'height', [ {
	selector: '.stk-block-divider__dot',
	styleRule: 'width',
	attrName: 'height',
	key: 'height-dot-width',
	responsive: 'all',
	format: '%spx',
	enabledCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
		return [ 'dots', 'asterisks' ].includes( blockStyle )
	},
	dependencies: [ 'className' ],
} ] )

dividerStyles.addBlockStyles( 'height', [ {
	selectorCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
		if ( [ 'dots', 'asterisks' ].includes( blockStyle ) ) {
			return '.stk-block-divider__dot'
		}

		return 'hr.stk-block-divider__hr'
	},
	styleRule: 'height',
	attrName: 'height',
	key: 'height-hr-height',
	format: '%spx',
	responsive: 'all',
	dependencies: [ 'className' ],
} ] )

dividerStyles.addBlockStyles( 'width', [ {
	selectorCallback: getAttribute => {
		const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
		if ( [ 'dots', 'asterisks' ].includes( blockStyle ) ) {
			return '.stk-block-divider__dots'
		}

		return 'hr.stk-block-divider__hr'
	},
	styleRule: 'width',
	attrName: 'width',
	key: 'width',
	format: '%s%',
	responsive: 'all',
	dependencies: [ 'className' ],
} ] )

Alignment.Style.addStyles( dividerStyles )
BlockDiv.Style.addStyles( dividerStyles )
Advanced.Style.addStyles( dividerStyles )
Transform.Style.addStyles( dividerStyles )
EffectsAnimations.Style.addStyles( dividerStyles )

export default dividerStyles

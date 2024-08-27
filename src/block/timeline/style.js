/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Transform,
	Typography,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'timelineAnchor', [ {
	selector: [ '', '~ .stk-block-timeline' ], // Also set the succeeding ones.
	styleRule: '--line-accent-bg-location',
	attrName: 'timelineAnchor',
	key: 'timelineAnchor',
	format: '%s%',
} ] )

blockStyles.addBlockStyles( 'timelineGap', [ {
	selector: '',
	styleRule: '--gap',
	attrName: 'timelineGap',
	key: 'timelineGap',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'timelineDotBorderRadius', [ {
	selector: '',
	styleRule: '--line-dot-border-radius',
	attrName: 'timelineDotBorderRadius',
	key: 'timelineDotBorderRadius',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'timelineDotSize', [ {
	selector: '',
	styleRule: '--line-dot-size',
	attrName: 'timelineDotSize',
	key: 'timelineDotSize',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'timelineThickness', [ {
	selector: '',
	styleRule: '--line-bg-width',
	attrName: 'timelineThickness',
	key: 'timelineThickness',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'timelineOffset', [ {
	selector: '',
	styleRule: '--content-line',
	attrName: 'timelineOffset',
	key: 'timelineOffset',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'timelineAccentColor', [ {
	selector: '',
	styleRule: '--line-accent-bg-color',
	attrName: 'timelineAccentColor',
	key: 'timelineAccentColor',
} ] )

blockStyles.addBlockStyles( 'timelineAccentColor2', [ {
	selector: '',
	styleRule: '--line-accent-bg-color-2',
	attrName: 'timelineAccentColor2',
	key: 'timelineAccentColor2',
	enabledCallback: getAttribute => getAttribute( 'timelineAccentColorType' ) === 'gradient',
	dependencies: [ 'timelineAccentColorType' ],
} ] )

blockStyles.addBlockStyles( 'timelineBackgroundColor', [ {
	selector: '',
	styleRule: '--line-bg-color',
	attrName: 'timelineBackgroundColor',
	key: 'timelineBackgroundColor',
} ] )

blockStyles.addBlockStyles( 'blockPadding', [ {
	renderIn: 'save',
	selector: '.stk-inner-blocks:after',
	styleRule: 'top',
	attrName: 'blockPadding',
	key: 'timeline-blockPadding-top',
	responsive: 'all',
	valuePreCallback: ( value, getAttribute, device ) => {
		const getInherited = true
		const padding = getAttribute( 'blockPadding', device, 'normal', getInherited )
		const top = padding && padding?.top !== '' ? padding?.top : ( device === 'mobile' ? 0 : 16 )
		if ( device === 'mobile' ) {
			return `${ top + 16 }px`
		}

		if ( padding?.top === padding?.bottom ) {
			return ''
		}

		const bottom = padding && padding?.bottom !== '' ? padding?.bottom : 16
		return `calc(${ top }px + (100% - ${ top }px - ${ bottom }px)/2)`
	},
	unitCallback: () => '',
	dependencies: [ 'blockPadding' ],
}, {
	renderIn: 'save',
	selector: '.stk-inner-blocks:after',
	styleRule: 'bottom',
	attrName: 'blockPadding',
	key: 'timeline-blockPadding-bottom',
	enabledCallback: getAttribute => getAttribute( 'timelineIsLast' ) === true,
	responsive: 'all',
	valuePreCallback: ( value, getAttribute, device ) => {
		const getInherited = true
		const padding = getAttribute( 'blockPadding', device, 'normal', getInherited )
		const top = padding && padding?.top !== '' ? padding?.top : ( device === 'mobile' ? 0 : 16 )
		const bottom = padding && padding?.bottom !== '' ? padding?.bottom : ( device === 'mobile' ? 0 : 16 )
		if ( device === 'mobile' ) {
			return `calc(${ bottom }px + (100% - ${ top + bottom }px) - 16px)`
		}

		if ( top === bottom ) {
			return ``
		}

		return `calc(${ bottom }px + (100% - ${ top }px - ${ bottom }px)/2)`
	},
	unitCallback: () => '',
	dependencies: [ 'timelineIsLast', 'blockPadding' ],
}, {
	renderIn: 'save',
	selector: '.stk-block-timeline__middle',
	styleRule: 'marginTop',
	attrName: 'blockPadding',
	key: 'timeline-blockPadding-marginTop',
	responsive: 'all',
	valuePreCallback: ( value, getAttribute, device ) => {
		const getInherited = true
		const padding = getAttribute( 'blockPadding', device, 'normal', getInherited )
		if ( device === 'mobile' ) {
			return padding ? `${ padding?.top }px` : ''
		}
		return ''
	},
	unitCallback: () => '',
	dependencies: [ 'blockPadding' ],
} ] )

BlockDiv.Style.addStyles( blockStyles )
MarginBottom.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-timeline__date',
	hoverSelector: '.stk-block-timeline__date:hover',
} )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles

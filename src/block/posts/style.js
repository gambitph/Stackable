/**
 * Internal dependencies
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
	Typography,
	FlexGapStyles,
	Transform,
} from '~stackable/block-components'
import { getBlockStyle } from '~stackable/hooks'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

const itemSelector = ' .%s-container'
const hoverSelectorCallback = append => getAttribute =>
	getAttribute( 'hoverStateInContainer' )
		? `${ itemSelector }:hover ${ append }`
		: `${ itemSelector } ${ append }:hover`
const dependencies = [ 'hoverStateInContainer' ]

blockStyles.addBlockStyles( 'columns', [ {
	selector: '',
	styleRule: '--stk-columns',
	attrName: 'columns',
	key: 'columns',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'containerPadding', [ {
	selector: '',
	responsive: 'all',
	styleRule: '--stk-container-padding-left',
	attrName: 'containerPadding',
	key: 'containerPadding',
	hasUnits: 'px',
	valueCallback: value => value?.left,
}, {
	selector: '',
	responsive: 'all',
	styleRule: '--stk-container-padding-right',
	attrName: 'containerPadding',
	key: 'containerPadding-right',
	hasUnits: 'px',
	valueCallback: value => value?.right,
} ] )

blockStyles.addBlockStyles( 'columnGap', [ {
	selector: '',
	styleRule: '--stk-column-gap',
	attrName: 'columnGap',
	key: 'columnGap',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'innerBlockContentWidth', [ {
	selector: '.stk-content-align',
	hasUnits: 'px',
	responsive: 'all',
	styleRule: 'maxWidth',
	attrName: 'innerBlockContentWidth',
	key: 'innerBlockContentWidth',
} ] )

blockStyles.addBlockStyles( 'innerBlockAlign', [ {
	selector: '.stk-content-align',
	responsive: 'all',
	styleRule: 'marginLeft',
	attrName: 'innerBlockAlign',
	key: 'innerBlockAlign-margin-left',
	valueCallback: ( value, getAttribute, device ) => {
		if ( getAttribute( 'innerBlockContentWidth', device ) === undefined || getAttribute( 'innerBlockContentWidth', device ) === '' ) {
			return undefined
		}
		if ( value === 'center' || value === 'flex-end' ) {
			return 'auto'
		}
		return 0
	},
	dependencies: [ 'innerBlockContentWidth' ],
}, {
	selector: '.stk-content-align',
	responsive: 'all',
	styleRule: 'marginRight',
	attrName: 'innerBlockAlign',
	key: 'innerBlockAlign',
	valueCallback: ( value, getAttribute, device ) => {
		if ( getAttribute( 'innerBlockContentWidth', device ) === undefined || getAttribute( 'innerBlockContentWidth', device ) === '' ) {
			return undefined
		}
		if ( value === 'center' || value === 'flex-start' ) {
			return 'auto'
		}
		return 0
	},
	dependencies: [ 'innerBlockContentWidth' ],
} ] )
{ /** Category Highlight Color */ }

blockStyles.addBlockStyles( 'categoryHighlightColor', [ {
	selector: `${ itemSelector } .stk-button`,
	styleRule: 'background',
	attrName: 'categoryHighlightColor',
	key: 'categoryHighlightColor-button',
	enabledCallback: getAttribute => getAttribute( 'categoryHighlighted' ),
	dependencies: [ 'categoryHighlighted' ],
}, {
	selector: `${ itemSelector } .stk-button:after`,
	styleRule: 'background',
	attrName: 'categoryHighlightColor',
	key: 'categoryHighlightColor-button-after',
	hoverSelectorCallback: getAttribute => getAttribute( 'categoryHoverStateInContainer' )
		? `${ itemSelector }:hover .stk-button:after`
		: `${ itemSelector } .stk-button:hover:after`,
	hover: 'all',
	valuePreCallback: ( value, getAttribute, device, state ) => {
		if ( state === 'normal' ) {
			return undefined
		}

		return value
	},
	enabledCallback: getAttribute => getAttribute( 'categoryHighlighted' ),
	dependencies: [ 'categoryHighlighted', 'categoryHoverStateInContainer' ],
}, {
	selector: `${ itemSelector } .stk-button:after`,
	styleRule: 'opacity',
	attrName: 'categoryHighlightColor',
	key: 'categoryHighlightColor-opacity',
	hoverSelectorCallback: getAttribute => getAttribute( 'categoryHoverStateInContainer' )
		? `${ itemSelector }:hover .stk-button:after`
		: `${ itemSelector } .stk-button:hover:after`,
	hover: 'all',
	valuePreCallback: ( value, getAttribute, device, state ) => {
		if ( state === 'normal' ) {
			return undefined
		}

		return ( value !== undefined && value !== '' ) ? 1 : undefined
	},
	enabledCallback: getAttribute => getAttribute( 'categoryHighlighted' ),
	dependencies: [ 'categoryHighlighted', 'categoryHoverStateInContainer' ],
} ] )

{ /** Spacing */ }
blockStyles.addBlockStyles( 'imageSpacing', [ {
	selector: `${ itemSelector } .stk-block-posts__image-link`,
	styleRule: 'marginBottom',
	attrName: 'imageSpacing',
	key: 'imageSpacing',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'titleSpacing', [ {
	selector: '.stk-block-posts__title',
	styleRule: 'marginBottom',
	attrName: 'titleSpacing',
	key: 'titleSpacing',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'categorySpacing', [ {
	selector: '.stk-block-posts__category',
	styleRule: 'marginBottom',
	attrName: 'categorySpacing',
	key: 'categorySpacing',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'excerptSpacing', [ {
	selector: '.stk-block-posts__excerpt',
	styleRule: 'marginBottom',
	attrName: 'excerptSpacing',
	key: 'excerptSpacing',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'metaSpacing', [ {
	selector: '.stk-block-posts__meta',
	styleRule: 'marginBottom',
	attrName: 'metaSpacing',
	key: 'metaSpacing',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'readmoreSpacing', [ {
	selector: '.stk-block-posts__readmore',
	styleRule: 'marginBottom',
	attrName: 'readmoreSpacing',
	key: 'readmoreSpacing',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'imageWidth', [ {
	renderIn: 'save',
	selector: '.stk-container-padding',
	styleRule: 'width',
	attrName: 'imageWidth',
	key: 'imageWidth',
	responsive: 'all',
	valueCallback: ( value, getAttribute, device ) => {
		if ( getAttribute( 'imageWidthUnit', device ) === '%' && value !== undefined && value !== '' ) {
			return ( 100 - parseInt( value ) ) + '%'
		}

		return undefined
	},
	enabledCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		return blockStyle?.name === 'list'
	},
	dependencies: [ 'imageWidthUnit', 'className' ],
}, {
	renderIn: 'save',
	selector: '.stk-block-posts__image-link:not(:empty)',
	styleRule: 'width',
	attrName: 'imageWidth',
	key: 'imageWidthHorizontalSave',
	responsive: 'all',
	hasUnits: '%',
	enabledCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )

		return ( getAttribute( 'imageWidthUnit' ) === '%' ||
		getAttribute( 'imageWidthUnitTablet' ) === '%' ) &&
		[ 'horizontal', 'horizontal-2' ].includes( blockStyle?.name ) &&
		getAttribute( 'imageHasLink' )
	},
	dependencies: [
		'imageWidthUnitTablet',
		'imageWidthUnit',
		'imageHasLink',
		'className',
	],
} ] )

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Column.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
ContainerDiv.Style.addStyles( blockStyles, {
	backgroundSelector: itemSelector,
	borderSelector: itemSelector,
	sizeSelector: itemSelector,
} )
Image.Style.addStyles( blockStyles, {
	dependencies: [ 'imageHoverStateInContainer', 'imageOverlayColorType' ],
	enableHeightCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )

		return ! [ 'portfolio' ].includes( blockStyle?.name )
	},
	enableAspectRatioCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		return ! [ 'list', 'horizontal', 'horizontal-2', 'portfolio', 'portfolio-2', 'vertical-card-2' ].includes( blockStyle?.name )
	},
	saveEnableWidthCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const imageHasLink = getAttribute( 'imageHasLink' )
		const blockStyle = getBlockStyle( variations, className )

		if ( [ 'horizontal', 'horizontal-2' ].includes( blockStyle?.name ) ) {
			if ( imageHasLink ) {
				return false
			}
			return true
		}
		return true
	},
	selectorCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		const imageHasLink = getAttribute( 'imageHasLink' )

		if ( [ 'list' ].includes( blockStyle?.name ) && imageHasLink ) {
			return `${ itemSelector } .stk-block-posts__image-link`
		}
		return '.stk-img-wrapper'
	},
	widthStyleRuleCallback: getAttribute => {
		const className = getAttribute( 'className' )
		const blockStyle = getBlockStyle( variations, className )
		const imageHasLink = getAttribute( 'imageHasLink' )

		if ( [ 'list' ].includes( blockStyle?.name ) && imageHasLink ) {
			return 'flexBasis'
		}
		return 'width'
	},

} )

Typography.Style.addStyles( blockStyles, {
	editSelector: '.stk-block-posts__title',
	saveSelector: `.stk-block-posts__title a`,
	editHoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__title' ),
	saveHoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__title a' ),
	attrNameTemplate: 'title%s',
	dependencies,
} )

Typography.Style.addStyles( blockStyles, {
	selectorCallback: getAttribute => `.stk-block-posts__category a${ getAttribute( 'highlighted' )
		? ' .stk-button__inner-text'
		: '' }`,
	hoverSelectorCallback: getAttribute => {
		const selector = getAttribute( 'highlighted' ) ? ' .stk-button__inner-text' : ''
		return getAttribute( 'hoverStateInContainer' )
			? `${ itemSelector }:hover .stk-block-posts__category a${ selector }`
			: `.stk-block-posts__category a:hover${ selector }`
	},
	attrNameTemplate: 'category%s',
	dependencies: [ 'Highlighted', 'hoverStateInContainer', ...dependencies ],
} )

Typography.Style.addStyles( blockStyles, {
	selector: `.stk-block-posts__excerpt p`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__excerpt p' ),
	attrNameTemplate: 'excerpt%s',
	dependencies,
} )

Typography.Style.addStyles( blockStyles, {
	selector: `.stk-block-posts__meta`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__meta' ),
	attrNameTemplate: 'meta%s',
	dependencies,
} )

Typography.Style.addStyles( blockStyles, {
	selector: `.stk-block-posts__readmore`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__readmore' ),
	attrNameTemplate: 'readmore%s',
	dependencies,
} )

FlexGapStyles.addStyles( blockStyles, {
	selector: '.stk-block-posts__items',
	enableColumnGap: false,
} )

export default blockStyles

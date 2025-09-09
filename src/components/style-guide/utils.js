import heroBg from './images/hero-bg.webp'
import profile from './images/profile.webp'
import {
	i18n, srcUrl, version as VERSION,
} from 'stackable'

import { CssSaveCompiler } from '../block-css'
import {
	cleanSerializedBlock,
	createUniqueClass,
	blockStyleGenerators,
} from '~stackable/util'
import { PLACEHOLDER_INNER_BLOCKS } from '~stackable/util/block-templates'

import { __, sprintf } from '@wordpress/i18n'
import { RawHTML } from '@wordpress/element'
import {
	createBlock, serialize,
	createBlocksFromInnerBlocksTemplate,
	getBlockVariations,
} from '@wordpress/blocks'
import { DEFAULT_CONTENT } from '../design-library-list/design-library-list-item'
import { addPlaceholderForPostsBlock } from '../design-library-list/util'

export const DUMMY_COLOR_SCHEMES = [
	{
		name: 'Base Color Scheme',
		key: 'color-scheme-1',
		normal: {
			backgroundColor: '#fff',
			headingColor: '#1e1e1e',
			textColor: '#1e1e1e',
			linkColor: '#1e1e1e',
			accentColor: '#39414d',
			buttonBackgroundColor: '#008de4',
			buttonTextColor: '#fff',
			buttonOutlineColor: '#008de4',
		},
		hover: {},
		parentHover: {},
	},
	{
		name: 'Background Color Scheme',
		key: 'color-scheme-2',
		normal: {
			backgroundColor: '#f1f1f1',
			headingColor: '#1e1e1e',
			textColor: '#1e1e1e',
			linkColor: '#1e1e1e',
			accentColor: '#39414d',
			buttonBackgroundColor: '#008de4',
			buttonTextColor: '#fff',
			buttonOutlineColor: '#008de4',
		},
		hover: {},
		parentHover: {},
	},
]

const SERIALIZE_CALLBACKS = {
	'stackable/tabs': serialized => serialized.replace( '"stk-block-tabs__tab"', '"stk-block-tabs__tab stk-block-tabs__tab--active"' ),
	'stackable/countdown': serialized => serialized.replace(
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-day"></div>',
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-day">10</div>'
	).replace(
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-hour"></div>',
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-hour">12</div>'
	).replace(
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-minute"></div>',
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-minute">30</div>'
	).replace(
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-second"></div>',
		'<div class="stk-block-countdown__digit stk-block-countdown__digit-second">45</div>',
	),
	'stackable/icon-list': ( serialized, attributes ) => serialized.replace(
		/#stk-icon-list__icon-svg-def-[^"]*/g,
		`#stk-icon-list__icon-svg-def-${ attributes.uniqueId }`
	),
}

const ADDITIONAL_ATTRIBUTES = {
	'stackable/heading': { text: __( 'Heading', i18n ) },
	'stackable/text': { text: __( 'Text', i18n ) },
	'stackable/subtitle': { text: __( 'Subtitle', i18n ) },
	'stackable/card': { imageExternalUrl: `${ srcUrl }/${ heroBg }` },
	'stackable/count-up': { text: '1,234.56' },
	'stackable/icon-list-item': { text: __( 'List Item', i18n ) },
	'stackable/number-box': { text: __( '1', i18n ) },
	'stackable/table-of-contents': {
		headings: [
			{
				content: sprintf( __( 'Heading %s', i18n ), 1 ),
				level: 1,
				anchor: 'heading-1',
				clientId: '72dfd683-3844-47a3-af9d-76eddbf6d51c',
				tag: 1,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 2 ),
				level: 2,
				anchor: 'heading-2-1',
				clientId: 'd9208411-5aef-4446-893b-f41226ba7858',
				tag: 2,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 3 ),
				level: 3,
				anchor: 'heading-3',
				clientId: 'fb915b6c-f956-44dc-8c50-44ccbb8e430c',
				tag: 3,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 4 ),
				level: 4,
				anchor: 'heading-4',
				clientId: '350dd450-77f6-430d-a9f3-0be449c64235',
				tag: 4,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 5 ),
				level: 5,
				anchor: 'heading-5',
				clientId: '41cde9d8-2585-47ea-a6ba-a3a208a0ede3',
				tag: 5,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 6 ),
				level: 6,
				anchor: 'heading-6',
				clientId: '375f0cb3-2aa1-478b-a3a7-de5dedd3dd38',
				tag: 6,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 2 ),
				level: 2,
				anchor: 'heading-2-2',
				clientId: '642f3b01-8ead-4813-a092-22d9995610c0',
				tag: 2,
				isExcluded: false,
			},
			{
				content: sprintf( __( 'Heading %s', i18n ), 2 ),
				level: 2,
				anchor: 'heading-2-3',
				clientId: 'f0ad1cb6-332f-406b-9f3f-d41e08725740',
				tag: 2,
				isExcluded: false,
			},
		],
	},
}

const INNER_BLOCK_CALLBACKS = {
	'stackable/team-member': innerBlocks => {
		innerBlocks[ 0 ].attributes.imageExternalUrl = `${ srcUrl }/${ profile }`

		return innerBlocks
	},
	'stackable/testimonial': innerBlocks => {
		innerBlocks[ 1 ].attributes.imageExternalUrl = `${ srcUrl }/${ profile }`

		return innerBlocks
	},
}

/* eslint-disable jsx-a11y/anchor-is-valid */
export const DefaultButton = ( {
	text, dataDevice = 'desktop', style = '',
} ) => {
	return <>
		<div className="wp-block-stackable-button stk-block-button stk-block stk-5609083" data-block-id="5609083">
			{ style && <style> { style } </style> }
			<a className="stk-link stk-button stk--hover-effect-darken" href="" onClick={ e => e.preventDefault() }>
				<span className="stk-button__inner-text ugb-style-guide__typography-preview" data-device={ dataDevice }>{ text }</span>
			</a>
		</div>
	</>
}

export const DefaultOutlineButton = ( {
	text, dataDevice = 'desktop', style = '',
} ) => {
	return <>

		<div className="wp-block-stackable-button stk-block-button is-style-ghost stk-block stk-3f9ae3c" data-block-id="3f9ae3c">
			<style>{ '.stk-3f9ae3c .stk-button{background:transparent !important;}.stk-3f9ae3c .stk-button:hover:after{background:transparent !important;opacity:1 !important;}:where(.stk-hover-parent:hover,  .stk-hover-parent.stk--is-hovered) .stk-3f9ae3c .stk-button:after{background:transparent !important;opacity:1 !important;}.stk-3f9ae3c .stk-button:before{border-style:solid !important;}' }</style>
			{ style && <style> { style } </style> }
			<a className="stk-link stk-button stk--hover-effect-darken" href="" onClick={ e => e.preventDefault() }>
				<span className="stk-button__inner-text ugb-style-guide__typography-preview" data-device={ dataDevice }>{ text }</span>
			</a>
		</div>

	</>
}

const getGeneratedCss = ( blocks, generateForInnerBlocks = false ) => {
	return blocks.map( block => {
		if ( ! block.attributes.uniqueId ) {
			block.attributes.uniqueId = createUniqueClass( block.clientId )
		}

		const blockStyleGenerator = blockStyleGenerators[ block.name ]
		const attrNamesWithValues = blockStyleGenerator.getAttributesWithValues( block.attributes )
		const blockStyleDefs = blockStyleGenerator.getBlockStyles( attrNamesWithValues )

		const cssCompiler = new CssSaveCompiler()
		const saveCss = blockStyleGenerator.generateBlockStylesForSave(
			cssCompiler,
			block.attributes,
			blockStyleDefs,
			{
				version: VERSION,
			}
		)

		block.attributes.generatedCss = saveCss

		if ( generateForInnerBlocks ) {
			block.innerBlocks = getGeneratedCss( block.innerBlocks, generateForInnerBlocks )
		}

		return block
	} )
}

const getSerializedBlock = props => {
	const {
		blockName: _blockName, attributes, innerBlocks,
	} = props

	let blockName = _blockName

	let block = createBlock( blockName, attributes, innerBlocks )
	let newBlock = getGeneratedCss( [ block ] )
	let serialized = serialize( newBlock )

	if ( blockName === 'stackable/timeline' ) {
		const _block = createBlock( blockName, attributes, innerBlocks )
		_block.attributes.timelineIsLast = true
		const duplicateBlock = getGeneratedCss( [ _block ] )
		serialized += '\n' + serialize( duplicateBlock )
	}

	if ( blockName === 'stackable/accordion' ) {
		const _block = createBlock( blockName, attributes, innerBlocks )
		_block.attributes.startOpen = true
		_block.attributes.blockMargin = {
			top: 24, bottom: 0, left: 0, right: 0,
		}
		const duplicateBlock = getGeneratedCss( [ _block ] )
		serialized += '\n' + serialize( duplicateBlock )
	}

	if ( blockName === 'stackable/column' ) {
		block = createBlock( 'stackable/columns', {}, [ block ] )
		newBlock = getGeneratedCss( [ block ] )
		serialized = serialize( newBlock )
		blockName = 'stackable/columns'
	}

	if ( blockName === 'stackable/icon-list-item' ) {
		block = createBlock( 'stackable/icon-list', {}, [ block ] )
		newBlock = getGeneratedCss( [ block ] )
		serialized = serialize( newBlock )
		blockName = 'stackable/icon-list'
	}

	if ( blockName === 'stackable/posts' ) {
		const defaultValues = DEFAULT_CONTENT[ 'Post Loop' ]
		serialized = addPlaceholderForPostsBlock( serialized, defaultValues.posts_placeholder, defaultValues, `${ srcUrl }/${ heroBg }` )
	}

	return {
		serialized, blockName, attributes: block.attributes,
	}
}

export const RenderBlock = props => {
	const {
		name = __( 'Default', i18n ), ...propsToPass
	} = props

	const {
		serialized, blockName, attributes,
	} = getSerializedBlock( propsToPass )

	return (
		<RawHTML>
			{ cleanSerializedBlock( serialized, SERIALIZE_CALLBACKS[ blockName ], attributes ) }
			{ `<p>${ name }</p>` }
		</RawHTML>
	)
}

export const getPlaceholders = blockName => {
	let innerBlocks = []
	let attributes = {}

	const variations = getBlockVariations( blockName )

	if ( blockName in PLACEHOLDER_INNER_BLOCKS ) {
		innerBlocks = createBlocksFromInnerBlocksTemplate( PLACEHOLDER_INNER_BLOCKS[ blockName ] )
	} else if ( variations.length && variations[ 0 ].innerBlocks?.length ) {
		innerBlocks = createBlocksFromInnerBlocksTemplate( variations[ 0 ].innerBlocks )

		if ( blockName in INNER_BLOCK_CALLBACKS ) {
			innerBlocks = INNER_BLOCK_CALLBACKS[ blockName ]( innerBlocks )
		}
	}

	if ( innerBlocks.length ) {
		innerBlocks = getGeneratedCss( innerBlocks, true )
	}

	if ( variations.length && variations[ 0 ].attributes ) {
		attributes = variations[ 0 ].attributes
	}

	if ( blockName in ADDITIONAL_ATTRIBUTES ) {
		attributes = {
			...attributes,
			...ADDITIONAL_ATTRIBUTES[ blockName ],
		}
	}

	return {
		attributes, innerBlocks,
	}
}

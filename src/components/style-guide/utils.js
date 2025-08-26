import heroBg from './images/hero-bg.webp'
import { i18n, srcUrl } from 'stackable'
import { cleanSerializedBlock, createUniqueClass } from '~stackable/util'

import { __ } from '@wordpress/i18n'
import { RawHTML } from '@wordpress/element'
import {
	createBlock, serialize,
	createBlocksFromInnerBlocksTemplate,
	getBlockVariations,
} from '@wordpress/blocks'
import { PLACEHOLDER_INNER_BLOCKS } from '~stackable/util/block-templates'

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
}

const ADDITIONAL_ATTRIBUTES = {
	'stackable/heading': { text: __( 'Heading', i18n ) },
	'stackable/text': { text: __( 'Text', i18n ) },
	'stackable/subtitle': { text: __( 'Subtitle', i18n ) },
	'stackable/card': { imageExternalUrl: `${ srcUrl }/${ heroBg }` },
	'stackable/count-up': { text: '1,234.56' },
	'stackable/icon-list-item': { text: __( 'List Item', i18n ) },
	'stackable/number-box': { text: __( '1', i18n ) },
}

export const RenderBlock = props => {
	const {
		blockName, attributes, innerBlocks, name = __( 'Default', i18n ),
	} = props

	const block = createBlock( blockName, attributes, innerBlocks )
	block.attributes.uniqueId = createUniqueClass( block.clientId )
	let serialized = serialize( [ block ] )

	if ( blockName === 'stackable/timeline' ) {
		const _block = createBlock( blockName, attributes, innerBlocks )
		_block.attributes.timelineIsLast = true
		serialized += '\n' + serialize( [ _block ] )
	}

	return (
		<RawHTML>
			{ cleanSerializedBlock( serialized, SERIALIZE_CALLBACKS[ blockName ] ) }
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

	return { attributes, innerBlocks }
}

import { i18n } from 'stackable'

import { __ } from '@wordpress/i18n'
import { RawHTML } from '@wordpress/element'
import { createBlock, serialize } from '@wordpress/blocks'

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

export const DefaultImage = ( { imgSrc } ) => {
	return <>
		<div className="wp-block-stackable-image stk-block-image stk-block stk-703847c" data-block-id="703847c">
			<figure>
				<span className="stk-img-wrapper stk-image--shape-stretch">
					<img className="stk-img" src={ imgSrc } width="150" height="300" alt="Placeholder" />
				</span>
			</figure>
		</div>

	</>
}

export const RenderBlock = props => {
	const {
		blockName, attributes = {}, innerBlocks = [],
	} = props

	return (
		<RawHTML>
			{ serialize( createBlock(
				blockName,
				attributes,
				innerBlocks
			) ) }
		</RawHTML>
	)
}

// DUMMY DATA
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

export const LONG_TEXT = [
	// Translators: This is placeholder text used in the style guide.
	__( 'They didn\'t plan to build a life around shared walls and hand-me-down furniture, but somehow, it worked.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Morning routines bled into late-night talks, and even the silence felt familiar.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Careers shifted, relationships changed, and expectations rarely lined up with reality.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'But there was always time for inside jokes, spontaneous distractions, and someone to show up, even without being asked.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Each of them brought something different—quiet patience, loud opinions, unexpected wisdom.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Change arrived slowly, then all at once. Some said goodbye, some stayed longer, and some simply evolved.', i18n ),
]

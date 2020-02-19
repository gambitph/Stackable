/**
 * External dependencies
 */
import { omit } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.blockquote.design.no-text-attributes', 'stackable/blockquote', attributes => {
	return omit( attributes, [
		'text',
	] )
} )

addFilter( 'stackable.blockquote.edit.designs', 'stackable/blockquote', designs => {
	return {
		...designs,
		corporateLight1: {
			label: __( 'Corporate Light 1', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-blockquote-design-corporate-light-01.jpg',
			attributes: {
				quoteIcon: 'square',
				quoteOpacity: 0.3,
				quoteColor: '#ffb20b',
				quoteSize: 150,
				quoteY: 19,
				textFontFamily: 'Roboto Condensed',
				textFontWeight: '100',
				textColor: '#707070',
				textAlign: 'center',
				paddingTop: 80,
				paddingBottom: 80,
				showBlockBackground: true,
				blockInnerWidth: 'center',
				align: 'full',
				blockBackgroundBackgroundColor: '#ffffff',
				showBottomSeparator: false,
			},

		},
		corporateLight2: {
			label: __( 'Corporate Light 2', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-blockquote-design-corporate-light-02.jpg',
			attributes: {
				quoteIcon: 'square',
				quoteOpacity: 0.3,
				quoteColor: '#c49732',
				quoteSize: 150,
				quoteY: 19,
				textFontFamily: 'Roboto Condensed',
				textFontWeight: '100',
				textColor: '#6a91eb',
				textAlign: 'center',
				paddingTop: 80,
				paddingBottom: 80,
				showBlockBackground: true,
				blockInnerWidth: 'center',
				align: 'full',
				blockBackgroundBackgroundColor: '#ffffff',
				showBottomSeparator: false,
			},
		},
		corporateDark1: {
			label: __( 'Corporate Dark 1', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-blockquote-design-corporate-dark-01.jpg',
			attributes: {
				quoteIcon: 'square',
				quoteOpacity: 0.3,
				quoteColor: '#1785cb',
				quoteSize: 150,
				quoteY: 19,
				textFontFamily: 'Roboto Condensed',
				textFontWeight: '100',
				textColor: '#ffffff',
				textAlign: 'center',
				paddingTop: 80,
				paddingBottom: 80,
				showBlockBackground: true,
				blockInnerWidth: 'center',
				align: 'full',
				blockBackgroundBackgroundColor: '#081831',
				showBottomSeparator: false,

			},
		},
		corporateDark2: {
			label: __( 'Corporate Dark 2', i18n ),
			image: 'https://gambitph.github.io/Stackable/assets/block-design-previews/stack-blockquote-design-corporate-dark-02.jpg',
			attributes: {
				quoteIcon: 'square',
				quoteOpacity: 0.3,
				quoteColor: '#2f2f2f',
				quoteSize: 150,
				quoteY: 19,
				textFontFamily: 'Roboto Condensed',
				textFontWeight: '100',
				textColor: '#06c19d',
				textAlign: 'center',
				paddingTop: 80,
				paddingBottom: 80,
				showBlockBackground: true,
				blockInnerWidth: 'center',
				align: 'full',
				blockBackgroundBackgroundColor: '#707070',
				showBottomSeparator: false,

			},
		},
	}
} )

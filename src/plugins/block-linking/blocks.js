/**
 * These are the blocks that support block-linking.
 */

import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.block-linking.blocks', 'stackable', blocks => {
	return {
		...blocks,
		'stackable/card': { filterAttributes: [ 'imageUrl', 'imageId', 'imageAlt', 'imageTitle' ] },
		'stackable/card-group': {},
		'stackable/heading': { filterAttributes: [ 'text' ] },
		'stackable/text': { filterAttributes: [ 'text' ] },
		'stackable/button-group': {},
		'stackable/button': { filterAttributes: [ 'text', 'linkUrl', 'linkRel', 'linkNewTab' ] },
		'stackable/columns': {},
		'stackable/column': {},
		'stackable/image': { filterAttributes: [ 'imageUrl', 'imageId', 'imageAlt' ] },
	}
} )

// These attributes are essential to be not linked across all Stackable blocks.
addFilter( 'stackable.block-linking.blocks', 'stackable-essentials', blocks => {
	Object.keys( blocks ).forEach( blockType => {
		if ( blockType.startsWith( 'stackable/' ) ) {
			if ( ! blocks[ blockType ].filterAttributes ) {
				blocks[ blockType ].filterAttributes = []
			}
			blocks[ blockType ].filterAttributes.push(
				'uniqueId', // This should always be unique
				'columnWidth', 'columnWidthTablet', 'columnWidthMobile', 'isFirstBlock', 'isLastBlock', // Columns
				'blockLinkUrl', // Block link url
			)
		}
	} )
	return blocks
}, 99 )

addFilter( 'stackable.block-linking.blocks', 'core', blocks => {
	return {
		...blocks,
		'core/archives': {},
		'core/audio': { filterAttributes: [ 'src', 'caption', 'id' ] },
		'core/block': { filterAttributes: [ 'ref' ] },
		'core/button': { filterAttributes: [ 'url', 'title', 'text', 'linkTarget', 'rel', 'placeholder' ] },
		'core/buttons': {},
		'core/calendar': {},
		'core/categories': {},
		'core/freeform': { filterAttributes: [ 'content' ] },
		'core/code': { filterAttributes: [ 'content' ] },
		'core/column': {},
		'core/columns': {},
		'core/cover': { filterAttributes: [ 'url', 'id' ] },
		'core/file': { filterAttributes: [ 'id', 'href', 'fileName', 'textLinkHref', 'downloadButtonText' ] },
		'core/gallery': { filterAttributes: [ 'images', 'ids', 'caption' ] },
		'core/group': {},
		'core/heading': { filterAttributes: [ 'content', 'level', 'placeholder' ] },
		'core/html': { filterAttributes: [ 'content' ] },
		'core/image': { filterAttributes: [ 'url', 'capion', 'title', 'href', 'rel', 'id', 'linkDestination', 'linkTarget' ] },
		'core/latest-comments': {},
		'core/latest-posts': { filterAttributes: [ 'categories' ] },
		'core/legacy-widget': { filterAttributes: [ 'id', 'idBase', 'instance' ] },
		'core/list': { filterAttributes: [ 'values' ] },
		'core/media-text': { filterAttributes: [ 'mediaAlt', 'mediaId', 'mediaUrl', 'mediaLink', 'linkDestination', 'linkTarget', 'href', 'rel' ] },
		'core/missing': { filterAttributes: [ 'content' ] },
		'core/navigation': {},
		'core/paragraph': { filterAttributes: [ 'content', 'placeholder' ] },
		'core/post-author': {},
		'core/post-date': {},
		'core/post-excerpt': {},
		'core/preformatted': { filterAttributes: [ 'content' ] },
		'core/pullquote': { filterAttributes: [ 'value', 'citation' ] },
		'core/quote': { filterAttributes: [ 'value', 'citation' ] },
		'core/rss': { filterAttributes: [ 'feedURL' ] },
		'core/search': { filterAttributes: [ 'label', 'placeholder', 'buttonText' ] },
		'core/separator': {},
		'core/site-title': { filterAttributes: [ 'level' ] },
		'core/social-links': {},
		'core/spacer': {},
		'core/subhead': { filterAttributes: [ 'content' ] },
		'core/table': { filterAttributes: [ 'caption', 'head', 'body', 'foot' ] },
		'core/tag-cloud': { filterAttributes: [ 'taxonomy' ] },
		'core/text-columns': { filterAttributes: [ 'content' ] },
		'core/verse': { filterAttributes: [ 'content' ] },
		'core/video': { filterAttributes: [ 'caption', 'id', 'poster', 'src' ] },
	}
} )

addFilter( 'stackable.block-linking.blocks', 'common', blocks => {
	Object.keys( blocks ).forEach( blockType => {
		if ( ! blocks[ blockType ].filterAttributes ) {
			blocks[ blockType ].filterAttributes = []
		}
		if ( ! blocks[ blockType ].filterAttributes.includes( 'id' ) ) {
			blocks[ blockType ].filterAttributes.push( 'id' )
		}
		if ( ! blocks[ blockType ].filterAttributes.includes( 'anchor' ) ) {
			blocks[ blockType ].filterAttributes.push( 'anchor' )
		}
	} )
	return blocks
}, 99 )

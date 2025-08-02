/* eslint-disable no-console */
import DEFAULT from './default.json'
import { settings, isPro } from 'stackable'
import { parse, serialize } from '@wordpress/blocks'

const DEFAULT_CONTENT = { ...DEFAULT }
const PARSER = new DOMParser()

export const cleanParse = content => {
	const originalConsoleError = console.error
	const originalConsoleWarn = console.warn

	console.error = ( ...args ) => {
		if ( args.length && typeof args[ 0 ] === 'string' &&
			args[ 0 ].includes( 'Block validation failed' )
		) {
			return
		}
		originalConsoleError( ...args )
	}

	console.warn = ( ...args ) => {
		if ( args.length && typeof args[ 0 ] === 'string' &&
			args[ 0 ].includes( 'Block validation' )
		) {
			return
		}
		originalConsoleWarn( ...args )
	}

	let result

	try {
		result = parse( content )
	} finally {
		console.error = originalConsoleError
		console.warn = originalConsoleWarn
	}

	return result
}

const replaceInnerContent = ( originalContent, newInnerHTML ) => {
	const openTag = '<!-- wp:'
	const closeTag = '<!-- /wp:'

	const openIndex = originalContent.indexOf( openTag, openTag.length )
	const lastClose = originalContent.lastIndexOf( closeTag )
	const secondLastClose = originalContent.lastIndexOf( closeTag, lastClose - 1 )
	const closeEnd = originalContent.indexOf( '-->', secondLastClose )

	if ( openIndex === -1 || secondLastClose === -1 || closeEnd === -1 ) {
		return originalContent
	}

	const before = originalContent.slice( 0, openIndex )
	const after = originalContent.slice( closeEnd + 3 )

	return `${ before }${ newInnerHTML }${ after }`
}

export const addContainerScheme = (
	block,
	containerScheme
) => {
	const addScheme = blocks => {
		return blocks.map( block => {
			if ( block.innerBlocks?.length ) {
				block.innerBlocks = addScheme( block.innerBlocks )
			}

			if ( block.attributes.hasContainer ) {
				block.attributes.containerColorScheme = containerScheme
			}

			if ( block.name === 'core/missing' && block.attributes.originalName ) {
				const { originalAttributes } = block.attributes

				let innerHTML = ''
				if ( block.innerBlocks.length ) {
					innerHTML = serialize( block.innerBlocks )
				} else if ( originalAttributes.text ) {
					innerHTML = originalAttributes.text
				}

				const updatedContent = replaceInnerContent( block.attributes.originalContent, innerHTML )

				block.attributes.originalContent = updatedContent
			}

			return block
		} )
	}

	const newBlock = addScheme( [ block ] )[ 0 ]

	return newBlock
}

export const addBackgroundScheme = (
	block,
	enableBackground,
	backgroundScheme,
) => {
	const addBackground = block => {
		block.attributes.hasBackground = true
		if ( backgroundScheme !== '' ) {
			block.attributes.backgroundColorScheme = backgroundScheme
		}

		return block
	}

	const getTargetBlock = blocks => {
		blocks.forEach( _block => {
			const customAttributes = _block.attributes.customAttributes

			const isTarget = customAttributes?.find( attribute => attribute[ 0 ] === 'stk-design-library__bg-target' && attribute[ 1 ] === 'true' )
			if ( isTarget ) {
				_block = addBackground( _block )
			} else if ( _block.innerBlocks.length ) {
				getTargetBlock( _block.innerBlocks )
			}
		} )
	}

	if ( ! enableBackground ) {
		return block
	}

	const customAttributes = block.attributes.customAttributes

	if ( ! customAttributes?.length ) {
		block = addBackground( block )
		return block
	}

	getTargetBlock( block.innerBlocks )

	return block
}

export const replacePlaceholders = ( block, category ) => {
	const key = block.attributes.text
	const defaultValues = DEFAULT_CONTENT[ category ]
	if ( key && defaultValues ) {
		const newValue = defaultValues[ key ]
		block.attributes.text = newValue
	}

	block.innerBlocks.forEach( innerBlock => {
		replacePlaceholders( innerBlock, category )
	} )

	return block
}

const retrieveAttributes = ( blockName, hasNoInnerBlocks, content ) => {
	const attrs = content.match( /{.*}/ )
	let parsedAttrs = {}
	if ( attrs ) {
		try {
			parsedAttrs = JSON.parse( attrs[ 0 ] )
			if ( hasNoInnerBlocks ) {
				content = content.replace( /<style[^>]*>[\s\S]*?<\/style>/gi, '' )
				const doc = PARSER.parseFromString( content, 'text/html' )
				parsedAttrs.text = doc.body.textContent.trim()
			}
		} catch ( err ) {}
	}
	return parsedAttrs
}

export const parseDisabledBlocks = parsedBlock => {
	const disabledBlocks = settings.stackable_block_states || []
	const blocksForSubstitution = new Set()

	if ( Array.isArray( disabledBlocks ) && ! disabledBlocks.length ) {
		return { block: parsedBlock, blocksForSubstitution }
	}

	const addOriginalAttributes = blocks => {
		return blocks.map( block => {
			if ( block.name === 'core/missing' ) {
				blocksForSubstitution.add( block.attributes.originalName )
				const newAttrs = retrieveAttributes( block.attributes.originalName, block.innerBlocks.length === 0, block.attributes.originalContent )
				const attrs = block.attributes
				block.attributes = {
					...attrs, ...newAttrs, originalAttributes: newAttrs,
				}
			}

			block.innerBlocks = addOriginalAttributes( block.innerBlocks )
			return block
		} )
	}

	const block = addOriginalAttributes( [ parsedBlock ] )[ 0 ]
	return { block, blocksForSubstitution }
}

const IMAGE_STORAGE = 'https://stackable-files.pages.dev/library-v4/images/'

export const addPlaceholderForPostsBlock = ( content, postsPlaceholder, defaultValues ) => {
	const remainingPosts = [ ...postsPlaceholder ]

	// Normalize special characters
	const normalized = content
		.replace( /&lt;/g, '<' )
		.replace( /&gt;/g, '>' )
		.replace( /–/g, '-' )
		.replace( /\u2013|\u2014/g, '-' )

	// Regex to match all stackable/posts blocks
	const postBlockRegex = /<!--\s*wp:stackable\/posts\s+(\{[\s\S]*?\})\s*-->([\s\S]*?)<!--\s*\/wp:stackable\/posts\s*-->/g

	return normalized.replace( postBlockRegex, ( match, jsonStr, innerHtml ) => {
		let attrs
		try {
			attrs = JSON.parse( jsonStr )
		} catch {
			return match // Skip if JSON is invalid
		}

		const numItems = attrs.numberOfItems ?? 6
		const width = attrs.imageWidth ? attrs.imageWidth + ( attrs.imageWidthUnit ?? 'px' ) : 'auto'

		// Get the post template inside the block
		const templateMatch = innerHtml.match( /<!--\s*\/stk-start:posts\/template\s*-->([\s\S]*?)<!--\s*\/stk-end:post\/template\s*-->/ )
		if ( ! templateMatch ) {
			return match // Skip if template is missing
		}

		const template = templateMatch[ 1 ].trim()
		const currentPosts = remainingPosts.splice( 0, numItems ) // Slice the posts for this block

		const renderedPosts = currentPosts.map( ( post, index ) =>
			template
				.replace( /!#title!#/g, post.title_placeholder )
				.replace( /!#excerpt!#/g, post.text_placeholder )
				.replace( /!#date!#/g, 'March 1, 2025' )
				.replace( /!#readmoreText!#/g, defaultValues[ 'post-btn_placeholder' ] )
				.replace( /!#category!#/g, defaultValues.tag_placeholder )
				.replace( /img class="stk-img"/g, `img class="stk-img" src="${ IMAGE_STORAGE }stk-design-library-image-${ index + 1 }.jpeg" width="${ width }" style="width: ${ width } !important;"` )
		).join( '\n' )

		// Replace just the template portion, keep rest of the block
		const updatedInnerHtml = innerHtml.replace(
			/<!--\s*\/stk-start:posts\/template\s*-->([\s\S]*?)<!--\s*\/stk-end:post\/template\s*-->/,
			renderedPosts
		)

		return `<!-- wp:stackable/posts ${ jsonStr } -->${ updatedInnerHtml }<!-- /wp:stackable/posts -->`
	} )
}

// Additional styles for blocks to render properly in the preview
export const getAdditionalStylesForPreview = () => {
	let styles = ''

	// Make sure count up block numbers are visible
	styles += `.stk-block-count-up__text:not(.stk--count-up-active) { opacity: 1; }`

	// Fill the vertical line in timeline blocks
	styles += `.stk-block-timeline { --line-bg-color: var(--line-accent-bg-color, #000); }`

	// Display correctly the progress in progress bar and progress circle blocks
	styles += `.stk-progress-bar .stk-progress-bar__bar { width: var(--progress-percent, 0px); }`
	styles += `.stk-progress-circle .stk-progress-circle__bar { stroke-dashoffset: var(--progress-dash-offset); }`

	// Display correctly the styles for posts block.
	// Do this only if in Free version, since we will be able to load the correct CSS for Premium.
	if ( ! isPro ) {
		styles += `.stk-block-posts.is-style-horizontal-2 {
	.stk-block-posts__item > .stk-container {
		padding: 0;
		display: flex;
		flex-direction: row;

		> .stk-block-posts__image-link:empty ~ .stk-container-padding,
			.stk-container-padding:only-child {
				width: 100%;
		}
	}
	.stk-img-wrapper {
		height: 100%;
		margin-top: 0;
		margin-bottom: 0;
	}
	.stk-block-posts__image-link {
		margin-bottom: 0;
	}
}`
	}

	return styles
}

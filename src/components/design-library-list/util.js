/* eslint-disable no-console */
import DEFAULT from './default.json'
import { settings } from 'stackable'
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

	if ( block.attributes.hasBackground ) {
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

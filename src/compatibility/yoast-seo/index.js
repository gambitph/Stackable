/**
 * Yoast SEO compatibility.
 *
 * Applies Yoast SEO analysis highlights to Stackable text-based blocks.
 * Yoast only annotates core blocks by default; this hooks into yoast.analysis.applyMarks.
 *
 * @see https://github.com/gambitph/Stackable/issues/2422
 */

/**
 * Internal dependencies
 */
import {
	getAnnotationsForStackableBlock,
	getAnnotationsForStackableBlocks,
	getFieldsToMark,
	shouldAnnotateBlock,
	STACKABLE_ANNOTATABLE_BLOCKS,
} from './helpers'

/**
 * WordPress dependencies
 */
import {
	dispatch, select, subscribe,
} from '@wordpress/data'
import { addAction } from '@wordpress/hooks'
import { isFunction } from 'lodash'

const ANNOTATION_SOURCE = 'yoast'

let annotationQueue = []
let previousSelectedBlockId = null
let previousActiveMarkerId = null

/**
 * Returns whether annotations are available in the block editor.
 *
 * @return {boolean} Whether annotations can be applied.
 */
const isAnnotationAvailable = () => {
	return select( 'core/block-editor' ) &&
		isFunction( select( 'core/block-editor' ).getBlocks ) &&
		select( 'core/annotations' ) &&
		isFunction( dispatch( 'core/annotations' ).__experimentalAddAnnotation )
}

/**
 * Returns whether Yoast SEO is active in the editor.
 *
 * @return {boolean} Whether Yoast SEO is available.
 */
const isYoastSeoAvailable = () => {
	return select( 'yoast-seo/editor' ) &&
		isFunction( select( 'yoast-seo/editor' ).getActiveMarker )
}

/**
 * Gets all blocks to scan for annotations.
 *
 * @return {Array} Blocks in the editor.
 */
const getEditorBlocks = () => {
	const blockEditorDataModule = select( 'core/block-editor' )
	const editorDataModule = select( 'core/editor' )

	if ( ! blockEditorDataModule || ! editorDataModule ) {
		return []
	}

	const isTemplateLocked = editorDataModule.getRenderingMode?.() === 'template-locked'
	const postContentBlock = blockEditorDataModule.getBlocksByName( 'core/post-content' )

	return ( isTemplateLocked && postContentBlock?.length )
		? blockEditorDataModule.getBlocks( postContentBlock[ 0 ] )
		: blockEditorDataModule.getBlocks()
}

/**
 * Applies the next annotation in the queue.
 *
 * @return {void}
 */
const applyAnnotationQueueItem = () => {
	const nextAnnotation = annotationQueue.shift()
	if ( ! nextAnnotation ) {
		return
	}

	dispatch( 'core/annotations' ).__experimentalAddAnnotation( nextAnnotation )
	scheduleAnnotationQueueApplication()
}

/**
 * Schedules the application of the next annotation in the queue.
 *
 * @return {void}
 */
const scheduleAnnotationQueueApplication = () => {
	if ( isFunction( window.requestIdleCallback ) ) {
		window.requestIdleCallback( applyAnnotationQueueItem, { timeout: 1000 } )
	} else {
		setTimeout( applyAnnotationQueueItem, 150 )
	}
}

/**
 * Formats annotations and adds them to the queue.
 *
 * @param {Array} annotations Annotations to queue.
 *
 * @return {void}
 */
const fillAnnotationQueue = annotations => {
	annotationQueue = annotations.map( annotation => ( {
		blockClientId: annotation.block,
		source: ANNOTATION_SOURCE,
		richTextIdentifier: annotation.richTextIdentifier,
		range: {
			start: annotation.startOffset,
			end: annotation.endOffset,
		},
	} ) )

	scheduleAnnotationQueueApplication()
}

/**
 * Removes annotations from a single block.
 *
 * @param {string} blockClientId Block client ID.
 *
 * @return {void}
 */
const removeAnnotationsFromBlock = blockClientId => {
	const annotationsInBlock = select( 'core/annotations' )
		.__experimentalGetAnnotations()
		.filter( annotation => annotation.blockClientId === blockClientId && annotation.source === ANNOTATION_SOURCE )

	annotationsInBlock.forEach( annotation => {
		dispatch( 'core/annotations' ).__experimentalRemoveAnnotation( annotation.id )
	} )
}

/**
 * Applies Yoast marks as annotations on Stackable text blocks.
 *
 * @param {Array} marks Yoast mark objects.
 *
 * @return {void}
 */
const applyStackableAnnotations = marks => {
	if ( ! isAnnotationAvailable() || ! marks?.length ) {
		return
	}

	const fieldsToMark = getFieldsToMark( marks )
	const blocks = getEditorBlocks()
	const annotations = getAnnotationsForStackableBlocks( blocks, marks, fieldsToMark )

	if ( annotations.length > 0 ) {
		fillAnnotationQueue( annotations )
	}
}

/**
 * Reapplies annotations for the currently selected Stackable block.
 *
 * @return {void}
 */
const reapplyAnnotationsForSelectedStackableBlock = () => {
	if ( ! isAnnotationAvailable() || ! isYoastSeoAvailable() ) {
		return
	}

	const block = select( 'core/block-editor' ).getSelectedBlock()
	const activeMarkerId = select( 'yoast-seo/editor' ).getActiveMarker()

	if ( ! block || ! activeMarkerId || ! STACKABLE_ANNOTATABLE_BLOCKS[ block.name ] ) {
		return
	}

	if ( block.clientId === previousSelectedBlockId && activeMarkerId === previousActiveMarkerId ) {
		return
	}

	previousSelectedBlockId = block.clientId
	previousActiveMarkerId = activeMarkerId

	const activeMarker = select( 'yoast-seo/editor' ).getResultById( activeMarkerId )
	if ( typeof activeMarker === 'undefined' ) {
		return
	}

	removeAnnotationsFromBlock( block.clientId )

	const fieldsToMark = getFieldsToMark( activeMarker.marks )
	if ( ! shouldAnnotateBlock( block, fieldsToMark ) ) {
		return
	}

	const annotations = getAnnotationsForStackableBlock( block, activeMarker.marks )
	if ( annotations.length > 0 ) {
		fillAnnotationQueue( annotations )
	}
}

/**
 * Initializes Yoast SEO highlighting compatibility for Stackable text blocks.
 *
 * @return {void}
 */
const initYoastSeoCompatibility = () => {
	if ( ! isAnnotationAvailable() ) {
		return
	}

	addAction( 'yoast.analysis.applyMarks', 'stackable/yoast-seo', applyStackableAnnotations )

	subscribe( reapplyAnnotationsForSelectedStackableBlock )
}

// Yoast SEO loads after Stackable, so wait until the editor is ready.
if ( typeof window !== 'undefined' ) {
	if ( isYoastSeoAvailable() ) {
		initYoastSeoCompatibility()
	} else {
		const unsubscribe = subscribe( () => {
			if ( isYoastSeoAvailable() ) {
				unsubscribe()
				initYoastSeoCompatibility()
			}
		} )
	}
}

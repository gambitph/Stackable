/**
 * Internal dependencies
 */
import {
	STACKABLE_ANNOTATABLE_BLOCKS,
	FIELD_TO_STACKABLE_BLOCKS,
	getFieldsToMark,
	shouldAnnotateBlock,
	getYoastmarkOffsets,
	calculateAnnotationsForTextFormat,
	createAnnotationsFromPositionBasedMarks,
	getAnnotationsForStackableBlock,
	getAnnotationsForStackableBlocks,
} from '../helpers'

/**
 * Creates a mock Yoast Mark object for search-based highlighting.
 *
 * @param {string} original Sentence without yoastmark tags.
 * @param {string} marked   Sentence with yoastmark tags.
 * @param {Array}  fieldsToMark Optional fields to mark.
 *
 * @return {Object} Mock mark.
 */
const createSearchMark = ( original, marked, fieldsToMark = [] ) => ( {
	getOriginal: () => original,
	getMarked: () => marked,
	getFieldsToMark: () => fieldsToMark,
	hasBlockPosition: () => false,
} )

/**
 * Creates a mock Yoast Mark object for position-based highlighting.
 *
 * @param {Object} options Mark options.
 * @param {string} options.clientId Block client ID.
 * @param {number} options.startOffsetBlock Block start offset.
 * @param {number} options.endOffsetBlock Block end offset.
 * @param {string} [options.original] Original text.
 * @param {string} [options.marked] Marked text.
 * @param {Array}  [options.fieldsToMark] Fields to mark.
 *
 * @return {Object} Mock mark.
 */
const createPositionMark = ( {
	clientId,
	startOffsetBlock,
	endOffsetBlock,
	original = '',
	marked = '',
	fieldsToMark = [],
} ) => ( {
	getOriginal: () => original,
	getMarked: () => marked,
	getFieldsToMark: () => fieldsToMark,
	hasBlockPosition: () => true,
	getBlockClientId: () => clientId,
	getBlockPositionStart: () => startOffsetBlock,
	getBlockPositionEnd: () => endOffsetBlock,
} )

const createBlock = ( name, clientId, attributes, innerBlocks = [] ) => ( {
	name,
	clientId,
	attributes,
	innerBlocks,
} )

describe( 'Yoast SEO compatibility helpers', () => {
	describe( 'STACKABLE_ANNOTATABLE_BLOCKS', () => {
		it( 'should map image blocks to figcaptionText', () => {
			expect( STACKABLE_ANNOTATABLE_BLOCKS[ 'stackable/image' ] ).toEqual( {
				attributeKey: 'figcaptionText',
				richTextIdentifier: 'text',
			} )
		} )

		it( 'should map text-based blocks to the text attribute', () => {
			[ 'stackable/text', 'stackable/heading', 'stackable/subtitle', 'stackable/icon-list-item', 'stackable/button' ].forEach( blockName => {
				expect( STACKABLE_ANNOTATABLE_BLOCKS[ blockName ] ).toEqual( {
					attributeKey: 'text',
					richTextIdentifier: 'text',
				} )
			} )
		} )
	} )

	describe( 'FIELD_TO_STACKABLE_BLOCKS', () => {
		it( 'should map field-specific assessments to the expected blocks', () => {
			expect( FIELD_TO_STACKABLE_BLOCKS.heading ).toEqual( [ 'stackable/heading', 'stackable/subtitle' ] )
			expect( FIELD_TO_STACKABLE_BLOCKS.paragraph ).toEqual( [ 'stackable/text', 'stackable/icon-list-item' ] )
			expect( FIELD_TO_STACKABLE_BLOCKS.caption ).toEqual( [ 'stackable/image' ] )
		} )

		it( 'should allow button blocks through when fieldsToMark is empty', () => {
			expect( shouldAnnotateBlock( { name: 'stackable/button' }, [] ) ).toBe( true )
			expect( FIELD_TO_STACKABLE_BLOCKS.paragraph ).not.toContain( 'stackable/button' )
		} )
	} )

	describe( 'getFieldsToMark', () => {
		it( 'should collect unique fields from marks', () => {
			const marks = [
				createSearchMark( 'a', 'a', [ 'heading' ] ),
				createSearchMark( 'b', 'b', [ 'paragraph', 'heading' ] ),
			]

			expect( getFieldsToMark( marks ) ).toEqual( [ 'heading', 'paragraph' ] )
		} )
	} )

	describe( 'shouldAnnotateBlock', () => {
		const textBlock = { name: 'stackable/text' }
		const headingBlock = { name: 'stackable/heading' }
		const imageBlock = { name: 'stackable/image' }
		const buttonBlock = { name: 'stackable/button' }

		it( 'should annotate all supported blocks when fieldsToMark is empty', () => {
			expect( shouldAnnotateBlock( textBlock, [] ) ).toBe( true )
			expect( shouldAnnotateBlock( headingBlock, [] ) ).toBe( true )
			expect( shouldAnnotateBlock( imageBlock, [] ) ).toBe( true )
			expect( shouldAnnotateBlock( buttonBlock, [] ) ).toBe( true )
		} )

		it( 'should only annotate heading blocks for heading fields', () => {
			expect( shouldAnnotateBlock( headingBlock, [ 'heading' ] ) ).toBe( true )
			expect( shouldAnnotateBlock( { name: 'stackable/subtitle' }, [ 'heading' ] ) ).toBe( true )
			expect( shouldAnnotateBlock( textBlock, [ 'heading' ] ) ).toBe( false )
		} )

		it( 'should only annotate paragraph blocks for paragraph fields', () => {
			expect( shouldAnnotateBlock( textBlock, [ 'paragraph' ] ) ).toBe( true )
			expect( shouldAnnotateBlock( { name: 'stackable/icon-list-item' }, [ 'paragraph' ] ) ).toBe( true )
			expect( shouldAnnotateBlock( headingBlock, [ 'paragraph' ] ) ).toBe( false )
		} )

		it( 'should only annotate image blocks for caption fields', () => {
			expect( shouldAnnotateBlock( imageBlock, [ 'caption' ] ) ).toBe( true )
			expect( shouldAnnotateBlock( textBlock, [ 'caption' ] ) ).toBe( false )
		} )

		it( 'should ignore unsupported blocks', () => {
			expect( shouldAnnotateBlock( { name: 'stackable/columns' }, [] ) ).toBe( false )
		} )
	} )

	describe( 'getYoastmarkOffsets', () => {
		it( 'should extract offsets from single-quoted yoastmark tags', () => {
			const marked = "Next, the field <yoastmark class='yoast-text-mark'>was selected</yoastmark> by the team."

			expect( getYoastmarkOffsets( marked ) ).toEqual( [ {
				startOffset: 16,
				endOffset: 28,
			} ] )
		} )
	} )

	describe( 'calculateAnnotationsForTextFormat', () => {
		it( 'should calculate offsets for passive voice style marks', () => {
			const sentence = 'Next, the field that you want to fetch data from was selected.'
			const mark = createSearchMark(
				sentence,
				"Next, the field that you want to fetch data from <yoastmark class='yoast-text-mark'>was selected</yoastmark>."
			)

			expect( calculateAnnotationsForTextFormat( sentence, mark ) ).toEqual( [ {
				startOffset: 49,
				endOffset: 61,
			} ] )
		} )

		it( 'should return an empty array when the sentence is not found', () => {
			const mark = createSearchMark(
				'Missing sentence.',
				"<yoastmark class='yoast-text-mark'>Missing sentence.</yoastmark>"
			)

			expect( calculateAnnotationsForTextFormat( 'Different content.', mark ) ).toEqual( [] )
		} )
	} )

	describe( 'createAnnotationsFromPositionBasedMarks', () => {
		it( 'should return annotations for matching client IDs', () => {
			const mark = createPositionMark( {
				clientId: 'block-1',
				startOffsetBlock: 0,
				endOffsetBlock: 11,
			} )

			expect(
				createAnnotationsFromPositionBasedMarks(
					mark,
					'block-1',
					'Giant panda',
					'Giant panda'
				)
			).toEqual( [ {
				startOffset: 0,
				endOffset: 11,
			} ] )
		} )

		it( 'should return an empty array for non-matching client IDs', () => {
			const mark = createPositionMark( {
				clientId: 'block-1',
				startOffsetBlock: 0,
				endOffsetBlock: 11,
			} )

			expect(
				createAnnotationsFromPositionBasedMarks(
					mark,
					'block-2',
					'Giant panda',
					'Giant panda'
				)
			).toEqual( [] )
		} )

		it( 'should adjust offsets when HTML tags are present', () => {
			const mark = createPositionMark( {
				clientId: 'block-1',
				startOffsetBlock: 16,
				endOffsetBlock: 33,
			} )

			expect(
				createAnnotationsFromPositionBasedMarks(
					mark,
					'block-1',
					'This is a giant <strong>panda</strong>.',
					'This is a giant panda.'
				)
			).toEqual( [ {
				startOffset: 16,
				endOffset: 25,
			} ] )
		} )
	} )

	describe( 'getAnnotationsForStackableBlock', () => {
		it( 'should annotate stackable/text blocks', () => {
			const sentence = 'The report was written by the team.'
			const block = createBlock( 'stackable/text', 'text-1', {
				text: sentence,
			} )
			const mark = createSearchMark(
				sentence,
				"The report <yoastmark class='yoast-text-mark'>was written by</yoastmark> the team."
			)

			expect( getAnnotationsForStackableBlock( block, [ mark ] ) ).toEqual( [ {
				startOffset: 11,
				endOffset: 25,
				block: 'text-1',
				richTextIdentifier: 'text',
			} ] )
		} )

		it( 'should annotate stackable/image figcaption text', () => {
			const caption = 'A photo was taken by the team.'
			const block = createBlock( 'stackable/image', 'image-1', {
				figcaptionText: caption,
			} )
			const mark = createSearchMark(
				caption,
				"A photo <yoastmark class='yoast-text-mark'>was taken by</yoastmark> the team."
			)

			expect( getAnnotationsForStackableBlock( block, [ mark ] ) ).toEqual( [ {
				startOffset: 8,
				endOffset: 20,
				block: 'image-1',
				richTextIdentifier: 'text',
			} ] )
		} )

		it( 'should annotate stackable/button text', () => {
			const buttonText = 'Click here to get started.'
			const block = createBlock( 'stackable/button', 'button-1', {
				text: buttonText,
			} )
			const mark = createSearchMark(
				buttonText,
				"Click <yoastmark class='yoast-text-mark'>here</yoastmark> to get started."
			)

			expect( getAnnotationsForStackableBlock( block, [ mark ] ) ).toEqual( [ {
				startOffset: 6,
				endOffset: 10,
				block: 'button-1',
				richTextIdentifier: 'text',
			} ] )
		} )
	} )

	describe( 'getAnnotationsForStackableBlocks', () => {
		it( 'should recurse into inner blocks', () => {
			const sentence = 'The report was written by the team.'
			const innerBlock = createBlock( 'stackable/text', 'inner-text-1', {
				text: sentence,
			} )
			const blocks = [
				createBlock( 'stackable/columns', 'columns-1', {}, [ innerBlock ] ),
			]
			const mark = createSearchMark(
				sentence,
				"The report <yoastmark class='yoast-text-mark'>was written by</yoastmark> the team."
			)

			expect( getAnnotationsForStackableBlocks( blocks, [ mark ], [] ) ).toEqual( [ {
				startOffset: 11,
				endOffset: 25,
				block: 'inner-text-1',
				richTextIdentifier: 'text',
			} ] )
		} )

		it( 'should respect fieldsToMark when filtering blocks', () => {
			const textBlock = createBlock( 'stackable/text', 'text-1', {
				text: 'Paragraph content.',
			} )
			const headingBlock = createBlock( 'stackable/heading', 'heading-1', {
				text: 'Heading content.',
			} )
			const textMark = createSearchMark(
				'Paragraph content.',
				"<yoastmark class='yoast-text-mark'>Paragraph content.</yoastmark>",
				[ 'paragraph' ]
			)
			const headingMark = createSearchMark(
				'Heading content.',
				"<yoastmark class='yoast-text-mark'>Heading content.</yoastmark>",
				[ 'heading' ]
			)

			const paragraphAnnotations = getAnnotationsForStackableBlocks(
				[ textBlock, headingBlock ],
				[ textMark ],
				[ 'paragraph' ]
			)
			const headingAnnotations = getAnnotationsForStackableBlocks(
				[ textBlock, headingBlock ],
				[ headingMark ],
				[ 'heading' ]
			)

			expect( paragraphAnnotations ).toHaveLength( 1 )
			expect( paragraphAnnotations[ 0 ].block ).toBe( 'text-1' )

			expect( headingAnnotations ).toHaveLength( 1 )
			expect( headingAnnotations[ 0 ].block ).toBe( 'heading-1' )
		} )
	} )
} )

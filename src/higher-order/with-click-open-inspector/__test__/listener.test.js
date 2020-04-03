/**
 * Internal dependencies
 */
import { getBlockName } from '../listener'

describe( 'Listener', () => {
	describe( 'getBlockName function', () => {
		test( 'should return blank if not Stackable block', () => {
			const el = document.createElement( 'div' )
			el.innerHTML = (
				'<div class="wp-block block-editor-block-list__block" data-type="core/paragraph" tabindex="0" aria-label="Block: Paragraph">' +
				'	<p class="rich-text block-editor-rich-text__editable wp-block-paragraph" aria-label="Paragraph block" contenteditable="true">This is a test.</p>' +
				'</div>'
			)
			expect( getBlockName( el.querySelector( 'p' ) ) ).toBe( '' )
		} )

		test( 'should return Stackable block name', () => {
			const el = document.createElement( 'div' )
			el.innerHTML = (
				'<div class="wp-block block-editor-block-list__block" data-type="ugb/blockName" tabindex="0" aria-label="Block: Paragraph">' +
				'	<p class="rich-text block-editor-rich-text__editable wp-block-paragraph" aria-label="Paragraph block" contenteditable="true">This is a test.</p>' +
				'</div>'
			)
			expect( getBlockName( el.querySelector( 'p' ) ) ).toBe( 'blockName' )
		} )
	} )

	describe( 'getBlockName function <= v5.3 support', () => {
		test( 'should return blank if not Stackable block', () => {
			const el = document.createElement( 'div' )
			el.innerHTML = (
				'<div class="block-editor-block-list__block" data-type="core/paragraph" tabindex="0">' +
				'	<div class="block-editor-block-list__block-edit" aria-label="Block: Paragraph">' +
				'		<p contenteditable="true">This is a test.</p>' +
				'	</div>' +
				'</div>'
			)
			expect( getBlockName( el.querySelector( 'p' ) ) ).toBe( '' )
		} )

		test( 'should return Stackable block name', () => {
			const el = document.createElement( 'div' )
			el.innerHTML = (
				'<div class="block-editor-block-list__block" data-type="ugb/blockName" tabindex="0">' +
				'	<div class="block-editor-block-list__block-edit" aria-label="Block: Paragraph">' +
				'		<p contenteditable="true">This is a test.</p>' +
				'	</div>' +
				'</div>'
			)
			expect( getBlockName( el.querySelector( 'p' ) ) ).toBe( 'blockName' )
		} )
	} )
} )

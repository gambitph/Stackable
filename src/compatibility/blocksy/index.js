import { addFilter } from '@wordpress/hooks'

/**
 * This filter has the following parameters:
 * 1. decls - The current css declarations.
 * 2. scheme - The current color scheme.
 * 3. mode - The current mode.
 * 4. theme - The current theme.
 */
addFilter( 'stackable.global-settings.global-color-schemes.add-theme-compatibility', 'stackable/global-color-schemes.theme-compatibility.blocksy', decls => {
	/**
	 * This is WIP. Blocksy is not supported yet.
	 */

	/*
	if ( theme === 'stk--is-blocksy-theme' ) {
		let buttonSelector = ''
	 	const backgroundProperty = camelToKebab( 'buttonBackgroundColor' )
	 	const textProperty = camelToKebab( 'buttonTextColor' )

	 	switch ( mode ) {
	 		case 'background':
	 			buttonSelector = [
	 				' > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])',
	 				' > :where(.stk-inner-blocks) > :where(div) > :where(div) > :where([data-type="stackable/button-group"]) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])',
	 			].join( ',' )
	 			break
	 		case 'container':
	 			buttonSelector = ' > :where(div) > :where(div) > :where([data-type="stackable/button-group"]) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])'
	 			break
	 		default:
	 			buttonSelector = ' :where([data-type="stackable/button-group"]) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])'
	 	}

	 	const _decls = {
	 		desktop: [],
	 		desktopParentHover: [],
	 	}

	 	Object.keys( _decls ).forEach( state => {
	 		const bgValue = getInheritedValue( scheme.buttonBackgroundColor, state, mode )
	 		decls[ state ].push( `${ buttonSelector }{${ backgroundProperty }: ${ bgValue };}` )

	 		const textValue = getInheritedValue( scheme.buttonTextColor, state, mode )
	 		decls[ state ].push( `${ buttonSelector }{${ textProperty }: ${ textValue };}` )
	 	} )
	}
	*/

	return decls
} )


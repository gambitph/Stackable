/**
 * External dependencies
 */
import { fetchSettings } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import { addFilter } from '@wordpress/hooks'

// Adds a body class for block style inheritance
const ThemeBlockStyleInheritanceClass = () => {
	const [ disableBlockStyleInheritance, setDisableBlockStyleInheritance ] = useState( true )
	const editorEl = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	}, [] )

	useEffect( () => {
		fetchSettings().then( response => {
			const isDisabled = response.stackable_disable_block_style_inheritance
			setDisableBlockStyleInheritance( isDisabled )

			if ( ! isDisabled ) {
				addFilter( 'stackable.global-styles.classnames', `stackable/global-settings.block-style-inheritance`, classnames => {
					classnames.push( 'stk-has-block-style-inheritance' )
					return classnames
				} )
			}
		} )
	}, [] )

	// Update the editor class
	useEffect( () => {
		if ( editorEl ) {
			// Add block style inheritance class
			if ( ! disableBlockStyleInheritance && editorEl.classList.contains( `stk-has-block-style-inheritance` ) === false ) {
				editorEl.classList.add( `stk-has-block-style-inheritance` )
			}

			if ( disableBlockStyleInheritance ) {
				editorEl.classList.remove( `stk-has-block-style-inheritance` )
			}

			// At first load of the editor, the block style inheritance class is removed, so we have to re-add it.
			const mo = onClassChange( editorEl, () => {
				if ( ! disableBlockStyleInheritance && editorEl.classList.contains( `stk-has-block-style-inheritance` ) === false ) {
					editorEl.classList.add( `stk-has-block-style-inheritance` )
				}

				if ( disableBlockStyleInheritance ) {
					editorEl.classList.remove( `stk-has-block-style-inheritance` )
				}
			} )

			return () => mo.disconnect()
		}
	}, [ editorEl, disableBlockStyleInheritance ] )

	return null
}

registerPlugin( 'stackable-theme-block-style-inheritance-class', {
	render: ThemeBlockStyleInheritanceClass,
} )

// Listener when a class is changed on an element.
const onClassChange = ( node, callback ) => {
	let lastClassString = node.classList.toString()

	const mutationObserver = new MutationObserver( mutationList => {
		for ( const item of mutationList ) {
			if ( item.attributeName === 'class' ) {
				const classString = node.classList.toString()
				if ( classString !== lastClassString ) {
					callback( mutationObserver )
					lastClassString = classString
					break
				}
			}
	  }
	} )

	mutationObserver.observe( node, { attributes: true } )

	return mutationObserver
}

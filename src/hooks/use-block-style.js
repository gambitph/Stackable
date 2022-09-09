import { find } from 'lodash'
import TokenList from '@wordpress/token-list'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useBlockAttributesContext } from './use-block-attributes-context'

// Keeps a list of all blockStyles encountered.
const blockStyles = {}

export const useBlockStyle = styles => {
	const { name: blockName } = useBlockEditContext()
	const className = useBlockAttributesContext( attributes => attributes.className )

	// Keep note of all block styles defined for all blocks. This is used by the
	// getDefinedBlockStyles so other functions can check what block styles are
	// defined.
	blockStyles[ blockName ] = styles

	if ( ! className ) {
		return 'default'
	}

	for ( const style of new TokenList( className ).values() ) {
		if ( style.indexOf( 'is-style-' ) === -1 ) {
			continue
		}

		const potentialStyleName = style.substring( 9 )
		const activeStyle = find( styles, { name: potentialStyleName } )
		if ( activeStyle ) {
			return activeStyle.name
		}
	}

	const currentStyle = find( styles, 'isDefault' )
	return currentStyle?.name || 'default'
}

export const getBlockStyle = ( styles, className ) => {
	for ( const style of new TokenList( className ).values() ) {
		if ( style.indexOf( 'is-style-' ) === -1 ) {
			continue
		}

		const potentialStyleName = style.substring( 9 )
		const activeStyle = find( styles, { name: potentialStyleName } )
		if ( activeStyle ) {
			return activeStyle
		}
	}

	return find( styles, 'isDefault' )
}

export const getDefinedBlockStyles = blockName => {
	return blockStyles[ blockName ] || []
}

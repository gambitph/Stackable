import { find } from 'lodash'
import TokenList from '@wordpress/token-list'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { useBlockAttributes } from './use-block-attributes'

export const useBlockStyle = () => {
	const { clientId, name: blockName } = useBlockEditContext()
	const { className } = useBlockAttributes( clientId )

	const { currentStyle } = useSelect( select => {
		const { getBlockStyles } = select( 'core/blocks' )
		const styles = getBlockStyles( blockName )
		let currentStyle = ''

		for ( const style of new TokenList( className ).values() ) {
			if ( style.indexOf( 'is-style-' ) === -1 ) {
				continue
			}

			const potentialStyleName = style.substring( 9 )
			const activeStyle = find( styles, { name: potentialStyleName } )
			if ( activeStyle ) {
				currentStyle = activeStyle
				break
			}
		}

		if ( ! currentStyle ) {
			currentStyle = find( styles, 'isDefault' )
		}

		return { currentStyle }
	}, [ blockName, className ] )

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
			return activeStyle.name
		}
	}

	return find( styles, 'isDefault' )?.name || 'default'
}

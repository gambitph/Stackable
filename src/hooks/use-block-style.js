import { find } from 'lodash'
import TokenList from '@wordpress/token-list'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'
import { useBlockAttributes } from './use-block-attributes'

export const useBlockStyle = styles => {
	const { clientId } = useBlockEditContext()
	const { className } = useBlockAttributes( clientId )

	const currentStyle = useMemo( () => {
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

		return currentStyle
	}, [ className, styles ] )

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

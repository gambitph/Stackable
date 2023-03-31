/**
 * WordPress dependencies
 */
import { useSelect, dispatch } from '@wordpress/data'
import { useEffect } from '@wordpress/element'
import { usePrevious } from '@wordpress/compose'

export const ContentAlign = () => {
	const {
		hasStkAlign, align, innerBlockContentAlign, clientId,
	} = useSelect( select => {
		const clientId = select( 'core/block-editor' ).getSelectedBlockClientId()
		const block = select( 'core/block-editor' ).getBlock( clientId )
		const blockName = block?.name || ''
		return {
			clientId,
			hasStkAlign: blockName.startsWith( 'stackable/' ) && select( 'core/blocks' ).getBlockType( blockName )?.supports?.stkAlign,
			align: block?.attributes?.align,
			innerBlockContentAlign: block?.attributes?.innerBlockContentAlign,
		}
	}, [] )

	const previousClientId = usePrevious( clientId )

	useEffect( () => {
		if ( hasStkAlign && align !== innerBlockContentAlign && previousClientId === clientId ) {
			let newContentAlign
			switch ( align ) {
				case 'center':
					newContentAlign = ''
					break
				case 'wide':
					newContentAlign = 'alignwide'
					break
				case 'full':
					newContentAlign = 'alignfull'
					break
				case '':
				case undefined:
					newContentAlign = ''
					break
				default: break
			}

			if ( typeof newContentAlign !== 'undefined' ) {
				dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { innerBlockContentAlign: newContentAlign } ) // eslint-disable-line stackable/no-update-block-attributes
			}
		}
	}, [ align ] )

	return null
}


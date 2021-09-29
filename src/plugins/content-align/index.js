/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data'
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

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	useEffect( () => {
		if ( hasStkAlign && align && align !== innerBlockContentAlign && previousClientId === clientId ) {
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
				default: break
			}

			if ( newContentAlign ) {
				updateBlockAttributes( clientId, { innerBlockContentAlign: newContentAlign } )
			}
		}
	}, [ align ] )

	return null
}


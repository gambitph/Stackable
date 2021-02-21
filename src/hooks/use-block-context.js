import { useSelect } from '@wordpress/data'
import {
	first, last, indexOf, nth,
} from 'lodash'

const useBlockContext = ( { clientId } ) => {
	const blockInfo = useSelect(
		select => {
			const { getBlock, getBlockParents } = select( 'core/block-editor' )
			const block = getBlock( clientId )
			const parentClientId = last( getBlockParents( clientId ) )
			const parent = parentClientId ? getBlock( parentClientId ) : null
			const index = indexOf( parent?.innerBlocks, getBlock( clientId ) )
			const isLastBlock = last( parent?.innerBlocks )?.clientId === clientId
			return {
				blockIndex: index,
				parentBlock: parent,
				isFirstBlock: first( parent?.innerBlocks )?.clientId === clientId,
				isLastBlock,
				isOnlyBlock: ! parent || parent?.innerBlocks?.length <= 1,
				adjacentBlock: nth( parent?.innerBlocks, ! isLastBlock ? index + 1 : index - 1 ),
				adjacentBlockIndex: ! isLastBlock ? index + 1 : index - 1,
				adjacentBlocks: parent?.innerBlocks || [],
				hasInnerBlocks: !! block?.innerBlocks?.length,
			}
		},
		[ clientId ]
	)

	return blockInfo
}

export default useBlockContext

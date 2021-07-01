import { useSelect } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	first, last, indexOf, nth,
} from 'lodash'

const useBlockContext = ( blockClientId = null ) => {
	// If nothing is provided, use the current block.
	const blockProps = useBlockEditContext()
	const clientId = blockClientId || blockProps.clientId

	const blockInfo = useSelect(
		select => {
			const { getBlock, getBlockParents } = select( 'core/block-editor' )
			const block = getBlock( clientId )
			const parentClientId = last( getBlockParents( clientId ) )

			const hasParent = parentClientId && parentClientId !== clientId
			if ( ! hasParent ) {
				return {
					numInnerBlocks: block?.innerBlocks?.length,
					hasInnerBlocks: !! block?.innerBlocks?.length,
				}
			}

			const parent = hasParent ? getBlock( parentClientId ) : null
			const index = hasParent ? indexOf( parent?.innerBlocks, getBlock( clientId ) ) : -1
			const isLastBlock = hasParent ? last( parent?.innerBlocks )?.clientId === clientId : false
			return {
				blockIndex: index,
				parentBlock: parent,
				isFirstBlock: hasParent ? first( parent?.innerBlocks )?.clientId === clientId : false,
				isLastBlock,
				isOnlyBlock: hasParent ? ( parent?.innerBlocks?.length <= 1 ) : false,
				adjacentBlock: hasParent ? nth( parent?.innerBlocks, ! isLastBlock ? index + 1 : index - 1 ) : null,
				adjacentBlockIndex: hasParent ? ( ! isLastBlock ? index + 1 : index - 1 ) : -1,
				adjacentBlocks: parent?.innerBlocks || [],
				numInnerBlocks: block?.innerBlocks?.length,
				hasInnerBlocks: !! block?.innerBlocks?.length,
			}
		},
		[ clientId ]
	)

	return blockInfo
}

export default useBlockContext

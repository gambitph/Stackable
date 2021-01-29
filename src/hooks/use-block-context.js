import { useSelect } from '@wordpress/data'
import {
	first, last, indexOf, nth,
} from 'lodash'

const useBlockContext = props => {
	const blockInfo = useSelect(
		select => {
			const { getBlock, getBlockParents } = select( 'core/block-editor' )
			const block = getBlock( props.clientId )
			const parentClientId = last( getBlockParents( props.clientId ) )
			const parent = parentClientId ? getBlock( parentClientId ) : null
			const index = indexOf( parent?.innerBlocks, getBlock( props.clientId ) )
			const isLastBlock = last( parent?.innerBlocks )?.clientId === props.clientId
			// getAdjacentBlockClientId
			return {
				parentBlock: parent,
				isFirstBlock: first( parent?.innerBlocks )?.clientId === props.clientId,
				isLastBlock,
				isOnlyBlock: ! parent || parent?.innerBlocks?.length <= 1,
				adjacentBlock: nth( parent?.innerBlocks, ! isLastBlock ? index + 1 : index - 1 ),
				adjacentBlocks: parent?.innerBlocks || [],
				hasInnerBlocks: !! block?.innerBlocks?.length,
			}
		},
		[ props.clientId ]
	)

	return blockInfo
}

export default useBlockContext

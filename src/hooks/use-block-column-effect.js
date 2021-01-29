import { useEffect } from '@wordpress/element'
import useBlockContext from './use-block-context'

const useBlockColumnEffect = props => {
	const {
		isFirstBlock, isLastBlock,
	} = useBlockContext( props )

	// Quietly update the first block attribute.
	useEffect( () => {
		props.attributes.isFirstBlock = isFirstBlock
	}, [ isFirstBlock ] )

	// Quietly update the last block attribute.
	useEffect( () => {
		props.attributes.isLastBlock = isLastBlock
	}, [ isLastBlock ] )
}

export default useBlockColumnEffect

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const useMarginBottom = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const onChangeDesktop = useCallback(
		value => updateBlockAttributes( clientId, { blockMarginBottom: value } )
	)
	const onChangeTablet = useCallback(
		value => updateBlockAttributes( clientId, { blockMarginBottomTablet: value } )
	)
	const onChangeMobile = useCallback(
		value => updateBlockAttributes( clientId, { blockMarginBottomMobile: value } )
	)

	return {
		setMarginBottom: {
			onChangeDesktop,
			onChangeTablet,
			onChangeMobile,
		},
	}
}

export default useMarginBottom

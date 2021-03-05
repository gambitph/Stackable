/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useBlockContext } from '~stackable/hooks'

const useColumn = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const { adjacentBlocks } = useBlockContext( { clientId } )

	const onChangeDesktop = useCallback(
		widths => {
			widths.forEach( ( width, i ) => {
				// TODO: When Gutenberg 10.1 comes out, update this to just one updateBlockAttributes call for all client Ids
				updateBlockAttributes( adjacentBlocks[ i ].clientId, { columnWidth: width } )
			} )
		},
		[ clientId, updateBlockAttributes ]
	)

	const onChangeTablet = useCallback(
		width => {
			updateBlockAttributes( clientId, { columnWidthTablet: width } )
		},
		[ clientId, updateBlockAttributes ]
	)

	const onChangeMobile = useCallback(
		width => {
			updateBlockAttributes( clientId, { columnWidthMobile: width } )
		},
		[ clientId, updateBlockAttributes ]
	)

	const onResetDesktop = useCallback(
		() => {
			adjacentBlocks.forEach( ( { clientId } ) => {
				updateBlockAttributes( clientId, { columnWidth: '' } )
			} )
		},
		[ clientId, updateBlockAttributes ]
	)

	return {
		setColumn: {
			onChangeDesktop,
			onChangeTablet,
			onChangeMobile,
			onResetDesktop,
		},
	}
}

export default useColumn

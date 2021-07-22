import { last } from 'lodash'

/**
 * WordPress Dependencies
 */
import { useDispatch, select } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import classnames from 'classnames'

export const useColumn = () => {
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const onChangeDesktop = useCallback(
		widths => {
			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			if ( adjacentBlocks.length ) {
				widths.forEach( ( width, i ) => {
				// TODO: When Gutenberg 10.1 comes out, update this to just one updateBlockAttributes call for all client Ids
					updateBlockAttributes( adjacentBlocks[ i ].clientId, { columnWidth: width } )
				} )
			}
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
			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			adjacentBlocks.forEach( ( { clientId } ) => {
				updateBlockAttributes( clientId, { columnWidth: '' } )
			} )
		},
		[ clientId, updateBlockAttributes ]
	)

	return {
		onChangeDesktop,
		onChangeTablet,
		onChangeMobile,
		onResetDesktop,
	}
}

export const getColumnClasses = attributes => {
	const columnClasses = classnames( [
		'stk-column',
	], {
		'stk-is-first': attributes.isFirstBlock,
		'stk-is-last': attributes.isLastBlock,
	} )
	return [
		columnClasses,
		'stk-column-wrapper',
	]
}

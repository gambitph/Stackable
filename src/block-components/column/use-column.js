import { last } from 'lodash'

/**
 * WordPress Dependencies
 */
import { useDispatch, select } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import classnames from 'classnames'
import { getRowsFromColumns } from './util'

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
		( width, widths ) => {
			updateBlockAttributes( clientId, { columnWidthTablet: width } )

			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			if ( adjacentBlocks.length ) {
				const columnRows = getRowsFromColumns( widths )

				widths.forEach( ( width, i ) => {
					// TODO: When Gutenberg 10.1 comes out, update this to just one updateBlockAttributes call for all client Ids
					updateBlockAttributes( adjacentBlocks[ i ].clientId, {
						columnWidthTablet: widths[ i ],
						columnAdjacentCountTablet: columnRows.filter( n => n === columnRows[ i ] ).length,
					} )
				} )
			}
		},
		[ clientId, updateBlockAttributes ]
	)

	const onChangeMobile = useCallback(
		( width, widths ) => {
			updateBlockAttributes( clientId, { columnWidthMobile: width } )

			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			if ( adjacentBlocks.length ) {
				const columnRows = getRowsFromColumns( widths )

				widths.forEach( ( width, i ) => {
					// TODO: When Gutenberg 10.1 comes out, update this to just one updateBlockAttributes call for all client Ids
					updateBlockAttributes( adjacentBlocks[ i ].clientId, {
						columnWidthMobile: widths[ i ],
						columnAdjacentCountMobile: columnRows.filter( n => n === columnRows[ i ] ).length,
					} )
				} )
			}
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

export const getColumnClasses = () => {
	const columnClasses = classnames( [
		'stk-column',
	] )
	return [
		columnClasses,
		'stk-column-wrapper',
	]
}

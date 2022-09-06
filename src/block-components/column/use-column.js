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
				// Update multiple blocks.
				const [ clientIds, attributes ] = widths.reduce( ( results, width, i ) => {
					const clientId = adjacentBlocks[ i ].clientId
					results[ 0 ].push( clientId ),
					results[ 1 ][ clientId ] = {
						columnWidth: width,
						columnAdjacentCount: widths.length,
					}
					return results
				}, [ [], {} ] )

				updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
			}
		},
		[ clientId, updateBlockAttributes ]
	)

	const onChangeTablet = useCallback(
		( width, widths ) => {
			const clientIds = [ clientId ]
			const attributes = {
				[ clientId ]: { columnWidthTablet: width },
			}

			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			if ( adjacentBlocks.length ) {
				const columnRows = getRowsFromColumns( widths )

				// Update multiple blocks.
				widths.forEach( ( width, i ) => {
					const clientId = adjacentBlocks[ i ].clientId
					clientIds.push( clientId )
					attributes[ clientId ] = {
						columnWidthTablet: width,
						columnAdjacentCountTablet: columnRows.filter( n => n === columnRows[ i ] ).length,
					}
				} )
			}

			updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
		},
		[ clientId, updateBlockAttributes ]
	)

	const onChangeMobile = useCallback(
		( width, widths ) => {
			const clientIds = [ clientId ]
			const attributes = {
				[ clientId ]: { columnWidthMobile: width },
			}

			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			if ( adjacentBlocks.length ) {
				const columnRows = getRowsFromColumns( widths )

				// Update multiple blocks.
				widths.forEach( ( width, i ) => {
					const clientId = adjacentBlocks[ i ].clientId
					clientIds.push( clientId )
					attributes[ clientId ] = {
						columnWidthMobile: width,
						columnAdjacentCountMobile: columnRows.filter( n => n === columnRows[ i ] ).length,
					}
				} )
			}

			updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
		},
		[ clientId, updateBlockAttributes ]
	)

	const onResetDesktop = useCallback(
		() => {
			const parentClientId = last( select( 'core/block-editor' ).getBlockParents( clientId ) )
			const adjacentBlocks = select( 'core/block-editor' ).getBlock( parentClientId )?.innerBlocks || []

			if ( adjacentBlocks.length ) {
				const clientIds = adjacentBlocks.map( block => block.clientId )
				updateBlockAttributes( clientIds, { columnWidth: '' } ) // eslint-disable-line stackable/no-update-block-attributes
			}
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

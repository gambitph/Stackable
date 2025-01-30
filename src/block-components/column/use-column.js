/**
 * WordPress Dependencies
 */
import { dispatch, select } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import classnames from 'classnames'
import { getRowsFromColumns } from './util'

export const useColumn = () => {
	const { clientId } = useBlockEditContext()

	const onChangeDesktop = widths => {
		const parentBlockId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
		const parentBlock = select( 'core/block-editor' ).getBlock( parentBlockId )
		const adjacentBlocks = parentBlock?.innerBlocks || []

		if ( adjacentBlocks.length ) {
			// Update multiple blocks.
			const [ clientIds, attributes ] = widths.reduce( ( results, width, i ) => {
				const clientId = adjacentBlocks[ i ].clientId
				results[ 0 ].push( clientId ),
				results[ 1 ][ clientId ] = {
					columnWidth: width,
					columnAdjacentCount: widths.length,
					columnWrapDesktop: false,
				}
				return results
			}, [ [], {} ] )

			dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
		}
	}

	const onChangeDesktopWrap = ( width, widths ) => {
		const clientIds = [ clientId ]
		const attributes = {
			[ clientId ]: { columnWidth: width },
		}

		const parentBlockId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
		const parentBlock = select( 'core/block-editor' ).getBlock( parentBlockId )
		const adjacentBlocks = parentBlock?.innerBlocks || []

		if ( adjacentBlocks.length ) {
			const columnRows = getRowsFromColumns( widths )

			// Update multiple blocks.
			widths.forEach( ( width, i ) => {
				const clientId = adjacentBlocks[ i ].clientId
				clientIds.push( clientId )
				attributes[ clientId ] = {
					columnWidth: width,
					columnAdjacentCount: columnRows.filter( n => n === columnRows[ i ] ).length,
					columnWrapDesktop: true,
				}
			} )
		}

		dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
	}

	const onChangeTablet = ( width, widths ) => {
		const clientIds = [ clientId ]
		const attributes = {
			[ clientId ]: { columnWidthTablet: width },
		}

		const parentBlockId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
		const parentBlock = select( 'core/block-editor' ).getBlock( parentBlockId )
		const adjacentBlocks = parentBlock?.innerBlocks || []

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

		dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
	}

	const onChangeMobile = ( width, widths ) => {
		const clientIds = [ clientId ]
		const attributes = {
			[ clientId ]: { columnWidthMobile: width },
		}

		const parentBlockId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
		const parentBlock = select( 'core/block-editor' ).getBlock( parentBlockId )
		const adjacentBlocks = parentBlock?.innerBlocks || []

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

		dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
	}

	const onResetDesktop = () => {
		const parentBlockId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
		const parentBlock = select( 'core/block-editor' ).getBlock( parentBlockId )
		const adjacentBlocks = parentBlock?.innerBlocks || []

		if ( adjacentBlocks.length ) {
			const clientIds = adjacentBlocks.map( block => block.clientId )
			dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, { columnWidth: '' } ) // eslint-disable-line stackable/no-update-block-attributes
		}
	}

	const onResetTabletMobile = () => {
		const parentBlockId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
		const parentBlock = select( 'core/block-editor' ).getBlock( parentBlockId )
		const adjacentBlocks = parentBlock?.innerBlocks || []

		if ( adjacentBlocks.length ) {
			const clientIds = adjacentBlocks.map( block => block.clientId )
			dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, { columnWidthTablet: '', columnWidthMobile: '' } ) // eslint-disable-line stackable/no-update-block-attributes
		}
	}

	return {
		onChangeDesktop,
		onChangeDesktopWrap,
		onChangeTablet,
		onChangeMobile,
		onResetDesktop,
		onResetTabletMobile,
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

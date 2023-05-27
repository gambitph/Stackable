import { i18n } from 'stackable'
import {
	last, min, pick,
} from 'lodash'
import { useBlockContext } from '~stackable/hooks'
import { AdvancedRangeControl, Tooltip } from '~stackable/components'

import { __ } from '@wordpress/i18n'
import { Button, Dashicon } from '@wordpress/components'
import { getBlockFromExample } from '@wordpress/blocks'
import { useBlockEditContext } from '@wordpress/block-editor'
import { dispatch, select } from '@wordpress/data'
import { useLocalStorage } from '~stackable/util'

export const ColumnsControl = ( { sliderMax = 6 } ) => {
	const { clientId } = useBlockEditContext()
	const {
		numInnerBlocks, innerBlocks,
	} = useBlockContext()
	const [ isDuplicate, setIsDuplicate ] = useLocalStorage( 'stk__columns_new_duplicate', false )
	const [ localNumInnerBlocks, setLocalNumInnerBlocks ] = useLocalStorage( 'stk__columns_num_inner_blocks' )
	const [ localInnerBlocks, setLocalInnerBlocks ] = useLocalStorage( 'stk__columns_inner_blocks' )

	const setColumns = numColumns => {
		const { insertBlock, removeBlocks } = dispatch( 'core/block-editor' )

		// Remove the columns.
		if ( numColumns < numInnerBlocks ) {
			const columnClientIds = innerBlocks.slice( numColumns ).map( ( { clientId } ) => clientId )
			removeBlocks( columnClientIds, false )

			// backspacing sets numInnerBlocks to 0 and removes all columns
			// this saves the deleted columns which can be retrieved later
			setLocalNumInnerBlocks( numInnerBlocks )
			setLocalInnerBlocks( innerBlocks )

		// Add a blank column.
		} else if ( numColumns > numInnerBlocks && ! isDuplicate ) {
			let numToAdd = numColumns - numInnerBlocks
			let index = numInnerBlocks

			// gets the deleted columns from memory
			if ( localNumInnerBlocks > 0 && numInnerBlocks === 0 ) {
				// adjust the number of columns to add and the index to which the column will be inserted
				numToAdd = numColumns - localNumInnerBlocks
				index = localNumInnerBlocks

				// Retrieve columns based on the value of numColumns:
				// - If numColumns is greater than the number of saved columns,
				//   retrieve all saved columns.
				// - Otherwise, if there are enough saved columns available,
				//   retrieve only the first numColumns columns.
				const minimum = min( [ numColumns, localNumInnerBlocks ] )
				for ( let i = 0; i < minimum; i++ ) {
					insertBlock( localInnerBlocks[ i ], i + 1, clientId, false )
				}
			}

			// add more empty columns if necessary
			for ( let i = 0; i < numToAdd; i++ ) {
				const block = getBlockFromExample( 'stackable/column', {} )
				insertBlock( block, index + i + 1, clientId, false )
			}

		// Duplicate the last column.
		} else if ( numColumns > numInnerBlocks ) {
			let numToAdd = numColumns - numInnerBlocks
			let index = numInnerBlocks

			// This is not guaranteed to have the latest attributes and values
			let lastColumnBlock = last( innerBlocks )

			if ( localNumInnerBlocks > 0 && numInnerBlocks === 0 ) {
				numToAdd = numColumns - localNumInnerBlocks
				index = localNumInnerBlocks

				// retrieve the last column of the saved columns
				lastColumnBlock = last( localInnerBlocks )

				const minimum = min( [ numColumns, localNumInnerBlocks ] )
				for ( let i = 0; i < minimum; i++ ) {
					insertBlock( localInnerBlocks[ i ], i + 1, clientId, false )
				}
			}

			// Retrieve block details to get the latest attributes and values,
			// If there's no block, then use a blank column.
			const newBlock = lastColumnBlock
				? select( 'core/block-editor' ).getBlock( lastColumnBlock.clientId )
				: {}

			for ( let i = 0; i < numToAdd; i++ ) {
				const block = getBlockFromExample( 'stackable/column', pick( newBlock, [ 'attributes', 'innerBlocks' ] ) )
				insertBlock( block, index + i + 1, clientId, false )
			}
		}
	}

	return (
		<AdvancedRangeControl
			label={ __( 'Columns', i18n ) }
			min={ 1 }
			max={ sliderMax }
			sliderMax={ sliderMax }
			placeholder="1"
			value={ numInnerBlocks }
			onChange={ setColumns }
			allowReset={ false }
			after={ (
				<ColumnButton
					isPressed={ isDuplicate }
					onClick={ () => setIsDuplicate( ! isDuplicate ) }
				/>
			) }
		/>
	)
}

const ColumnButton = props => {
	return (
		<Tooltip
			text={ __( 'When enabled, the last column will be cloned instead of adding a blank column.', i18n ) }
		>
			<Button
				className="stk-control-columns__settings-button"
				isSmall
				isTertiary
				isPressed={ props.isPressed }
				aria-label={ __( 'Settings', i18n ) }
				onClick={ props.onClick }
				icon={ <Dashicon icon="admin-page" /> }
			/>
		</Tooltip>
	)
}

ColumnButton.defaultProps = {
	isPressed: false,
	onClick: null,
}

import { i18n } from 'stackable'
import { last, pick } from 'lodash'
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

	const setColumns = numColumns => {
		const { insertBlock, removeBlocks } = dispatch( 'core/block-editor' )

		// Remove the columns.
		if ( numColumns < numInnerBlocks ) {
			const columnClientIds = innerBlocks.slice( numColumns ).map( ( { clientId } ) => clientId )
			removeBlocks( columnClientIds, false )

		// Add a blank column.
		} else if ( numColumns > numInnerBlocks && ! isDuplicate ) {
			const numToAdd = numColumns - numInnerBlocks
			for ( let i = 0; i < numToAdd; i++ ) {
				const block = getBlockFromExample( 'stackable/column', {} )
				insertBlock( block, numInnerBlocks + i + 1, clientId, false )
			}

		// Duplicate the last column.
		} else if ( numColumns > numInnerBlocks ) {
			// This is not guaranteed to have the latest attributes and values
			const lastColumnBlock = last( innerBlocks )
			// Retrieve block details to get the latest attributes and values
			const latestColumnBlockDetails = select( 'core/block-editor' ).getBlock( lastColumnBlock.clientId )
			const numToAdd = numColumns - numInnerBlocks
			for ( let i = 0; i < numToAdd; i++ ) {
				const block = getBlockFromExample( 'stackable/column', pick( latestColumnBlockDetails, [ 'attributes', 'innerBlocks' ] ) )
				insertBlock( block, numInnerBlocks + i + 1, clientId, false )
			}
		}
	}

	return (
		<AdvancedRangeControl
			label={ __( 'Columns', i18n ) }
			min={ 1 }
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

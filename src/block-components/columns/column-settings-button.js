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

const PASSTHRU = ( func, numColumns ) => func( numColumns )

export const ColumnsControl = props => {
	const {
		label,
		sliderMax = 6,
		rootClientId = null,
		onChangeCallback,
		customAttributes,
	} = props
	const { clientId: _clientId } = useBlockEditContext()
	const clientId = rootClientId || _clientId
	const {
		numInnerBlocks, innerBlocks,
	} = useBlockContext( rootClientId )
	const [ isDuplicate, setIsDuplicate ] = useLocalStorage( 'stk__columns_new_duplicate', false )

	const setColumns = numColumns => {
		const changeColumnsFunc = numColumns => {
			const { insertBlock, removeBlocks } = dispatch( 'core/block-editor' )

			// do nothing if input field is blank
			if ( numColumns === '' ) {

				// Remove the columns.
			} else if ( numColumns < numInnerBlocks ) {
				const columnClientIds = innerBlocks.slice( numColumns ).map( ( { clientId } ) => clientId )
				removeBlocks( columnClientIds, false )

				// Add a blank column.
			} else if ( numColumns > numInnerBlocks && ! isDuplicate ) {
				const numToAdd = numColumns - numInnerBlocks

				// add more empty columns if necessary
				for ( let i = 0; i < numToAdd; i++ ) {
					const block = getBlockFromExample( 'stackable/column', {
						attributes: { ...customAttributes },
					} )
					insertBlock( block, numInnerBlocks + i + 1, clientId, false )
				}

				// Duplicate the last column.
			} else if ( numColumns > numInnerBlocks ) {
				const numToAdd = numColumns - numInnerBlocks

				// This is not guaranteed to have the latest attributes and values
				const lastColumnBlock = last( innerBlocks )

				// Retrieve block details to get the latest attributes and values,
				// If there's no block, then use a blank column.
				const newBlock = lastColumnBlock
					? select( 'core/block-editor' ).getBlock( lastColumnBlock.clientId )
					: {}

				for ( let i = 0; i < numToAdd; i++ ) {
					const block = getBlockFromExample( 'stackable/column', pick( newBlock, [ 'attributes', 'innerBlocks' ] ) )
					insertBlock( block, numInnerBlocks + i + 1, clientId, false )
				}
			}
		}

		onChangeCallback( changeColumnsFunc, numColumns )
	}

	return (
		<AdvancedRangeControl
			label={ label }
			min={ 1 }
			sliderMax={ sliderMax }
			placeholder="1"
			value={ numInnerBlocks }
			onChange={ setColumns }
			allowReset={ false }
			after={ (
				<CloneButton
					isPressed={ isDuplicate }
					onClick={ () => setIsDuplicate( ! isDuplicate ) }
				/>
			) }
		/>
	)
}

export const CloneButton = props => {
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

ColumnsControl.defaultProps = {
	label: __( 'Columns', i18n ),
	rootClientId: null,
	onChangeCallback: PASSTHRU,
	customAttributes: {},
}

CloneButton.defaultProps = {
	isPressed: false,
	onClick: null,
}

import { i18n } from 'stackable'
import { last, pick } from 'lodash'
import { useBlockContext } from '~stackable/hooks'
import { AdvancedRangeControl, Tooltip } from '~stackable/components'

import { __ } from '@wordpress/i18n'
import { Button, Dashicon } from '@wordpress/components'
import { getBlockFromExample } from '@wordpress/blocks'
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { useLocalStorage } from '~stackable/util'

const PASSTHRU = ( func, numColumns ) => func( numColumns )

export const ColumnsControl = props => {
	const {
		label,
		sliderMax = 6,
		rootClientId = null,
		onChangeCallback,
		newColumnAttributes,
	} = props
	const { clientId: _clientId } = useBlockEditContext()
	const clientId = rootClientId || _clientId
	const {
		numInnerBlocks, innerBlocks,
	} = useBlockContext( rootClientId )
	const {
		multiClientIds, multiNumInnerBlocks, multiInnerBlocks, hasMultiSelectedBlocks,
	} = useSelect( select => {
		const multiClientIds = select( 'core/block-editor' ).getMultiSelectedBlockClientIds()
		const multiInnerBlocks = {}
		const multiNumInnerBlocks = {}

		multiClientIds.forEach( clientId => {
			const { numInnerBlocks, innerBlocks } = select( 'stackable/block-context' ).getBlockContext( clientId )
			multiInnerBlocks[ clientId ] = innerBlocks
			multiNumInnerBlocks[ clientId ] = numInnerBlocks
		} )

		return {
			multiClientIds,
			multiNumInnerBlocks,
			multiInnerBlocks,
			hasMultiSelectedBlocks: multiClientIds.length > 1,
		}
	} )
	const [ isDuplicate, setIsDuplicate ] = useLocalStorage( 'stk__columns_new_duplicate', false )

	const setColumns = numColumns => {
		const _changeColumnsFunc = ( _clientId, _numColumns, _numInnerBlocks, _innerBlocks ) => {
			const { insertBlock, removeBlocks } = dispatch( 'core/block-editor' )

			// do nothing if input field is blank
			if ( _numColumns === '' ) {

				// Remove the columns.
			} else if ( _numColumns < _numInnerBlocks ) {
				const columnClientIds = _innerBlocks.slice( numColumns ).map( ( { clientId } ) => clientId )
				removeBlocks( columnClientIds, false )

				// Add a blank column.
			} else if ( _numColumns > _numInnerBlocks && ! isDuplicate ) {
				const numToAdd = _numColumns - _numInnerBlocks

				// add more empty columns if necessary
				for ( let i = 0; i < numToAdd; i++ ) {
					const block = getBlockFromExample( 'stackable/column', {
						attributes: { ...newColumnAttributes },
					} )
					insertBlock( block, _numInnerBlocks + i + 1, _clientId, false )
				}

				// Duplicate the last column.
			} else if ( _numColumns > _numInnerBlocks ) {
				const numToAdd = _numColumns - _numInnerBlocks

				// This is not guaranteed to have the latest attributes and values
				const lastColumnBlock = last( _innerBlocks )

				// Retrieve block details to get the latest attributes and values,
				// If there's no block, then use a blank column.
				const newBlock = lastColumnBlock
					? select( 'core/block-editor' ).getBlock( lastColumnBlock.clientId )
					: {}

				for ( let i = 0; i < numToAdd; i++ ) {
					const block = getBlockFromExample( 'stackable/column', pick( newBlock, [ 'attributes', 'innerBlocks' ] ) )
					insertBlock( block, _numInnerBlocks + i + 1, _clientId, false )
				}
			}
		}

		const changeColumnsFunc = numColumns => {
			if ( hasMultiSelectedBlocks ) {
				multiClientIds.forEach( blockClientId =>
					_changeColumnsFunc( blockClientId, numColumns, multiNumInnerBlocks[ blockClientId ], multiInnerBlocks[ blockClientId ] ) )
			} else if ( ! hasMultiSelectedBlocks ) {
				_changeColumnsFunc( clientId, numColumns, numInnerBlocks, innerBlocks )
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
	newColumnAttributes: {},
}

CloneButton.defaultProps = {
	isPressed: false,
	onClick: null,
}

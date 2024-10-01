import { i18n } from 'stackable'
import { last, pick } from 'lodash'
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
	} = useSelect(
		select => {
			const { getBlock } = select( 'core/block-editor' )
			const { innerBlocks } = getBlock( clientId )
			return {
				innerBlocks,
				numInnerBlocks: innerBlocks.length,
			}
		},
		[ clientId ]
	)

	const {
		multiClientIds, multiNumInnerBlocks, multiInnerBlocks, hasMultiSelectedBlocks,
	} = useSelect( select => {
		const multiBlocks = select( 'core/block-editor' ).getMultiSelectedBlocks()
		let multiClientIds = []
		const multiInnerBlocks = {}
		const multiNumInnerBlocks = {}
		if ( multiBlocks.length && multiBlocks[ 0 ].name === 'stackable/tabs' ) {
			multiBlocks.forEach( block => {
				const tabContent = block.innerBlocks[ 0 ].name === 'stackable/tab-content' ? block.innerBlocks[ 0 ] : block.innerBlocks[ 1 ]
				multiClientIds.push( tabContent.clientId )
			} )
		} else {
			multiClientIds = multiBlocks.map( block => block.clientId )
		}

		multiClientIds.forEach( clientId => {
			const innerBlocks = select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
			const numInnerBlocks = innerBlocks.length
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
		const _changeColumnsFunc = ( _clientId, _numColumns, _numInnerBlocks, _innerBlocks, quietUpdate = false ) => {
			const { insertBlock, removeBlocks } = dispatch( 'core/block-editor' )

			// do nothing if input field is blank
			if ( _numColumns === '' ) {

				// Remove the columns.
			} else if ( _numColumns < _numInnerBlocks ) {
				const columnClientIds = _innerBlocks.slice( numColumns ).map( ( { clientId } ) => clientId )
				if ( quietUpdate ) {
					dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				}
				removeBlocks( columnClientIds, false )

				// Add a blank column.
			} else if ( _numColumns > _numInnerBlocks && ! isDuplicate ) {
				const numToAdd = _numColumns - _numInnerBlocks

				// add more empty columns if necessary
				for ( let i = 0; i < numToAdd; i++ ) {
					const block = getBlockFromExample( 'stackable/column', {
						attributes: { ...newColumnAttributes },
					} )
					if ( quietUpdate ) {
						dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
					}
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
					if ( quietUpdate ) {
						dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
					}
					insertBlock( block, _numInnerBlocks + i + 1, _clientId, false )
				}
			}
		}

		const changeColumnsFunc = numColumns => {
			if ( hasMultiSelectedBlocks ) {
				multiClientIds.forEach( ( blockClientId, index ) =>
					_changeColumnsFunc( blockClientId, numColumns, multiNumInnerBlocks[ blockClientId ], multiInnerBlocks[ blockClientId ], index !== 0 ? true : false ) )
			} else if ( ! hasMultiSelectedBlocks ) {
				_changeColumnsFunc( clientId, numColumns, numInnerBlocks, innerBlocks, false )
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

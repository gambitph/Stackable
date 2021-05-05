/**
 * External dependencies
 */
import { pick, last } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components'
import { getBlockFromExample } from '@wordpress/blocks'
import { select, dispatch } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useCallback } from '@wordpress/element'
import { plus } from '@wordpress/icons'
import { __ } from '@wordpress/i18n'

const ColumnInserter = () => {
	const { clientId: rootClientId } = useBlockEditContext()

	const onAppend = useCallback( () => {
		const {
			getBlock,
			__experimentalGetAllowedBlocks: getAllowedBlocks,
		} = select( 'core/block-editor' )

		const { innerBlocks } = getBlock( rootClientId )
		const lastBlock = last( innerBlocks )

		// Copy the last block
		const block = getBlockFromExample(
			lastBlock?.name || getAllowedBlocks( rootClientId )[ 0 ].name,
			pick( lastBlock || {}, [ 'attributes', 'innerBlocks' ] )
		)

		dispatch( 'core/block-editor' ).insertBlock( block, innerBlocks.length, rootClientId )
	}, [ rootClientId ] )

	return (
		<div className="block-editor-default-block-appender stk-column-appender">
			<Button
				onMouseDown={ onAppend }
				icon={ plus }
				label={ __( 'Add Column', i18n ) }
				tooltipPosition="bottom"
				className="block-editor-inserter__toggle"
			/>
		</div>
	)
}

export default ColumnInserter

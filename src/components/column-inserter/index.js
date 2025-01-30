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
import { plus } from '@wordpress/icons'
import { __ } from '@wordpress/i18n'

export const insertColumnBlock = ( rootClientId, blockName = '', attributes = {} ) => {
	const {
		getBlock,
		__experimentalGetAllowedBlocks: getAllowedBlocks,
	} = select( 'core/block-editor' )

	let block
	const { innerBlocks } = getBlock( rootClientId )

	// If block name is given, insert a blank block.
	if ( blockName ) {
		block = getBlockFromExample( blockName, attributes )

	// Else, copy the last block if it's available
	} else {
		const lastBlock = last( innerBlocks )
		block = getBlockFromExample(
			lastBlock?.name || getAllowedBlocks( rootClientId )[ 0 ].name,
			pick( lastBlock || {}, [ 'attributes', 'innerBlocks' ] )
		)
	}

	dispatch( 'core/block-editor' ).insertBlock( block, innerBlocks.length, rootClientId )
}

const ColumnInserter = ( { label } ) => {
	const { clientId } = useBlockEditContext()

	return (
		<div className="block-editor-default-block-appender stk-column-appender">
			<Button
				onMouseDown={ () => insertColumnBlock( clientId ) }
				icon={ plus }
				label={ label }
				tooltipPosition="bottom"
				className="block-editor-inserter__toggle"
			/>
		</div>
	)
}

ColumnInserter.defaultProps = {
	label: __( 'Add Column', i18n ),
}

export default ColumnInserter

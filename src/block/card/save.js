/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { select } from '@wordpress/data'
import classnames from 'classnames'
import { first, last } from 'lodash'
import {
	useSelect,
} from '@wordpress/data'

export default props => {
	// const {
	// 	isFirstBlock, isLastBlock,
	// } = useSelect(
	// select => {
	// console.log( 'save', props.clientId )
	// const { getBlock, getBlockParents } = select( 'core/block-editor' )
	// const parentClientId = first( getBlockParents( props.clientId ) )
	// const parent = parentClientId ? getBlock( parentClientId ) : null
	// const isFirstBlock = first( parent?.innerBlocks )?.clientId === props.clientId
	// const isLastBlock = last( parent?.innerBlocks )?.clientId === props.clientId

	// },
	// 	[ props.clientId ]
	// )

	const classNames = classnames( [
		'stk-card',
		'stk-block',
		'stk-column',
		`stk-${ props.attributes.uniqueId }`,
		'stk-container',
	], {
		'stk-is-first': props.attributes.isFirstBlock,
		'stk-is-last': props.attributes.isLastBlock,
	} )

	return (
		<div className={ classNames } data-id={ props.attributes.uniqueId }>
			<style>
				{ props.attributes.columnWidth ? `.stk-${ props.attributes.uniqueId } {
					flex: 1 1 ${ props.attributes.columnWidth }% !important;
					max-width: ${ props.attributes.columnWidth }% !important;
				}` : null }
			</style>
			<InnerBlocks.Content />
		</div>
	)
}

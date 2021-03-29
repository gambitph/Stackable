/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	MarginBottom,
	Style,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-card-group',
		rowClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	return <Fragment>

		<InspectorTabs />

		<Alignment.InspectorControls hasRowAlignment={ true } />
		<BlockDiv.InspectorControls />

		<BlockDiv className={ blockClassNames }>
			<Style styleFunc={ createStyles( VERSION ) } />
			<div className={ contentClassNames }>
				<InnerBlocks
					orientation="horizontal"
					allowedBlocks={ [ 'stackable/card' ] }
				/>
			</div>
			<MarginBottom />
		</BlockDiv>
	</Fragment>
}

export default Edit

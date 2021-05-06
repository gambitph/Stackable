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
	ColumnInserter,
	GroupPlaceholder,
	InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	MarginBottom,
	Style,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { useBlockContext } from '~stackable/hooks'

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()

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
		<Advanced.InspectorControls />
		<CustomCSS.InspectorControls mainBlockClass="stk-card-group" />
		<Responsive.InspectorControls />

		<BlockDiv className={ blockClassNames }>
			<Style styleFunc={ createStyles( VERSION ) } />
			<CustomCSS mainBlockClass="stk-card-group" />

			{ ! hasInnerBlocks && <GroupPlaceholder /> }
			<Fragment>
				<div className={ contentClassNames }>
					<InnerBlocks
						orientation="horizontal"
						allowedBlocks={ [ 'stackable/card' ] }
						renderAppender={ () => hasInnerBlocks ? <ColumnInserter /> : null }
					/>
				</div>
				{ hasInnerBlocks && <MarginBottom /> }
			</Fragment>
		</BlockDiv>
	</Fragment>
}

export default Edit

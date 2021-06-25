/**
 * Internal dependencies
 */
import { ButtonGroupStyles } from './style'

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
import { Fragment, useCallback } from '@wordpress/element'
import { useBlockContext } from '~stackable/hooks'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button' ]

const TEMPLATE = [
	[ 'stackable/button' ],
]

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-button-group',
		rowClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	const renderAppender = useCallback(
		() => hasInnerBlocks ? <ColumnInserter /> : null,
		[ hasInnerBlocks ]
	)

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-button-group" />
			<Responsive.InspectorControls />

			<BlockDiv className={ blockClassNames }>
				<ButtonGroupStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-button-group" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Fragment>
					<div className={ contentClassNames }>
						<InnerBlocks
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ renderAppender }
							template={ TEMPLATE }
							templateInsertUpdatesSelection={ true }
						/>
					</div>
					{ hasInnerBlocks && <MarginBottom /> }
				</Fragment>
			</BlockDiv>
		</Fragment>
	)
}

export default Edit

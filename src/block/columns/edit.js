/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
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
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment, useCallback } from '@wordpress/element'
import { useBlockContext, useBlockHoverClass } from '~stackable/hooks'
import { __ } from '@wordpress/i18n'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]
const TABS = [ 'block', 'advanced' ]

const Edit = props => {
	const {
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-columns',
		rowClass,
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	] )

	const renderAppender = useCallback(
		() => hasInnerBlocks ? <ColumnInserter label={ __( 'Add Column', i18n ) } /> : null,
		[ hasInnerBlocks ]
	)

	return (
		<Fragment>
			<InspectorTabs tabs={ TABS } />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockDiv className={ blockClassNames }>
				<BlockStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div className={ contentClassNames }>
						<InnerBlocks
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ renderAppender }
							template={ TEMPLATE }
							templateLock={ props.attributes.templateLock || false }
							templateInsertUpdatesSelection={ true }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</Fragment>
	)
}

export default Edit

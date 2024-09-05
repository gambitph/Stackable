/**
 * Internal dependencies
 */
import blockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks,
	ControlSeparator,
	GroupPlaceholder,
	InspectorLayoutControls,
	InspectorTabs,
	useBlockCssGenerator,
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
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	Columns,
} from '~stackable/block-components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { useQueryLoopInstanceId } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'
import { memo } from '@wordpress/element'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const { hasInnerBlocks } = useSelect(
		select => {
			const { getBlockOrder } = select( 'core/block-editor' )

			return {
				hasInnerBlocks: getBlockOrder( clientId ).length > 0,
			}
		},
		[ clientId ]
	)

	const blockClassNames = classnames( applyFilters( 'stackable.columns.edit.blockClassNames',
		[
			className,
			'stk-block-columns',
			rowClass,
			separatorClass,
			columnTooltipClass,
		], props ) )

	const instanceId = useQueryLoopInstanceId( props.attributes.uniqueId )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( props.attributes, 'column', instanceId ) )

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>

			<InspectorControls />
			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div
						className={ contentClassNames }
						data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							: props.attributes.contentAlign === 'alignwide' ? 'wide'
								: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
					>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							templateLock={ props.attributes.templateLock || false }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

// Load the polyfill for columns block :has() selector for Firefox
const userAgent = navigator?.userAgent
if ( userAgent && userAgent.indexOf( 'Firefox' ) !== -1 ) {
	addFilter( 'stackable.columns.edit.blockClassNames', 'stackable/columns-has-single-block-polyfill', ( classes, props ) => {
		const { numInnerBlocks } = useSelect(
			select => {
				const { getBlockOrder } = select( 'core/block-editor' )

				return {
					numInnerBlocks: getBlockOrder( props.clientId ).length,
				}
			},
			[ props.clientId ]
		)

		if ( numInnerBlocks === 1 ) {
			classes.push( 'stk-block-columns--has-single-block-polyfill' )
		}

		return classes
	} )
}

// Inspector controls for the block, it's important that we only pass only the
// props used by controls to prevent rerenders of all the inspector controls.
const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs />

			<Columns.InspectorControls />
			<InspectorLayoutControls>
				<ControlSeparator />
			</InspectorLayoutControls>
			<ContentAlign.InspectorControls />
			<Alignment.InspectorControls
				hasContainerSize={ true }
				containerSizePriority={ 1 }
				hasContainerHeight={ false }
				hasColumnJustify={ true }
				hasRowAlignment={ true }
			/>
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

/**
 * Internal dependencies
 */
import BlockStyles from './style'

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
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
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
import { useBlockContext } from '~stackable/hooks'
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

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const Edit = props => {
	const {
		className,
		clientId,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

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
	], getContentAlignmentClasses( props.attributes, instanceId ) )

	return (
		<>

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

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<BlockStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
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
	addFilter( 'stackable.columns.edit.blockClassNames', 'stackable/columns-has-single-block-polyfill', classes => {
		const { numInnerBlocks } = useBlockContext()

		if ( numInnerBlocks === 1 ) {
			classes.push( 'stk-block-columns--has-single-block-polyfill' )
		}

		return classes
	} )
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

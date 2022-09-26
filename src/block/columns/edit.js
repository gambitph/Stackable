/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice, version as VERSION,
} from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks,
	GroupPlaceholder,
	InspectorTabs,
	ProControlButton,
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
	useContentAlignmentClasses,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button' ]

const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	const {
		className,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-columns',
		rowClass,
		separatorClass,
		columnTooltipClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], useContentAlignmentClasses( props.attributes ) )

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Separator.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
			<ContentAlign.InspectorControls hasColumnCount={ true } />

			<BlockDiv
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<BlockStyles version={ VERSION } />
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
							template={ TEMPLATE }
							templateLock={ props.attributes.templateLock || false }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

addFilter( 'stackable.block-components.responsive.control', 'stackable/premium', output => {
	const { name } = useBlockEditContext()

	// Only do mobile column arrangement for the Columns block.
	if ( name !== 'stackable/columns' ) {
		return output
	}

	if ( showProNotice && ! isPro ) {
		return (
			<ProControlButton
				title={ __( 'Say Hello to More Responsive Options 👋', i18n ) }
				description={ __( 'Adjust the arrangement of your columns when collapsed on mobile. This feature is only available on Stackable Premium', i18n ) }
			/>
		)
	} else if ( isPro ) {
		return applyFilters( 'stackable.block.columns.column-arrangement', output )
	}

	return output
} )

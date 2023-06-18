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
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { useSetActiveTabContext } from '../tabs/with-active-tab'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const TEMPLATE = [
	[ 'stackable/column', {
		customAttributes: [ [ 'role', 'tabpanel' ] ],
	} ],
	[ 'stackable/column', {
		customAttributes: [ [ 'role', 'tabpanel' ] ],
	} ],
	[ 'stackable/column', {
		customAttributes: [ [ 'role', 'tabpanel' ] ],
	} ],
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
		context,
	} = props

	useGeneratedCss( props.attributes )

	const [ activeTab, , templateLock ] = useSetActiveTabContext()

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { innerBlocks, hasInnerBlocks } = useBlockContext()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-content',
		rowClass,
		separatorClass,
		columnTooltipClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( props.attributes ) )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<Columns.InspectorControls />
					<InspectorLayoutControls>
						<ControlSeparator />
					</InspectorLayoutControls>
					<ContentAlign.InspectorControls />
					<Alignment.InspectorControls hasColumnJustify={ true } hasRowAlignment={ true } />
					<BlockDiv.InspectorControls />
					<Separator.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-tab-content" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				// enableVariationPicker={ true }
			>
				<BlockStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-tab-content" />

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
							template={ props.attributes.templateLock ? undefined : TEMPLATE }
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							templateLock={ templateLock ? 'insert' : false }
						/>
					</div>
				</Separator>
				<style>
					{ innerBlocks?.map( ( { clientId }, index ) => {
						if ( context[ 'stackable/tabPanelEffect' ] === 'immediate' ) {
							if ( index !== activeTab - 1 ) {
								return `.stk-block-tabs [data-block="${ clientId }"] {
									visibility: hidden;
									z-index: 1 !important;
								}`
							}
						} else { // fade
							if ( index !== activeTab - 1 ) {
								return `.stk-block-tabs [data-block="${ clientId }"] {
									visibility: hidden;
									opacity: 0;
									z-index: 1 !important;
								}`
							}
							return `.stk-block-tabs [data-block="${ clientId }"] {
								opacity: 1;
							}`
						}
						return ''
					} ) }
				</style>
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

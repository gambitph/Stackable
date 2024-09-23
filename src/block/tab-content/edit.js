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
	GroupPlaceholder,
	InspectorTabs,
	AdvancedToggleControl,
	InspectorLayoutControls,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
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
	getContentAlignmentClasses,
} from '~stackable/block-components'
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
import { memo } from '@wordpress/element'
import { useSetActiveTabContext } from '../tabs/with-active-tab'
import {
	useSelect,
} from '@wordpress/data'


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
		context,
	} = props

	const [ activeTab, , templateLock ] = useSetActiveTabContext()

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()
    const { innerBlocks, hasInnerBlocks } = useSelect(
        select => {
            const innerBlocks = select( 'core/block-editor' ).getBlock( clientId ).innerBlocks
            return {
                innerBlocks: innerBlocks,
                hasInnerBlocks: innerBlocks.length > 0,
            }
        },
        [ clientId ]
    )

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
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }
				<CustomCSS mainBlockClass="stk-block-tab-content" />

				{/* { ! hasInnerBlocks && <GroupPlaceholder attributes={ TEMPLATE[0][1] } /> } */}
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
							templateLock={ false }
						/>
					</div>
				</Separator>
				<style>
					{ innerBlocks?.map( ( { clientId }, index ) => {
						if ( context[ 'stackable/tabPanelEffect' ] === 'immediate' ) {
							if ( index !== activeTab - 1 ) {
								return `.stk-block-tabs [data-block="${ clientId }"] {
									${ context[ 'stackable/equalTabHeight' ] ? 'visibility: hidden' : 'display:none' };
									z-index: 1 !important;
								}`
							}
						} else { // fade
							if ( index !== activeTab - 1 ) {
								return `.stk-block-tabs [data-block="${ clientId }"] {
									${ context[ 'stackable/equalTabHeight' ] ? 'visibility: hidden' : 'display:none' };
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

const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs />
			<Alignment.InspectorControls hasColumnJustify={ false } hasRowAlignment={ false } />
			<BlockDiv.InspectorControls sizeControlLayoutProps={ { hasContentVerticalAlign: false } } />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-tab-content" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
})

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

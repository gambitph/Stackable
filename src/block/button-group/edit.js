/**
 * Internal dependencies
 */
import blockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	GroupPlaceholder,
	InspectorTabs,
	InspectorLayoutControls,
	AdvancedSelectControl,
	AdvancedToggleControl,
	AlignButtonsControl,
	advancedToolbarControlControls,
	AdvancedToolbarControl,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
	MarginBottom,
	getRowClasses,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	FlexGapControls,
	Transform,
} from '~stackable/block-components'
import { useDeviceType } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import {
	AlignmentToolbar, BlockControls, InnerBlocks,
} from '@wordpress/block-editor'
import { sprintf, __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button', 'stackable/icon-button' ]

const TEMPLATE = [
	[ 'stackable/button' ],
]

const ALIGN_OPTIONS = advancedToolbarControlControls[ 'flex-horizontal' ].map( option => {
	return {
		...option,
		value: option.value === 'flex-start' ? 'left'
			: option.value === 'flex-end' ? 'right'
				: option.value,
	}
} )

const TOOLBAR_ALIGN_OPTIONS = ALIGN_OPTIONS.map( control => {
	return {
		align: control.value,
		icon: control.icon,
		title: control.title,
	}
} )

const ALIGNMENT_CONTROLS_DESKTOP = [
	{
		title: __( 'Horizontal', i18n ),
		value: '',
	},
	{
		title: __( 'Vertical', i18n ),
		value: 'vertical',
	},
]

const ALIGNMENT_CONTROLS_TABLET_MOBILE = [
	{
		title: __( 'Horizontal', i18n ),
		value: 'horizontal',
	},
	{
		title: __( 'Vertical', i18n ),
		value: 'vertical',
	},
]

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	const {
		collapseOn = '',
	} = attributes

	const deviceType = useDeviceType()
	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const { hasInnerBlocks } = useSelect( select => {
		const { getBlockOrder } = select( 'core/block-editor' )
		return {
			hasInnerBlocks: getBlockOrder( props.clientId ).length > 0,
		}
	}, [ props.clientId ] )

	const blockClassNames = classnames( [
		className,
		'stk-block-button-group',
		rowClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-button-group',
		{
			[ `stk--collapse-on-${ collapseOn }` ]: collapseOn,
		},
	] )

	let contentAlignControls = null
	if ( attributes.buttonAlign === '' ) {
		contentAlignControls = ALIGN_OPTIONS
	}
	if ( deviceType === 'Tablet' || deviceType === 'Mobile' ) {
		if ( attributes.buttonAlignTablet === 'horizontal' ) {
			contentAlignControls = ALIGN_OPTIONS
		} else if ( attributes.buttonAlignTablet === 'vertical' ) {
			contentAlignControls = null
		}
	}
	if ( deviceType === 'Mobile' ) {
		if ( attributes.buttonAlignMobile === 'horizontal' ) {
			contentAlignControls = ALIGN_OPTIONS
		} else if ( attributes.buttonAlignMobile === 'vertical' ) {
			contentAlignControls = null
		}
	}

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
			<InspectorControls
				contentAlign={ attributes.contentAlign }
				setAttributes={ setAttributes }
				contentAlignControls={ contentAlignControls }
				deviceType={ deviceType }
			/>

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }
				<CustomCSS mainBlockClass="stk-block-button-group" />

				{ ! hasInnerBlocks && <GroupPlaceholder blockName="stackable/button" /> }
				<div className={ contentClassNames }>
					<InnerBlocks
						orientation="horizontal"
						allowedBlocks={ ALLOWED_INNER_BLOCKS }
						template={ TEMPLATE }
						templateInsertUpdatesSelection={ true }
						renderAppender={ hasInnerBlocks ? undefined : false }
					/>
				</div>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<BlockDiv.InspectorControls />

			<BlockControls>
				<AlignmentToolbar
					value={ props.contentAlign }
					onChange={ contentAlign => props.setAttributes( { contentAlign } ) }
					alignmentControls={ TOOLBAR_ALIGN_OPTIONS }
				/>
			</BlockControls>
			<InspectorLayoutControls>
				<AlignButtonsControl
					label={ sprintf( __( '%s Alignment', i18n ), __( 'Content', i18n ) ) }
					attribute="contentAlign"
					responsive="all"
					controls={ props.contentAlignControls }
				/>
				<AdvancedToolbarControl
					label={ sprintf( __( '%s Alignment', i18n ), __( 'Button', i18n ) ) }
					controls={ props.deviceType === 'Desktop' ? ALIGNMENT_CONTROLS_DESKTOP : ALIGNMENT_CONTROLS_TABLET_MOBILE }
					attribute="buttonAlign"
					responsive="all"
				/>
				<AdvancedToggleControl
					label={ __( 'Full Width Buttons', i18n ) }
					attribute="buttonFullWidth"
					defaultValue={ false }
				/>
				<FlexGapControls />
				<AdvancedSelectControl
					label={ __( 'Flex Wrap', i18n ) }
					attribute="flexWrap"
					options={ [
						{
							label: __( 'No Wrap', i18n ),
							value: '',
						},
						{
							label: __( 'Wrap', i18n ),
							value: 'wrap',
						},
						{
							label: __( 'Wrap Reverse', i18n ),
							value: 'wrap-reverse',
						},
					] }
					responsive="all"
				/>
			</InspectorLayoutControls>
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-button-group" />
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


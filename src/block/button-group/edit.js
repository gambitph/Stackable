/**
 * Internal dependencies
 */
import { ButtonGroupStyles } from './style'

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
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
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
import { useBlockContext, useDeviceType } from '~stackable/hooks'
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
		clientId,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const {
		collapseOn = '',
	} = attributes

	const deviceType = useDeviceType()
	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const { hasInnerBlocks } = useBlockContext()

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

	return (
		<>
			<>
				<InspectorTabs />

				<BlockDiv.InspectorControls />

				<BlockControls>
					<AlignmentToolbar
						value={ attributes.contentAlign }
						onChange={ contentAlign => setAttributes( { contentAlign } ) }
						alignmentControls={ TOOLBAR_ALIGN_OPTIONS }
					/>
				</BlockControls>
				<InspectorLayoutControls>
					<AlignButtonsControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Content', i18n ) ) }
						attribute="contentAlign"
						responsive="all"
						controls={ contentAlignControls }
					/>
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Button', i18n ) ) }
						controls={ deviceType === 'Desktop' ? ALIGNMENT_CONTROLS_DESKTOP : ALIGNMENT_CONTROLS_TABLET_MOBILE }
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

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<ButtonGroupStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-button-group" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<>
					<div className={ contentClassNames }>
						<InnerBlocks
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							template={ TEMPLATE }
							templateInsertUpdatesSelection={ true }
						/>
					</div>
				</>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )


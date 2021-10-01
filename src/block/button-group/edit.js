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
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedSelectControl,
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
	FlexGapControls,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { useBlockContext, useBlockHoverClass } from '~stackable/hooks'
import { __ } from '@wordpress/i18n'

const ALLOWED_INNER_BLOCKS = [ 'stackable/button', 'stackable/icon-button' ]

const TEMPLATE = [
	[ 'stackable/button' ],
]

const Edit = props => {
	const {
		className,
		attributes,
	} = props

	const {
		collapseOn = '',
	} = attributes

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const blockHoverClass = useBlockHoverClass()
	const { hasInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-button-group',
		rowClass,
		blockHoverClass,
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

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
			<BlockDiv.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<FlexGapControls />
					<AdvancedSelectControl
						label={ __( 'Flex Wrap' ) }
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
					<AdvancedSelectControl
						label={ __( 'Collapse Buttons On', i18n ) }
						attribute="collapseOn"
						options={ [
							{
								label: __( 'Don\'t collapse', i18n ),
								value: '',
							},
							{
								label: __( 'Desktop', i18n ),
								value: 'desktop',
							},
							{
								label: __( 'Tablet', i18n ),
								value: 'tablet',
							},
							{
								label: __( 'Mobile', i18n ),
								value: 'mobile',
							},
						] }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-button-group" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockDiv className={ blockClassNames }>
				<ButtonGroupStyles version={ VERSION } />
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
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default Edit

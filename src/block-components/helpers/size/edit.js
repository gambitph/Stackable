/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	FourRangeControl,
} from '~stackable/components'
import {
	useAttributeEditHandlers, useDeviceType, usePresetControls,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { getAttributeNameFunc } from '~stackable/util'

const HEIGHT_PRESET = [
	{
		value: '64px',
		label: 'XS',
	},
	{
		value: '128px',
		label: 'S',
	},
	{
		value: '192px',
		label: 'M',
	},
	{
		value: '256px',
		label: 'L',
	},
	{
		value: '384px',
		label: 'XL',
	},
	{
		value: '512px',
		label: '2XL',
	},
	{
		value: '640px',
		label: '3XL',
	},
	{
		value: '100vh',
		label: 'Full',
	},
]

const Layout = props => {
	const deviceType = useDeviceType()

	const {
		getAttribute,
		getAttrName,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const {
		labelHeight = __( 'Min. Height', i18n ),
		labelContentWidth = __( 'Max. Content Width', i18n ),
		labelHorizontalAlign = __( 'Content Horizontal Align', i18n ),
		labelVerticalAlign = __( 'Content Vertical Align', i18n ),
	} = props.labels

	const heightMarks = HEIGHT_PRESET

	return (
		<>
			{ props.hasMinHeight && <AdvancedRangeControl
				label={ labelHeight }
				attribute={ getAttrName( 'height' ) }
				responsive="all"
				units={ [ 'px', 'vh' ] }
				min={ [ 0, 0 ] }
				sliderMax={ [ 1000, 100 ] }
				step={ [ 1, 1 ] }
				allowReset={ true }
				placeholder="0"
				helpTooltip={ {
					video: 'block-height',
					description: __( 'Adjusts the minimum allowable height of the block', i18n ),
				} }
				visualGuide={ props.visualGuide }
				marks={ heightMarks }
			/> }

			{ props.hasContentVerticalAlign &&
				<AdvancedToolbarControl
					label={ labelVerticalAlign }
					attribute={ getAttrName( 'verticalAlign' ) }
					responsive="all"
					controls="vertical"
					helpTooltip={ {
						video: 'content-vertical-align',
						description: __( 'Sets the placement of the content to top, center or bottom. Available when the min. block height is set to higher than default.', i18n ),

					} }
					visualGuide={ ! props.visualGuide ? null : {
						...props.visualGuide,
						selector: ( props.visualGuide.selector || '' ) + ', .stk-%s > *',
					} }
				/>
			}

			<AdvancedRangeControl
				label={ labelContentWidth }
				attribute={ getAttrName( 'width' ) }
				responsive="all"
				units={ [ 'px', '%', 'vw' ] }
				min={ [ 0, 0 ] }
				sliderMax={ [ 1500, 100 ] }
				step={ [ 1, 1 ] }
				allowReset={ true }
				placeholder=""
				initialPosition="1500"
				helpTooltip={ {
					video: 'max-content-width',
					description: __( 'Adjusts the maximum allowable width of the block. The settings will depend on the block width you set on the toolbar.', i18n ),
				} }
				visualGuide={ props.visualGuide }
			/>

			{ (
				( getAttribute( 'width' ) !== '' && deviceType === 'Desktop' ) ||
			    ( ( getAttribute( 'width' ) !== '' || getAttribute( 'widthTablet' ) !== '' ) && deviceType === 'Tablet' ) ||
			    ( ( getAttribute( 'width' ) !== '' || getAttribute( 'widthTablet' ) !== '' || getAttribute( 'widthMobile' ) !== '' ) && deviceType === 'Mobile' )
			  ) &&
				<AdvancedToolbarControl
					label={ labelHorizontalAlign }
					attribute={ getAttrName( 'HorizontalAlign' ) }
					responsive="all"
					controls="horizontal"
					helpTooltip={ {
						video: 'content-horizontal-align',
						description: __( 'Sets the placement of the content to left, center or right. Not available when block width is set to full width.', i18n ),
					} }
					visualGuide={ props.visualGuide }
				/>
			}
		</>
	)
}

Layout.defaultProps = {
	attrNameTemplate: '%s',
	hasMinHeight: true,
	hasContentVerticalAlign: true,
	visualGuide: null,
	labels: {},
}

const Spacing = props => {
	// Don't use the hook form so we don't rerender
	const getAttrName = getAttributeNameFunc( props.attrNameTemplate )

	const {
		labelPaddings = __( 'Paddings', i18n ),
		labelMargins = __( 'Margins', i18n ),
	} = props.labels

	const paddingVisualGuide = ! props.visualGuide ? null : {
		...props.visualGuide,
		highlight: 'padding',
	}

	const marginVisualGuide = ! props.visualGuide ? null : {
		...props.visualGuide,
		highlight: 'margin',
	}

	const presetMarks = usePresetControls( 'spacingSizes' )

	return (
		<>
			<FourRangeControl
				label={ labelPaddings }
				attribute={ getAttrName( 'padding' ) }
				responsive="all"
				hover="all"
				units={ [ 'px', 'em', '%' ] }
				defaultLocked={ true }
				min={ [ 0, 0, 0 ] }
				sliderMax={ [ 200, 30, 100 ] }
				helpTooltip={ {
					video: 'inner-block-padding',
					description: __( 'Sets the block paddings, i.e the space between the inner columns and the block border', i18n ),
				} }
				visualGuide={ paddingVisualGuide }
				placeholder={ props.paddingPlaceholder }
				marks={ presetMarks }
			/>

			{ props.enableMargin &&
				<FourRangeControl
					label={ labelMargins }
					attribute={ getAttrName( 'margin' ) }
					responsive="all"
					units={ [ 'px', '%' ] }
					defaultLocked={ false }
					sliderMin={ [ -200, -100 ] }
					sliderMax={ [ 200, 100 ] }
					placeholder="0"
					helpTooltip={ {
						video: 'advanced-block-margin',
						description: __( 'Sets the block margin, i.e. the space outside the block between the block border and the next block.', i18n ),
					} }
					visualGuide={ marginVisualGuide }
					marks={ presetMarks }
				/>
			}
		</>
	)
}

Spacing.defaultProps = {
	attrNameTemplate: '%s',
	paddingPlaceholder: '',
	enableMargin: true,
	visualGuide: null,
	labels: {},
}
export const SizeControls = {
	Layout,
	Spacing,
}

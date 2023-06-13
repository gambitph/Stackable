/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	FourRangeControl,
} from '~stackable/components'
import { useAttributeEditHandlers, useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

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

	return (
		<>
			<AdvancedRangeControl
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
					description: __( 'height', i18n ),
				} }
				visualGuide={ props.visualGuide }
			/>

			{ props.hasContentVerticalAlign &&
				<AdvancedToolbarControl
					label={ labelVerticalAlign }
					attribute={ getAttrName( 'verticalAlign' ) }
					responsive="all"
					controls="vertical"
					helpTooltip={ {
						description: __( 'vertical align', i18n ),
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
				units={ [ 'px', '%' ] }
				min={ [ 0, 0 ] }
				sliderMax={ [ 1500, 100 ] }
				step={ [ 1, 1 ] }
				allowReset={ true }
				placeholder=""
				initialPosition="1500"
				helpTooltip={ {
					description: __( 'width', i18n ),
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
						description: __( 'horizontal align', i18n ),
					} }
					visualGuide={ props.visualGuide }
				/>
			}
		</>
	)
}

Layout.defaultProps = {
	attrNameTemplate: '%s',
	hasContentVerticalAlign: true,
	visualGuide: null,
	labels: {},
}

const Spacing = props => {
	const {
		getAttrName,
	} = useAttributeEditHandlers( props.attrNameTemplate )

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
					description: __( 'padding', i18n ),
				} }
				visualGuide={ paddingVisualGuide }
				placeholder={ props.paddingPlaceholder }
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
						description: __( 'margins', i18n ),
					} }
					visualGuide={ marginVisualGuide }
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

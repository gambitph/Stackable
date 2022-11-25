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
				className="ugb--help-tip-advanced-block-height"
			/>

			<AdvancedToolbarControl
				label={ labelVerticalAlign }
				attribute={ getAttrName( 'verticalAlign' ) }
				responsive="all"
				controls="vertical"
				className="ugb--help-tip-advanced-block-vertical-align"
			/>

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
				className="ugb--help-tip-advanced-block-content-width"
			/>

			{ getAttribute( 'width' ) !== '' && deviceType === 'Desktop' &&
				<AdvancedToolbarControl
					label={ labelHorizontalAlign }
					attribute={ getAttrName( 'HorizontalAlign' ) }
					responsive="all"
					controls="horizontal"
					value={ getAttribute( 'HorizontalAlign' ) }
					className="ugb--help-tip-advanced-block-horizontal-align"
				/>
			}
			{ ( getAttribute( 'width' ) !== '' || getAttribute( 'widthTablet' ) !== '' ) && deviceType === 'Tablet' &&
				<AdvancedToolbarControl
					label={ labelHorizontalAlign }
					attribute={ getAttrName( 'HorizontalAlign' ) }
					responsive="all"
					controls="horizontal"
					className="ugb--help-tip-advanced-block-horizontal-align"
				/>
			}
			{ ( getAttribute( 'width' ) !== '' || getAttribute( 'widthTablet' ) !== '' || getAttribute( 'widthMobile' ) !== '' ) && deviceType === 'Mobile' &&
				<AdvancedToolbarControl
					label={ labelHorizontalAlign }
					attribute={ getAttrName( 'HorizontalAlign' ) }
					responsive="all"
					controls="horizontal"
					className="ugb--help-tip-advanced-block-horizontal-align"
				/>
			}
		</>
	)
}

Layout.defaultProps = {
	attrNameTemplate: '%s',
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
				className="ugb--help-tip-advanced-block-paddings"
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
					className="ugb--help-tip-advanced-block-margins"
				/>
			}
		</>
	)
}

Spacing.defaultProps = {
	attrNameTemplate: '%s',
	enableMargin: true,
	labels: {},
}
export const SizeControls = {
	Layout,
	Spacing,
}

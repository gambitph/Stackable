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
	useAttributeEditHandlers, useDeviceType,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

export const SizeControls = props => {
	const deviceType = useDeviceType()

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	return (
		<Fragment>
			{ deviceType === 'Desktop' &&
				<AdvancedRangeControl
					label={ __( 'Min. Block Height', i18n ) }
					units={ [ 'px', 'vh' ] }
					min={ [ 0, 0 ] }
					sliderMax={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					screens="all"
					value={ getAttribute( 'height' ) }
					unit={ getAttribute( 'heightUnit' ) }
					onChange={ updateAttributeHandler( 'height' ) }
					onChangeUnit={ updateAttributeHandler( 'heightUnit' ) }
					placeholder="0"
					className="ugb--help-tip-advanced-block-height"
				/>
			}
			{ deviceType === 'Tablet' &&
				<AdvancedRangeControl
					label={ __( 'Min. Block Height', i18n ) }
					units={ [ 'px', 'vh' ] }
					min={ [ 0, 0 ] }
					sliderMax={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					screens="all"
					value={ getAttribute( 'heightTablet' ) }
					unit={ getAttribute( 'heightUnitTablet' ) }
					onChange={ updateAttributeHandler( 'heightTablet' ) }
					onChangeUnit={ updateAttributeHandler( 'heightUnitTablet' ) }
					placeholder="0"
					className="ugb--help-tip-advanced-block-height"
				/>
			}
			{ deviceType === 'Mobile' &&
				<AdvancedRangeControl
					label={ __( 'Min. Block Height', i18n ) }
					units={ [ 'px', 'vh' ] }
					min={ [ 0, 0 ] }
					sliderMax={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					screens="all"
					allowReset={ true }
					value={ getAttribute( 'heightMobile' ) }
					unit={ getAttribute( 'heightUnitMobile' ) }
					onChange={ updateAttributeHandler( 'heightMobile' ) }
					onChangeUnit={ updateAttributeHandler( 'heightUnitMobile' ) }
					placeholder="0"
					className="ugb--help-tip-advanced-block-height"
				/>
			}

			{ getAttribute( 'height' ) !== '' && deviceType === 'Desktop' &&
				<AdvancedToolbarControl
					label={ __( 'Content Vertical Align', i18n ) }
					screens="all"
					controls="flex-vertical"
					value={ getAttribute( 'VerticalAlign' ) }
					onChange={ updateAttributeHandler( 'VerticalAlign' ) }
					className="ugb--help-tip-advanced-block-vertical-align"
				/>
			}
			{ ( getAttribute( 'height' ) !== '' || getAttribute( 'heightTablet' ) !== '' ) && deviceType === 'Tablet' &&
				<AdvancedToolbarControl
					label={ __( 'Content Vertical Align', i18n ) }
					screens="all"
					controls="flex-vertical"
					value={ getAttribute( 'VerticalAlignTablet' ) }
					onChange={ updateAttributeHandler( 'VerticalAlignTablet' ) }
					className="ugb--help-tip-advanced-block-vertical-align"
				/>
			}
			{ ( getAttribute( 'height' ) !== '' || getAttribute( 'heightTablet' ) !== '' || getAttribute( 'heightMobile' ) !== '' ) && deviceType === 'Mobile' &&
				<AdvancedToolbarControl
					label={ __( 'Content Vertical Align', i18n ) }
					screens="all"
					controls="flex-vertical"
					value={ getAttribute( 'VerticalAlignMobile' ) }
					onChange={ updateAttributeHandler( 'VerticalAlignMobile' ) }
					className="ugb--help-tip-advanced-block-vertical-align"
				/>
			}

			{ deviceType === 'Desktop' &&
				<AdvancedRangeControl
					label={ __( 'Max. Content Width', i18n ) }
					screens="all"
					units={ [ 'px', '%' ] }
					min={ [ 0, 0 ] }
					sliderMax={ [ 1500, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					value={ getAttribute( 'Width' ) }
					unit={ getAttribute( 'WidthUnit' ) }
					onChange={ updateAttributeHandler( 'Width' ) }
					onChangeUnit={ updateAttributeHandler( 'WidthUnit' ) }
					placeholder=""
					initialPosition="1500"
					className="ugb--help-tip-advanced-block-content-width"
				/>
			}
			{ deviceType === 'Tablet' &&
				<AdvancedRangeControl
					label={ __( 'Max. Content Width', i18n ) }
					screens="all"
					units={ [ 'px', '%' ] }
					min={ [ 0, 0 ] }
					sliderMax={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					value={ getAttribute( 'WidthTablet' ) }
					unit={ getAttribute( 'WidthUnitTablet' ) }
					onChange={ updateAttributeHandler( 'WidthTablet' ) }
					onChangeUnit={ updateAttributeHandler( 'WidthUnitTablet' ) }
					className="ugb--help-tip-advanced-block-content-width"
				/>
			}
			{ deviceType === 'Mobile' &&
				<AdvancedRangeControl
					label={ __( 'Max. Content Width', i18n ) }
					screens="all"
					units={ [ 'px', '%' ] }
					min={ [ 0, 0 ] }
					sliderMax={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					value={ getAttribute( 'WidthMobile' ) }
					unit={ getAttribute( 'WidthUnitMobile' ) }
					onChange={ updateAttributeHandler( 'WidthMobile' ) }
					onChangeUnit={ updateAttributeHandler( 'WidthUnitMobile' ) }
					className="ugb--help-tip-advanced-block-content-width"
				/>
			}

			{ getAttribute( 'width' ) !== '' && deviceType === 'Desktop' &&
				<AdvancedToolbarControl
					label={ __( 'Content Horizontal Align', i18n ) }
					screens="all"
					controls="flex-horizontal"
					value={ getAttribute( 'HorizontalAlign' ) }
					onChange={ updateAttributeHandler( 'HorizontalAlign' ) }
					className="ugb--help-tip-advanced-block-horizontal-align"
				/>
			}
			{ ( getAttribute( 'height' ) !== '' || getAttribute( 'heightTablet' ) !== '' ) && deviceType === 'Tablet' &&
				<AdvancedToolbarControl
					label={ __( 'Content Horizontal Align', i18n ) }
					screens="all"
					controls="flex-horizontal"
					value={ getAttribute( 'HorizontalAlignTablet' ) }
					onChange={ updateAttributeHandler( 'HorizontalAlignTablet' ) }
					className="ugb--help-tip-advanced-block-horizontal-align"
				/>
			}
			{ ( getAttribute( 'height' ) !== '' || getAttribute( 'heightTablet' ) !== '' || getAttribute( 'heightMobile' ) !== '' ) && deviceType === 'Mobile' &&
				<AdvancedToolbarControl
					label={ __( 'Content Horizontal Align', i18n ) }
					screens="all"
					controls="flex-horizontal"
					value={ getAttribute( 'HorizontalAlignMobile' ) }
					onChange={ updateAttributeHandler( 'HorizontalAlignMobile' ) }
					className="ugb--help-tip-advanced-block-horizontal-align"
				/>
			}

			{ deviceType === 'Desktop' &&
				<FourRangeControl
					label={ __( 'Block Margins', i18n ) }
					units={ [ 'px', '%' ] }
					screens="all"
					defaultLocked={ false }
					top={ getAttribute( 'marginTop' ) }
					bottom={ getAttribute( 'marginBottom' ) }
					right={ getAttribute( 'marginRight' ) }
					left={ getAttribute( 'marginLeft' ) }
					unit={ getAttribute( 'marginUnit' ) || 'px' }
					sliderMin={ [ -200, -100 ] }
					sliderMax={ [ 200, 100 ] }
					onChange={ margins => {
						updateAttributes( {
							marginTop: ! margins.top && margins.top !== 0 ? '' : parseInt( margins.top, 10 ),
							marginRight: ! margins.right && margins.right !== 0 ? '' : parseInt( margins.right, 10 ),
							marginBottom: ! margins.bottom && margins.bottom !== 0 ? '' : parseInt( margins.bottom, 10 ),
							marginLeft: ! margins.left && margins.left !== 0 ? '' : parseInt( margins.left, 10 ),
						} )
					} }
					onChangeUnit={ updateAttributeHandler( 'marginUnit' ) }
					propsToPassTop={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginTop ),
					} : null }
					propsToPassRight={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginRight ),
					} : null }
					propsToPassBottom={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginBottom ),
					} : null }
					propsToPassLeft={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginLeft ),
					} : null }
					enableRight={ getAttribute( 'align' ) !== 'full' }
					enableLeft={ getAttribute( 'align' ) !== 'full' }
					placeholder="0"
					placeholderBottom={ props.marginPlaceholderBottom }
					className="ugb--help-tip-advanced-block-margins"
				/>
			}
			{ deviceType === 'Tablet' &&
				<FourRangeControl
					label={ __( 'Block Margins', i18n ) }
					units={ [ 'px', '%' ] }
					screens="all"
					defaultLocked={ false }
					top={ getAttribute( 'marginTopTablet' ) }
					bottom={ getAttribute( 'marginBottomTablet' ) }
					right={ getAttribute( 'marginRightTablet' ) }
					left={ getAttribute( 'marginLeftTablet' ) }
					unit={ getAttribute( 'marginUnitTablet' ) || 'px' }
					sliderMin={ [ -200, -100 ] }
					sliderMax={ [ 200, 100 ] }
					onChange={ margins => {
						updateAttributes( {
							marginTopTablet: ! margins.top && margins.top !== 0 ? '' : parseInt( margins.top, 10 ),
							marginRightTablet: ! margins.right && margins.right !== 0 ? '' : parseInt( margins.right, 10 ),
							marginBottomTablet: ! margins.bottom && margins.bottom !== 0 ? '' : parseInt( margins.bottom, 10 ),
							marginLeftTablet: ! margins.left && margins.left !== 0 ? '' : parseInt( margins.left, 10 ),
						} )
					} }
					onChangeUnit={ updateAttributeHandler( 'marginUnitTablet' ) }
					propsToPassTop={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginTop ),
					} : null }
					propsToPassRight={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginRight ),
					} : null }
					propsToPassBottom={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginBottom ),
					} : null }
					propsToPassLeft={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginLeft ),
					} : null }
					enableRight={ getAttribute( 'align' ) !== 'full' }
					enableLeft={ getAttribute( 'align' ) !== 'full' }
					className="ugb--help-tip-advanced-block-margins"
				/>
			}
			{ deviceType === 'Mobile' &&
				<FourRangeControl
					label={ __( 'Block Margins', i18n ) }
					units={ [ 'px', '%' ] }
					screens="all"
					defaultLocked={ false }
					top={ getAttribute( 'marginTopMobile' ) }
					bottom={ getAttribute( 'marginBottomMobile' ) }
					right={ getAttribute( 'marginRightMobile' ) }
					left={ getAttribute( 'marginLeftMobile' ) }
					unit={ getAttribute( 'marginUnitMobile' ) || 'px' }
					sliderMin={ [ -200, -100 ] }
					sliderMax={ [ 200, 100 ] }
					onChange={ margins => {
						updateAttributes( {
							marginTopMobile: ! margins.top && margins.top !== 0 ? '' : parseInt( margins.top, 10 ),
							marginRightMobile: ! margins.right && margins.right !== 0 ? '' : parseInt( margins.right, 10 ),
							marginBottomMobile: ! margins.bottom && margins.bottom !== 0 ? '' : parseInt( margins.bottom, 10 ),
							marginLeftMobile: ! margins.left && margins.left !== 0 ? '' : parseInt( margins.left, 10 ),
						} )
					} }
					onChangeUnit={ updateAttributeHandler( 'marginUnitMobile' ) }
					propsToPassTop={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginTop ),
					} : null }
					propsToPassRight={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginRight ),
					} : null }
					propsToPassBottom={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginBottom ),
					} : null }
					propsToPassLeft={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).marginLeft ),
					} : null }
					className="ugb--help-tip-advanced-block-margins"
				/>
			}

			{ deviceType === 'Desktop' &&
				<FourRangeControl
					label={ __( 'Block Paddings', i18n ) }
					units={ [ 'px', 'em', '%' ] }
					screens="all"
					defaultLocked={ true }
					top={ getAttribute( 'paddingTop' ) }
					bottom={ getAttribute( 'paddingBottom' ) }
					right={ getAttribute( 'paddingRight' ) }
					left={ getAttribute( 'paddingLeft' ) }
					unit={ getAttribute( 'paddingUnit' ) || 'px' }
					min={ [ 0, 0, 0 ] }
					sliderMax={ [ 200, 30, 100 ] }
					onChange={ paddings => {
						updateAttributes( {
							paddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
							paddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
							paddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
							paddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
						} )
					} }
					onChangeUnit={ updateAttributeHandler( 'paddingUnit' ) }
					propsToPassTop={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingTop ),
					} : null }
					propsToPassRight={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingRight ),
					} : null }
					propsToPassBottom={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingBottom ),
					} : null }
					propsToPassLeft={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingLeft ),
					} : null }
					className="ugb--help-tip-advanced-block-paddings"
				/>
			}
			{ deviceType === 'Tablet' &&
				<FourRangeControl
					label={ __( 'Block Paddings', i18n ) }
					units={ [ 'px', 'em', '%' ] }
					screens="all"
					defaultLocked={ true }
					top={ getAttribute( 'paddingTopTablet' ) }
					bottom={ getAttribute( 'paddingBottomTablet' ) }
					right={ getAttribute( 'paddingRightTablet' ) }
					left={ getAttribute( 'paddingLeftTablet' ) }
					unit={ getAttribute( 'paddingUnitTablet' ) || 'px' }
					min={ [ 0, 0, 0 ] }
					sliderMax={ [ 200, 30, 100 ] }
					onChange={ paddings => {
						updateAttributes( {
							paddingTopTablet: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
							paddingRightTablet: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
							paddingBottomTablet: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
							paddingLeftTablet: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
						} )
					} }
					onChangeUnit={ updateAttributeHandler( 'paddingUnitTablet' ) }
					propsToPassTop={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingTop ),
					} : null }
					propsToPassRight={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingRight ),
					} : null }
					propsToPassBottom={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingBottom ),
					} : null }
					propsToPassLeft={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingLeft ),
					} : null }
					className="ugb--help-tip-advanced-block-paddings"
				/>
			}
			{ deviceType === 'Mobile' &&
				<FourRangeControl
					label={ __( 'Block Paddings', i18n ) }
					units={ [ 'px', 'em', '%' ] }
					screens="all"
					defaultLocked={ true }
					top={ getAttribute( 'paddingTopMobile' ) }
					bottom={ getAttribute( 'paddingBottomMobile' ) }
					right={ getAttribute( 'paddingRightMobile' ) }
					left={ getAttribute( 'paddingLeftMobile' ) }
					unit={ getAttribute( 'paddingUnitMobile' ) || 'px' }
					min={ [ 0, 0, 0 ] }
					sliderMax={ [ 200, 30, 100 ] }
					onChange={ paddings => {
						updateAttributes( {
							paddingTopMobile: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
							paddingRightMobile: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
							paddingBottomMobile: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
							paddingLeftMobile: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
						} )
					} }
					onChangeUnit={ updateAttributeHandler( 'paddingUnitMobile' ) }
					propsToPassTop={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingTop ),
					} : null }
					propsToPassRight={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingRight ),
					} : null }
					propsToPassBottom={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingBottom ),
					} : null }
					propsToPassLeft={ props.blockEl ? {
						placeholderRender: () => parseFloat( window.getComputedStyle( props.blockEl ).paddingLeft ),
					} : null }
					className="ugb--help-tip-advanced-block-paddings"
				/>
			}
		</Fragment>
	)
}

SizeControls.defaultProps = {
	attrNameTemplate: '%s',
	blockEl: null,
	marginPlaceholderBottom: '',
}

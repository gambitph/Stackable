/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	 AdvancedToolbarControl,
	 AdvancedRangeControl,
	 ColorPaletteControl,
	 SpacingControl,
	 ShadowControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Fragment, useMemo, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useAttributeEditHandlers } from '~stackable/hooks'

const BORDER_CONTROLS = [
	{
		value: '',
		title: __( 'None', i18n ),
	},
	{
		value: 'solid',
		title: __( 'Solid', i18n ),
	},
	{
		value: 'dashed',
		title: __( 'Dashed', i18n ),
	},
	{
		value: 'dotted',
		title: __( 'Dotted', i18n ),
	},
]

export const BorderControls = props => {
	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const borderRadiusPlaceholder = useMemo( () => {
		return props.blockEl
			? () => props.blockEl.el() && parseFloat( window.getComputedStyle( props.blockEl.el() ).borderRadius )
			: null
	}, [ props.blockEl ] )

	const onChangeShadow = useCallback( updateAttributeHandler( 'shadow' ), [ updateAttributeHandler ] )

	return (
		<Fragment>
			<AdvancedToolbarControl
				label={ __( 'Borders', i18n ) }
				controls={ BORDER_CONTROLS }
				className="ugb-border-controls__border-type-toolbar"
				value={ getAttribute( 'borderType' ) }
				onChange={ updateAttributeHandler( 'borderType' ) }
				fullwidth={ true }
				isSmall={ true }
			/>

			{ getAttribute( 'borderType' ) &&
				<SpacingControl
					label={ __( 'Border Width' ) }
					units={ [ 'px' ] }
					min={ 0 }
					max={ 99 }
					step={ 1 }
					sliderMax={ 5 }
					defaultLocked={ true }

					valueDesktop={ {
						top: getAttribute( 'borderWidthTop' ),
						right: getAttribute( 'borderWidthRight' ),
						bottom: getAttribute( 'borderWidthBottom' ),
						left: getAttribute( 'borderWidthLeft' ),
					} }
					onChangeDesktop={
						( {
							top, right, bottom, left,
						} ) => {
							const attributes = {
								BorderWidthTop: ! top && top !== 0 ? '' : parseInt( top, 10 ),
								BorderWidthRight: ! right && right !== 0 ? '' : parseInt( right, 10 ),
								BorderWidthBottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
								BorderWidthLeft: ! left && left !== 0 ? '' : parseInt( left, 10 ),
							}
							if ( ! getAttribute( 'borderType' ) ) {
								attributes.borderType = 'solid'
							}
							updateAttributes( attributes )
						}
					}

					valueTablet={ {
						top: getAttribute( 'borderWidthTopTablet' ),
						right: getAttribute( 'borderWidthRightTablet' ),
						bottom: getAttribute( 'borderWidthBottomTablet' ),
						left: getAttribute( 'borderWidthLeftTablet' ),
					} }
					onChangeTablet={
						( {
							top, right, bottom, left,
						} ) => {
							updateAttributes( {
								BorderWidthTopTablet: ! top && top !== 0 ? '' : parseInt( top, 10 ),
								BorderWidthRightTablet: ! right && right !== 0 ? '' : parseInt( right, 10 ),
								BorderWidthBottomTablet: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
								BorderWidthLeftTablet: ! left && left !== 0 ? '' : parseInt( left, 10 ),
							} )
						}
					}

					valueMobile={ {
						top: getAttribute( 'borderWidthTopMobile' ),
						right: getAttribute( 'borderWidthRightMobile' ),
						bottom: getAttribute( 'borderWidthBottomMobile' ),
						left: getAttribute( 'borderWidthLeftMobile' ),
					} }
					onChangeMobile={
						( {
							top, right, bottom, left,
						} ) => {
							updateAttributes( {
								BorderWidthTopMobile: ! top && top !== 0 ? '' : parseInt( top, 10 ),
								BorderWidthRightMobile: ! right && right !== 0 ? '' : parseInt( right, 10 ),
								BorderWidthBottomMobile: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
								BorderWidthLeftMobile: ! left && left !== 0 ? '' : parseInt( left, 10 ),
							} )
						}
					}

					placeholder="1"
					placeholderTop="1"
					placeholderLeft="1"
					placeholderBottom="1"
					placeholderRight="1"
				/>
			}

			{ getAttribute( 'borderType' ) &&
				<ColorPaletteControl
					value={ getAttribute( 'borderColor' ) }
					onChange={ color => {
						const attributes = {
							BorderColor: color,
						}
						if ( ! getAttribute( 'borderType' ) ) {
							attributes.borderType = 'solid'
						}
						updateAttributes( attributes )
					} }
					label={ __( 'Border Color', i18n ) }
				/>
			}

			<AdvancedRangeControl
				label={ __( 'Border Radius', i18n ) }
				value={ getAttribute( 'borderRadius' ) }
				onChange={ updateAttributeHandler( 'borderRadius' ) }
				min={ 0 }
				sliderMax={ 50 }
				allowReset={ true }
				placeholderRender={ borderRadiusPlaceholder }
				className="ugb--help-tip-general-border-radius"
			/>
			<ShadowControl
				value={ getAttribute( 'shadow' ) }
				onChange={ onChangeShadow }
			/>
		</Fragment>
	)
}

BorderControls.defaultProps = {
	attrNameTemplate: '%s',
	blockEl: null,
}

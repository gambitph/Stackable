/*
 * External dependencies
 */
import {
	AdvancedRangeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	BaseControl,
	AdvancedToolbarControl,
	ColorPaletteControl,
	FourRangeControl2,
} from '~stackable/components'
import { i18n } from 'stackable'
import {
	useBlockAttributes, useDeviceType, useBlockEl, useBlockHoverState,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * Internal dependencies
 */
import { BorderControls } from '../helpers'
import { LinkControls } from '../helpers/link'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'

export const Edit = () => {
	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const [ hoverState ] = useBlockHoverState()

	const blockEl = useBlockEl()

	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Link', i18n ) }
					id="link"
				>
					<LinkControls attrNameTemplate="link%s" />
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Button', i18n ) }
					id="button"
				>

					<Fragment>
						<BaseControl
							id="stk-button-normal-color-type"
						>
							<Fragment>
								<AdvancedToolbarControl
									controls={ [
										{
											value: '',
											title: __( 'Single', i18n ),
										},
										{
											value: 'gradient',
											title: __( 'Gradient', i18n ),
										},
									] }
									attribute="buttonBackgroundColorType"
									isSmall={ true }
									fullwidth={ false }
									hover="all"
								/>
								<ColorPaletteControl
									label={ attributes[ getAttributeName( 'buttonBackgroundColorType', deviceType, hoverState ) ] === 'gradient' ? sprintf( __( 'Button Color #%s', i18n ), 1 )
										: __( 'Button Color', i18n ) }
									attribute="buttonBackgroundColor"
									hasTransparent={ attributes.buttonBackgroundColorType !== 'gradient' }
									hover="all"
								/>
								{ attributes[ getAttributeName( 'buttonBackgroundColorType', deviceType, hoverState ) ] === 'gradient' && (
									<Fragment>
										<ColorPaletteControl
											label={ __( 'Button Color #2', i18n ) }
											attribute="buttonBackgroundColor2"
											hover="all"
										/>

										<AdvancedRangeControl
											label={ __( 'Gradient Direction (degrees)', i18n ) }
											attribute="buttonBackgroundGradientDirection"
											min={ 0 }
											max={ 360 }
											step={ 10 }
											allowReset={ true }
											hover="all"
										/>
									</Fragment>
								) }
							</Fragment>
						</BaseControl>

						<BorderControls
							blockEl={ blockEl }
							blockElSelector=".stk-button__button"
							attrNameTemplate="button%s"
						/>

						<FourRangeControl2
							label={ __( 'Button Paddings', i18n ) }
							units={ [ 'px', '%' ] }
							responsive="all"
							defaultLocked={ false }
							attribute="buttonPadding"
							sliderMin={ [ 0, 0 ] }
							sliderMax={ [ 40, 100 ] }
							default="16"
						/>

					</Fragment>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}

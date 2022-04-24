/**
 * Internal dependencies
 */
import {
	AdvancedRangeControl, ColorPaletteControl, FourRangeControl, PanelAdvancedSettings, ProControl,
} from '~stackable/components'
import { DesignSystem } from './editor-loader'
import './store'
import './margin-bottom'

/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { useSelect, useDispatch } from '@wordpress/data'
import { useAttributeName } from '~stackable/hooks'
import { dispatchUpdateEvent } from '~stackable/hooks/use-update-event'
export { DesignSystem }

addFilter( 'stackable.global-settings.inspector', 'stackable/design-system', output => {
	if ( ! showProNotice && ! isPro ) {
		return output
	}

	// const { deviceType } = useDeviceType()
	const styles = useSelect( select => {
		return select( 'stackable/design-system' ).getStyles()
	} )
	const { updateStyle } = useDispatch( 'stackable/design-system' )

	const marginBottomName = useAttributeName( 'marginBottom', 'all', false )

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Block Design System', i18n ) }
				id="design-system"
			>
				{ ! isPro &&
					<ProControl
						title={ __( 'Say Hello to Design Systems 👋', i18n ) }
						description={ __( 'Change the timing of your CSS transitions, change the X and Y position, scale or rotate your blocks, perfect for hover animations. This feature is only available on Stackable Premium', i18n ) }
					/>
				}
				{ isPro &&
					<p className="components-base-control__help">
						{ __( 'These are design rules which apply to all Stackable blocks, adjusting these will affect all blocks in your entire site.', i18n ) }
						&nbsp;
						<a href="https://docs.wpstackable.com/article/362-how-to-use-global-colors?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
							{ __( 'Learn more about Design System', i18n ) }
						</a>
					</p>
				}
				{ isPro &&
					applyFilters( 'stackable.design-system.controls', null )
				}
				<PanelAdvancedSettings
					title={ __( 'Blocks', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					<AdvancedRangeControl
						label={ __( 'Bottom Margin', i18n ) }
						responsive="all"
						attribute="height"
						sliderMin={ 0 }
						sliderMax={ 100 }
						placeholder="24"
						initialPosition={ 24 }
						value={ styles[ marginBottomName ] }
						onChange={ value => {
							updateStyle( marginBottomName, value )
							// Trigger an update to all resizable bottom margin components.
							dispatchUpdateEvent( 'stackable.resizable-bottom-margin' )
						} }
					/>
					<ColorPaletteControl
						label={ __( 'Block Background Color', i18n ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Block Background Padding', i18n ) }
						responsive="all"
						sliderMin={ 0 }
						sliderMax={ 100 }
						placeholder=""
						value=""
						onChange={ v => console.log( v ) }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Columns', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					{ /* <AdvancedRangeControl
						label={ __( 'Column Inner Spacing', i18n ) }
						responsive="all"
						sliderMin={ 0 }
						sliderMax={ 100 }
						placeholder=""
						value=""
						onChange={ v => console.log( v ) }
					/> */ }
					<FourRangeControl
						label={ __( 'Column Inner Spacing', i18n ) }
						responsive="all"
						units={ [ 'px', 'em' ] }
						defaultLocked={ true }
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						// placeholder={ isOnlyBlock ? '0' : '12' }
						className="ugb--help-tip-advanced-block-paddings"
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Buttons', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					<ColorPaletteControl
						label={ __( 'Button Background Color', i18n ) }
					/>
					<FourRangeControl
						label={ __( 'Vertical Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						defaultLocked={ true }
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						enableLeft={ false }
						enableRight={ false }
					/>
					<FourRangeControl
						label={ __( 'Horizontal Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						defaultLocked={ true }
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						enableTop={ false }
						enableBottom={ false }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Padding', i18n ) }
						responsive="all"
						sliderMin={ 0 }
						sliderMax={ 100 }
						placeholder=""
						value=""
						onChange={ v => console.log( v ) }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Containers', i18n ) }
					isAlt={ true }
					id="design-system"
				>
					test
				</PanelAdvancedSettings>
			</PanelAdvancedSettings>
		</>
	)
}, 9 )

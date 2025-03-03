// import './store'

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedSelectControl, PanelAdvancedSettings } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

addFilter( 'stackable.global-settings.inspector', 'stackable/global-color-schemes', output => {
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Color Schemes', i18n ) }
				initialOpen={ true }
			>
				<p className="components-base-control__help">
					{ __( 'Color schemes are applied to all blocks and sections of your entire website.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/362-how-to-use-global-colors?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Color Schemes', i18n ) }
					</a>
				</p>
				<div className="stk--global-color-schemes--default-picker">
					<p>
						{ __( 'Default Block Colors', i18n ) }
					</p>
					<AdvancedSelectControl
						label={ __( 'Base Color Scheme', i18n ) }
						options={ [
							{
								label: __( 'Default', i18n ),
								value: 'default',
							},
							{
								label: __( 'Background Scheme', i18n ),
								value: 'background',
							},
						] }
					/>
					<AdvancedSelectControl
						label={ __( 'Background Mode Color Scheme', i18n ) }
						options={ [
							{
								label: __( 'Default', i18n ),
								value: 'default',
							},
							{
								label: __( 'Background Scheme', i18n ),
								value: 'background',
							},
						] }
					/>
					<AdvancedSelectControl
						label={ __( 'Container Mode Color Scheme', i18n ) }
						options={ [
							{
								label: __( 'Default', i18n ),
								value: 'default',
							},
							{
								label: __( 'Background Scheme', i18n ),
								value: 'background',
							},
						] }
					/>
				</div>

			</PanelAdvancedSettings>
		</Fragment>
	)
} )


import './store'

/**
 * Internal dependencies
 */
import ColorSchemePicker from './color-scheme-picker'

/**
 * External dependencies
 */
import {
	i18n, showProNotice, isPro,
} from 'stackable'
import { PanelAdvancedSettings, ProControlButton } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { ToggleControl } from '@wordpress/components'
import { useSelect, dispatch } from '@wordpress/data'
import { models } from '@wordpress/api'

export { GlobalColorSchemeStyles } from './editor-loader'

addFilter( 'stackable.global-settings.inspector', 'stackable/global-color-schemes', output => {
	const [ itemInEdit, setItemInEdit ] = useState( null )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Color Schemes', i18n ) }
				initialOpen={ true }
			>
				{ ! itemInEdit && <p className="components-base-control__help">
					{ __( 'Color schemes are applied to all blocks and sections of your entire website.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/362-how-to-use-global-colors?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Color Schemes', i18n ) }
					</a>
				</p>
				}
				<ColorSchemePicker
					label={ __( 'Color Schemes', i18n ) }
					itemInEdit={ itemInEdit }
					setItemInEdit={ setItemInEdit }
				/>
				{ isPro && applyFilters( 'stackable.global-settings.global-color-schemes.inspector', Fragment, itemInEdit ) }
				{ ! itemInEdit && showProNotice && <ProControlButton type="color-schemes" /> }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

addFilter( 'stackable.global-settings.inspector.global-colors.toggle-controls', 'stackable/global-color-schemes', output => {
	const { hideColorSchemeColors } = useSelect( select => select( 'stackable/global-color-schemes' ).getSettings() )

	const onChange = value => {
		dispatch( 'stackable/global-color-schemes' ).updateSettings( {
			hideColorSchemeColors: value,
		} )

		const settings = new models.Settings( { stackable_global_hide_color_scheme_colors: value } ) // eslint-disable-line camelcase
		settings.save()
	}

	return <>
		{ output }
		<ToggleControl
			label={ __( 'Show Color Scheme Colors', i18n ) }
			checked={ ! hideColorSchemeColors }
			onChange={ value => onChange( ! value ) }
		/>

	</>
} )

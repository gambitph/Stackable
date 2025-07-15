import './store'

/**
 * Internal dependencies
 */
import ColorSchemePicker from './color-scheme-picker'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings, HelpTooltip,
	AdvancedSelectControl, SectionSettings,
} from '~stackable/components'
import { useBlockColorSchemes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { ToggleControl } from '@wordpress/components'
import { useSelect, dispatch } from '@wordpress/data'
import { models } from '@wordpress/api'

export { GlobalColorSchemeStyles } from './editor-loader'

let saveTimeout = null

const COLOR_SCHEME_OPTION_NAMES = {
	baseColorScheme: 'stackable_global_base_color_scheme',
	backgroundModeColorScheme: 'stackable_global_background_mode_color_scheme',
	containerModeColorScheme: 'stackable_global_container_mode_color_scheme',
}

addFilter( 'stackable.global-settings.inspector', 'stackable/global-color-schemes', output => {
	const [ itemInEdit, setItemInEdit ] = useState( null )
	const [ isOpen, setIsOpen ] = useState( false )
	const [ displayHoverNotice, setDisplayHoverNotice ] = useState( false )

	const {
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	} = useBlockColorSchemes()

	const onChangeDefaultColorScheme = ( mode, colorSchemeKey ) => {
		clearTimeout( saveTimeout )
		saveTimeout = setTimeout( () => {
			const settings = new models.Settings( {
				[ COLOR_SCHEME_OPTION_NAMES[ mode ] ]: colorSchemeKey, // eslint-disable-line camelcase
				stackable_global_color_scheme_generated_css: '', // eslint-disable-line camelcase
			} )
			settings.save()
		}, 300 )

		// Update our store.
		dispatch( 'stackable/global-color-schemes' ).updateSettings( { [ mode ]: colorSchemeKey } )
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Color Schemes', i18n ) }
				className="ugb-global-color-schemes__panel"
				onToggle={ isOpen => setIsOpen( isOpen ) }
			>
				{ isOpen && displayHoverNotice && <span className="stk-global-block-layouts-help-tooltip">
					<HelpTooltip
						title={ __( 'Hover States', i18n ) }
						description={ __( 'When editing color schemes in the hover states, select a block to view the applied colors.', i18n ) }
						closeOnEscape={ false }
						showTooltipCheckbox={ false }
						onClose={ () => {
							setDisplayHoverNotice( false )
							localStorage.setItem( 'stk-disable-global-block-color-schemes-hover-notice', true )
						} }
					/>
				</span>
				}
				{ ! itemInEdit && <p className="components-base-control__help">
					{ __( 'Color schemes are applied to all blocks and sections of your entire website.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/649-how-to-use-color-schemes?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Color Schemes', i18n ) }
					</a>
				</p>
				}
				<ColorSchemePicker
					label={ __( 'Color Schemes', i18n ) }
					itemInEdit={ itemInEdit }
					setItemInEdit={ setItemInEdit }
					setDisplayHoverNotice={ setDisplayHoverNotice }
				/>
				{ ! itemInEdit && <>
					<SectionSettings title={ __( 'Default Block Colors', i18n ) }>
						<AdvancedSelectControl
							label={ __( 'Base Color Scheme', i18n ) }
							value={ baseColorScheme }
							options={ COLOR_SCHEME_OPTIONS }
							default="scheme-default-1"
							onChange={ colorScheme => onChangeDefaultColorScheme( 'baseColorScheme', colorScheme ) }
							help={ __( 'Default color scheme to use for all blocks when no special options are enabled.', i18n ) }
						/>
						<AdvancedSelectControl
							label={ __( 'Background Mode Color Scheme', i18n ) }
							value={ backgroundModeColorScheme }
							options={ COLOR_SCHEME_OPTIONS }
							default="scheme-default-2"
							onChange={ colorScheme => onChangeDefaultColorScheme( 'backgroundModeColorScheme', colorScheme ) }
							help={ __( 'Colors applied when the background option is enabled for a block.', i18n ) }
						/>
						<AdvancedSelectControl
							label={ __( 'Container Mode Color Scheme', i18n ) }
							value={ containerModeColorScheme }
							options={ COLOR_SCHEME_OPTIONS }
							default="scheme-default-1"
							onChange={ colorScheme => onChangeDefaultColorScheme( 'containerModeColorScheme', colorScheme ) }
							help={ __( 'Colors applied when the container option is enabled for a block.', i18n ) }
						/>
					</SectionSettings>
				</> }
			</PanelAdvancedSettings>
		</Fragment>
	)
}, 2 )

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
			label={ __( 'Show Global Color Schemes', i18n ) }
			checked={ ! hideColorSchemeColors }
			onChange={ value => onChange( ! value ) }
		/>

	</>
} )

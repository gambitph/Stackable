import './store'

/**
 * Internal dependencies
 */
import { SectionSettings } from '../utils'
import ColorSchemePicker from './color-scheme-picker'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedSelectControl, PanelAdvancedSettings } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { models } from '@wordpress/api'
import { useSelect, dispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

let saveTimeout = null

const COLOR_SCHEME_OPTION_NAMES = {
	baseColorScheme: 'stackable_global_base_color_scheme',
	backgroundModeColorScheme: 'stackable_global_background_mode_color_scheme',
	containerModeColorScheme: 'stackable_global_container_mode_color_scheme',
}

addFilter( 'stackable.global-settings.inspector', 'stackable/global-color-schemes', output => {
	const {
		COLOR_SCHEME_OPTIONS,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	} = useSelect( select => {
		const {
			colorSchemes,
			baseColorScheme,
			backgroundModeColorScheme,
			containerModeColorScheme,
		 } = select( 'stackable/global-color-schemes' ).getSettings()

		const COLOR_SCHEME_OPTIONS = colorSchemes?.map( scheme => ( {
			label: scheme.name,
			value: scheme.key,
		} ) )

		return {
			COLOR_SCHEME_OPTIONS,
			baseColorScheme,
			backgroundModeColorScheme,
			containerModeColorScheme,
		}
	} )
	const [ itemInEdit, setItemInEdit ] = useState( null )

	const onChangeDefaultColorScheme = ( mode, colorSchemeKey ) => {
		clearTimeout( saveTimeout )
		saveTimeout = setTimeout( () => {
			const settings = new models.Settings( { [ COLOR_SCHEME_OPTION_NAMES[ mode ] ]: colorSchemeKey } ) // eslint-disable-line camelcase
			settings.save()
		}, 300 )

		// Update our store.
		dispatch( 'stackable/global-color-schemes' ).updateDefaultColorScheme( { [ mode ]: colorSchemeKey } )
	}

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
				{ ! itemInEdit && <>
					<SectionSettings title={ __( 'Default Block Colors', i18n ) }>
						<AdvancedSelectControl
							label={ __( 'Base Color Scheme', i18n ) }
							value={ baseColorScheme }
							options={ COLOR_SCHEME_OPTIONS }
							default="scheme-default-1"
							onChange={ colorScheme => onChangeDefaultColorScheme( 'baseColorScheme', colorScheme ) }
							help={ __( 'Default colors for text, accents, and buttons when no special options are enabled.', i18n ) }
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
} )


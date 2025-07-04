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
import {
	PanelAdvancedSettings, ProControlButton, HelpTooltip,
} from '~stackable/components'

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
	const [ isOpen, setIsOpen ] = useState( false )
	const [ displayHoverNotice, setDisplayHoverNotice ] = useState( false )

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
				{ isOpen && <ColorSchemePicker
					label={ __( 'Color Schemes', i18n ) }
					itemInEdit={ itemInEdit }
					setItemInEdit={ setItemInEdit }
					setDisplayHoverNotice={ setDisplayHoverNotice }
				/> }
				{ isPro && applyFilters( 'stackable.global-settings.global-color-schemes.inspector', Fragment, itemInEdit ) }
				{ ! itemInEdit && showProNotice && <ProControlButton type="color-schemes" /> }
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

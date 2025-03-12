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
import { PanelAdvancedSettings, ProControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

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
				{ ! itemInEdit && ! isPro && showProNotice && <ProControl type="color-schemes" /> }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )


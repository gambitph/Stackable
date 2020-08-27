/**
 * Internal dependencies
 */
import { GlobalSettingsPanel, GlobalSettingsColorPicker } from '../components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Wordpress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

addFilter( 'stackable.global-settings.inspector', 'global-settings/global-colors', output => {
	return (
		<Fragment>
			{ output }
			<GlobalSettingsPanel
				title={ __( 'Colors', i18n ) }
				onClickAddStyle={ () => {} }>
				<GlobalSettingsColorPicker />
			</GlobalSettingsPanel>
		</Fragment>
	)
} )

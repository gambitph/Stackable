
import { useImportExportSettingsContext } from './context'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'

addFilter( 'stackable.admin-settings.export-settings', 'stackable.design-library-export-settings', Prev => {
	return props => {
		const { tab, settings } = props
		const exportContext = useImportExportSettingsContext()

		if ( tab.name !== 'design-library' ) {
			return <Prev { ...props } />
		}

		const ExportSettingsComp = applyFilters( 'stackable.admin-settings.export-settings.design-library', Fragment )

		return isPro ? <ExportSettingsComp
			patterns={ settings.stackable_design_library_saved_patterns }
			exportContext={ exportContext }
		/> : <p className="s-settings-pro">
			{ __( 'This is only available in Stackable Premium. ', i18n ) }
			<a href="https://wpstackable.com/premium/?utm_source=wp-settings-role-manager&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium">
				{ __( 'Go Premium', i18n ) }
			</a>
		</p>
	}
} )

addFilter( 'stackable.admin-settings.import-settings', 'stackable.design-library-import-settings', Prev => {
	return props => {
		const { tab, settings } = props
		const importContext = useImportExportSettingsContext()

		if ( tab.name !== 'design-library' ) {
			return <Prev { ...props } />
		}

		const ImportSettingsComp = applyFilters( 'stackable.admin-settings.import-settings.design-library', Fragment )

		return isPro ? <ImportSettingsComp
			patterns={ settings.stackable_design_library_saved_patterns }
			importContext={ importContext }
		/> : <p className="s-settings-pro">
			{ __( 'This is only available in Stackable Premium. ', i18n ) }
			<a href="https://wpstackable.com/premium/?utm_source=wp-settings-role-manager&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium">
				{ __( 'Go Premium', i18n ) }
			</a>
		</p>
	}
} )

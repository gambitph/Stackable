
import { useImportExportSettingsContext } from './context'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Spinner } from '@wordpress/components'

const fetchSavedPatternsFromFilter = () => {
	const result = applyFilters( 'stackable.design-library.fetch-saved-patterns', null )

	if ( ! result || typeof result.then !== 'function' ) {
		return Promise.resolve( [] )
	}

	return result
}

const SavedPatternsLoader = ( {
	tab, children, context, type,
} ) => {
	const [ patterns, setPatterns ] = useState( [] )
	const [ isLoading, setIsLoading ] = useState( true )

	useEffect( () => {
		if ( tab.name !== 'design-library' || ! isPro ) {
			return
		}

		let isMounted = true

		fetchSavedPatternsFromFilter().then( loadedPatterns => {
			if ( isMounted ) {
				setPatterns( loadedPatterns )
				setIsLoading( false )
			}
		} ).catch( () => {
			if ( isMounted ) {
				setPatterns( [] )
				setIsLoading( false )
			}
		} )

		return () => {
			isMounted = false
		}
	}, [ tab.name ] )

	if ( tab.name !== 'design-library' ) {
		return children
	}

	if ( ! isPro ) {
		return <p className="s-settings-pro">
			{ __( 'This is only available in Stackable Premium. ', i18n ) }
			<a href="https://wpstackable.com/premium/?utm_source=wp-settings-role-manager&utm_campaign=gopremium&utm_medium=wp-dashboard" target="_premium">
				{ __( 'Go Premium', i18n ) }
			</a>
		</p>
	}

	if ( isLoading ) {
		return <Spinner />
	}

	const SettingsComp = applyFilters( `stackable.admin-settings.${ type }-settings.design-library`, Fragment )

	if ( type === 'export' ) {
		return <SettingsComp
			patterns={ patterns }
			exportContext={ context }
		/>
	}

	return <SettingsComp
		patterns={ patterns }
		importContext={ context }
	/>
}

addFilter( 'stackable.admin-settings.export-settings', 'stackable.design-library-export-settings', Prev => {
	return props => {
		const { tab } = props
		const exportContext = useImportExportSettingsContext()

		if ( tab.name !== 'design-library' ) {
			return <Prev { ...props } />
		}

		return <SavedPatternsLoader
			tab={ tab }
			context={ exportContext }
			type="export"
		>
			<Prev { ...props } />
		</SavedPatternsLoader>
	}
} )

addFilter( 'stackable.admin-settings.import-settings', 'stackable.design-library-import-settings', Prev => {
	return props => {
		const { tab } = props
		const importContext = useImportExportSettingsContext()

		if ( tab.name !== 'design-library' ) {
			return <Prev { ...props } />
		}

		return <SavedPatternsLoader
			tab={ tab }
			context={ importContext }
			type="import"
		>
			<Prev { ...props } />
		</SavedPatternsLoader>
	}
} )
